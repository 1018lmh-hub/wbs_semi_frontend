// src/features/board/BoardItem.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const ItemContainer = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm};
  border-radius: 8px;
  background-color: ${theme.color.bgSoft};
  border: 1px solid ${theme.color.border};
  cursor: pointer;

  &:hover {
    border-color: ${theme.color.accent};
  }
`;

export const TitleBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: bold;
  color: ${theme.color.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Nickname = styled.span`
  display: block;
  margin-top: ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
`;

export const CountText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const DateText = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
`;

export const DeleteButton = styled.button`
  flex-shrink: 0;
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
