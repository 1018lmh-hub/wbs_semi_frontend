// src/features/station/StationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { fetchStationReviews } from "../../lib/stationApi";
import { useAuth } from "../../context/AuthContext";
import { useBookmark } from "./useBookmark";
import {
  DetailContainer,
  TitleRow,
  CloseButton,
  StationNameRow,
  StationName,
  BookmarkButton,
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
  const { isLoggedIn } = useAuth();

  // MainLayout에서 Map.jsx의 onLocationsLoaded를 통해 끌어올린 전체 충전소 목록과
  // 오버레이 닫기 핸들러를 Outlet context로 전달받아 사용
  const { locations = [], onCloseOverlay } = useOutletContext();

  const station = locations.find(
    (loc) => String(loc.stationNo) === String(stationId),
  );

  // 후기/평점/북마크 상태를 여기서 소유 (기존 ReviewPreview 내부에 있던 fetch를 끌어올림)
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isPending: isBookmarkPending, toggleBookmark } = useBookmark(
    stationId,
    bookmarked,
    setBookmarked,
  );

  useEffect(() => {
    if (!stationId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchStationReviews(stationId)
      .then((data) => {
        if (cancelled) return;
        setReviews(data?.reviews ?? []);
        setAvgRating(data?.avgRating ?? 0);
        setBookmarked(!!data?.bookmark); // 가정: boolean. 실제 형태 다르면 이 줄만 수정
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("후기 정보를 불러오지 못했습니다:", err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stationId]);

  const handleBookmarkClick = () => {
    if (!isLoggedIn) return;
    toggleBookmark();
  };

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
        <StationNameRow>
          <StationName>{stationName}</StationName>
          <BookmarkButton
            type="button"
            onClick={handleBookmarkClick}
            disabled={!isLoggedIn || isBookmarkPending}
            $bookmarked={bookmarked}
            aria-label={bookmarked ? "즐겨찾기 취소" : "즐겨찾기 추가"}
          >
            {bookmarked ? "★" : "☆"}
          </BookmarkButton>
        </StationNameRow>
        <CloseButton onClick={onCloseOverlay} aria-label="닫기">
          ✕
        </CloseButton>
      </TitleRow>

      <StationAddress>{address}</StationAddress>

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

      {/* 후기 미리보기 + 전체보기 + 후기 작성하기(헤더 우측, 로그인 시)
          - reviews/avgRating/isLoading/error/setReviews를 여기서 내려줌 (fetch는 이 컴포넌트가 담당) */}
      <ReviewPreview
        stationNo={stationId}
        reviews={reviews}
        avgRating={avgRating}
        isLoading={isLoading}
        error={error}
        setReviews={setReviews}
      />
    </DetailContainer>
  );
};

export default StationDetail;
