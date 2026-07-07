// src/features/board/BoardDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { fetchBoardDetail } from "../../lib/boardApi";
import { useAuth } from "../../context/AuthContext";
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

// boardType별 라우트 파라미터명/경로 prefix (App.jsx 라우트 정의와 짝을 맞춤)
const ROUTE_CONFIG = {
  notice: { paramName: "noticeNo", listPath: "/notices", editPath: "/notices" },
  inquiry: {
    paramName: "inquiryNo",
    listPath: "/inquirys",
    editPath: "/inquirys",
  },
};

const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");

/**
 * 공지사항/문의글 공용 상세보기.
 * 댓글 영역은 이번 세션 범위 밖 (세션 6에서 연결 예정) — 자리만 비워둠.
 * 수정/삭제 버튼 클릭 동작은 세션 4(수정), 5(삭제)에서 실제 연결.
 */
const BoardDetail = ({ boardType }) => {
  const routeConfig = ROUTE_CONFIG[boardType];
  const params = useParams();
  const boardNo = params[routeConfig.paramName];

  const navigate = useNavigate();
  const { onCloseOverlay } = useOutletContext() ?? {};
  const { isLoggedIn, user } = useAuth();

  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 삭제는 세션 5(useBoardDeletion)에서 실제 로직 연결 예정 — 지금은 버튼만 노출
  const handleDeleteClick = () => {
    console.warn("삭제 기능은 세션 5에서 연결됩니다.");
  };

  // role이 "[ROLE_ADMIN]" 형태로 내려오므로 포함 여부로 판별 (BoardList와 동일 기준)
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
        <ErrorMessage>게시글 정보를 불러오지 못했습니다.</ErrorMessage>
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

      {/* TODO: 문의글 댓글 영역 - 세션 6에서 연결 (boardType === "inquiry"일 때만 렌더) */}
    </DetailContainer>
  );
};

export default BoardDetail;
