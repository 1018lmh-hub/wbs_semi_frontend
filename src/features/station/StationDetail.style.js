// src/features/station/StationDetail.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 충전기 3개 기준으로 100% 줌에서 스크롤 없이 한 화면에 들어오도록 여백 압축 */
  padding: ${theme.space.sm} ${theme.space.lg} ${theme.space.sm};
`;

/* CloseButton과 StationName을 같은 줄에 배치 */
export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.space.sm};
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

export const StationAddress = styled.p`
  margin-top: ${theme.space.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

/* TODO: 평균 별점 영역 - 리뷰 API 연동 후 구현 */

/* TODO: 즐겨찾기 토글 영역 - 즐겨찾기 API 연동 후 구현 */

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
  /* 상태값에 따른 색상은 chargeStatus 코드 기반으로 추후 lib/chargeStatus.js 연동 가능 */
  /* primary가 배경(bgSoft)과 대비가 약해 잘 안 보여서 sub로 변경 */
  color: ${theme.color.sub};
`;

/* 후기 미리보기 / 전체보기 스타일은 ReviewPreview.style.js로 분리됨 */

/* NOTE: 후기 작성 버튼은 ReviewPreview.jsx 헤더로 이동되어 이 컴포넌트는
   더 이상 StationDetail.jsx에서 쓰이지 않음. 필요 없으면 삭제해도 무방 */
export const WriteReviewButton = styled.button`
  margin-top: ${theme.space.xs};
  width: 100%;
  padding: ${theme.space.xs};
  border: 1px solid ${theme.color.border};
  border-radius: 6px;
  background: none;
  color: ${theme.color.text};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;

  &:hover {
    border-color: ${theme.color.primary};
    color: ${theme.color.primary};
  }
`;
