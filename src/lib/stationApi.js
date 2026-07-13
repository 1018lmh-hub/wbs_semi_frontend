import api from "../api/axios";
import { getChargeStatusLabel, getChargeModeLabel } from "./chargeStatus";
function parseStationResponse(responseBody) {
  if (!responseBody || typeof responseBody.data !== "string") {
    console.warn("예상치 못한 응답 형식입니다:", responseBody);
    return [];
  }
  let inner;
  try {
    inner = JSON.parse(responseBody.data);
  } catch (e) {
    console.error("충전소 응답 데이터 파싱 실패:", e);
    return [];
  }
  return Array.isArray(inner?.data) ? inner.data : [];
}
function groupRowsByStation(rows) {
  const stationMap = new Map();
  rows.forEach((row) => {
    const stationNo = row.csId;
    const lat = Number(row.lat);
    const lng = Number(row.longi);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    if (!stationMap.has(stationNo)) {
      stationMap.set(stationNo, {
        stationNo,
        stationName: row.csNm,
        address: row.addr,
        lat,
        lng,
        chargers: [],
      });
    }
    stationMap.get(stationNo).chargers.push({
      chargeName: row.cpNm,
      chargeType: row.chargeTp,
      chargeStatus: row.cpStat,
      chargeStatusLabel: getChargeStatusLabel(row.cpStat),
      chargeMode: row.cpTp,
      chargeModeLabel: getChargeModeLabel(row.cpTp),
    });
  });
  return Array.from(stationMap.values());
}
export async function fetchChargingStations(endpoint = "/charging-stations") {
  const { data: responseBody } = await api.get("http://localhost/api/stations");
  const rows = parseStationResponse(responseBody);
  return groupRowsByStation(rows);
}
export const fetchStationReviews = async (stationNo) => {
  try {
    const res = await api.get(`/stations/${stationNo}`, {
      params: { _t: Date.now() },
    });
    return res.data.data;
  } catch (err) {
    if (err.response?.data?.code === 400) {
      return { reviews: [], avgRating: 0, bookmark: null };
    }
    throw err;
  }
};
export const createStationReview = async (
  stationNo,
  { title, content, rating },
) => {
  const res = await api.post(`/stations/${stationNo}/reviews`, {
    reviewTitle: title,
    reviewContent: content,
    rating,
  });
  return res.data;
};
export const fetchStationReviewList = async (stationNo, page = 1) => {
  try {
    const res = await api.get(`/stations/${stationNo}/reviews`, {
      params: { page },
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
export const updateStationReview = async (
  stationNo,
  reviewNo,
  { title, content, rating },
) => {
  const res = await api.patch(`/stations/${stationNo}/reviews/${reviewNo}`, {
    reviewTitle: title,
    reviewContent: content,
    rating,
  });
  return res.data;
};
export const deleteStationReview = async (stationNo, reviewNo) => {
  const res = await api.delete(`/stations/${stationNo}/reviews/${reviewNo}`);
  return res.data;
};
export const addReviewLike = async (stationNo, reviewNo) => {
  const res = await api.post(
    `/stations/${stationNo}/reviews/${reviewNo}/likes`,
  );
  return res.data;
};
export const deleteReviewLike = async (stationNo, reviewNo) => {
  const res = await api.delete(
    `/stations/${stationNo}/reviews/${reviewNo}/likes`,
  );
  return res.data;
};
export const addBookmark = async (stationNo) => {
  const res = await api.post(`/stations/${stationNo}/bookmarks`);
  return res.data;
};
export const deleteBookmark = async (stationNo) => {
  const res = await api.delete(`/stations/${stationNo}/bookmarks`);
  return res.data;
};
export const fetchBookmarks = async () => {
  const res = await api.get("/stations/bookmarks");
  return res.data.data;
};
export const fetchStationReviewListLatest = async (stationNo, page = 1) => {
  try {
    const res = await api.get(`/stations/${stationNo}/reviews/latest`, {
      params: { page },
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
