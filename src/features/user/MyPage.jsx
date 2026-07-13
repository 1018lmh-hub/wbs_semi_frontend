import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import {
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../../lib/userApi";
import { DEFAULT_PROFILE_IMAGE } from "../../lib/defaultProfileImage";
import {
  MyPageContainer,
  HeaderRow,
  CloseButton,
  Title,
  ProfileSection,
  ProfileImageWrapper,
  ProfileImage,
  DeleteProfileButton,
  HiddenFileInput,
  UserInfoBlock,
  UserIdText,
  NicknameText,
  MenuList,
  MenuButton,
  LoadingText,
  ErrorText,
} from "./MyPage.style";
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
const MAX_PROFILE_SIZE = 100 * 1024 * 1024;
const MyPage = () => {
  const navigate = useNavigate();
  const { onCloseOverlay } = useOutletContext() ?? {};
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "회원정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);
  const handleProfileClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };
  const handleProfileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_PROFILE_TYPES.includes(file.type)) {
      showToast("지원하지 않는 파일형식입니다.", "error");
      return;
    }
    if (file.size > MAX_PROFILE_SIZE) {
      showToast("이미지 용량은 100MB 이하여야 합니다.", "error");
      return;
    }
    setIsUploading(true);
    try {
      await updateUserProfile(file);
      await loadProfile();
      showToast("프로필이 변경되었습니다.", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ??
        "프로필 변경에 실패했습니다. 잠시 후 다시 시도해주세요.";
      showToast(message, "error");
    } finally {
      setIsUploading(false);
    }
  };
  const handleDeleteProfile = async (e) => {
    e.stopPropagation();
    if (isUploading) return;
    setIsUploading(true);
    try {
      await deleteUserProfile();
      await loadProfile();
      showToast("프로필이 기본 이미지로 변경되었습니다.", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ??
        "프로필 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.";
      showToast(message, "error");
    } finally {
      setIsUploading(false);
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
    <MyPageContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>
      <Title>마이페이지</Title>
      {isLoading && <LoadingText>정보를 불러오는 중입니다.</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      {!isLoading && !error && profile && (
        <>
          <ProfileSection>
            <ProfileImageWrapper onClick={handleProfileClick}>
              <ProfileImage
                src={profile.changeProfileName || DEFAULT_PROFILE_IMAGE}
                alt={`${profile.nickname} 프로필`}
                $dimmed={isUploading}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              {profile.changeProfileName && (
                <DeleteProfileButton
                  type="button"
                  aria-label="프로필 삭제"
                  onClick={handleDeleteProfile}
                  disabled={isUploading}
                >
                  ✕
                </DeleteProfileButton>
              )}
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
              />
            </ProfileImageWrapper>
            <UserInfoBlock>
              <UserIdText>{profile.userId}</UserIdText>
              <NicknameText>{profile.nickname}</NicknameText>
            </UserInfoBlock>
          </ProfileSection>
          <MenuList>
            <MenuButton type="button" onClick={() => navigate("/myPage/edit")}>
              회원정보 수정
            </MenuButton>
            <MenuButton
              type="button"
              onClick={() => navigate("/myPage/password")}
            >
              비밀번호 변경
            </MenuButton>
            <MenuButton
              type="button"
              $danger
              onClick={() => navigate("/myPage/withdraw")}
            >
              회원탈퇴
            </MenuButton>
          </MenuList>
        </>
      )}
    </MyPageContainer>
  );
};
export default MyPage;
