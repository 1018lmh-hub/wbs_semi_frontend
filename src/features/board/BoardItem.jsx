import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ItemContainer,
  TitleBlock,
  TitleRow,
  Title,
  AnsweredBadge,
  Nickname,
  Meta,
  CountText,
  DateText,
} from "./BoardItem.style";
const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");
const DETAIL_PATH = {
  notice: "/notices",
  inquiry: "/inquirys",
};
const BoardItem = ({ board, boardType }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`${DETAIL_PATH[boardType]}/${board.boardNo}`);
  };
  return (
    <ItemContainer onClick={handleClick}>
      <TitleBlock>
        <TitleRow>
          <Title>{board.title}</Title>
          {board.hasComment === true && <AnsweredBadge>답변완료</AnsweredBadge>}
        </TitleRow>
        <Nickname>{board.nickname}</Nickname>
      </TitleBlock>
      <Meta>
        <CountText>조회 {board.count}</CountText>
        <DateText>{formatDate(board.createDate)}</DateText>
      </Meta>
    </ItemContainer>
  );
};
export default BoardItem;
