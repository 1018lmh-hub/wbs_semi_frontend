// src/components/layout/MainLayout/MainLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Map from "../../../features/map/Map";
import {
  LayoutContainer,
  OverlayContainer,
  OverlayContent,
} from "./MainLayout.style";

// 오버레이가 열려야 하는 경로 목록
// "/stations/", "/notices", "/inquirys", "/myPage"는 하위 경로(상세/작성/수정 등)가
// 계속 늘어날 예정이라 매번 배열에 추가하지 않도록 접두사(prefix)로 통째로 처리
const EXACT_OVERLAY_ROUTES = ["/login", "/signup"];
const OVERLAY_PREFIX_ROUTES = [
  "/stations/",
  "/myPage",
  "/notices",
  "/inquirys",
];

const matchesOverlayRoute = (pathname) =>
  EXACT_OVERLAY_ROUTES.includes(pathname) ||
  OVERLAY_PREFIX_ROUTES.some((prefix) => pathname.startsWith(prefix));

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map 내부에서 fetchChargingStations로 불러온 충전소 전체 목록을
  // StationDetail(단건 조회)에서도 써야 하므로 이 상태로 끌어올려 공유한다.
  // (전용 단건 조회 API가 아직 없어 목록에서 stationNo로 찾는 방식)
  const [locations, setLocations] = useState([]);

  // 헤더 ☰ 버튼 클릭 시 다시 열어줄 "마지막으로 열려 있던 오버레이 경로".
  // 종류(로그인/공지/문의/충전소/마이페이지 등) 상관없이 오버레이 경로면 전부 여기에 저장.
  // 한 번도 방문한 적 없으면 공지사항 목록(/notices)을 기본값으로 사용.
  const [lastOverlayPath, setLastOverlayPath] = useState("/notices");

  useEffect(() => {
    if (matchesOverlayRoute(location.pathname)) {
      setLastOverlayPath(location.pathname);
    }
  }, [location.pathname]);

  const isOverlayOpen = matchesOverlayRoute(location.pathname);

  // 헤더 ☰ 버튼: 닫혀있으면 마지막으로 열려 있던 경로를 그대로 재오픈,
  // 이미 열려있으면 닫는다.
  const toggleSidebar = () => {
    navigate(isOverlayOpen ? "/" : lastOverlayPath);
  };

  // Map 마커 클릭 시: 기존 인포윈도우 표시는 Map.jsx 내부에서 그대로 유지되고,
  // 여기서는 추가로 StationDetail 라우트로 이동시키는 역할만 담당
  const handleStationSelect = (station) => {
    navigate(`/stations/${station.stationNo}`);
  };

  // 오버레이 닫기 (StationDetail 등에서 사용) — 이전 경로 또는 "/"로 이동
  const handleCloseOverlay = () => {
    navigate("/");
  };

  return (
    <LayoutContainer>
      {/* 글로벌 제어 장치 */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Layer 0: 라우팅 경로 변경과 무관하게 항시 마운트 상태를 유지하는 배경 지도 */}
      <Map
        onStationSelect={handleStationSelect}
        onLocationsLoaded={setLocations}
      />

      {/* Layer 3: 가변적 컨텐츠 영역 (로그인/회원가입/게시판/충전소 상세가 주입됨) */}
      <OverlayContainer $isOpen={isOverlayOpen}>
        <OverlayContent>
          <Outlet context={{ onCloseOverlay: handleCloseOverlay, locations }} />
        </OverlayContent>
      </OverlayContainer>
    </LayoutContainer>
  );
};

export default MainLayout;
