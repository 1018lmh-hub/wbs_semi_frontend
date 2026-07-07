// src/features/board/BoardForm.jsx
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
  AuthGuardBox,
  AuthGuardButton,
} from "./BoardForm.style";

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

const INITIAL_FORM = {
  title: "",
  content: "",
};

// boardType별 라우트 파라미터명/경로 (App.jsx 라우트 정의와 짝을 맞춤)
const ROUTE_CONFIG = {
  notice: { paramName: "noticeNo", listPath: "/notices" },
  inquiry: { paramName: "inquiryNo", listPath: "/inquirys" },
};

// 백엔드 400 응답의 data 키(noticeTitle/noticeContent, inquiryTitle/inquiryContent)를
// 폼 필드 키(title/content)로 매핑
const mapServerFieldErrors = (data, boardType) => {
  if (!data) return {};
  if (boardType === "notice") {
    return { title: data.noticeTitle, content: data.noticeContent };
  }
  return { title: data.inquiryTitle, content: data.inquiryContent };
};

/**
 * 공지사항/문의글 공용 작성/수정 폼.
 * URL의 noticeNo/inquiryNo 파라미터 유무로 작성/수정 모드를 분기 (ReviewForm과 동일 패턴).
 *
 * 접근 권한:
 * - 공지 작성: 로그인 + ROLE_ADMIN
 * - 공지 수정: 로그인 + ROLE_ADMIN + 본인 작성 글 (세션 3에서 정한 기준과 일치)
 * - 문의 작성: 로그인
 * - 문의 수정: 로그인 + 본인 작성 글
 */
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
  // BoardDetail의 수정 버튼 클릭 시 navigate(..., { state: detail })로 전달된 기존 값
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

  // location.state 없이 새로고침/직접 URL 접근한 경우 목록으로 리다이렉트 (ReviewForm과 동일)
  useEffect(() => {
    if (isEditMode && !editData) {
      showToast("잘못된 접근입니다. 목록에서 다시 시도해주세요.", "error");
      navigate(routeConfig.listPath, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // Textarea는 기본적으로 Enter가 줄바꿈으로 처리되어 폼이 제출되지 않으므로,
  // Enter만 누르면 제출, Shift+Enter는 줄바꿈이 되도록 별도 처리
  // (Input(제목)은 브라우저 기본 동작으로 이미 Enter 시 폼 제출됨)
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

  // 접근 권한 체크
  // - 공지: 로그인 + ROLE_ADMIN 필요. 수정 모드면 추가로 본인 작성 글이어야 함
  // - 문의: 로그인 필요. 수정 모드면 추가로 본인 작성 글이어야 함
  const isAdmin = !!user?.role?.includes("ROLE_ADMIN");
  const isOwner = !!user && isEditMode && editData?.userId === user.userId;

  const hasAccess = (() => {
    if (!isLoggedIn) return false;
    if (boardType === "notice") {
      return isEditMode ? isAdmin && isOwner : isAdmin;
    }
    return isEditMode ? isOwner : true;
  })();

  // 비로그인이거나 권한이 없는 경우 폼 대신 안내만 표시 (ReviewForm의 비로그인 안내 패턴과 동일)
  if (!isLoggedIn || (isEditMode && editData && !hasAccess)) {
    return (
      <FormContainer>
        <HeaderRow>
          <CloseButton onClick={handleClose} aria-label="닫기">
            ✕
          </CloseButton>
        </HeaderRow>
        <AuthGuardBox>
          <p>
            {!isLoggedIn
              ? `게시글 ${isEditMode ? "수정" : "작성"}은 로그인 후 이용할 수 있습니다.`
              : "이 게시글을 수정할 권한이 없습니다."}
          </p>
          {!isLoggedIn && (
            <AuthGuardButton type="button" onClick={() => navigate("/login")}>
              로그인하러 가기
            </AuthGuardButton>
          )}
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
