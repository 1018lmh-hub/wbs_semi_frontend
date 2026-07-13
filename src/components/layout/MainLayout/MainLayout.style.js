import styled from "styled-components";
import { theme } from "../../../styles/theme";
export const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: ${theme.color.bg};
`;
export const OverlayContainer = styled.aside`
  position: absolute;
  top: ${theme.size.headerHeight};
  right: 0;
  width: 40vw;
  height: calc(100vh - ${theme.size.headerHeight});
  background-color: ${theme.color.bgSoft};
  border-left: 1px solid ${theme.color.border};
  z-index: 2000;
  box-sizing: border-box;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(100%)"};
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? "-4px 0 15px rgba(0, 0, 0, 0.5)" : "none"};
`;
export const OverlayContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: ${theme.color.text};
  font-family: "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${theme.color.border};
    border-radius: 3px;
  }
`;
