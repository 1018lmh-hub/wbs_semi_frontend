import { useCallback, useState } from "react";
import { addReviewLike, deleteReviewLike } from "../../lib/stationApi";
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
