// src/features/board/BoardHome.jsx
import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  BoardHomeContainer,
  HeaderRow,
  CloseButton,
  Title,
  ButtonGroup,
  BoardButton,
} from "./BoardHome.style";

/**
 * /boards 진입 시 노출되는 "공지사항 / 문의게시판" 선택 화면.
 * 실제 목록/상세는 /notices, /inquiries로 분리되어 있으므로
 * 여기서는 두 버튼만 보여주고 클릭 시 해당 경로로 이동시킨다.
 * (Login/SignUp과 동일하게 MainLayout의 오버레이를 그대로 재사용)
 */
const BoardHome = () => {
  const navigate = useNavigate();
  const { onCloseOverlay } = useOutletContext() ?? {};

  const handleClose = () => {
    if (onCloseOverlay) {
      onCloseOverlay();
    } else {
      navigate("/");
    }
  };

  return (
    <BoardHomeContainer>
      <HeaderRow>
        <CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>

      <Title>게시판</Title>

      <ButtonGroup>
        // BoardHome.jsx 내 handleClick 부분만 변경
        <BoardButton type="button" onClick={() => navigate("/notices")}>
          공지사항
        </BoardButton>
        <BoardButton type="button" onClick={() => navigate("/inquirys")}>
          문의게시판
        </BoardButton>
      </ButtonGroup>
    </BoardHomeContainer>
  );
};

export default BoardHome;
