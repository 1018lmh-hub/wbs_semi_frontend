// src/features/user/MyPage.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.space.lg};
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.sub};
  cursor: pointer;

  &:hover {
    color: ${theme.color.text};
  }
`;

export const Title = styled.h2`
  margin-top: ${theme.space.sm};
  font-size: ${theme.fontSize.xl};
  color: ${theme.color.text};
  margin-bottom: ${theme.space.md};
`;

export const LoadingText = styled.p`
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
`;

export const ErrorText = styled.p`
  color: ${theme.color.danger};
  font-size: ${theme.fontSize.sm};
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
  padding: ${theme.space.md};
  background-color: ${theme.color.bgSoft};
  border: 1px solid ${theme.color.border};
  border-radius: 8px;
`;

// 프로필 이미지 + 삭제 버튼(X)의 위치 기준이 되는 wrapper
export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${theme.color.border};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.5 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

// 프로필 이미지 우측 상단에 겹쳐지는 작은 삭제(X) 버튼
export const DeleteProfileButton = styled.button`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${theme.color.border};
  background-color: ${theme.color.headerBg};
  color: ${theme.color.sub};
  font-size: 11px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover:not(:disabled) {
    color: ${theme.color.danger};
    border-color: ${theme.color.danger};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const UserInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  min-width: 0;
`;

export const UserIdText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const NicknameText = styled.span`
  font-size: ${theme.fontSize.lg};
  font-weight: bold;
  color: ${theme.color.text};
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.lg};
`;

export const MenuButton = styled.button`
  padding: ${theme.space.sm};
  border-radius: 6px;
  border: 1px solid ${theme.color.border};
  background-color: ${theme.color.bgSoft};
  color: ${({ $danger }) => ($danger ? theme.color.danger : theme.color.text)};
  font-size: ${theme.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: ${({ $danger }) =>
      $danger ? theme.color.danger : theme.color.accent};
  }
`;
