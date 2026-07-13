import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { updateUserPwd } from "../../lib/userApi";
import {
  PasswordContainer,
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
} from "./MyPagePassword.style";
const PWD_REGEX = /^[a-zA-Z0-9@$!%*#?&]{8,20}$/;
const INITIAL_FORM = {
  userPwd: "",
  newPwd: "",
  newPwdConfirm: "",
};
const MyPagePassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setServerError(null);
  };
  const validate = () => {
    const errors = {};
    if (!PWD_REGEX.test(form.userPwd)) {
      errors.userPwd =
        "비밀번호는 8~20자의 영문, 숫자, @$!%*#?& 만 사용할 수 있습니다.";
    }
    if (!PWD_REGEX.test(form.newPwd)) {
      errors.newPwd =
        "비밀번호는 8~20자의 영문, 숫자, @$!%*#?& 만 사용할 수 있습니다.";
    }
    if (form.newPwdConfirm !== form.newPwd) {
      errors.newPwdConfirm = "새 비밀번호가 일치하지 않습니다.";
    }
    if (!errors.userPwd && !errors.newPwd && form.userPwd === form.newPwd) {
      errors.newPwd = "새 비밀번호는 기존 비밀번호와 다르게 설정해주세요.";
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
      await updateUserPwd(form.userPwd, form.newPwd);
      showToast("비밀번호 변경에 성공했습니다.", "success");
      navigate("/myPage");
    } catch (err) {
      const message =
        err.response?.data?.message ??
        "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    navigate("/myPage");
  };
  return (
    <PasswordContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>
      <Title>비밀번호 변경</Title>
      {serverError && <ServerErrorBox>{serverError}</ServerErrorBox>}
      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="userPwd">기존 비밀번호</Label>
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
        <FieldGroup>
          <Label htmlFor="newPwd">새 비밀번호</Label>
          <Input
            id="newPwd"
            name="newPwd"
            type="password"
            value={form.newPwd}
            onChange={handleChange}
            placeholder="8~20자 영문, 숫자, @$!%*#?&"
            $hasError={!!fieldErrors.newPwd}
            autoComplete="new-password"
          />
          {fieldErrors.newPwd && (
            <FieldErrorText>{fieldErrors.newPwd}</FieldErrorText>
          )}
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="newPwdConfirm">새 비밀번호 확인</Label>
          <Input
            id="newPwdConfirm"
            name="newPwdConfirm"
            type="password"
            value={form.newPwdConfirm}
            onChange={handleChange}
            $hasError={!!fieldErrors.newPwdConfirm}
            autoComplete="new-password"
          />
          {fieldErrors.newPwdConfirm && (
            <FieldErrorText>{fieldErrors.newPwdConfirm}</FieldErrorText>
          )}
        </FieldGroup>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "변경 중..." : "변경하기"}
        </SubmitButton>
      </Form>
    </PasswordContainer>
  );
};
export default MyPagePassword;
