import React, { useEffect } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

const RequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const outletContext = useOutletContext();

  useEffect(() => {
    if (!isLoggedIn) {
      showToast("로그인이 필요합니다.", "error");
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate, showToast]);

  if (!isLoggedIn) return null;

  return <Outlet context={outletContext} />;
};

export default RequireAuth;
