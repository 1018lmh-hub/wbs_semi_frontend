// src/features/station/useBookmark.js
import { useCallback, useState } from "react";
import { addBookmark, deleteBookmark } from "../../lib/stationApi";

/**
 * 북마크(즐겨찾기) 토글 훅 - StationDetail 전용
 * - useReviewLike와 동일한 패턴: 클릭 즉시 반영, 실패 시 토스트 없이 조용히 롤백
 * - 단일 충전소에 대한 boolean 상태라 reviews 배열 갱신과 달리 setBookmarked만 필요
 */
export const useBookmark = (stationNo, bookmarked, setBookmarked) => {
  const [isPending, setIsPending] = useState(false);

  const toggleBookmark = useCallback(async () => {
    if (isPending) return; // 연타 방지

    const nextBookmarked = !bookmarked;
    setIsPending(true);
    setBookmarked(nextBookmarked); // 낙관적 업데이트

    try {
      if (nextBookmarked) {
        await addBookmark(stationNo);
      } else {
        await deleteBookmark(stationNo);
      }
    } catch (err) {
      console.error("북마크 처리 실패, 조용히 롤백:", err);
      setBookmarked(bookmarked); // 롤백
    } finally {
      setIsPending(false);
    }
  }, [stationNo, bookmarked, setBookmarked, isPending]);

  return { isPending, toggleBookmark };
};
