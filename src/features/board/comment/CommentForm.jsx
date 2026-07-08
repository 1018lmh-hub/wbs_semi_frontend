// src/features/board/comment/CommentForm.jsx
import React, { useState } from "react";
import {
  FormWrap,
  Textarea,
  SubmitButton,
  FieldErrorText,
} from "./CommentForm.style";

const CONTENT_MAX = 500;

/**
 * 새 댓글 작성 폼. ROLE_ADMIN만 렌더되도록 부모(CommentList)에서 조건부 렌더.
 * Enter로 제출, Shift+Enter는 줄바꿈 (BoardForm과 동일 UX).
 */
const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (content.trim().length < 1 || content.length > CONTENT_MAX) {
      setError(`댓글은 1~${CONTENT_MAX}자 까지 입력가능합니다.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(content);
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message ?? "댓글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <FormWrap>
      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder="답변을 입력해주세요 (Enter로 등록, Shift+Enter로 줄바꿈)"
        maxLength={CONTENT_MAX}
        $hasError={!!error}
      />
      {error && <FieldErrorText>{error}</FieldErrorText>}
      <SubmitButton
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "등록 중..." : "답변 등록"}
      </SubmitButton>
    </FormWrap>
  );
};

export default CommentForm;
