// src/components/common/Toast/Toast.style.js
import styled from "styled-components";
import { theme } from "../../../styles/theme";

// 화면 우측 하단 고정, 토스트가 여러 개 쌓이면 위로 쌓이도록 구성
export const ToastContainer = styled.div`
  position: fixed;
  bottom: ${theme.space.lg};
  right: ${theme.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
  z-index: 9999; /* MainLayout의 오버레이(2000)보다 위에 표시되어야 함 */
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
  /* 요청대로 success / 그 외(error) 2가지 색상만 구분 */
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
