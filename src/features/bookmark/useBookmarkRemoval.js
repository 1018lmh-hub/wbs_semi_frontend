// src/features/bookmark/useBookmarkRemoval.js
import { useCallback, useState } from "react";
import { deleteBookmark } from "../../lib/stationApi";

/**
 * 즐겨찾기 목록 전용 해제(unbookmark) 훅
 * - useBookmark.js(StationDetail)와 동일한 패턴: 클릭 즉시 반영(낙관적 업데이트), 실패 시 토스트 없이 조용히 롤백
 * - 차이점: StationDetail은 boolean 하나만 다루지만, 여기서는 배열(bookmarks)에서 항목을 제거/복원해야 함
 */
export const useBookmarkRemoval = (setBookmarks) => {
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const removeBookmark = useCallback(
    async (bookmark) => {
      const { bookmarkNo, stationNo } = bookmark;

      if (pendingIds.has(bookmarkNo)) return; // 연타 방지
      setPendingIds((prev) => new Set(prev).add(bookmarkNo));

      // 낙관적 업데이트: 즉시 목록에서 제거
      setBookmarks((prev) => prev.filter((b) => b.bookmarkNo !== bookmarkNo));

      try {
        await deleteBookmark(stationNo);
      } catch (err) {
        console.error("즐겨찾기 해제 실패, 조용히 롤백:", err);
        // 실패 시 목록에 다시 추가 (createDate 기준 재정렬로 원래 위치와 최대한 비슷하게 복원)
        setBookmarks((prev) =>
          [...prev, bookmark].sort(
            (a, b) => new Date(b.createDate) - new Date(a.createDate),
          ),
        );
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(bookmarkNo);
          return next;
        });
      }
    },
    [pendingIds, setBookmarks],
  );

  return { pendingRemovalIds: pendingIds, removeBookmark };
};
