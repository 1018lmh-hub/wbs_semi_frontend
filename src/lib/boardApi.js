// src/lib/boardApi.js
import api from "../api/axios";

// boardType별로 실제 엔드포인트/필드명 차이를 여기서 흡수
// - path: API 경로 (백엔드 표기 그대로, inquiry는 "inquirys")
// - listKey: 목록 응답에서 배열이 들어있는 필드명
// - noKey/titleKey/contentKey: 게시글 번호/제목/내용 원본 필드명
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

/**
 * 공지사항/문의글 공용 목록 조회.
 * boardType별로 다른 필드명(noticeTitle vs inquiryTitle 등)을
 * 여기서 title/content/boardNo로 통일해서 BoardList/BoardItem에 넘긴다.
 *
 * @param {"notice"|"inquiry"} boardType
 * @param {number} page
 * @returns {Promise<{ items: Array, pageInfo: object }>}
 */
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
    }));

    return { items, pageInfo: pageInfo ?? null };
  } catch (err) {
    // 존재하지 않는 페이지 요청(400) 등은 컴포넌트에서 처리하도록 그대로 던짐
    throw err;
  }
};

/**
 * 공지사항/문의글 공용 상세 조회.
 * 목록과 동일하게 title/content/boardNo로 필드명을 통일해서 반환한다.
 *
 * @param {"notice"|"inquiry"} boardType
 * @param {string|number} boardNo
 */
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
    // 존재하지 않는 게시글(400) 등은 컴포넌트에서 처리하도록 그대로 던짐
    throw err;
  }
};
