// src/features/station/ReviewPreview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStationReviews } from "../../lib/stationApi";
import { useAuth } from "../../context/AuthContext";
import ReviewItem from "../review/ReviewItem";
import {
  PreviewContainer,
  PreviewHeader,
  TitleRow,
  SectionTitle,
  AvgRatingBadge,
  WriteReviewButton,
  ViewAllButton,
  ReviewList,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
} from "./ReviewPreview.style";
import { useReviewDeletion } from "../review/useReviewDeletion";

/**
 * StationDetail 하단에 표시되는 후기 미리보기 영역.
 * - GET /api/stations/{stationNo} 응답의 reviews / avgRating을 사용
 * - reviews 중 앞쪽 maxPreviewCount개만 노출, 나머지는 "전체보기"로 이동
 *
 * 리스트 아이템 렌더링은 features/review/ReviewItem 공통 컴포넌트를 사용
 * (ReviewList.jsx - 후기 전체보기 - 와 레이아웃 공유)
 *
 * 헤더 우측: 로그인 사용자 대상 "후기 작성하기" (ReviewList와 동일 위치/스타일로 통일)
 * 리스트 하단: "전체보기" (기존 헤더 위치에서 이동)
 *
 * 스코프 밖(다음 작업 예정):
 * - bookmark(즐겨찾기) 토글 — 응답에는 포함되어 오지만 이번 컴포넌트에서는 사용하지 않음
 */
const ReviewPreview = ({ stationNo, maxPreviewCount = 3, onViewAllClick }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { pendingIds, requestDelete } = useReviewDeletion(setReviews);

  const handleDeleteClick = (review) => {
    requestDelete(stationNo, review.reviewNo);
  };

  useEffect(() => {
    if (!stationNo) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchStationReviews(stationNo)
      .then((data) => {
        if (cancelled) return;
        setReviews(data?.reviews ?? []);
        setAvgRating(data?.avgRating ?? 0);
        // TODO: 즐겨찾기 영역 구현 시 data.bookmark 사용
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
  }, [stationNo]);

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
      return;
    }
    navigate(`/stations/${stationNo}/reviews`);
  };

  const handleWriteReview = () => {
    navigate(`/stations/${stationNo}/reviews/form`);
  };

  if (isLoading) {
    return (
      <PreviewContainer>
        <LoadingMessage>후기를 불러오는 중...</LoadingMessage>
      </PreviewContainer>
    );
  }

  if (error) {
    return (
      <PreviewContainer>
        <ErrorMessage>후기 정보를 불러오지 못했습니다.</ErrorMessage>
      </PreviewContainer>
    );
  }

  const previewReviews = reviews
    .filter((review) => !pendingIds.has(review.reviewNo))
    .slice(0, maxPreviewCount);

  return (
    <PreviewContainer>
      <PreviewHeader>
        <TitleRow>
          <SectionTitle>후기</SectionTitle>
          {reviews.length > 0 && (
            <AvgRatingBadge>★ {avgRating.toFixed(1)}</AvgRatingBadge>
          )}
        </TitleRow>
        {isLoggedIn && (
          <WriteReviewButton type="button" onClick={handleWriteReview}>
            후기 작성하기
          </WriteReviewButton>
        )}
      </PreviewHeader>

      {previewReviews.length === 0 ? (
        <EmptyMessage>아직 등록된 후기가 없습니다.</EmptyMessage>
      ) : (
        <ReviewList>
          {previewReviews.map((review) => (
            <ReviewItem
              key={review.reviewNo}
              review={review}
              variant="preview"
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </ReviewList>
      )}

      <ViewAllButton onClick={handleViewAll}>전체보기</ViewAllButton>

      {/* TODO: 즐겨찾기 토글 영역 - 즐겨찾기 API 연동 후 구현 (data.bookmark 활용) */}
    </PreviewContainer>
  );
};

export default ReviewPreview;
