// src/features/board/comment/CommentItem.style.js
import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const ItemContainer = styled.li`
  padding: ${theme.space.xs} ${theme.space.sm};
  border-radius: 8px;
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.border};
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const Nickname = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: bold;
  color: ${theme.color.text};
`;

export const DateText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const ContentText = styled.p`
  margin-top: ${theme.space.xs};
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.xs};
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  padding: 2px ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  cursor: pointer;

  &:hover {
    color: ${theme.color.accent};
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 2px ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  cursor: pointer;

  &:hover {
    color: ${theme.color.danger};
  }
`;

export const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.xs};
`;

export const EditTextarea = styled.textarea`
  min-height: 70px;
  padding: ${theme.space.xs};
  border-radius: 6px;
  border: 1px solid
    ${({ $hasError }) => ($hasError ? theme.color.danger : theme.color.border)};
  background-color: ${theme.color.bgSoft};
  color: ${theme.color.text};
  font-size: ${theme.fontSize.sm};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? theme.color.danger : theme.color.primary};
  }
`;

export const EditButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.space.xs};
`;

export const SaveButton = styled.button`
  padding: ${theme.space.xs} ${theme.space.sm};
  border: none;
  border-radius: 6px;
  background-color: ${theme.color.primary};
  color: #fff;
  font-size: ${theme.fontSize.xs};
  cursor: pointer;

  &:disabled {
    background-color: ${theme.color.border};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${theme.color.primarySoft};
  }
`;

export const CancelButton = styled.button`
  padding: ${theme.space.xs} ${theme.space.sm};
  border: 1px solid ${theme.color.border};
  border-radius: 6px;
  background: none;
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;

  &:hover {
    color: ${theme.color.text};
  }
`;

export const FieldErrorText = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.danger};
`;
