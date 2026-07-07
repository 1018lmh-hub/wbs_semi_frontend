// src/features/review/ReviewItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  BottomRow,
  EditButton,
  DeleteButton,
} from "./ReviewItem.style";

const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'>` +
      `<rect width='40' height='40' rx='20' fill='#243754'/>` +
      `<circle cx='20' cy='16' r='7' fill='#8A99AD'/>` +
      `<path d='M6 34c0-8 6-12 14-12s14 4 14 12' fill='#8A99AD'/>` +
      `</svg>`,
  );

const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");

/**
 * @param {Function} [onDeleteClick] - 삭제 버튼 클릭 시 호출 (review 전달).
 *   부모(ReviewList/ReviewPreview)가 useReviewDeletion의 requestDelete를 연결해서 넘겨줌.
 *   전달하지 않으면 삭제 버튼 자체가 렌더링되지 않음.
 */
const ReviewItem = ({ review, variant = "list", onDeleteClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = !!user && user.userId === review.userId;

  const handleEditClick = () => {
    navigate(`/stations/${review.stationNo}/reviews/${review.reviewNo}/edit`, {
      state: {
        reviewNo: review.reviewNo,
        reviewTitle: review.reviewTitle,
        reviewContent: review.reviewContent,
        rating: review.rating,
      },
    });
  };

  const handleDeleteClick = () => {
    onDeleteClick?.(review);
  };

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

      {isOwner && (
        <BottomRow>
          <EditButton type="button" onClick={handleEditClick}>
            수정
          </EditButton>
          <DeleteButton type="button" onClick={handleDeleteClick}>
            삭제
          </DeleteButton>
        </BottomRow>
      )}
    </ItemContainer>
  );
};

export default ReviewItem;
