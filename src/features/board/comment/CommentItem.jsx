// src/features/board/comment/CommentItem.jsx
import React, { useState } from "react";
import {
  ItemContainer,
  TopRow,
  Nickname,
  DateText,
  ContentText,
  BottomRow,
  EditButton,
  DeleteButton,
  EditForm,
  EditTextarea,
  EditButtonRow,
  SaveButton,
  CancelButton,
  FieldErrorText,
} from "./CommentItem.style";

const CONTENT_MAX = 500;
const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");

/**
 * 댓글 한 건.
 * - 수정: 인라인으로 textarea 전환 (별도 페이지/모달 없이 카드 내부에서 바로 편집)
 * - 삭제: 확인 없이 즉시 요청 (댓글은 8초 지연삭제 대상 아님 - 게시글과 달리 가벼운 액션으로 판단)
 */
const CommentItem = ({ comment, canManage, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.commentContent);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = () => {
    setContent(comment.commentContent);
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (content.trim().length < 1 || content.length > CONTENT_MAX) {
      setError(`댓글은 1~${CONTENT_MAX}자 까지 입력가능합니다.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdate(comment.commentNo, content);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message ?? "댓글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    onDelete(comment.commentNo);
  };

  if (isEditing) {
    return (
      <ItemContainer>
        <TopRow>
          <Nickname>{comment.nickname}</Nickname>
          <DateText>{formatDate(comment.createDate)}</DateText>
        </TopRow>
        <EditForm>
          <EditTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={CONTENT_MAX}
            $hasError={!!error}
          />
          {error && <FieldErrorText>{error}</FieldErrorText>}
          <EditButtonRow>
            <CancelButton type="button" onClick={handleCancel}>
              취소
            </CancelButton>
            <SaveButton
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </SaveButton>
          </EditButtonRow>
        </EditForm>
      </ItemContainer>
    );
  }

  return (
    <ItemContainer>
      <TopRow>
        <Nickname>{comment.nickname}</Nickname>
        <DateText>{formatDate(comment.createDate)}</DateText>
      </TopRow>
      <ContentText>{comment.commentContent}</ContentText>
      {canManage && (
        <BottomRow>
          <EditButton type="button" onClick={handleEditClick}>
            수정
          </EditButton>
          <DeleteButton type="button" onClick={handleDelete}>
            삭제
          </DeleteButton>
        </BottomRow>
      )}
    </ItemContainer>
  );
};

export default CommentItem;
