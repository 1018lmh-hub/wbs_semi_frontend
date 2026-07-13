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
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
