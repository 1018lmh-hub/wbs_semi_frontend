// src/features/station/StationDetail.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.space.sm} ${theme.space.lg} ${theme.space.sm};
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.space.sm};
`;

/* stationName과 북마크 별을 같은 줄에 붙여서 배치하기 위한 래퍼 */
export const StationNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  flex: 1;
  min-width: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.sub};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: ${theme.color.text};
  }
`;

export const StationName = styled.h2`
  flex: 1;
  min-width: 0;
  font-size: ${theme.fontSize.xl};
  color: ${theme.color.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* 즐겨찾기 별 - 꽉 찬 별은 accent(청록) 색상으로 강조 */
export const BookmarkButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  font-size: ${theme.fontSize.xl};
  line-height: 1;
  cursor: pointer;
  color: ${({ $bookmarked }) =>
    $bookmarked ? theme.color.accent : theme.color.sub};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    color: ${theme.color.accent};
  }
`;

export const StationAddress = styled.p`
  margin-top: ${theme.space.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const ChargerListSection = styled.section`
  margin-top: ${theme.space.sm};
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  margin-bottom: ${theme.space.xs};
`;

export const ChargerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

export const ChargerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.space.xs};
  border: 1px solid ${theme.color.border};
  border-radius: 8px;
  background-color: ${theme.color.bgSoft};
`;

export const ChargerName = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
`;

export const ChargerModeLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const ChargerStatusLabel = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: bold;
  color: ${theme.color.sub};
`;
