// src/features/station/ReviewPreview.style.js
import styled from "styled-components";
import { theme } from "../../styles/theme";

export const PreviewContainer = styled.section`
  margin-top: ${theme.space.lg};
  padding-top: ${theme.space.md};
  border-top: 1px solid ${theme.color.border};
`;

export const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.space.sm};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.xs};
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  color: ${theme.color.text};
`;

export const AvgRatingBadge = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.accent};
  font-weight: bold;
`;

export const ViewAllButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSize.xs};
  color: ${theme.color.sub};
  cursor: pointer;

  &:hover {
    color: ${theme.color.text};
  }
`;

export const ReviewList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const EmptyMessage = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
  text-align: center;
  padding: ${theme.space.md} 0;
`;

export const LoadingMessage = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.sub};
`;

export const ErrorMessage = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.color.danger};
`;
