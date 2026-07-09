// src/features/chart/CurrentCongestionRate.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const Wrapper = styled.div`
  padding: ${theme.space.sm} ${theme.space.md}; /* md → sm으로 줄임 (상하 여백) */
  color: ${theme.color.text};
  font-family: "Noto Sans KR", sans-serif;
`;

export const Title = styled.h2`
  font-size: ${theme.fontSize.md}; /* lg → md */
  color: ${theme.color.text};
  margin: 0 0 4px 0; /* xs → 4px로 더 줄임 */
`;

export const SubText = styled.p`
  font-size: ${theme.fontSize.xs}; /* sm → xs */
  color: ${theme.color.sub};
  margin: 0 0 ${theme.space.xs} 0; /* md → xs */
`;

export const ChartArea = styled.div`
  width: 100%;
`;

export const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.space.xs}; /* sm → xs */
  margin-top: ${theme.space.xs}; /* md → xs */
`;

export const StatBox = styled.div`
  flex: 1;
  background-color: ${theme.color.bgSoft};
  border: 1px solid ${theme.color.border};
  border-radius: 8px;
  padding: ${theme.space.xs}; /* sm → xs */
  text-align: center;
`;

export const StatLabel = styled.div`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  margin-bottom: 4px;
`;

export const StatValue = styled.div`
  font-size: ${theme.fontSize.md};
  font-weight: 700;
  color: ${({ $color }) => $color || theme.color.text};
`;

export const StatusText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${({ $isError }) => ($isError ? theme.color.danger : theme.color.sub)};
`;
