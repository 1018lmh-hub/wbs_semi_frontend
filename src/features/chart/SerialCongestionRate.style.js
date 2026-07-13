import styled from "styled-components";
import { theme } from "../../styles/theme";
export const Wrapper = styled.div`
  padding: ${theme.space.md} ${theme.space.lg};
  color: ${theme.color.text};
  font-family: "Noto Sans KR", sans-serif;
`;
export const Title = styled.h2`
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.text};
  margin: 0 0 ${theme.space.xs} 0;
`;
export const SubText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  margin: 0 0 ${theme.space.sm} 0;
`;
export const ChartArea = styled.div`
  width: 100%;
`;
export const StatusText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${({ $isError }) => ($isError ? theme.color.danger : theme.color.sub)};
`;
