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

function createMarkers(
  stations,
  mapInstance,
  sharedInfoWindow,
  onStationSelectRef,
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
        anchor: new window.naver.maps.Point(44, 10),
      },
    });
    window.naver.maps.Event.addListener(marker, "click", () => {
      sharedInfoWindow.setContent(
        `<div style="padding:12px 16px;font-size:14px;font-weight:600;">${station.stationName}</div>`,
      );
      sharedInfoWindow.open(mapInstance, marker);
      onStationSelectRef.current?.(station);
    });
    return marker;
  });
}

function makeImageClusterIcon(url, size) {
  return {
    url,
    size: new window.naver.maps.Size(size, size),
    scaledSize: new window.naver.maps.Size(size, size),
    origin: new window.naver.maps.Point(0, 0),
    anchor: new window.naver.maps.Point(size / 2, size / 2),
  };
}

function initCluster(mapInstance, markers) {
  const MarkerClustering = makeMarkerClustering(window.naver);
  const ICON_SIZE = 88;
  const clusterIcons = [
    makeImageClusterIcon(clusterIcon2, ICON_SIZE),
    makeImageClusterIcon(clusterIcon3, ICON_SIZE),
    makeImageClusterIcon(clusterIcon4, ICON_SIZE),
    makeImageClusterIcon(clusterIcon5, ICON_SIZE),
  ];
  return new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 14,
    map: mapInstance,
    markers,
    disableClickZoom: false,
    gridSize: 120,
    icons: clusterIcons,
    indexGenerator: [3, 4, 5],
  });
}

const Map = ({ onStationSelect, onLocationsLoaded }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const clusterRef = useRef(null);
  const infoWindowRef = useRef(null);
  const onStationSelectRef = useRef(onStationSelect);

  useEffect(() => {
    onStationSelectRef.current = onStationSelect;
  }, [onStationSelect]);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [stationsError, setStationsError] = useState(null);

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
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingStations(true);
    setStationsError(null);
    fetchChargingStations()
      .then((stations) => {
        if (cancelled) return;
        setLocations(stations);
        onLocationsLoaded?.(stations);
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

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;
    if (locations.length === 0) return;
    cleanupCluster();
    cleanupMarkers();
    markersRef.current = createMarkers(
      locations,
      mapInstanceRef.current,
      infoWindowRef.current,
      onStationSelectRef,
    );
    clusterRef.current = initCluster(
      mapInstanceRef.current,
      markersRef.current,
    );
    return () => {
      cleanupCluster();
      cleanupMarkers();
    };
  }, [isMapLoaded, locations]);

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
