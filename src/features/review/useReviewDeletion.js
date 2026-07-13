import { useCallback, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { deleteStationReview } from "../../lib/stationApi";
const UNDO_DURATION = 8000;
export function useReviewDeletion(setReviews) {
  const { showToast } = useToast();
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const timers = useRef(new Map());
  const clearPending = useCallback((reviewNo) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(reviewNo);
      return next;
    });
  }, []);
  const finalizeDelete = useCallback(
    async (stationNo, reviewNo) => {
      timers.current.delete(reviewNo);
      try {
        await deleteStationReview(stationNo, reviewNo);
        setReviews((prev) => prev.filter((r) => r.reviewNo !== reviewNo));
      } catch (err) {
        showToast(
          err.response?.data?.message ?? "후기 삭제에 실패했습니다.",
          "error",
        );
      } finally {
        clearPending(reviewNo);
      }
    },
    [setReviews, showToast, clearPending],
  );
  const requestDelete = useCallback(
    (stationNo, reviewNo) => {
      setPendingIds((prev) => new Set(prev).add(reviewNo));
      const timeoutId = setTimeout(() => {
        finalizeDelete(stationNo, reviewNo);
      }, UNDO_DURATION);
      timers.current.set(reviewNo, timeoutId);
      showToast("후기가 삭제되었습니다.", "error", {
        duration: UNDO_DURATION,
        actionLabel: "작업취소",
        onAction: () => {
          const timeoutIdToCancel = timers.current.get(reviewNo);
          if (timeoutIdToCancel) {
            clearTimeout(timeoutIdToCancel);
            timers.current.delete(reviewNo);
          }
          clearPending(reviewNo);
        },
      });
    },
    [finalizeDelete, showToast, clearPending],
  );
  return { pendingIds, requestDelete };
}
