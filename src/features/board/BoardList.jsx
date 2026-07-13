import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoardList } from "../../lib/boardApi";
import { useAuth } from "../../context/AuthContext";
import BoardItem from "./BoardItem";
import {
  isPendingDeletion,
  subscribePendingDeletion,
} from "../../lib/pendingDeletion";
import {
  ListContainer,
  TitleRow,
  PageTitle,
  WriteButton,
  BoardListWrap,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
  PaginationWrap,
  PageArrowButton,
  PageNumberButton,
} from "./BoardList.style";
const BOARD_LABEL = {
  notice: "공지사항",
  inquiry: "문의게시판",
};
const WRITE_PATH = {
  notice: "/notices/form",
  inquiry: "/inquirys/form",
};
const BoardList = ({ boardType }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchBoardList(boardType, page)
      .then(({ items, pageInfo: nextPageInfo }) => {
        if (cancelled) return;
        setBoards(items);
        setPageInfo(nextPageInfo);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("게시글 목록을 불러오지 못했습니다:", err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [boardType, page]);
  useEffect(() => {
    return subscribePendingDeletion(() => forceUpdate((n) => n + 1));
  }, []);
  useEffect(() => {
    setPage(1);
  }, [boardType]);
  const isAdmin = !!user?.role?.includes("ROLE_ADMIN");
  const canWrite = boardType === "notice" ? isLoggedIn && isAdmin : isLoggedIn;
  const handleWriteClick = () => {
    navigate(WRITE_PATH[boardType]);
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
      <TitleRow>
        <PageTitle>{BOARD_LABEL[boardType]}</PageTitle>
        {canWrite && (
          <WriteButton type="button" onClick={handleWriteClick}>
            글쓰기
          </WriteButton>
        )}
      </TitleRow>
      {isLoading && <LoadingMessage>목록을 불러오는 중...</LoadingMessage>}
      {!isLoading && error && (
        <ErrorMessage>목록을 불러오지 못했습니다.</ErrorMessage>
      )}
      {!isLoading && !error && boards.length === 0 && (
        <EmptyMessage>등록된 게시글이 없습니다.</EmptyMessage>
      )}
      {!isLoading && !error && boards.length > 0 && (
        <BoardListWrap>
          {boards
            .filter((board) => !isPendingDeletion(boardType, board.boardNo))
            .map((board) => (
              <BoardItem
                key={board.boardNo}
                board={board}
                boardType={boardType}
              />
            ))}
        </BoardListWrap>
      )}
      {renderPagination()}
    </ListContainer>
  );
};
export default BoardList;
