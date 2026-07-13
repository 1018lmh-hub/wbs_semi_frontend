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
export const subscribePendingDeletion = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
