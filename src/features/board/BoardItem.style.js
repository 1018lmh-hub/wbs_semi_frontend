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
export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
  min-width: 0;
`;
export const Title = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: bold;
  color: ${theme.color.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;
export const AnsweredBadge = styled.span`
  flex-shrink: 0;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.accent};
  background-color: ${theme.color.bg};
  border: 1px solid ${theme.color.accent};
  border-radius: 10px;
  padding: 1px ${theme.space.xs};
  white-space: nowrap;
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
