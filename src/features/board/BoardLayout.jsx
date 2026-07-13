import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BoardLayoutContainer,
  BoardTabRow,
  BoardTab,
} from "./BoardLayout.style";
const BoardLayout = () => {
  return (
    <BoardLayoutContainer>
      <BoardTabRow>
        <BoardTab as={NavLink} to="/notices">
          공지사항
        </BoardTab>
        <BoardTab as={NavLink} to="/inquirys">
          문의게시판
        </BoardTab>
      </BoardTabRow>
      <Outlet />
    </BoardLayoutContainer>
  );
};
export default BoardLayout;
