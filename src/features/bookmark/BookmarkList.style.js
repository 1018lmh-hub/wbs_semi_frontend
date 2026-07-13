import styled from "styled-components";
import { theme } from "../../styles/theme";
export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
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
export const PageTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.text};
  margin: 0;
`;
export const BookmarkListWrap = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;
export const BookmarkCard = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm};
  border-radius: 8px;
  background-color: ${theme.color.bgSoft};
  border: 1px solid ${theme.color.border};
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  &:hover {
    border-color: ${theme.color.accent};
  }
`;
export const StationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
export const StationName = styled.p`
  font-size: ${theme.fontSize.sm};
  font-weight: bold;
  color: ${theme.color.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const StationAddress = styled.p`
  margin-top: ${theme.space.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const BookmarkStarButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  font-size: ${theme.fontSize.xl};
  line-height: 1;
  cursor: pointer;
  color: ${theme.color.accent};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    color: ${theme.color.danger};
  }
`;
export const EmptyMessage = styled.p`
  color: ${theme.color.sub};
  font-size: ${theme.fontSize.sm};
  text-align: center;
  padding: ${theme.space.lg} 0;
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
export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.space.xs};
  margin-top: ${theme.space.sm};
`;
export const PageArrowButton = styled.button`
  background: none;
  border: 1px solid ${theme.color.border};
  border-radius: 4px;
  color: ${theme.color.text};
  width: 28px;
  height: 28px;
  cursor: pointer;
  &:disabled {
    color: ${theme.color.border};
    cursor: not-allowed;
  }
`;
export const PageNumberButton = styled.button`
  background-color: ${({ $isActive }) =>
    $isActive ? theme.color.primary : "transparent"};
  color: ${({ $isActive }) =>
    $isActive ? theme.color.headerText : theme.color.text};
  border: 1px solid ${theme.color.border};
  border-radius: 4px;
  width: 28px;
  height: 28px;
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? theme.color.primary : theme.color.bgSoft};
  }
`;
