// src/features/review/useReviewLike.js
import { useCallback, useState } from "react";
import { addReviewLike, deleteReviewLike } from "../../lib/stationApi";

/**
 * 좋아요 토글 훅
 * - 지연확정/토스트 없음 — 클릭 즉시 반영 + 즉시 요청
 * - 실패 시에도 사용자에게 알리지 않고 조용히 원상복구 (좋아요는 크리티컬하지 않음)
 * - console.error만 남겨 디버깅 시 확인 가능하게 함 (사용자 화면엔 노출 안 됨)
 */
export const useReviewLike = (setReviews) => {
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const toggleLike = useCallback(
    async (stationNo, review) => {
      const { reviewNo, liked, likeCount } = review;

      if (pendingIds.has(reviewNo)) return;
      setPendingIds((prev) => new Set(prev).add(reviewNo));

      const nextLiked = !liked;
      const nextCount = liked ? likeCount - 1 : likeCount + 1;

      setReviews((prev) =>
        prev.map((r) =>
          r.reviewNo === reviewNo
            ? { ...r, liked: nextLiked, likeCount: nextCount }
            : r,
        ),
      );

      try {
        if (nextLiked) {
          await addReviewLike(stationNo, reviewNo);
        } else {
          await deleteReviewLike(stationNo, reviewNo);
        }
      } catch (err) {
        console.error("좋아요 처리 실패, 조용히 롤백:", err);
        setReviews((prev) =>
          prev.map((r) =>
            r.reviewNo === reviewNo ? { ...r, liked, likeCount } : r,
          ),
        );
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(reviewNo);
          return next;
        });
      }
    },
    [pendingIds, setReviews],
  );

  return { pendingLikeIds: pendingIds, toggleLike };
};
