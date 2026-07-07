// src/components/layout/Header/Header.style.js
import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${theme.size.headerHeight};
  background-color: ${theme.color.headerBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${theme.space.md};
  z-index: 1000;
  box-sizing: border-box;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${theme.color.headerText};
  font-size: ${theme.fontSize.xl};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${theme.color.accent};
  }
`;

export const LogoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  height: 32px;
  width: auto;
  display: block;
  margin-top: 6px;
`;

export const AuthContainer = styled.div`
  display: flex;
  gap: ${theme.space.md};
`;

export const AuthItem = styled.div`
  margin-top: 7px;
  color: ${theme.color.sub};
  font-family: "Noto Sans KR", sans-serif;
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${theme.color.headerText};
  }
`;
