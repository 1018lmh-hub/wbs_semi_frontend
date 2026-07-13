import styled from "styled-components";
import { theme } from "../../styles/theme";
export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: calc(100vh - ${theme.size.headerHeight});
  padding: ${theme.space.lg} 0;
`;
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.color.border};
  margin: ${theme.space.lg} ${theme.space.sm};
`;
