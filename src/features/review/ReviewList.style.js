// src/features/review/ReviewList.style.js
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

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`;

export const PageTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  color: ${theme.color.text};
  margin: 0;
`;

export const AvgRatingBadge = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.accent};
  background-color: ${theme.color.bgSoft};
  border-radius: 12px;
  padding: 2px ${theme.space.sm};
`;

export const ReviewList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
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

export const WriteReviewButton = styled.button`
  flex-shrink: 0;
  background-color: ${theme.color.primary};
  color: ${theme.color.headerText};
  border: none;
  border-radius: 6px;
  padding: ${theme.space.xs} ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${theme.color.primarySoft};
  }
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

export const SortToggleGroup = styled.div`
  display: flex;
  gap: ${theme.space.xs};
`;

export const SortToggleButton = styled.button`
  background-color: ${({ $isActive }) =>
    $isActive ? theme.color.primary : "transparent"};
  color: ${({ $isActive }) =>
    $isActive ? theme.color.headerText : theme.color.sub};
  border: 1px solid ${theme.color.border};
  border-radius: 12px;
  padding: 2px ${theme.space.sm};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;

  &:hover {
    color: ${theme.color.headerText};
    border-color: ${theme.color.accent};
  }
`;
