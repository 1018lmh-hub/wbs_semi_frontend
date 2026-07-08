// src/lib/stationApi.js
import api from "../api/axios";
import { getChargeStatusLabel, getChargeModeLabel } from "./chargeStatus";

/**
 * 서버 원본 응답 형태:
 * {
 *   code: 200,
 *   message: "...",
 *   data: "{\"data\":[{...}, {...}, ...]}"   <-- data 필드 자체가 "JSON 문자열"
 * }
 *
 * 즉 response.data 를 한 번 더 JSON.parse 해야
 * 실제 충전기 row 배열(parsed.data)을 얻을 수 있음.
 */
function parseStationResponse(responseBody) {
  // responseBody = { code, message, data: "stringified json" }
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

/**
 * 충전기(cpId) row 배열을 충전소(csId) 단위로 그룹핑.
 * 같은 csId를 가진 row들은 좌표가 동일하므로 마커 1개로 합치고,
 * 그 안에 chargers 배열로 개별 충전기 정보를 담는다.
 *
 * @param {Array<object>} rows - API에서 받은 원본 row 배열
 * @returns {Array<object>} LOCATION 형태의 배열
 */
function groupRowsByStation(rows) {
  const stationMap = new Map(); // csId -> station 객체

  rows.forEach((row) => {
    const stationNo = row.csId;
    const lat = Number(row.lat);
    const lng = Number(row.longi);

    // 좌표가 유효하지 않은 row는 스킵 (지도에 찍을 수 없음)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    if (!stationMap.has(stationNo)) {
      stationMap.set(stationNo, {
        stationNo, // csId
        stationName: row.csNm, // 충전소 명칭
        address: row.addr, // 충전소 주소
        lat,
        lng,
        chargers: [],
      });
    }

    stationMap.get(stationNo).chargers.push({
      chargeName: row.cpNm, // 충전기 명칭 (예: 급속01)
      chargeType: row.chargeTp, // 충전기 타입 코드
      chargeStatus: row.cpStat, // 충전기 상태 코드 (원본)
      chargeStatusLabel: getChargeStatusLabel(row.cpStat), // 한글 라벨
      chargeMode: row.cpTp, // 충전 방식 코드
      chargeModeLabel: getChargeModeLabel(row.cpTp), // 충전 방식 한글 라벨
    });
  });

  return Array.from(stationMap.values());
}

/**
 * 충전소 목록 조회 (그룹핑된 LOCATION 배열 반환)
 * @param {string} endpoint - 충전소 조회 API 경로 (baseURL 기준 상대경로)
 */
export async function fetchChargingStations(endpoint = "/charging-stations") {
  const { data: responseBody } = await api.get("http://localhost/api/stations");
  const rows = parseStationResponse(responseBody);
  return groupRowsByStation(rows);
}

export const fetchStationReviews = async (stationNo) => {
  try {
    const res = await api.get(`/stations/${stationNo}`, {
      params: { _t: Date.now() }, // 캐시 우회용 - 매 요청마다 다른 쿼리스트링으로 만들어 브라우저가 새로 요청하게 함
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
    return res.data.data; // { reviews, avgRating, bookmark, pageInfo }
  } catch (err) {
    // 존재하지 않는 페이지 요청 등은 컴포넌트에서 처리하도록 그대로 던짐
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

// GET /stations/bookmarks — 본인 즐겨찾기 목록 조회 (stationNo만 내려옴)
export const fetchBookmarks = async () => {
  const res = await api.get("/stations/bookmarks");
  return res.data.data; // [{ bookmarkNo, userId, stationNo, createDate }, ...]
};

export const fetchStationReviewListLatest = async (stationNo, page = 1) => {
  try {
    const res = await api.get(`/stations/${stationNo}/reviews/latest`, {
      params: { page },
    });
    return res.data.data; // { reviews, avgRating, bookmark, pageInfo }
  } catch (err) {
    throw err;
  }
};
