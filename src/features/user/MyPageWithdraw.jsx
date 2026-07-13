import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountWithdrawal } from "./useAccountWithdrawal";
import {
  WithdrawContainer,
  HeaderRow,
  CloseButton,
  Title,
  WarningBox,
  Form,
  FieldGroup,
  Label,
  Input,
  FieldErrorText,
  SubmitButton,
} from "./MyPageWithdraw.style";
const PWD_REGEX = /^[a-zA-Z0-9@$!%*#?&]{8,20}$/;
const MyPageWithdraw = () => {
  const navigate = useNavigate();
  const { requestWithdrawal } = useAccountWithdrawal();
  const [userPwd, setUserPwd] = useState("");
  const [fieldError, setFieldError] = useState(null);
  const handleChange = (e) => {
    setUserPwd(e.target.value);
    setFieldError(null);
  };
  const validate = () => {
    if (!PWD_REGEX.test(userPwd)) {
      setFieldError(
        "비밀번호는 8~20자의 영문, 숫자, @$!%*#?& 만 사용할 수 있습니다.",
      );
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    requestWithdrawal(userPwd);
  };
  const handleClose = () => {
    navigate("/myPage");
  };
  return (
    <WithdrawContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>
      <Title>회원탈퇴</Title>
      <WarningBox>
        탈퇴 시 계정 정보가 더 이상 사용되지 않습니다. 제출 후 8초 이내에
        토스트의 "작업취소"를 누르면 탈퇴를 취소할 수 있습니다.
      </WarningBox>
      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="userPwd">비밀번호</Label>
          <Input
            id="userPwd"
            name="userPwd"
            type="password"
            value={userPwd}
            onChange={handleChange}
            $hasError={!!fieldError}
            autoComplete="current-password"
          />
          {fieldError && <FieldErrorText>{fieldError}</FieldErrorText>}
        </FieldGroup>
        <SubmitButton type="submit">탈퇴하기</SubmitButton>
      </Form>
    </WithdrawContainer>
  );
};
export default MyPageWithdraw;
