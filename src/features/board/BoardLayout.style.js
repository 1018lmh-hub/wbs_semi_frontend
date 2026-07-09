// src/features/board/BoardLayout.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const BoardLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* 부모(OverlayContent 등)의 퍼센트 높이 체인에 기대지 않고,
     패널 높이(calc(100vh - headerHeight))를 직접 계산해서
     탭 아래 목록 영역이 남은 공간을 확실히 채우도록 함 */
  min-height: calc(100vh - ${theme.size.headerHeight});
`;

export const BoardTabRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.color.border};
  flex-shrink: 0;
`;

export const BoardTab = styled.button`
  flex: 1;
  padding: ${theme.space.sm};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;

  &.active {
    color: ${theme.color.accent};
    border-bottom-color: ${theme.color.accent};
  }

  &:hover {
    color: ${theme.color.text};
  }
`;
