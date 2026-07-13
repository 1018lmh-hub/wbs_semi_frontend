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
