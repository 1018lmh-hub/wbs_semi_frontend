import styled from "styled-components";
import { theme } from "../../../styles/theme";
export const ToastContainer = styled.div`
  position: fixed;
  bottom: ${theme.space.lg};
  right: ${theme.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  z-index: 9999;
`;
export const ToastBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  min-width: 240px;
  max-width: 360px;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: 8px;
  color: #fff;
  font-size: ${theme.fontSize.sm};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background-color: ${({ $type }) =>
    $type === "success" ? theme.color.success : theme.color.danger};
  animation: toast-slide-in 0.25s ease-out;
  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
export const ToastMessage = styled.p`
  flex: 1;
`;
export const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;
export const ToastActionButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  padding: 2px ${theme.space.xs};
  color: #fff;
  font-size: ${theme.fontSize.xs};
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;
