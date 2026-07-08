// src/lib/commentApi.js
import api from "../api/axios";

const commentsPath = (inquiryNo) => `/inquirys/${inquiryNo}/inquirycomments`;

/**
 * 문의글 댓글 목록 조회. 페이징 없음 (전체 반환).
 */
export const fetchComments = async (inquiryNo) => {
  const res = await api.get(commentsPath(inquiryNo));
  return res.data.data ?? [];
};

/**
 * 댓글 작성. ROLE_ADMIN만 가능 (백엔드에서 hasRole로 검증).
 */
export const createComment = async (inquiryNo, content) => {
  const res = await api.post(commentsPath(inquiryNo), {
    commentContent: content,
  });
  return res.data;
};

/**
 * 댓글 수정. ROLE_ADMIN + 작성자 본인만 가능.
 */
export const updateComment = async (inquiryNo, commentNo, content) => {
  const res = await api.patch(`${commentsPath(inquiryNo)}/${commentNo}`, {
    commentContent: content,
  });
  return res.data;
};

/**
 * 댓글 삭제. ROLE_ADMIN + 작성자 본인만 가능.
 */
export const deleteComment = async (inquiryNo, commentNo) => {
  const res = await api.delete(`${commentsPath(inquiryNo)}/${commentNo}`);
  return res.data;
};
