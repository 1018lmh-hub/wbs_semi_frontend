// src/features/review/ReviewList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchStationReviewList,
  fetchStationReviewListLatest,
} from "../../lib/stationApi";
import { useAuth } from "../../context/AuthContext";
import ReviewItem from "./ReviewItem";
import {
  ListContainer,
  HeaderRow,
  BackButton,
  TitleRow,
  TitleGroup,
  PageTitle,
  AvgRatingBadge,
  SortToggleGroup,
  SortToggleButton,
  ReviewList as ReviewListWrap,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
  WriteReviewButton,
  PaginationWrap,
  PageArrowButton,
  PageNumberButton,
} from "./ReviewList.style";
import { useReviewDeletion } from "./useReviewDeletion";
import { useReviewLike } from "./useReviewLike";

/**
 * 후기 전체보기 화면 (/stations/:stationId/reviews)
 * - StationDetail의 "전체보기" 버튼에서 진입
 * - 백엔드에서 5개씩(page당) 내려주는 후기를 pageInfo 기반으로 페이지네이션
 * - 정렬: 좋아요순(GET /reviews, 기본) / 최신순(GET /reviews/latest) 중 선택
 *   -> 정렬 기준 자체가 다른 엔드포인트라 sort 변경 시 새로 fetch + page 1로 리셋
 */
const ReviewList = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [sort, setSort] = useState("like"); // "like" | "latest"
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [pageInfo, setPageInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { pendingIds, requestDelete } = useReviewDeletion(setReviews);
  const { pendingLikeIds, toggleLike } = useReviewLike(setReviews);
  const handleLikeClick = (review) =>
    toggleLike(stationId /* 또는 stationNo */, review);

  const handleDeleteClick = (review) => {
    requestDelete(stationId, review.reviewNo);
  };

  useEffect(() => {
    if (!stationId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetcher =
      sort === "latest" ? fetchStationReviewListLatest : fetchStationReviewList;

    fetcher(stationId, page)
      .then((data) => {
        if (cancelled) return;
        setReviews(data?.reviews ?? []);
        setAvgRating(data?.avgRating ?? 0);
        setPageInfo(data?.pageInfo ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("후기 목록을 불러오지 못했습니다:", err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stationId, page, sort]);

  // 라우트 히스토리 없이 직접 진입한 경우를 대비해 StationDetail 경로로 폴백
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/stations/${stationId}`);
    }
  };

  const handleWriteReview = () => {
    navigate(`/stations/${stationId}/reviews/form`);
  };

  const handleSortChange = (nextSort) => {
    if (nextSort === sort) return;
    setSort(nextSort);
    setPage(1); // 정렬이 바뀌면 페이지도 처음부터
  };

  const handlePageChange = (nextPage) => {
    if (!pageInfo) return;
    if (nextPage < 1 || nextPage > pageInfo.maxPage) return;
    setPage(nextPage);
  };

  const renderPagination = () => {
    if (!pageInfo || pageInfo.maxPage <= 1) return null;

    const { currentPage, maxPage, startPage, endPage } = pageInfo;
    const pageNumbers = [];
    for (let p = startPage; p <= endPage; p += 1) {
      pageNumbers.push(p);
    }

    return (
      <PaginationWrap>
        <PageArrowButton
          type="button"
          disabled={startPage <= 1}
          onClick={() => handlePageChange(startPage - 1)}
          aria-label="이전 페이지 블록"
        >
          {"<"}
        </PageArrowButton>

        {pageNumbers.map((p) => (
          <PageNumberButton
            key={p}
            type="button"
            $isActive={p === currentPage}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </PageNumberButton>
        ))}

        <PageArrowButton
          type="button"
          disabled={endPage >= maxPage}
          onClick={() => handlePageChange(endPage + 1)}
          aria-label="다음 페이지 블록"
        >
          {">"}
        </PageArrowButton>
      </PaginationWrap>
    );
  };

  return (
    <ListContainer>
      <HeaderRow>
        <BackButton onClick={handleBack} aria-label="뒤로가기">
          ← 뒤로
        </BackButton>
        <TitleRow>
          <TitleGroup>
            <PageTitle>후기 전체보기</PageTitle>
            {reviews.length > 0 && (
              <AvgRatingBadge>★ {avgRating.toFixed(1)}</AvgRatingBadge>
            )}
          </TitleGroup>

          {/* 로그인 사용자 대상 후기 작성 버튼 - 어느 페이지에서든 바로 접근 가능하도록 상단 고정 */}
          {isLoggedIn && (
            <WriteReviewButton type="button" onClick={handleWriteReview}>
              후기 작성하기
            </WriteReviewButton>
          )}
        </TitleRow>

        {/* 정렬 토글: 좋아요순(기본) / 최신순 - 서로 다른 엔드포인트라 클릭 시 재조회됨 */}
        <SortToggleGroup>
          <SortToggleButton
            type="button"
            $isActive={sort === "like"}
            onClick={() => handleSortChange("like")}
          >
            좋아요순
          </SortToggleButton>
          <SortToggleButton
            type="button"
            $isActive={sort === "latest"}
            onClick={() => handleSortChange("latest")}
          >
            최신순
          </SortToggleButton>
        </SortToggleGroup>
      </HeaderRow>

      {isLoading && <LoadingMessage>후기를 불러오는 중...</LoadingMessage>}

      {!isLoading && error && (
        <ErrorMessage>후기 정보를 불러오지 못했습니다.</ErrorMessage>
      )}

      {!isLoading && !error && reviews.length === 0 && (
        <EmptyMessage>아직 등록된 후기가 없습니다.</EmptyMessage>
      )}

      {!isLoading && !error && reviews.length > 0 && (
        <ReviewListWrap>
          {reviews
            .filter((review) => !pendingIds.has(review.reviewNo))
            .map((review) => (
              <ReviewItem
                key={review.reviewNo}
                review={review}
                variant="list" // 또는 "preview"
                onDeleteClick={handleDeleteClick}
                onLikeClick={handleLikeClick}
                isLikePending={pendingLikeIds.has(review.reviewNo)}
              />
            ))}
        </ReviewListWrap>
      )}

      {renderPagination()}
    </ListContainer>
  );
};

export default ReviewList;
