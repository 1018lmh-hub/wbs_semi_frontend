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
  const { onCloseOverlay } = useOutletContext() ?? {};
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { login } = useAuth();
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
