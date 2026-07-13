import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { fetchBookmarks } from "../../lib/stationApi";
import { useBookmarkRemoval } from "./useBookmarkRemoval";
import {
  ListContainer,
  HeaderRow,
  BackButton,
  PageTitle,
  BookmarkListWrap,
  BookmarkCard,
  StationInfo,
  StationName,
  StationAddress,
  BookmarkStarButton,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
  PaginationWrap,
  PageArrowButton,
  PageNumberButton,
} from "./BookmarkList.style";
const PAGE_SIZE = 7;
const BLOCK_SIZE = 5;
const BookmarkList = () => {
  const navigate = useNavigate();
  const { locations = [] } = useOutletContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { pendingRemovalIds, removeBookmark } =
    useBookmarkRemoval(setBookmarks);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchBookmarks()
      .then((data) => {
        if (cancelled) return;
        setBookmarks(data ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("즐겨찾기 목록을 불러오지 못했습니다:", err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const totalPages = Math.max(1, Math.ceil(bookmarks.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);
  const pagedBookmarks = bookmarks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const currentBlock = Math.ceil(page / BLOCK_SIZE);
  const startPage = (currentBlock - 1) * BLOCK_SIZE + 1;
  const endPage = Math.min(startPage + BLOCK_SIZE - 1, totalPages);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  const handleItemClick = (stationNo) => {
    navigate(`/stations/${stationNo}`);
  };
  const handleStarClick = (e, bookmark) => {
    e.stopPropagation();
    removeBookmark(bookmark);
  };
  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };
  const renderPagination = () => {
    if (totalPages <= 1) return null;
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
            $isActive={p === page}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </PageNumberButton>
        ))}
        <PageArrowButton
          type="button"
          disabled={endPage >= totalPages}
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
        <PageTitle>즐겨찾기</PageTitle>
      </HeaderRow>
      {isLoading && (
        <LoadingMessage>즐겨찾기 목록을 불러오는 중...</LoadingMessage>
      )}
      {!isLoading && error && (
        <ErrorMessage>즐겨찾기 목록을 불러오지 못했습니다.</ErrorMessage>
      )}
      {!isLoading && !error && bookmarks.length === 0 && (
        <EmptyMessage>즐겨찾기한 충전소가 없습니다.</EmptyMessage>
      )}
      {!isLoading && !error && bookmarks.length > 0 && (
        <>
          <BookmarkListWrap>
            {pagedBookmarks.map((bookmark) => {
              const station = locations.find(
                (loc) => String(loc.stationNo) === String(bookmark.stationNo),
              );
              const isPending = pendingRemovalIds.has(bookmark.bookmarkNo);
              return (
                <BookmarkCard
                  key={bookmark.bookmarkNo}
                  onClick={() => handleItemClick(bookmark.stationNo)}
                >
                  <StationInfo>
                    <StationName>
                      {station?.stationName ?? "충전소 정보를 불러오는 중..."}
                    </StationName>
                    {station?.address && (
                      <StationAddress>{station.address}</StationAddress>
                    )}
                  </StationInfo>
                  <BookmarkStarButton
                    type="button"
                    onClick={(e) => handleStarClick(e, bookmark)}
                    disabled={isPending}
                    aria-label="즐겨찾기 해제"
                  >
                    ★
                  </BookmarkStarButton>
                </BookmarkCard>
              );
            })}
          </BookmarkListWrap>
          {renderPagination()}
        </>
      )}
    </ListContainer>
  );
};
export default BookmarkList;
