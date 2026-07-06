// src/context/ToastContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";
import { ToastContainer } from "../components/common/Toast/Toast.style";
import Toast from "../components/common/Toast/Toast";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3000; // 자동으로 사라지는 시간 (ms)

// 회원가입/로그인/후기작성/즐겨찾기 등 성공(실패) 알림에서 공통으로 쓰는
// 전역 토스트. main.jsx에서 최상단을 감싸두면 어느 컴포넌트에서든
// useToast()로 호출 가능.
// (Toast.jsx / Toast.style.js는 순수 UI라 components/common/Toast/에 그대로 두고,
//  Context 로직만 AuthContext와 동일하게 src/context/로 이동함)
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // type: "success" | "error" (theme.color.success / theme.color.danger 참조)
  const showToast = useCallback(
    (message, type = "success", duration = DEFAULT_DURATION) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      // duration 이후 자동 제거 (X 버튼으로도 즉시 제거 가능)
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
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// 사용 예시: const { showToast } = useToast(); showToast("회원가입에 성공했습니다.", "success");
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
