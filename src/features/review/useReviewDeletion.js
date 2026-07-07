// src/features/review/useReviewDeletion.js
import { useCallback, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { deleteStationReview } from "../../lib/stationApi";

const UNDO_DURATION = 8000; // 8초 - 취소 가능 시간 (토스트 노출 시간과 동일)

/**
 * "삭제 버튼 클릭 시 즉시 서버에 보내지 않고, 화면에서만 먼저 숨긴 뒤
 * 8초 동안 취소하지 않으면 그때 실제 DELETE 요청을 보내는" 지연 삭제 로직.
 * ReviewList(전체보기) / ReviewPreview(미리보기) 양쪽에서 공유해서 사용.
 *
 * @param {Function} setReviews - 각 화면이 갖고 있는 reviews 배열의 setState 함수
 * @returns {{ pendingIds: Set<number>, requestDelete: Function }}
 *   - pendingIds: 현재 "삭제 대기 중"이라 화면에서 숨겨야 하는 reviewNo 집합
 *   - requestDelete(stationNo, reviewNo): 삭제 버튼 클릭 시 호출
 */
export function useReviewDeletion(setReviews) {
  const { showToast } = useToast();
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const timers = useRef(new Map()); // reviewNo -> timeoutId

  const clearPending = useCallback((reviewNo) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(reviewNo);
      return next;
    });
  }, []);

  // 8초가 지나 실제로 삭제를 확정하는 함수
  const finalizeDelete = useCallback(
    async (stationNo, reviewNo) => {
      timers.current.delete(reviewNo);
      try {
        await deleteStationReview(stationNo, reviewNo);
        // 서버 삭제 성공 -> 목록에서 완전히 제거
        setReviews((prev) => prev.filter((r) => r.reviewNo !== reviewNo));
      } catch (err) {
        // 삭제 실패("작성자와 일치하지 않습니다" 등) -> 화면에 다시 노출
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
      // 화면에서 즉시 숨김 (아직 서버 요청은 안 보냄)
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
          // 서버 요청 자체가 안 나갔으므로 원래 배열은 그대로 -> pending만 풀어주면 원위치 복원됨
          clearPending(reviewNo);
        },
      });
    },
    [finalizeDelete, showToast, clearPending],
  );

  return { pendingIds, requestDelete };
}
