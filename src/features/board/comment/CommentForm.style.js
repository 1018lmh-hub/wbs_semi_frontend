// src/features/board/comment/CommentForm.style.js
import styled from "styled-components";
import { theme } from "../../../styles/theme";

export const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  padding-top: ${theme.space.sm};
  border-top: 1px solid ${theme.color.border};
`;

export const Textarea = styled.textarea`
  min-height: 80px;
  padding: ${theme.space.sm};
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

export const SubmitButton = styled.button`
  align-self: flex-end;
  padding: ${theme.space.xs} ${theme.space.md};
  border: none;
  border-radius: 6px;
  background-color: ${theme.color.primary};
  color: #fff;
  font-size: ${theme.fontSize.sm};
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    background-color: ${theme.color.border};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${theme.color.primarySoft};
  }
`;

export const FieldErrorText = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.danger};
`;
