// src/features/review/ReviewItem.jsx
import React from "react";
import {
  ItemContainer,
  TopRow,
  ProfileImage,
  TitleBlock,
  Title,
  Nickname,
  Meta,
  LikeCount,
  DateText,
  ContentText,
} from "./ReviewItem.style";

// TODO: 프로필 이미지 fallback을 쓰는 곳이 더 늘어나면 lib/ 유틸로 한 번 더 추출 검토
const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'>` +
      `<rect width='40' height='40' rx='20' fill='#243754'/>` +
      `<circle cx='20' cy='16' r='7' fill='#8A99AD'/>` +
      `<path d='M6 34c0-8 6-12 14-12s14 4 14 12' fill='#8A99AD'/>` +
      `</svg>`,
  );

// "2026-07-03T14:54:36.757" -> "2026-07-03"
const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");

/**
 * 후기 1건을 렌더링하는 공통 아이템 (카드형).
 * ReviewPreview(StationDetail 하단 미리보기)와 ReviewList(후기 전체보기)에서 공유.
 *
 * @param {object} review - 후기 데이터
 * @param {"preview"|"list"} variant - "preview": 제목 한 줄 말줄임 + 내용 2줄 말줄임 (StationDetail 미리보기용)
 *                                      "list": 제목/내용 모두 전체 표시 (후기 전체보기용)
 *
 * 레이아웃 우선순위: 제목 > 내용 > 작성자(닉네임)
 * - 좋아요/작성일은 우측 상단에 보조 정보로만 작게 표시
 * - changeProfileName이 없으면(null) 기본 프로필 이미지로 대체
 */
const ReviewItem = ({ review, variant = "list" }) => {
  return (
    <ItemContainer>
      <TopRow>
        <ProfileImage
          src={review.changeProfileName || DEFAULT_PROFILE_IMAGE}
          alt={`${review.nickname} 프로필`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
          }}
        />
        <TitleBlock>
          <Title $variant={variant}>{review.reviewTitle}</Title>
          <Nickname>{review.nickname}</Nickname>
        </TitleBlock>
        <Meta>
          <LikeCount>좋아요 {review.likeCount}</LikeCount>
          <DateText>{formatDate(review.createDate)}</DateText>
        </Meta>
      </TopRow>
      <ContentText $variant={variant}>{review.reviewContent}</ContentText>
    </ItemContainer>
  );
};

export default ReviewItem;
