// src/features/board/BoardLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BoardLayoutContainer,
  BoardTabRow,
  BoardTab,
} from "./BoardLayout.style";
import { BoardDeletionProvider } from "../../context/BoardDeletionContext";

/**
 * 공지사항/문의게시판 공통 레이아웃.
 * 상단 탭 2개(NavLink)로 두 게시판을 자유롭게 오갈 수 있게 하고,
 * 실제 목록/상세/작성/수정 화면은 Outlet으로 그 아래에 렌더링한다.
 * "게시판" 헤더 버튼은 항상 이 레이아웃의 기본 진입점인 /notices로 이동한다.
 */
const BoardLayout = () => {
  return (
    <BoardDeletionProvider>
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
    </BoardDeletionProvider>
  );
};

export default BoardLayout;
