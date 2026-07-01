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

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  // 인증 상태 관리가 구현되기 전 임시 상태
  const isLoggedIn = false;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // JWT 토큰 삭제 로직 추가 예정
    navigate("/");
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar} aria-label="메뉴 열기">
          ☰
        </MenuButton>
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
          </>
        )}
      </AuthContainer>
    </HeaderContainer>
  );
};

export default Header;
