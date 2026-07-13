import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { fetchBoardDetail, deleteBoard } from "../../lib/boardApi";
import {
  markPendingDeletion,
  unmarkPendingDeletion,
} from "../../lib/pendingDeletion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import CommentList from "./comment/CommentList";
import {
  DetailContainer,
  HeaderRow,
  BackButton,
  TitleRow,
  TitleText,
  Meta,
  Nickname,
  DateText,
  CountText,
  ContentText,
  BottomRow,
  EditButton,
  DeleteButton,
  LoadingMessage,
  ErrorMessage,
} from "./BoardDetail.style";
const ROUTE_CONFIG = {
  notice: { paramName: "noticeNo", listPath: "/notices", editPath: "/notices" },
  inquiry: {
    paramName: "inquiryNo",
    listPath: "/inquirys",
    editPath: "/inquirys",
  },
};
const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");
const UNDO_DURATION = 8000;
const BoardDetail = ({ boardType }) => {
  const routeConfig = ROUTE_CONFIG[boardType];
  const params = useParams();
  const boardNo = params[routeConfig.paramName];
  const navigate = useNavigate();
  const { onCloseOverlay } = useOutletContext() ?? {};
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteTimerRef = useRef(null);
  useEffect(() => {
    if (!boardNo) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchBoardDetail(boardType, boardNo)
      .then((data) => {
        if (cancelled) return;
        setDetail(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("게시글 상세를 불러오지 못했습니다:", err);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [boardType, boardNo]);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(routeConfig.listPath);
    }
  };
  const handleClose = () => {
    if (onCloseOverlay) {
      onCloseOverlay();
    } else {
      navigate(routeConfig.listPath);
    }
  };
  const handleEditClick = () => {
    navigate(`${routeConfig.editPath}/${boardNo}/edit`, { state: detail });
  };
  const handleDeleteClick = () => {
    markPendingDeletion(boardType, boardNo);
    showToast("게시글이 삭제되었습니다.", "error", {
      duration: UNDO_DURATION,
      actionLabel: "작업취소",
      onAction: () => {
        clearTimeout(deleteTimerRef.current);
        unmarkPendingDeletion(boardType, boardNo);
      },
    });
    deleteTimerRef.current = setTimeout(async () => {
      try {
        await deleteBoard(boardType, boardNo);
      } catch (err) {
        showToast(
          err.response?.data?.message ?? "게시글 삭제에 실패했습니다.",
          "error",
        );
        unmarkPendingDeletion(boardType, boardNo);
      }
    }, UNDO_DURATION);
    handleBack();
  };
  const isAdmin = !!user?.role?.includes("ROLE_ADMIN");
  const isOwner = !!user && detail?.userId === user.userId;
  const canManage =
    boardType === "notice"
      ? isLoggedIn && isAdmin && isOwner
      : isLoggedIn && isOwner;
  if (isLoading) {
    return (
      <DetailContainer>
        <LoadingMessage>게시글을 불러오는 중...</LoadingMessage>
      </DetailContainer>
    );
  }
  if (error || !detail) {
    return (
      <DetailContainer>
        <HeaderRow>
          <BackButton onClick={handleBack} aria-label="뒤로가기">
            ← 뒤로
          </BackButton>
        </HeaderRow>
        <ErrorMessage>
          {error?.response?.data?.message ??
            "게시글 정보를 불러오지 못했습니다."}
        </ErrorMessage>
      </DetailContainer>
    );
  }
  return (
    <DetailContainer>
      <HeaderRow>
        <BackButton onClick={handleBack} aria-label="뒤로가기">
          ← 뒤로
        </BackButton>
      </HeaderRow>
      <TitleRow>
        <TitleText>{detail.title}</TitleText>
      </TitleRow>
      <Meta>
        <Nickname>{detail.nickname}</Nickname>
        <DateText>{formatDate(detail.createDate)}</DateText>
        <CountText>조회 {detail.count}</CountText>
      </Meta>
      <ContentText>{detail.content}</ContentText>
      {canManage && (
        <BottomRow>
          <EditButton type="button" onClick={handleEditClick}>
            수정
          </EditButton>
          <DeleteButton type="button" onClick={handleDeleteClick}>
            삭제
          </DeleteButton>
        </BottomRow>
      )}
      {boardType === "inquiry" && <CommentList inquiryNo={boardNo} />}
    </DetailContainer>
  );
};
export default BoardDetail;
