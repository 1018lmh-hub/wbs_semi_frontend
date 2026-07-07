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
import { DEFAULT_PROFILE_IMAGE } from "../../lib/defaultProfileImage";

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
