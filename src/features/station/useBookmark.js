import { useCallback, useState } from "react";
import { addBookmark, deleteBookmark } from "../../lib/stationApi";
export const useBookmark = (stationNo, bookmarked, setBookmarked) => {
  const [isPending, setIsPending] = useState(false);
  const toggleBookmark = useCallback(async () => {
    if (isPending) return;
    const nextBookmarked = !bookmarked;
    setIsPending(true);
    setBookmarked(nextBookmarked);
    try {
      if (nextBookmarked) {
        await addBookmark(stationNo);
      } else {
        await deleteBookmark(stationNo);
      }
    } catch (err) {
      console.error("북마크 처리 실패, 조용히 롤백:", err);
      setBookmarked(bookmarked);
    } finally {
      setIsPending(false);
    }
  }, [stationNo, bookmarked, setBookmarked, isPending]);
  return { isPending, toggleBookmark };
};
