// src/features/board/BoardList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoardList } from "../../lib/boardApi";
import { useAuth } from "../../context/AuthContext";
import BoardItem from "./BoardItem";
import { useBoardDeletion } from "../../context/BoardDeletionContext";
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

/**
 * 공지사항/문의글 공용 목록 화면.
 * - boardType="notice": /notices
 * - boardType="inquiry": /inquirys
 * API 엔드포인트/필드명 차이는 lib/boardApi.js에서 흡수되어 있어
 * 여기서는 board.title/board.content 등 통일된 필드만 다룬다.
 */
const BoardList = ({ boardType }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [boards, setBoards] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { requestDelete, isPending } = useBoardDeletion();

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

  // boardType이 바뀌면(탭으로 공지↔문의 이동) 페이지를 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [boardType]);

  // 작성 버튼 노출 조건
  // - 공지: 로그인 + ROLE_ADMIN
  // - 문의: 로그인한 사용자 누구나
  // role이 "[ROLE_ADMIN]" 형태(리스트를 toString한 형태로 추정)로 내려오므로
  // === 대신 문자열 포함 여부(includes)로 판별
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
            .filter((board) => !isPending(boardType, board.boardNo))
            .map((board) => (
              <BoardItem
                key={board.boardNo}
                board={board}
                boardType={boardType}
                onDeleteClick={(boardNo) => requestDelete(boardType, boardNo)}
              />
            ))}
        </BoardListWrap>
      )}

      {renderPagination()}
    </ListContainer>
  );
};

export default BoardList;
