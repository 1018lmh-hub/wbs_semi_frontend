import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import { createStationReview, updateStationReview } from "../../lib/stationApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  FormContainer,
  HeaderRow,
  CloseButton,
  Title,
  ServerErrorBox,
  Form,
  FieldGroup,
  Label,
  Input,
  Textarea,
  CharCount,
  RatingRow,
  RatingStarButton,
  RatingValueText,
  FieldErrorText,
  SubmitButton,
  AuthGuardBox,
  AuthGuardButton,
} from "./ReviewForm.style";
const TITLE_MAX = 100;
const CONTENT_MAX = 500;
const RATING_STARS = [1, 2, 3, 4, 5];
const INITIAL_FORM = {
  title: "",
  content: "",
  rating: 5,
};
const mapServerFieldErrors = (data) => {
  if (!data) return {};
  return {
    title: data.reviewTitle,
    content: data.reviewContent,
    rating: data.rating,
  };
};
const ReviewForm = () => {
  const { stationId, reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { onCloseOverlay } = useOutletContext() ?? {};
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const isEditMode = !!reviewId;
  const editData = location.state;
  const [form, setForm] = useState(() => {
    if (isEditMode && editData) {
      return {
        title: editData.reviewTitle ?? "",
        content: editData.reviewContent ?? "",
        rating: editData.rating ?? 5,
      };
    }
    return INITIAL_FORM;
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isEditMode && !editData) {
      showToast("잘못된 접근입니다. 목록에서 다시 시도해주세요.", "error");
      navigate(`/stations/${stationId}/reviews`, { replace: true });
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setServerError(null);
  };
  const handleRatingSelect = (value) => {
    setForm((prev) => ({ ...prev, rating: value }));
    setFieldErrors((prev) => ({ ...prev, rating: null }));
  };
  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (onCloseOverlay) {
      onCloseOverlay();
    } else {
      navigate(`/stations/${stationId}`);
    }
  };
  const validate = () => {
    const errors = {};
    if (form.title.trim().length < 2 || form.title.length > TITLE_MAX) {
      errors.title = `제목은 2~${TITLE_MAX}자 까지 입력가능합니다.`;
    }
    if (form.content.trim().length < 2 || form.content.length > CONTENT_MAX) {
      errors.content = `내용은 2~${CONTENT_MAX}자 까지 입력가능합니다.`;
    }
    if (form.rating < 1 || form.rating > 5) {
      errors.rating = "별점은 1~5 사이여야 합니다.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateStationReview(stationId, reviewId, {
          title: form.title,
          content: form.content,
          rating: form.rating,
        });
        showToast("후기가 수정되었습니다.", "success");
      } else {
        await createStationReview(stationId, {
          title: form.title,
          content: form.content,
          rating: form.rating,
        });
        showToast("후기가 등록되었습니다.", "success");
      }
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(`/stations/${stationId}`);
      }
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.code === 400 && responseData?.data) {
        setFieldErrors(mapServerFieldErrors(responseData.data));
      } else {
        setServerError(
          responseData?.message ??
            (isEditMode
              ? "후기 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
              : "후기 등록에 실패했습니다. 잠시 후 다시 시도해주세요."),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isLoggedIn) {
    return (
      <FormContainer>
        <HeaderRow>
          <CloseButton onClick={handleClose} aria-label="닫기">
            ✕
          </CloseButton>
        </HeaderRow>
        <AuthGuardBox>
          <p>
            후기 {isEditMode ? "수정" : "작성"}은 로그인 후 이용할 수 있습니다.
          </p>
          <AuthGuardButton type="button" onClick={() => navigate("/login")}>
            로그인하러 가기
          </AuthGuardButton>
        </AuthGuardBox>
      </FormContainer>
    );
  }
  if (isEditMode && !editData) return null;
  return (
    <FormContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>
      <Title>{isEditMode ? "후기 수정하기" : "후기 작성하기"}</Title>
      {serverError && <ServerErrorBox>{serverError}</ServerErrorBox>}
      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="2~100자로 입력해주세요"
            maxLength={TITLE_MAX}
            $hasError={!!fieldErrors.title}
          />
          {fieldErrors.title && (
            <FieldErrorText>{fieldErrors.title}</FieldErrorText>
          )}
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="충전소 이용 경험을 2~500자로 남겨주세요"
            maxLength={CONTENT_MAX}
            $hasError={!!fieldErrors.content}
          />
          <CharCount>
            {form.content.length} / {CONTENT_MAX}
          </CharCount>
          {fieldErrors.content && (
            <FieldErrorText>{fieldErrors.content}</FieldErrorText>
          )}
        </FieldGroup>
        <FieldGroup>
          <Label>별점</Label>
          <RatingRow>
            {RATING_STARS.map((value) => (
              <RatingStarButton
                key={value}
                type="button"
                onClick={() => handleRatingSelect(value)}
                $filled={value <= form.rating}
                aria-label={`${value}점`}
              >
                ★
              </RatingStarButton>
            ))}
            <RatingValueText>{form.rating}점</RatingValueText>
          </RatingRow>
          {fieldErrors.rating && (
            <FieldErrorText>{fieldErrors.rating}</FieldErrorText>
          )}
        </FieldGroup>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "수정 중..."
              : "등록 중..."
            : isEditMode
              ? "수정하기"
              : "등록하기"}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};
export default ReviewForm;
