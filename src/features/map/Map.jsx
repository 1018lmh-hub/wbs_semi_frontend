// src/features/map/Map.jsx
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, MapPlaceholder } from "./Map.style";
import markerIcon from "../../assets/marker.png";
import clusterIcon2 from "../../assets/cluster2.png";
import clusterIcon3 from "../../assets/cluster3.png";
import clusterIcon4 from "../../assets/cluster4.png";
import clusterIcon5 from "../../assets/cluster5.png";
import { makeMarkerClustering } from "../../lib/MarkerClustering";
import { fetchChargingStations } from "../../lib/stationApi";

const SCRIPT_ID = "naver-map-script";
const CALLBACK_NAME = "initNaverMap";
const DEFAULT_CENTER = { lat: 37.5666102, lng: 126.9783881 };

// ─────────────────────────────────────────────
// 네이버 지도 스크립트 로더
// ─────────────────────────────────────────────
let scriptPromise = null;

function loadNaverMapScript(clientId) {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    if (window.naver?.maps?.Map) {
      resolve();
      return;
    }

    window[CALLBACK_NAME] = () => {
      resolve();
      delete window[CALLBACK_NAME];
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (!existing) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=gl&callback=${CALLBACK_NAME}`;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

// ─────────────────────────────────────────────
// 마커 생성 헬퍼 (충전소 = LOCATION 1개당 마커 1개)
// ─────────────────────────────────────────────
function createMarkers(
  stations,
  mapInstance,
  sharedInfoWindow,
  onStationSelect,
) {
  return stations.map((station) => {
    const position = new window.naver.maps.LatLng(station.lat, station.lng);

    const marker = new window.naver.maps.Marker({
      position,
      map: mapInstance,
      title: station.stationName,
      clickable: true,
      icon: {
        url: markerIcon,
        size: new window.naver.maps.Size(88, 88),
        scaledSize: new window.naver.maps.Size(88, 88),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(24, 24),
      },
    });

    window.naver.maps.Event.addListener(marker, "click", () => {
      // 충전소명 정도만 가볍게 인포윈도우로 보여주고,
      // 상세 정보(충전기 목록 등)는 사이드바에서 처리하도록 콜백으로 위임
      sharedInfoWindow.setContent(
        `<div style="padding:12px 16px;font-size:14px;font-weight:600;">${station.stationName}</div>`,
      );
      sharedInfoWindow.open(mapInstance, marker);

      onStationSelect?.(station);
    });

    return marker;
  });
}

// ─────────────────────────────────────────────
// 클러스터 아이콘 (이미지 기반)
// count === 2 -> clusterIcon2 / 3 -> clusterIcon3 / 4 -> clusterIcon4 / 5 이상 -> clusterIcon5("5+")
// ─────────────────────────────────────────────
function makeImageClusterIcon(url, size) {
  return {
    url,
    size: new window.naver.maps.Size(size, size),
    scaledSize: new window.naver.maps.Size(size, size),
    origin: new window.naver.maps.Point(0, 0),
    anchor: new window.naver.maps.Point(size / 2, size / 2),
  };
}

// ─────────────────────────────────────────────
// MarkerClustering 초기화 헬퍼
// ─────────────────────────────────────────────
function initCluster(mapInstance, markers) {
  const MarkerClustering = makeMarkerClustering(window.naver);

  const ICON_SIZE = 88;
  const clusterIcons = [
    makeImageClusterIcon(clusterIcon2, ICON_SIZE), // count === 2
    makeImageClusterIcon(clusterIcon3, ICON_SIZE), // count === 3
    makeImageClusterIcon(clusterIcon4, ICON_SIZE), // count === 4
    makeImageClusterIcon(clusterIcon5, ICON_SIZE), // count >= 5 ("5+"로 통일)
  ];

  return new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 14,
    map: mapInstance,
    markers,
    disableClickZoom: false,
    gridSize: 120,
    icons: clusterIcons,
    // count < 3 -> index0(2.png), <4 -> index1(3.png), <5 -> index2(4.png), 그 외 -> index3(5+.png)
    indexGenerator: [3, 4, 5],
  });
}

// ─────────────────────────────────────────────
// Map 컴포넌트
// ─────────────────────────────────────────────
// onStationSelect: 마커(충전소) 클릭 시 호출되는 콜백. 추후 사이드바 오픈 등에 사용.
const Map = ({ onStationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clusterRef = useRef(null);
  const infoWindowRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [locations, setLocations] = useState([]); // 충전소 단위로 그룹핑된 배열
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [stationsError, setStationsError] = useState(null);

  // ── (A) 지도 초기화 Effect (최초 1회)
  useEffect(() => {
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    const styleId = import.meta.env.VITE_NAVER_MAP_STYLE_ID;
    if (!clientId || !styleId) return;

    let cancelled = false;

    loadNaverMapScript(clientId).then(() => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
        gl: true,
        center: new window.naver.maps.LatLng(
          DEFAULT_CENTER.lat,
          DEFAULT_CENTER.lng,
        ),
        zoom: 14,
        customStyleId: styleId,
      });

      infoWindowRef.current = new window.naver.maps.InfoWindow();

      setIsMapLoaded(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            if (cancelled || !mapInstanceRef.current) return;
            const userLatLng = new window.naver.maps.LatLng(
              coords.latitude,
              coords.longitude,
            );
            mapInstanceRef.current.setCenter(userLatLng);
            new window.naver.maps.Marker({
              position: userLatLng,
              map: mapInstanceRef.current,
              title: "현재 위치",
            });
          },
          (error) =>
            console.warn("위치 정보를 가져올 수 없습니다:", error.message),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        );
      }
    });

    return () => {
      cancelled = true;
      cleanupCluster();
      cleanupMarkers();

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        scriptPromise = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── (B) 충전소 데이터 조회 Effect (최초 1회)
  // TODO: endpoint("/charging-stations")는 실제 백엔드 라우트로 교체해 주세요.
  useEffect(() => {
    let cancelled = false;

    setIsLoadingStations(true);
    setStationsError(null);

    fetchChargingStations("/charging-stations")
      .then((stations) => {
        if (cancelled) return;
        setLocations(stations);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("충전소 데이터를 불러오지 못했습니다:", err);
        setStationsError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingStations(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── (C) 마커 & 클러스터 렌더링 Effect (locations 변경 시 재실행)
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;
    if (locations.length === 0) return;

    cleanupCluster();
    cleanupMarkers();

    markersRef.current = createMarkers(
      locations,
      mapInstanceRef.current,
      infoWindowRef.current,
      onStationSelect,
    );

    clusterRef.current = initCluster(
      mapInstanceRef.current,
      markersRef.current,
    );

    return () => {
      cleanupCluster();
      cleanupMarkers();
    };
  }, [isMapLoaded, locations, onStationSelect]);

  function cleanupMarkers() {
    markersRef.current.forEach((marker) => {
      window.naver.maps.Event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    markersRef.current = [];
  }

  function cleanupCluster() {
    if (clusterRef.current) {
      clusterRef.current.setMap(null);
      clusterRef.current = null;
    }
  }

  return (
    <>
      <MapContainer ref={mapRef} id="map-container" />
      {!isMapLoaded && (
        <MapPlaceholder>
          <h2>LOADING PLUG-IN MAP...</h2>
        </MapPlaceholder>
      )}
      {isMapLoaded && isLoadingStations && (
        <MapPlaceholder>
          <h2>충전소 정보를 불러오는 중...</h2>
        </MapPlaceholder>
      )}
      {stationsError && (
        <MapPlaceholder>
          <h2>충전소 정보를 불러오지 못했습니다.</h2>
        </MapPlaceholder>
      )}
    </>
  );
};

export default Map;
