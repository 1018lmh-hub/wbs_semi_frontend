// src/features/review/ReviewItem.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

// 카드형으로 통일 (기존 ReviewPreview.style.js의 카드 스타일 기준)
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
  min-width: 0; /* preview variant의 말줄임(ellipsis) 적용을 위해 필요 */
`;

/* 우선순위: 제목(강조) > 작성자(보조) 순으로 표시
   preview: 한 줄 말줄임 / list(전체보기): 줄바꿈 허용, 전체 표시 */
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

export const Nickname = styled.span`
  display: block;
  margin-top: ${theme.space.xs};
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

export const LikeCount = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const DateText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

/* preview: 2줄 말줄임(-webkit-line-clamp) / list(전체보기): 전체 내용 표시 */
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
