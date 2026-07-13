import styled from "styled-components";
import { theme } from "../../styles/theme";
export const MapContainer = styled.div`
  position: fixed;
  top: ${theme.size.headerHeight};
  left: 0;
  width: 100vw;
  height: calc(100vh - ${theme.size.headerHeight});
  z-index: 0;
  background-color: ${theme.color.bg};
`;
export const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${theme.color.sub};
  font-family: "Orbitron", "Noto Sans KR", sans-serif;
  gap: 12px;
  position: absolute;
  top: 0;
  left: 0;
`;
