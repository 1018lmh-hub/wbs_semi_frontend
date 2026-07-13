// src/features/user/SignUp.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../api/axios";
import {
  SignUpContainer,
  HeaderRow,
  CloseButton,
  Title,
  Form,
  FieldGroup,
  Label,
  Input,
  FieldErrorText,
  ProfileUploadRow,
  ProfilePreview,
  ProfilePlaceholder,
  FileInputLabel,
  HiddenFileInput,
  ServerErrorBox,
  SubmitButton,
} from "./SignUp.style";
import { useToast } from "../../context/ToastContext";

// ─────────────────────────────────────────────
// 클라이언트 측 유효성 검사 규칙 (백엔드 DTO 제약과 동일하게 맞춤)
// ─────────────────────────────────────────────
const USER_ID_REGEX = /^[a-zA-Z0-9_]{5,12}$/;
const USER_PWD_REGEX = /^[a-zA-Z0-9@$!%*#?&]{8,20}$/;
const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]{2,10}$/;
const ALLOWED_PROFILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
];
const MAX_PROFILE_SIZE = 5 * 1024 * 1024; // 5MB

const INITIAL_FORM = {
  userId: "",
  userPwd: "",
  userPwdConfirm: "",
  nickname: "",
};

const SignUp = () => {
  const navigate = useNavigate();
  // MainLayout에서 내려주는 오버레이 닫기 핸들러 (StationDetail 등과 동일 패턴)
  const { onCloseOverlay } = useOutletContext() ?? {};

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // 선택한 프로필 이미지 미리보기 URL 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    };
  }, [profilePreviewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // 입력 중에는 해당 필드 에러만 지워서 거슬리지 않게 처리
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setServerError(null);
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_PROFILE_TYPES.includes(file.type)) {
      setProfileError("지원하지 않는 이미지 형식입니다.");
      return;
    }
    if (file.size > MAX_PROFILE_SIZE) {
      setProfileError("이미지 용량은 5MB 이하여야 합니다.");
      return;
    }

    setProfileError(null);
    setProfileFile(file);
    setProfilePreviewUrl(URL.createObjectURL(file));
  };

  // 필드별 유효성 검사 (백엔드 정규식 기준과 동일)
  const validate = () => {
    const errors = {};

    if (!USER_ID_REGEX.test(form.userId)) {
      errors.userId = "아이디는 5~12자의 영문, 숫자, _만 사용할 수 있습니다.";
    }
    if (!USER_PWD_REGEX.test(form.userPwd)) {
      errors.userPwd =
        "비밀번호는 8~20자의 영문, 숫자, @$!%*#?& 만 사용할 수 있습니다.";
    }
    if (form.userPwdConfirm !== form.userPwd) {
      errors.userPwdConfirm = "비밀번호가 일치하지 않습니다.";
    }
    if (!NICKNAME_REGEX.test(form.nickname)) {
      errors.nickname =
        "닉네임은 2~10자의 한글, 영문, 숫자만 사용할 수 있습니다.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    // 백엔드가 @ModelAttribute + @RequestParam(name="file")로 받으므로
    // multipart/form-data로 전송. Content-Type은 axios가 FormData를 보고
    // boundary를 포함해 자동으로 설정하므로 직접 지정하지 않음.
    const formData = new FormData();
    formData.append("userId", form.userId);
    formData.append("userPwd", form.userPwd);
    formData.append("nickname", form.nickname);
    // NOTE: 명세서 예시 표의 key는 "profile"이지만 실제 바인딩은
    // @RequestParam(name="file")이라 "file"로 전송함. 실제 구현이 다르면
    // 이 한 줄의 key만 "profile"로 바꾸면 됨.
    if (profileFile) {
      formData.append("file", profileFile);
    }

    try {
      await api.post("/users", formData);
      showToast("회원가입에 성공했습니다.", "success");
      navigate("/"); // 요청대로 /login 대신 메인화면으로 이동
    } catch (err) {
      // 실패 시 인라인 에러는 기존 로직 그대로 유지 (토스트는 성공 시에만 사용)
      const message =
        err.response?.data?.message ??
        "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setServerError(message);
    } finally {
      // (수정) 기존에는 finally가 없어 실패 시 isSubmitting이 계속 true로 남아
      // 버튼이 "가입 중..." 상태로 멈춰 재요청이 불가능했음.
      // 성공 시에는 어차피 navigate("/")로 화면을 벗어나므로 여기서 풀어줘도 무방함.
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
    <SignUpContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>

      <Title>회원가입</Title>

      {serverError && <ServerErrorBox>{serverError}</ServerErrorBox>}

      <Form onSubmit={handleSubmit} noValidate>
        <ProfileUploadRow>
          {profilePreviewUrl ? (
            <ProfilePreview src={profilePreviewUrl} alt="프로필 미리보기" />
          ) : (
            <ProfilePlaceholder>프로필</ProfilePlaceholder>
          )}
          <FileInputLabel htmlFor="signup-profile">이미지 선택</FileInputLabel>
          <HiddenFileInput
            id="signup-profile"
            type="file"
            accept="image/*"
            onChange={handleProfileChange}
          />
        </ProfileUploadRow>
        {profileError && <FieldErrorText>{profileError}</FieldErrorText>}

        <FieldGroup>
          <Label htmlFor="userId">아이디</Label>
          <Input
            id="userId"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            placeholder="5~12자 영문, 숫자, _"
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
            placeholder="8~20자 영문, 숫자, @$!%*#?&"
            $hasError={!!fieldErrors.userPwd}
            autoComplete="new-password"
          />
          {fieldErrors.userPwd && (
            <FieldErrorText>{fieldErrors.userPwd}</FieldErrorText>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="userPwdConfirm">비밀번호 확인</Label>
          <Input
            id="userPwdConfirm"
            name="userPwdConfirm"
            type="password"
            value={form.userPwdConfirm}
            onChange={handleChange}
            $hasError={!!fieldErrors.userPwdConfirm}
            autoComplete="new-password"
          />
          {fieldErrors.userPwdConfirm && (
            <FieldErrorText>{fieldErrors.userPwdConfirm}</FieldErrorText>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="2~10자 한글, 영문, 숫자"
            $hasError={!!fieldErrors.nickname}
          />
          {fieldErrors.nickname && (
            <FieldErrorText>{fieldErrors.nickname}</FieldErrorText>
          )}
        </FieldGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "회원가입"}
        </SubmitButton>
      </Form>
    </SignUpContainer>
  );
};

export default SignUp;
