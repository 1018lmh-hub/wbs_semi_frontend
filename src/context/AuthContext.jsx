// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

// PROJECT_CONTEXT의 localStorage 키 컨벤션과 동일하게 유지
// (axios.js 요청 인터셉터가 STORAGE_KEYS.token을 그대로 읽어서 Authorization 헤더에 붙임)
const STORAGE_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  memberId: "memberId",
  memberName: "memberName",
  role: "role",
};

// 새로고침해도 로그인 상태가 풀리지 않도록, 초기 state를 localStorage에서 복구
const getStoredUser = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (!token) return null;

  return {
    memberId: localStorage.getItem(STORAGE_KEYS.memberId),
    memberName: localStorage.getItem(STORAGE_KEYS.memberName),
    role: localStorage.getItem(STORAGE_KEYS.role),
  };
};

// main.jsx에서 BrowserRouter 하위, App 상위를 감싸서 사용
// (ToastProvider와 마찬가지로 어느 컴포넌트에서든 useAuth()로 접근 가능)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  // Login.jsx에서 POST /auth/login 성공 시 응답의 data 필드를 그대로 전달해서 호출
  // data: { userId, nickname, accessToken, refreshToken, role }
  const login = useCallback((data) => {
    localStorage.setItem(STORAGE_KEYS.token, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.memberId, data.userId);
    localStorage.setItem(STORAGE_KEYS.memberName, data.nickname);
    localStorage.setItem(STORAGE_KEYS.role, data.role);

    setUser({
      memberId: data.userId,
      memberName: data.nickname,
      role: data.role,
    });
  }, []);

  const logout = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setUser(null);
  }, []);

  // 참고: axios.js의 응답 인터셉터도 refreshToken 만료 시 동일한 키들을 지우고
  // window.location.href = "/login"으로 강제 이동시키는데, 이 경우는 페이지 자체가
  // 새로고침되므로 AuthProvider가 다시 마운트되며 getStoredUser()로 자연스럽게 로그아웃 상태가 됨
  // → 별도로 axios.js와 상태를 동기화할 필요는 없음

  const value = {
    user, // { memberId, memberName, role } | null
    isLoggedIn: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
