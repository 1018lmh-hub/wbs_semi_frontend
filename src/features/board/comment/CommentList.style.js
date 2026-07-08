// src/features/board/comment/CommentList.style.js
import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  margin-top: ${theme.space.md};
`;

export const ListTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
  margin: 0;
`;

export const ItemsWrap = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

export const EmptyMessage = styled.p`
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.space.md} 0;
`;

export const LoadingMessage = styled.p`
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.space.md} 0;
`;

export const ErrorMessage = styled.p`
  color: ${theme.color.danger};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.space.md} 0;
`;
