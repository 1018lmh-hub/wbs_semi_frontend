// src/features/station/StationDetail.jsx
import React from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  DetailContainer,
  TitleRow,
  CloseButton,
  StationName,
  StationAddress,
  ChargerListSection,
  SectionTitle,
  ChargerList,
  ChargerItem,
  ChargerName,
  ChargerModeLabel,
  ChargerStatusLabel,
} from "./StationDetail.style";
import ReviewPreview from "./ReviewPreview";

const StationDetail = () => {
  const { stationId } = useParams();

  // MainLayout에서 Map.jsx의 onLocationsLoaded를 통해 끌어올린 전체 충전소 목록과
  // 오버레이 닫기 핸들러를 Outlet context로 전달받아 사용
  // (전용 단건 조회 API가 아직 없어 목록에서 stationNo로 찾는 방식으로 구현)
  const { locations = [], onCloseOverlay } = useOutletContext();

  const station = locations.find(
    (loc) => String(loc.stationNo) === String(stationId),
  );

  if (!station) {
    return (
      <DetailContainer>
        <TitleRow>
          <CloseButton onClick={onCloseOverlay} aria-label="닫기">
            ✕
          </CloseButton>
        </TitleRow>
        <p>충전소 정보를 불러오는 중이거나 존재하지 않습니다.</p>
      </DetailContainer>
    );
  }

  const { stationName, address, chargers = [] } = station;

  return (
    <DetailContainer>
      <TitleRow>
        <StationName>{stationName}</StationName>
        <CloseButton onClick={onCloseOverlay} aria-label="닫기">
          ✕
        </CloseButton>
      </TitleRow>

      <StationAddress>{address}</StationAddress>

      {/* TODO: 평균 별점 영역 - 리뷰 API 연동 후 구현 */}

      {/* TODO: 즐겨찾기 토글 영역 - 즐겨찾기 API 연동 후 구현 */}

      <ChargerListSection>
        <SectionTitle>충전기 목록</SectionTitle>
        <ChargerList>
          {chargers.map((charger) => (
            <ChargerItem key={charger.chargeName}>
              <ChargerName>{charger.chargeName}</ChargerName>
              <ChargerModeLabel>{charger.chargeModeLabel}</ChargerModeLabel>
              <ChargerStatusLabel>
                {charger.chargeStatusLabel}
              </ChargerStatusLabel>
            </ChargerItem>
          ))}
        </ChargerList>
      </ChargerListSection>

      {/* 후기 미리보기 + 전체보기 + 후기 작성하기(헤더 우측, 로그인 시) */}
      <ReviewPreview stationNo={stationId} />
    </DetailContainer>
  );
};

export default StationDetail;
