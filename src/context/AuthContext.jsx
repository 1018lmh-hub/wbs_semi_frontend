// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  userId: "userId",
  nickname: "nickname", // memberName → nickname으로 통일 (review.nickname 등과 이름 맞춤)
  role: "role",
};

const getStoredUser = () => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (!token) return null;

  return {
    userId: localStorage.getItem(STORAGE_KEYS.userId),
    nickname: localStorage.getItem(STORAGE_KEYS.nickname),
    role: localStorage.getItem(STORAGE_KEYS.role),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  // data: { userId, nickname, accessToken, refreshToken, role }
  const login = useCallback((data) => {
    localStorage.setItem(STORAGE_KEYS.token, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.userId, data.userId);
    localStorage.setItem(STORAGE_KEYS.nickname, data.nickname);
    localStorage.setItem(STORAGE_KEYS.role, data.role);

    setUser({
      userId: data.userId,
      nickname: data.nickname,
      role: data.role,
    });
  }, []);

  const logout = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setUser(null);
  }, []);

  // 마이페이지 닉네임 수정 성공 시 호출: localStorage + 전역 상태 동시 갱신
  const updateNickname = useCallback((newNickname) => {
    localStorage.setItem(STORAGE_KEYS.nickname, newNickname);
    setUser((prev) => (prev ? { ...prev, nickname: newNickname } : prev));
  }, []);

  const value = {
    user, // { userId, nickname, role } | null
    isLoggedIn: !!user,
    login,
    logout,
    updateNickname,
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
