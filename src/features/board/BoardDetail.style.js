// src/features/board/BoardDetail.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  padding: ${theme.space.lg};
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const BackButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${theme.color.text};
  }
`;

export const TitleRow = styled.div`
  border-bottom: 1px solid ${theme.color.border};
  padding-bottom: ${theme.space.sm};
`;

export const TitleText = styled.h2`
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.text};
  margin: 0;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const Nickname = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  font-weight: bold;
`;

export const DateText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const CountText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const ContentText = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.text};
  line-height: 1.6;
  white-space: pre-wrap;
  padding: ${theme.space.md} 0;
  border-bottom: 1px solid ${theme.color.border};
`;

export const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.space.xs};
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

export const LoadingMessage = styled.p`
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.space.lg} 0;
`;

export const ErrorMessage = styled.p`
  color: ${theme.color.danger};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.space.lg} 0;
`;
