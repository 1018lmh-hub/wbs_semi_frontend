// src/features/board/comment/CommentList.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../../lib/commentApi";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import {
  ListContainer,
  ListTitle,
  ItemsWrap,
  EmptyMessage,
  LoadingMessage,
  ErrorMessage,
} from "./CommentList.style";

// 삭제 취소 가능 시간 (8초) - 게시글 삭제(BoardDetail)와 동일 기준
const UNDO_DURATION = 8000;

/**
 * 문의글 댓글 영역. BoardDetail에서 boardType === "inquiry"일 때만 렌더.
 * - 조회: 인증 불필요
 * - 작성: ROLE_ADMIN만
 * - 수정/삭제: ROLE_ADMIN + 작성자 본인만 (각 댓글의 userId로 판별)
 * - 삭제: 8초 지연삭제 (작업취소 가능) - 게시글 삭제와 동일 패턴
 */
const CommentList = ({ inquiryNo }) => {
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // 삭제 대기 중인 댓글 번호 집합 - 화면에서는 즉시 숨기고, 8초 뒤 실제 삭제 요청
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const timers = useRef(new Map()); // commentNo -> timeoutId

  const loadComments = () => {
    setIsLoading(true);
    setError(null);
    fetchComments(inquiryNo)
      .then(setComments)
      .catch((err) => {
        console.error("댓글 목록을 불러오지 못했습니다:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!inquiryNo) return;
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiryNo]);

  // role이 "[ROLE_ADMIN]" 형태로 내려오므로 포함 여부로 판별 (다른 화면과 동일 기준)
  const isAdmin = !!user?.role?.includes("ROLE_ADMIN");
  const canWrite = isLoggedIn && isAdmin;

  const handleCreate = async (content) => {
    await createComment(inquiryNo, content);
    loadComments();
  };

  const handleUpdate = async (commentNo, content) => {
    await updateComment(inquiryNo, commentNo, content);
    loadComments();
  };

  const handleDelete = (commentNo) => {
    // 화면에서 즉시 숨김 (아직 서버 요청은 안 보냄)
    setPendingIds((prev) => new Set(prev).add(commentNo));

    const timeoutId = setTimeout(async () => {
      timers.current.delete(commentNo);
      try {
        await deleteComment(inquiryNo, commentNo);
        loadComments();
      } catch (err) {
        console.error("댓글 삭제에 실패했습니다:", err);
        showToast(
          err.response?.data?.message ?? "댓글 삭제에 실패했습니다.",
          "error",
        );
        // 삭제 실패 -> 다시 노출되도록 대기 상태 해제
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(commentNo);
          return next;
        });
      }
    }, UNDO_DURATION);
    timers.current.set(commentNo, timeoutId);

    showToast("답변이 삭제되었습니다.", "error", {
      duration: UNDO_DURATION,
      actionLabel: "작업취소",
      onAction: () => {
        const timeoutIdToCancel = timers.current.get(commentNo);
        if (timeoutIdToCancel) {
          clearTimeout(timeoutIdToCancel);
          timers.current.delete(commentNo);
        }
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(commentNo);
          return next;
        });
      },
    });
  };

  return (
    <ListContainer>
      <ListTitle>
        답변 {comments.length > 0 && `(${comments.length})`}
      </ListTitle>

      {isLoading && <LoadingMessage>답변을 불러오는 중...</LoadingMessage>}

      {!isLoading && error && (
        <ErrorMessage>
          {error.response?.data?.message ?? "답변을 불러오지 못했습니다."}
        </ErrorMessage>
      )}

      {!isLoading && !error && comments.length === 0 && (
        <EmptyMessage>등록된 답변이 없습니다.</EmptyMessage>
      )}

      {!isLoading && !error && comments.length > 0 && (
        <ItemsWrap>
          {comments
            .filter((comment) => !pendingIds.has(comment.commentNo))
            .map((comment) => {
              const isOwner = !!user && comment.userId === user.userId;
              return (
                <CommentItem
                  key={comment.commentNo}
                  comment={comment}
                  canManage={isAdmin && isOwner}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              );
            })}
        </ItemsWrap>
      )}

      {canWrite && <CommentForm onSubmit={handleCreate} />}
    </ListContainer>
  );
};

export default CommentList;
