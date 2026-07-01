// src/components/layout/MainLayout/MainLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Map from "../../../features/map/Map";
import {
  LayoutContainer,
  SidebarContainer,
  OverlayContent,
} from "./MainLayout.style";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 초기 상태 개방 (UX 고려)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <LayoutContainer>
      {/* 글로벌 제어 장치 */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Layer 0: 라우팅 경로 변경과 무관하게 항시 마운트 상태를 유지하는 배경 지도 */}
      <Map />

      {/* Layer 3: 가변적 컨텐츠 영역 (공지사항, 문의사항, 후기 등이 주입됨) */}
      <SidebarContainer $isOpen={isSidebarOpen}>
        <OverlayContent>
          <Outlet />
        </OverlayContent>
      </SidebarContainer>
    </LayoutContainer>
  );
};

export default MainLayout;
