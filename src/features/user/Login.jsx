// src/features/user/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../api/axios";
import {
  LoginContainer,
  HeaderRow,
  CloseButton,
  Title,
  ServerErrorBox,
  Form,
  FieldGroup,
  Label,
  Input,
  FieldErrorText,
  SubmitButton,
  SignUpLinkRow,
  SignUpLinkButton,
} from "./Login.style";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM = {
  userId: "",
  userPwd: "",
};

const Login = () => {
  const navigate = useNavigate();
  // MainLayout에서 내려주는 오버레이 닫기 핸들러 (SignUp, StationDetail과 동일 패턴)
  const { onCloseOverlay } = useOutletContext() ?? {};

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();

  // 리프레시 토큰 만료로 인한 강제 로그아웃 후 진입한 경우, 만료 안내 토스트 표시
  // (axios.js 응답 인터셉터가 sessionStorage에 남겨둔 플래그를 여기서 확인 후 즉시 제거)
  useEffect(() => {
    if (sessionStorage.getItem("authExpired")) {
      sessionStorage.removeItem("authExpired");
      showToast(
        "로그인 기간이 만료되었습니다. 다시 로그인을 시도해주세요.",
        "error",
      );
    }
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setServerError(null);
  };

  // 로그인은 회원가입과 달리 형식(정규식) 검증이 의미가 없어 필수 입력 여부만 확인.
  // 아이디/비밀번호 형식이 틀렸는지는 백엔드가 401로 판단해서 내려줌.
  const validate = () => {
    const errors = {};
    if (!form.userId) errors.userId = "아이디를 입력해주세요.";
    if (!form.userPwd) errors.userPwd = "비밀번호를 입력해주세요.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", {
        userId: form.userId,
        userPwd: form.userPwd,
      });

      // AuthContext.login()이 localStorage 저장 + 전역 로그인 상태 갱신을 함께 처리.
      // (axios.js 인터셉터가 저장된 "token" 키를 읽으므로 이후 요청에 즉시 반영됨)
      login(data.data);

      showToast("로그인에 성공했습니다.", "success");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ??
        "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onCloseOverlay) {
      onCloseOverlay();
    } else {
      navigate("/");
    }
  };

  return (
    <LoginContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>

      <Title>로그인</Title>

      {serverError && <ServerErrorBox>{serverError}</ServerErrorBox>}

      {/* 엔터 입력 시 제출은 <form onSubmit>의 기본 동작으로 이미 처리됨 (버튼 클릭과 동일 경로) */}
      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            id="userId"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            $hasError={!!fieldErrors.userId}
            autoComplete="username"
          />
          {fieldErrors.userId && (
            <FieldErrorText>{fieldErrors.userId}</FieldErrorText>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="userPwd">비밀번호</Label>
          <Input
            id="userPwd"
            name="userPwd"
            type="password"
            value={form.userPwd}
            onChange={handleChange}
            $hasError={!!fieldErrors.userPwd}
            autoComplete="current-password"
          />
          {fieldErrors.userPwd && (
            <FieldErrorText>{fieldErrors.userPwd}</FieldErrorText>
          )}
        </FieldGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </SubmitButton>
      </Form>

      {/* SignUp에는 없던 요소지만, 로그인 화면 UX상 자연스러워서 최소하게 추가함 */}
      <SignUpLinkRow>
        아직 계정이 없으신가요?
        <SignUpLinkButton type="button" onClick={() => navigate("/signup")}>
          회원가입
        </SignUpLinkButton>
      </SignUpLinkRow>
    </LoginContainer>
  );
};

export default Login;
