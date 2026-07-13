import styled, { keyframes } from "styled-components";
import { theme } from "../../styles/theme";
const heartBounce = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.35); }
  100% { transform: scale(1); }
`;
export const ItemContainer = styled.li`
  padding: ${theme.space.xs};
  border-radius: 8px;
  background-color: ${theme.color.bgSoft};
  border: 1px solid ${theme.color.border};
`;
export const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.space.sm};
`;
export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: ${theme.color.border};
`;
export const TitleBlock = styled.div`
  flex: 1;
  min-width: 0;
`;
export const Title = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: bold;
  color: ${theme.color.text};
  ${({ $variant }) =>
    $variant === "preview"
      ? `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `
      : `
    white-space: normal;
  `}
`;
export const NicknameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.xs};
`;
export const Nickname = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;
export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
`;
export const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  font-size: ${theme.fontSize.xs};
  color: ${({ $liked }) => ($liked ? theme.color.danger : theme.color.sub)};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    color: ${theme.color.danger};
  }
`;
export const DateText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;
export const ContentText = styled.p`
  margin-top: ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  ${({ $variant }) =>
    $variant === "preview"
      ? `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `
      : `
    line-height: 1.5;
  `}
`;
export const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${theme.space.xs};
`;
export const EditButton = styled.button`
  background: none;
  border: none;
  padding: 2px ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  cursor: pointer;
  &:hover {
    color: ${theme.color.accent};
  }
`;
export const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 2px ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  cursor: pointer;
  &:hover {
    color: ${theme.color.danger};
  }
`;
export const RatingStars = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.accent};
  letter-spacing: 1px;
`;
export const HeartIcon = styled.span`
  display: inline-block;
  font-size: ${theme.fontSize.sm};
  animation: ${({ $isBouncing }) => ($isBouncing ? heartBounce : "none")} 0.3s
    ease-in-out;
`;
