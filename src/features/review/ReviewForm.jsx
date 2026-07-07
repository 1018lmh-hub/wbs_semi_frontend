// src/features/review/ReviewForm.jsx
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

// 백엔드 400 응답의 data 키(reviewTitle/reviewContent/rating)를
// 폼 필드 키(title/content/rating)로 매핑
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
  // MainLayout에서 내려주는 오버레이 닫기 핸들러 (SignUp, StationDetail과 동일 패턴)
  const { onCloseOverlay } = useOutletContext() ?? {};
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  // reviewId 유무로 수정/작성 모드 구분
  const isEditMode = !!reviewId;
  // ReviewItem 수정 버튼 클릭 시 navigate(..., { state: {...} })로 전달된 기존 값
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

  // state로만 데이터를 전달받는 방식이라, 새로고침/직접 URL 접근 등으로
  // location.state가 없는 상태에서 수정 화면에 들어온 경우 목록으로 되돌려보냄
  useEffect(() => {
    if (isEditMode && !editData) {
      showToast("잘못된 접근입니다. 목록에서 다시 시도해주세요.", "error");
      navigate(`/stations/${stationId}/reviews`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 백엔드 400 예시 응답의 에러 문구(제목 2~100자, 내용 2~500자, 별점 1~5)를 그대로 클라이언트 검증에 반영
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

      // 등록/수정 후 이전 페이지로 복귀
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(`/stations/${stationId}`);
      }
    } catch (err) {
      const responseData = err.response?.data;

      // 필드별 검증 에러(400)인 경우 각 입력창 아래에 표시
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

  // 인증 필요(authenticated) 엔드포인트라 비로그인 상태면 폼 대신 안내만 표시
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

  // editData가 없어 리다이렉트되는 순간까지의 짧은 깜빡임 방지
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
