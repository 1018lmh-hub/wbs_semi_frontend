import api from "../api/axios";
const BOARD_CONFIG = {
  notice: {
    path: "/notices",
    listKey: "notices",
    noKey: "noticeNo",
    titleKey: "noticeTitle",
    contentKey: "noticeContent",
  },
  inquiry: {
    path: "/inquirys",
    listKey: "inquirys",
    noKey: "inquiryNo",
    titleKey: "inquiryTitle",
    contentKey: "inquiryContent",
  },
};
export const fetchBoardList = async (boardType, page = 1) => {
  const config = BOARD_CONFIG[boardType];
  try {
    const res = await api.get(config.path, { params: { page } });
    const { [config.listKey]: rawItems, pageInfo } = res.data.data;
    const items = (rawItems ?? []).map((item) => ({
      boardNo: item[config.noKey],
      userId: item.userId,
      nickname: item.nickname,
      title: item[config.titleKey],
      content: item[config.contentKey],
      count: item.count,
      createDate: item.createDate,
      modifyDate: item.modifyDate,
      status: item.status,
      hasComment: item.hasComment,
    }));
    return { items, pageInfo: pageInfo ?? null };
  } catch (err) {
    throw err;
  }
};
export const fetchBoardDetail = async (boardType, boardNo) => {
  const config = BOARD_CONFIG[boardType];
  try {
    const res = await api.get(`${config.path}/${boardNo}`);
    const item = res.data.data;
    return {
      boardNo: item[config.noKey],
      userId: item.userId,
      nickname: item.nickname,
      title: item[config.titleKey],
      content: item[config.contentKey],
      count: item.count,
      createDate: item.createDate,
      modifyDate: item.modifyDate,
      status: item.status,
    };
  } catch (err) {
    throw err;
  }
};
export const createBoard = async (boardType, { title, content }) => {
  const config = BOARD_CONFIG[boardType];
  const res = await api.post(config.path, {
    [config.titleKey]: title,
    [config.contentKey]: content,
  });
  return res.data;
};
export const updateBoard = async (boardType, boardNo, { title, content }) => {
  const config = BOARD_CONFIG[boardType];
  const res = await api.patch(`${config.path}/${boardNo}`, {
    [config.titleKey]: title,
    [config.contentKey]: content,
  });
  return res.data;
};
export const deleteBoard = async (boardType, boardNo) => {
  const config = BOARD_CONFIG[boardType];
  const res = await api.delete(`${config.path}/${boardNo}`);
  return res.data;
};
