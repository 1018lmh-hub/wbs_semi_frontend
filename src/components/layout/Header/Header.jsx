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
  ChartIconButton,
} from "./Header.style";
import logoDark from "../../../assets/plugin-logo-dark.png";
import { useAuth } from "../../../context/AuthContext";
const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleLogout = async () => {
    await logout();
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
        <ChartIconButton
          onClick={() => handleNavigation("/congestion")}
          aria-label="실시간 혼잡도 차트 보기"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </ChartIconButton>
        <AuthItem onClick={() => handleNavigation("/notices")}>게시판</AuthItem>
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
          </>
        )}
        <MenuButton onClick={toggleSidebar} aria-label="메뉴 열기">
          ☰
        </MenuButton>
      </AuthContainer>
    </HeaderContainer>
  );
};
export default Header;
