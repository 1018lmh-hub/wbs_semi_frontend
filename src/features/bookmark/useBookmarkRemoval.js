import { useCallback, useState } from "react";
import { deleteBookmark } from "../../lib/stationApi";
export const useBookmarkRemoval = (setBookmarks) => {
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const removeBookmark = useCallback(
    async (bookmark) => {
      const { bookmarkNo, stationNo } = bookmark;
      if (pendingIds.has(bookmarkNo)) return;
      setPendingIds((prev) => new Set(prev).add(bookmarkNo));
      setBookmarks((prev) => prev.filter((b) => b.bookmarkNo !== bookmarkNo));
      try {
        await deleteBookmark(stationNo);
      } catch (err) {
        console.error("즐겨찾기 해제 실패, 조용히 롤백:", err);
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
