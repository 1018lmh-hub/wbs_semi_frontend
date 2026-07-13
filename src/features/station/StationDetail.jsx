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
  const { locations = [], onCloseOverlay } = useOutletContext();
  const station = locations.find(
    (loc) => String(loc.stationNo) === String(stationId),
  );
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
        setBookmarked(!!data?.bookmark?.bookmarkNo);
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
