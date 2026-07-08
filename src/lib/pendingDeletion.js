// src/lib/pendingDeletion.js
// 게시글 삭제(8초 지연삭제) 대기 상태를 컴포넌트 트리와 무관하게 공유하기 위한 저장소.
// BoardDetail에서 삭제 요청을 걸어도 즉시 목록으로 이동하면서 컴포넌트가 언마운트되므로,
// React state(Context 포함)로는 그 사실을 목록 쪽에 전달하기 까다로움.
// 모듈 스코프의 Set으로 "이 글은 지금 지우는 중"을 기록해두고,
// 값이 바뀔 때마다 구독 중인 리스너(BoardList)에게 알려서 화면을 다시 그리게 한다.
const pendingKeys = new Set();
const listeners = new Set();

const makeKey = (boardType, boardNo) => `${boardType}:${boardNo}`;

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const markPendingDeletion = (boardType, boardNo) => {
  pendingKeys.add(makeKey(boardType, boardNo));
  notify();
};

export const unmarkPendingDeletion = (boardType, boardNo) => {
  pendingKeys.delete(makeKey(boardType, boardNo));
  notify();
};

export const isPendingDeletion = (boardType, boardNo) =>
  pendingKeys.has(makeKey(boardType, boardNo));

// BoardList가 구독해서, mark/unmark가 호출될 때마다 재렌더 트리거용으로 사용
export const subscribePendingDeletion = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
