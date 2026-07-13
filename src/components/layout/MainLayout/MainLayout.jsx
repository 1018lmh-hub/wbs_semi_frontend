import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Map from "../../../features/map/Map";
import {
  LayoutContainer,
  OverlayContainer,
  OverlayContent,
} from "./MainLayout.style";

const EXACT_OVERLAY_ROUTES = ["/login", "/signup"];
const OVERLAY_PREFIX_ROUTES = [
  "/stations/",
  "/myPage",
  "/notices",
  "/inquirys",
  "/bookmarks",
  "/congestion",
];

const matchesOverlayRoute = (pathname) =>
  EXACT_OVERLAY_ROUTES.includes(pathname) ||
  OVERLAY_PREFIX_ROUTES.some((prefix) => pathname.startsWith(prefix));

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);

  const [lastOverlayPath, setLastOverlayPath] = useState("/notices");

  useEffect(() => {
    if (matchesOverlayRoute(location.pathname)) {
      setLastOverlayPath(location.pathname);
    }
  }, [location.pathname]);

  const isOverlayOpen = matchesOverlayRoute(location.pathname);

  const toggleSidebar = () => {
    navigate(isOverlayOpen ? "/" : lastOverlayPath);
  };

  const handleStationSelect = useCallback(
    (station) => {
      navigate(`/stations/${station.stationNo}`);
    },
    [navigate],
  );

  const handleCloseOverlay = () => {
    navigate("/");
  };

  return (
    <LayoutContainer>
      <Header toggleSidebar={toggleSidebar} />

      <Map
        onStationSelect={handleStationSelect}
        onLocationsLoaded={setLocations}
      />

      <OverlayContainer $isOpen={isOverlayOpen}>
        <OverlayContent>
          <Outlet context={{ onCloseOverlay: handleCloseOverlay, locations }} />
        </OverlayContent>
      </OverlayContainer>
    </LayoutContainer>
  );
};

export default MainLayout;
