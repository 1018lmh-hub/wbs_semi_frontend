// src/lib/raspApi.js
import api from "../api/axios";

// 이제 응답이 { asOf, devices } 형태이므로 그대로 반환.
// asOf: 이 데이터가 계산된 기준 시각 (서버 시각, 문자열)
// devices: 세션 로그 배열
export const fetchCurrentCongestion = async () => {
  const res = await api.get("/rasp/current");
  return res.data.data; // { asOf, devices }
};

/**
 * 최근 14분 관찰 구간과 겹치는 세션 전체 조회
 * GET /rasp/serial
 * 프론트에서 10초 단위로 직접 집계하여 라인차트에 사용.
 * asOf를 기준 시각으로 써야 함 (브라우저 시계를 쓰면 안 됨).
 */
export const fetchSerialCongestion = async () => {
  const res = await api.get("/rasp/serial");
  return res.data.data; // { asOf, devices }
};
