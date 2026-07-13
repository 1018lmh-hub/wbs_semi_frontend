import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import { createBoard, updateBoard } from "../../lib/boardApi";
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
  FieldErrorText,
  SubmitButton,
} from "./BoardForm.style";

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

const INITIAL_FORM = {
  title: "",
  content: "",
};

const ROUTE_CONFIG = {
  notice: { paramName: "noticeNo", listPath: "/notices" },
  inquiry: { paramName: "inquiryNo", listPath: "/inquirys" },
};

const mapServerFieldErrors = (data, boardType) => {
  if (!data) return {};
  if (boardType === "notice") {
    return { title: data.noticeTitle, content: data.noticeContent };
  }
  return { title: data.inquiryTitle, content: data.inquiryContent };
};

const BoardForm = ({ boardType }) => {
  const routeConfig = ROUTE_CONFIG[boardType];
  const params = useParams();
  const boardNo = params[routeConfig.paramName];

  const navigate = useNavigate();
  const location = useLocation();
  const { onCloseOverlay } = useOutletContext() ?? {};
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();

  const isEditMode = !!boardNo;

  const editData = location.state;

  const [form, setForm] = useState(() => {
    if (isEditMode && editData) {
      return {
        title: editData.title ?? "",
        content: editData.content ?? "",
      };
    }
    return INITIAL_FORM;
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = !!user?.role?.includes("ROLE_ADMIN");
  const isOwner = !!user && isEditMode && editData?.userId === user.userId;

  const isWriteUnauthorized =
    !isEditMode && (!isLoggedIn || (boardType === "notice" && !isAdmin));

  const isEditUnauthorized = isEditMode && !!editData && !isOwner;

  const isUnauthorized = isWriteUnauthorized || isEditUnauthorized;

  useEffect(() => {
    if (isUnauthorized) {
      showToast("권한이 없는 접근입니다.", "error");
      navigate("/", { replace: true });
    }
  }, [isUnauthorized]);

  useEffect(() => {
    if (isEditMode && !editData) {
      showToast("잘못된 접근입니다. 목록에서 다시 시도해주세요.", "error");
      navigate(routeConfig.listPath, { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setServerError(null);
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (onCloseOverlay) {
      onCloseOverlay();
    } else {
      navigate(routeConfig.listPath);
    }
  };

  const handleContentKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const validate = () => {
    const errors = {};

    if (form.title.trim().length < 1 || form.title.length > TITLE_MAX) {
      errors.title = `제목은 1~${TITLE_MAX}자 까지 입력가능합니다.`;
    }
    if (form.content.trim().length < 1 || form.content.length > CONTENT_MAX) {
      errors.content = `내용은 1~${CONTENT_MAX}자 까지 입력가능합니다.`;
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
        await updateBoard(boardType, boardNo, form);
        showToast("게시글이 수정되었습니다.", "success");
      } else {
        await createBoard(boardType, form);
        showToast("게시글이 등록되었습니다.", "success");
      }

      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(routeConfig.listPath);
      }
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.code === 400 && responseData?.data) {
        setFieldErrors(mapServerFieldErrors(responseData.data, boardType));
      } else {
        setServerError(
          responseData?.message ??
            (isEditMode
              ? "게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
              : "게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요."),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUnauthorized) return null;

  if (isEditMode && !editData) return null;

  return (
    <FormContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>

      <Title>{isEditMode ? "게시글 수정하기" : "게시글 작성하기"}</Title>

      {serverError && <ServerErrorBox>{serverError}</ServerErrorBox>}

      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={`1~${TITLE_MAX}자로 입력해주세요`}
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
            onKeyDown={handleContentKeyDown}
            placeholder={`1~${CONTENT_MAX}자로 입력해주세요`}
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

export default BoardForm;
