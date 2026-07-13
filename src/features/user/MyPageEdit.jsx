import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { updateUserNickname } from "../../lib/userApi";
import {
  EditContainer,
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
} from "./MyPageEdit.style";
const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]{2,10}$/;
const MyPageEdit = () => {
  const navigate = useNavigate();
  const { user, updateNickname } = useAuth();
  const { showToast } = useToast();
  const [newNickname, setNewNickname] = useState(user?.nickname ?? "");
  const [fieldError, setFieldError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    setNewNickname(e.target.value);
    setFieldError(null);
    setServerError(null);
  };
  const validate = () => {
    if (!NICKNAME_REGEX.test(newNickname)) {
      setFieldError("별명은 2~10자의 한글, 영문, 숫자만 사용할 수 있습니다.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await updateUserNickname(newNickname);
      updateNickname(newNickname);
      showToast("닉네임이 변경되었습니다.", "success");
      navigate("/myPage");
    } catch (err) {
      const message =
        err.response?.data?.message ??
        "닉네임 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    navigate("/myPage");
  };
  return (
    <EditContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>
      <Title>회원정보 수정</Title>
      {serverError && <ServerErrorBox>{serverError}</ServerErrorBox>}
      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="newNickname">닉네임</Label>
          <Input
            id="newNickname"
            name="newNickname"
            value={newNickname}
            onChange={handleChange}
            placeholder="2~10자 한글, 영문, 숫자"
            $hasError={!!fieldError}
          />
          {fieldError && <FieldErrorText>{fieldError}</FieldErrorText>}
        </FieldGroup>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : "저장"}
        </SubmitButton>
      </Form>
    </EditContainer>
  );
};
export default MyPageEdit;
