// src/features/board/BoardItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ItemContainer,
  TitleBlock,
  Title,
  Nickname,
  Meta,
  CountText,
  DateText,
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
const BoardItem = ({ board, boardType }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${DETAIL_PATH[boardType]}/${board.boardNo}`);
  };

  return (
    <ItemContainer onClick={handleClick}>
      <TitleBlock>
        <Title>{board.title}</Title>
        <Nickname>{board.nickname}</Nickname>
      </TitleBlock>
      <Meta>
        {/* count 필드가 조회수라는 확실한 명세가 없어 우선 "조회"로 가정 표시함.
            다른 의미(답변 수 등)라면 라벨만 바꾸면 됨 */}
        <CountText>조회 {board.count}</CountText>
        <DateText>{formatDate(board.createDate)}</DateText>
      </Meta>
    </ItemContainer>
  );
};

export default BoardItem;
