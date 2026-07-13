// src/features/chart/CongestionPanel.jsx
import React, { useEffect, useState, useCallback } from "react";
import CurrentCongestionRate from "./CurrentCongestionRate";
import SerialCongestionRate from "./SerialCongestionRate";
import {
  fetchCurrentCongestion,
  fetchSerialCongestion,
} from "../../lib/raspApi";
import { PanelWrapper, Divider } from "./CongestionPanel.style";

const POLL_INTERVAL = 10000;

const CongestionPanel = () => {
  const [currentLogs, setCurrentLogs] = useState([]);
  const [serialLogs, setSerialLogs] = useState([]);
  const [serialAsOf, setSerialAsOf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [current, serial] = await Promise.all([
        fetchCurrentCongestion(),
        fetchSerialCongestion(),
      ]);
      setCurrentLogs(current.devices);
      setSerialLogs(serial.devices);
      setSerialAsOf(serial.asOf); // 서버가 계산한 기준 시각. 이걸 그래프의 "지금"으로 사용
      setError(null);
    } catch (e) {
      console.error("[CongestionPanel] fetch error:", e);
      setError("혼잡도 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const timer = setInterval(loadAll, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [loadAll]);

  return (
    <PanelWrapper>
      <CurrentCongestionRate
        logs={currentLogs}
        isLoading={isLoading}
        error={error}
      />
      <Divider />
      <SerialCongestionRate
        logs={serialLogs}
        asOf={serialAsOf}
        isLoading={isLoading}
        error={error}
      />
    </PanelWrapper>
  );
};

export default CongestionPanel;
