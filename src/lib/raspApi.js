// src/lib/raspApi.js
import api from "../api/axios";

export const fetchCurrentCongestion = async () => {
  const res = await api.get("/rasp/current");
  return res.data.data;
};

/**
 * 최근 7일간 생성된 전체 로그 조회 (실시간 스냅샷 아님 - 기간 내 전체 이력)
 * GET /rasp/serial
 * 프론트에서 시간대별(BUCKET_INTERVAL_MINUTES 단위)로 직접 집계하여 라인차트에 사용
 */
export const fetchSerialCongestion = async () => {
  const res = await api.get("/rasp/serial");
  return res.data.data;
};
