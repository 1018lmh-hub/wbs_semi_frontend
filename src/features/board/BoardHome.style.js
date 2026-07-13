import styled from "styled-components";
import { theme } from "../../styles/theme";
export const BoardHomeContainer = styled.div`
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
  margin-bottom: ${theme.space.lg};
`;
export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;
export const BoardButton = styled.button`
  padding: ${theme.space.md};
  border-radius: 8px;
  border: 1px solid ${theme.color.border};
  background-color: ${theme.color.bgSoft};
  color: ${theme.color.text};
  font-size: ${theme.fontSize.md};
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover {
    border-color: ${theme.color.accent};
    color: ${theme.color.accent};
  }
`;
