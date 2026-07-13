// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  userId: "userId",
  nickname: "nickname",
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

  // (변경) DB에 저장된 리프레시 토큰도 함께 삭제하도록 서버 요청 추가.
  // 서버 요청이 실패하더라도(네트워크 오류, 이미 만료된 토큰 등) 클라이언트 로그아웃은
  // 반드시 진행되어야 하므로 try/catch로 감싸고, localStorage 정리 + 상태 초기화는
  // 요청 성공 여부와 무관하게 항상 실행함.
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

    if (refreshToken) {
      try {
        // 백엔드 컨트롤러가 @RequestBody String refreshToken 을 받으므로
        // 순수 문자열을 JSON으로 직접 보내야 함 (axios가 문자열은 자동 stringify 하지 않음)
        await api.post("/auth/logout", JSON.stringify(refreshToken), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("서버 로그아웃 요청 실패:", err);
      }
    }

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setUser(null);
  }, []);

  const updateNickname = useCallback((newNickname) => {
    localStorage.setItem(STORAGE_KEYS.nickname, newNickname);
    setUser((prev) => (prev ? { ...prev, nickname: newNickname } : prev));
  }, []);

  const value = {
    user,
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
