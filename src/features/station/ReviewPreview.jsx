// src/features/station/ReviewPreview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { useReviewLike } from "../review/useReviewLike";

/**
 * StationDetail 하단에 표시되는 후기 미리보기 영역.
 * - (변경) 데이터 fetch는 더 이상 이 컴포넌트가 하지 않음.
 *   북마크 별과 같은 API(GET /stations/{stationNo})를 사용하기 때문에
 *   StationDetail이 한 번만 호출하고 reviews/avgRating/isLoading/error/setReviews를 내려줌.
 */
const ReviewPreview = ({
  stationNo,
  reviews,
  avgRating,
  isLoading,
  error,
  setReviews,
  maxPreviewCount = 3,
  onViewAllClick,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { pendingIds, requestDelete } = useReviewDeletion(setReviews);
  const { pendingLikeIds, toggleLike } = useReviewLike(setReviews);

  const handleDeleteClick = (review) => {
    requestDelete(stationNo, review.reviewNo);
  };

  const handleLikeClick = (review) => {
    toggleLike(stationNo, review);
  };

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
              onLikeClick={handleLikeClick}
              isLikePending={pendingLikeIds.has(review.reviewNo)}
            />
          ))}
        </ReviewList>
      )}

      <ViewAllButton onClick={handleViewAll}>전체보기</ViewAllButton>
    </PreviewContainer>
  );
};

export default ReviewPreview;
