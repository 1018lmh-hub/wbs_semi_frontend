// src/features/chart/CongestionPanel.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.color.border};
  margin: 0 ${theme.space.sm}; /* md → sm */
`;
