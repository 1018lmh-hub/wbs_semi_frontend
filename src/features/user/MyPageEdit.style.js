// src/features/user/MyPageEdit.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.space.lg};
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.sub};
  cursor: pointer;

  &:hover {
    color: ${theme.color.text};
  }
`;

export const Title = styled.h2`
  margin-top: ${theme.space.sm};
  font-size: ${theme.fontSize.xl};
  color: ${theme.color.text};
  margin-bottom: ${theme.space.md};
`;

export const ServerErrorBox = styled.div`
  padding: ${theme.space.sm};
  margin-bottom: ${theme.space.md};
  border-radius: 8px;
  background-color: ${theme.color.bgSoft};
  border: 1px solid ${theme.color.danger};
  color: ${theme.color.danger};
  font-size: ${theme.fontSize.sm};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

export const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
`;

export const Input = styled.input`
  padding: ${theme.space.sm};
  border-radius: 6px;
  border: 1px solid
    ${({ $hasError }) => ($hasError ? theme.color.danger : theme.color.border)};
  background-color: ${theme.color.bgSoft};
  color: ${theme.color.text};
  font-size: ${theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? theme.color.danger : theme.color.primary};
  }
`;

export const FieldErrorText = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.danger};
`;

export const SubmitButton = styled.button`
  margin-top: ${theme.space.sm};
  padding: ${theme.space.sm};
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
