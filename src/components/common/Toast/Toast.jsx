// src/components/common/Toast/Toast.jsx
import React from "react";
import {
  ToastBox,
  ToastMessage,
  ToastActionButton,
  ToastCloseButton,
} from "./Toast.style";

const Toast = ({
  message,
  type = "success",
  actionLabel,
  onAction,
  onClose,
}) => {
  // 액션 버튼 클릭 시: 등록된 취소 로직 실행 + 토스트도 즉시 닫음
  // (X 버튼은 취소가 아니라 단순히 토스트만 닫는 것 — 8초 타이머는 계속 진행됨)
  const handleActionClick = () => {
    onAction?.();
    onClose();
  };

  return (
    <ToastBox $type={type}>
      <ToastMessage>{message}</ToastMessage>
      {actionLabel && (
        <ToastActionButton type="button" onClick={handleActionClick}>
          {actionLabel}
        </ToastActionButton>
      )}
      <ToastCloseButton onClick={onClose} aria-label="닫기">
        ✕
      </ToastCloseButton>
    </ToastBox>
  );
};

export default Toast;
