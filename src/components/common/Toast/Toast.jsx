// src/components/common/Toast/Toast.jsx
import React from "react";
import { ToastBox, ToastMessage, ToastCloseButton } from "./Toast.style";

// 개별 토스트 아이템 (실제 표시/제거 관리는 ToastContext의 ToastProvider가 담당)
const Toast = ({ message, type = "success", onClose }) => {
  return (
    <ToastBox $type={type}>
      <ToastMessage>{message}</ToastMessage>
      <ToastCloseButton onClick={onClose} aria-label="닫기">
        ✕
      </ToastCloseButton>
    </ToastBox>
  );
};

export default Toast;
