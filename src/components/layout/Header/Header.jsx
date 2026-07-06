// src/components/layout/Header/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HeaderContainer,
  LeftSection,
  MenuButton,
  LogoWrapper,
  LogoImage,
  AuthContainer,
  AuthItem,
} from "./Header.style";
import logoDark from "../../../assets/plugin-logo-dark.png";
import { useAuth } from "../../../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  // 임시값(isLoggedIn = false) 대신 AuthContext의 실제 로그인 상태 사용
  const { isLoggedIn, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // AuthContext.logout()이 localStorage 정리 + 전역 로그인 상태 갱신을 함께 처리
    logout();
    navigate("/");
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <LogoWrapper onClick={() => handleNavigation("/")}>
          <LogoImage src={logoDark} alt="Plug-in Logo" />
        </LogoWrapper>
      </LeftSection>

      <AuthContainer>
        {isLoggedIn ? (
          <>
            <AuthItem onClick={() => handleNavigation("/myPage")}>
              마이페이지
            </AuthItem>
            <AuthItem onClick={() => handleNavigation("/bookmarks")}>
              즐겨찾기
            </AuthItem>
            <AuthItem onClick={handleLogout}>로그아웃</AuthItem>
          </>
        ) : (
          <>
            <AuthItem onClick={() => handleNavigation("/login")}>
              로그인
            </AuthItem>
            <AuthItem onClick={() => handleNavigation("/signup")}>
              회원가입
            </AuthItem>
            <MenuButton onClick={toggleSidebar} aria-label="메뉴 열기">
              ☰
            </MenuButton>
          </>
        )}
      </AuthContainer>
    </HeaderContainer>
  );
};

export default Header;
