// src/features/board/BoardLayout.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const BoardLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
