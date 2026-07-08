// src/context/BoardDeletionContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useToast } from "./ToastContext";
import { deleteBoard } from "../lib/boardApi";

const BoardDeletionContext = createContext(null);

const UNDO_DURATION = 8000; // 8초 - 취소 가능 시간 (토스트 노출 시간과 동일)

// boardType+boardNo를 합쳐 하나의 키로 관리 (notice/inquiry가 같은 번호를 가질 수 있으므로)
const makeKey = (boardType, boardNo) => `${boardType}:${boardNo}`;

/**
 * 게시글(공지/문의) 삭제 대기 상태를 BoardLayout 하위 전체(목록 화면, 상세 화면)에서
 * 공유하기 위한 Context.
 *
 * 배경: 기존 useBoardDeletion처럼 컴포넌트 로컬 상태로 pendingIds를 관리하면,
 * 상세보기에서 삭제 요청 후 목록으로 이동할 때 새로 마운트되는 BoardList가
 * 그 대기 상태를 전혀 모르는 문제가 있었음. Context로 끌어올려서
 * "어디서 삭제를 눌렀든" 목록/상세 어디에서든 동일하게 숨겨지도록 함.
 *
 * 목록 배열을 직접 조작하는 대신, "이 boardNo는 삭제 대기/완료 상태"라는
 * 마킹만 들고 있고, 화면은 매 렌더마다 isPending으로 필터링한다.
 * 삭제 성공 시에는 마킹을 계속 유지 (서버에서도 실제로 사라졌으므로 자연히 숨겨진 채 유지).
 * 삭제 실패 시에는 마킹을 해제해서 원래 목록에 다시 보이게 한다.
 */
export const BoardDeletionProvider = ({ children }) => {
  const { showToast } = useToast();
  const [pendingKeys, setPendingKeys] = useState(() => new Set());
  const timers = useRef(new Map()); // key -> timeoutId

  const clearPending = useCallback((key) => {
    setPendingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const finalizeDelete = useCallback(
    async (boardType, boardNo, key) => {
      timers.current.delete(key);
      try {
        await deleteBoard(boardType, boardNo);
        // 성공 시 마킹은 그대로 유지 -> 이후 목록이 다시 fetch 되어도
        // 실제로 삭제된 게시글이라 서버 응답에 없으므로 자연히 계속 숨겨짐
      } catch (err) {
        showToast(
          err.response?.data?.message ?? "게시글 삭제에 실패했습니다.",
          "error",
        );
        // 삭제 실패 -> 화면에 다시 노출되어야 하므로 마킹 해제
        clearPending(key);
      }
    },
    [showToast, clearPending],
  );

  const requestDelete = useCallback(
    (boardType, boardNo) => {
      const key = makeKey(boardType, boardNo);

      setPendingKeys((prev) => new Set(prev).add(key));

      const timeoutId = setTimeout(() => {
        finalizeDelete(boardType, boardNo, key);
      }, UNDO_DURATION);
      timers.current.set(key, timeoutId);

      showToast("게시글이 삭제되었습니다.", "error", {
        duration: UNDO_DURATION,
        actionLabel: "작업취소",
        onAction: () => {
          const timeoutIdToCancel = timers.current.get(key);
          if (timeoutIdToCancel) {
            clearTimeout(timeoutIdToCancel);
            timers.current.delete(key);
          }
          clearPending(key);
        },
      });
    },
    [finalizeDelete, showToast, clearPending],
  );

  const isPending = useCallback(
    (boardType, boardNo) => pendingKeys.has(makeKey(boardType, boardNo)),
    [pendingKeys],
  );

  return (
    <BoardDeletionContext.Provider value={{ requestDelete, isPending }}>
      {children}
    </BoardDeletionContext.Provider>
  );
};

export const useBoardDeletion = () => {
  const context = useContext(BoardDeletionContext);
  if (!context) {
    throw new Error(
      "useBoardDeletion은 BoardDeletionProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return context;
};
