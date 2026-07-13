import api from "../api/axios";
const commentsPath = (inquiryNo) => `/inquirys/${inquiryNo}/inquirycomments`;
export const fetchComments = async (inquiryNo) => {
  const res = await api.get(commentsPath(inquiryNo));
  return res.data.data ?? [];
};
export const createComment = async (inquiryNo, content) => {
  const res = await api.post(commentsPath(inquiryNo), {
    commentContent: content,
  });
  return res.data;
};
export const updateComment = async (inquiryNo, commentNo, content) => {
  const res = await api.patch(`${commentsPath(inquiryNo)}/${commentNo}`, {
    commentContent: content,
  });
  return res.data;
};
export const deleteComment = async (inquiryNo, commentNo) => {
  const res = await api.delete(`${commentsPath(inquiryNo)}/${commentNo}`);
  return res.data;
};
