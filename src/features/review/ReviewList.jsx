// src/features/review/ReviewList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStationReviewList } from "../../lib/stationApi";
import { useAuth } from "../../context/AuthContext";
import ReviewItem from "./ReviewItem";
import {
  ListContainer,
  HeaderRow,
  BackButton,
  TitleRow,
  PageTitle,
  AvgRatingBadge,
  ReviewList as ReviewListWrap,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
  WriteReviewButton,
  PaginationWrap,
  PageArrowButton,
  PageNumberButton,
} from "./ReviewList.style";

/**
 * 후기 전체보기 화면 (/stations/:stationId/reviews)
 * - StationDetail의 "전체보기" 버튼에서 진입
 * - 백엔드에서 5개씩(page당) 내려주는 후기를 pageInfo 기반으로 페이지네이션
 *
 * 스코프 밖(다음 작업 예정):
 * - bookmark(즐겨찾기) 토글
 * - 좋아요(liked) 클릭 인터랙션
 */
const ReviewList = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [pageInfo, setPageInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stationId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchStationReviewList(stationId, page)
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
  }, [stationId, page]);

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
          <PageTitle>후기 전체보기</PageTitle>
          {reviews.length > 0 && (
            <AvgRatingBadge>★ {avgRating.toFixed(1)}</AvgRatingBadge>
          )}
        </TitleRow>
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
          {reviews.map((review) => (
            <ReviewItem key={review.reviewNo} review={review} variant="list" />
          ))}
        </ReviewListWrap>
      )}

      {renderPagination()}

      {/* 로그인 사용자 대상 후기 작성 버튼 - StationDetail과 동일 조건 */}
      {isLoggedIn && (
        <WriteReviewButton type="button" onClick={handleWriteReview}>
          후기 작성하기
        </WriteReviewButton>
      )}

      {/* TODO: 즐겨찾기 토글 영역 - 즐겨찾기 API 연동 후 구현 (data.bookmark 활용) */}
      {/* TODO: 좋아요(liked) 클릭 인터랙션 - 관련 API 확정 후 구현 */}
    </ListContainer>
  );
};

export default ReviewList;
