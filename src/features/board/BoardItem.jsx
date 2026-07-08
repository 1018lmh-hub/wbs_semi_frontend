// src/features/board/BoardItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ItemContainer,
  TitleBlock,
  Title,
  Nickname,
  Meta,
  CountText,
  DateText,
  DeleteButton,
} from "./BoardItem.style";

const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");

// boardType별 상세 경로 prefix (백엔드 표기 그대로 - notices / inquirys)
const DETAIL_PATH = {
  notice: "/notices",
  inquiry: "/inquirys",
};

/**
 * 공지사항/문의글 공용 목록 행.
 * boardApi.fetchBoardList에서 이미 title/content/boardNo로 필드명이
 * 통일된 객체를 받으므로, 여기서는 noticeTitle/inquiryTitle 같은
 * 원본 키를 신경 쓰지 않는다.
 */
const BoardItem = ({ board, boardType, onDeleteClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    navigate(`${DETAIL_PATH[boardType]}/${board.boardNo}`);
  };

  // role이 "[ROLE_ADMIN]" 형태로 내려오므로 포함 여부로 판별 (BoardDetail과 동일 기준)
  const isAdmin = !!user?.role?.includes("ROLE_ADMIN");
  const isOwner = !!user && board.userId === user.userId;
  // 삭제 노출 조건: 공지는 admin+본인, 문의는 본인만 (BoardDetail의 canManage와 동일 기준)
  const canDelete = boardType === "notice" ? isAdmin && isOwner : isOwner;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteClick?.(board.boardNo);
  };

  return (
    <ItemContainer onClick={handleClick}>
      <TitleBlock>
        <Title>{board.title}</Title>
        <Nickname>{board.nickname}</Nickname>
      </TitleBlock>
      <Meta>
        <CountText>조회수 {board.count}</CountText>
        <DateText>{formatDate(board.createDate)}</DateText>
      </Meta>
      {canDelete && (
        <DeleteButton type="button" onClick={handleDeleteClick}>
          삭제
        </DeleteButton>
      )}
    </ItemContainer>
  );
};

export default BoardItem;
