// src/lib/chargeStatus.js

// 환경부 공공데이터포털(전기차 충전소 정보) cpStat 코드 기준
export const CHARGE_STATUS_LABEL = {
  1: "충전가능",
  2: "충전중",
  3: "고장/점검",
  4: "통신장애",
  5: "통신미연결",
  6: "충전종료",
  7: "계획정지",
};

/**
 * cpStat 코드를 한글 라벨로 변환
 * @param {string|number} code
 * @returns {string}
 */
export function getChargeStatusLabel(code) {
  return CHARGE_STATUS_LABEL[Number(code)] ?? "알 수 없음";
}

// cpTp(충전 방식) 코드 매핑
export const CHARGE_MODE_LABEL = {
  1: "B타입(5핀)",
  2: "C타입(5핀)",
  3: "BC타입(5핀)",
  4: "BC타입(7핀)",
  5: "C차 데모",
  6: "AC3상",
  7: "DC콤보",
  8: "DC차데모+DC콤보",
};

/**
 * cpTp 코드를 한글 라벨로 변환
 * @param {string|number} code
 * @returns {string}
 */
export function getChargeModeLabel(code) {
  return CHARGE_MODE_LABEL[Number(code)] ?? "알 수 없음";
}
