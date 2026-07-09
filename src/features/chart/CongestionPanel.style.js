// src/features/chart/CongestionPanel.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  /* 오버레이 패널 높이에 맞춰 늘어나도록 고정 계산 (퍼센트 높이 체인에 의존하지 않음) */
  min-height: calc(100vh - ${theme.size.headerHeight});
  padding: ${theme.space.lg} 0;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.color.border};
  margin: ${theme.space.lg} ${theme.space.sm};
`;
