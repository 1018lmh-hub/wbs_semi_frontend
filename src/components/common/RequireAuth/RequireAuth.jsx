// src/components/common/RequireAuth/RequireAuth.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

// 로그인이 필요한 라우트 그룹을 감싸는 공용 가드.
// App.jsx에서 <Route element={<RequireAuth />}> 로 자식 라우트들을 감싸면
// 비로그인 상태에서 그 하위 URL(예: /myPage/edit, /myPage/password, /myPage/withdraw)로
// 직접 접근해도 자동으로 /login으로 리다이렉트됨.
// MyPage.jsx에 있던 개별 로그인 체크 로직을 여기로 옮겨 공통화함.
const RequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      showToast("로그인이 필요합니다.", "error");
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate, showToast]);

  // 리다이렉트가 실행되기 전 한 프레임 동안 자식이 렌더링되는 것을 막기 위해 null 반환
  if (!isLoggedIn) return null;

  return <Outlet />;
};

export default RequireAuth;
