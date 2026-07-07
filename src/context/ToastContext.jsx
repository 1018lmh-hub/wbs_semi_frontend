// src/context/ToastContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";
import { ToastContainer } from "../components/common/Toast/Toast.style";
import Toast from "../components/common/Toast/Toast";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // type: "success" | "error"
  // options: { duration, actionLabel, onAction } - 후기 삭제 등 "취소 가능한" 토스트에서 사용
  const showToast = useCallback(
    (message, type = "success", options = {}) => {
      const { duration = DEFAULT_DURATION, actionLabel, onAction } = options;
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev,
        { id, message, type, actionLabel, onAction },
      ]);

      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// 사용 예시(기존): showToast("회원가입에 성공했습니다.", "success");
// 사용 예시(신규, 취소 가능): showToast("후기가 삭제되었습니다.", "error", { duration: 8000, actionLabel: "작업취소", onAction: () => {...} });
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
