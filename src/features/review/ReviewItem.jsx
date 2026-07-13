import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ItemContainer,
  TopRow,
  ProfileImage,
  TitleBlock,
  Title,
  NicknameRow,
  Nickname,
  RatingStars,
  Meta,
  LikeButton,
  HeartIcon,
  DateText,
  ContentText,
  BottomRow,
  EditButton,
  DeleteButton,
} from "./ReviewItem.style";
import { DEFAULT_PROFILE_IMAGE } from "../../lib/defaultProfileImage";
const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");
const renderRatingStars = (rating) => {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
};
const ReviewItem = ({
  review,
  variant = "list",
  onDeleteClick,
  onLikeClick,
  isLikePending,
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isBouncing, setIsBouncing] = useState(false);
  const isOwner = !!user && user.userId === review.userId;
  const handleLikeClick = () => {
    if (!isLoggedIn) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);
    onLikeClick?.(review);
  };
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
          <NicknameRow>
            <Nickname>{review.nickname}</Nickname>
            <RatingStars aria-label={`평점 ${review.rating}점`}>
              {renderRatingStars(review.rating)}
            </RatingStars>
          </NicknameRow>
        </TitleBlock>
        <Meta>
          <LikeButton
            type="button"
            onClick={handleLikeClick}
            disabled={!isLoggedIn || isLikePending}
            $liked={review.liked}
            aria-label={review.liked ? "좋아요 취소" : "좋아요"}
          >
            <HeartIcon $isBouncing={isBouncing}>
              {review.liked ? "♥" : "♡"}
            </HeartIcon>
            {review.likeCount}
          </LikeButton>
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
