// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

// PROJECT_CONTEXT의 localStorage 키 컨벤션에서 memberId를 userId로 통일
// (review.userId와 동일한 키 이름으로 맞춰 본인 글 판별 시 혼동 방지)
const STORAGE_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  userId: "userId",
  memberName: "memberName",
  role: "role",
};

const getStoredUser = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (!token) return null;

  return {
    userId: localStorage.getItem(STORAGE_KEYS.userId),
    memberName: localStorage.getItem(STORAGE_KEYS.memberName),
    role: localStorage.getItem(STORAGE_KEYS.role),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  // Login.jsx에서 POST /auth/login 성공 시 응답의 data 필드를 그대로 전달해서 호출
  // data: { userId, nickname, accessToken, refreshToken, role }
  const login = useCallback((data) => {
    localStorage.setItem(STORAGE_KEYS.token, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.userId, data.userId);
    localStorage.setItem(STORAGE_KEYS.memberName, data.nickname);
    localStorage.setItem(STORAGE_KEYS.role, data.role);

    setUser({
      userId: data.userId,
      memberName: data.nickname,
      role: data.role,
    });
  }, []);

  const logout = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setUser(null);
  }, []);

  const value = {
    user, // { userId, memberName, role } | null
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
