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
