// src/features/user/useAccountWithdrawal.js
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { deleteUser } from "../../lib/userApi";

const UNDO_DURATION = 8000; // 8초 - 후기 삭제와 동일한 취소 가능 시간

/**
 * "탈퇴 버튼 클릭 시 즉시 서버에 보내지 않고, 메인 화면으로 먼저 이동시킨 뒤
 * 8초 동안 취소하지 않으면 그때 실제 DELETE 요청 + 로그아웃을 확정하는" 지연 탈퇴 로직.
 * useReviewDeletion.js와 동일한 패턴이나, 리스트에서 숨길 항목이 없으므로
 * pendingIds 없이 타이머 예약/취소만 관리함.
 */
export function useAccountWithdrawal() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const timerRef = useRef(null);

  // 8초가 지나 실제로 탈퇴를 확정하는 함수
  const finalizeWithdrawal = useCallback(
    async (userPwd) => {
      timerRef.current = null;
      try {
        await deleteUser(userPwd);
        await logout();
      } catch (err) {
        showToast(
          err.response?.data?.message ?? "회원탈퇴에 실패했습니다.",
          "error",
        );
      }
    },
    [logout, showToast],
  );

  const requestWithdrawal = useCallback(
    (userPwd) => {
      // 탈퇴 확정 전이므로 로그인 상태는 그대로 유지한 채 메인으로 이동
      navigate("/");

      const timeoutId = setTimeout(() => {
        finalizeWithdrawal(userPwd);
      }, UNDO_DURATION);
      timerRef.current = timeoutId;

      showToast("회원탈퇴가 완료되었습니다.", "error", {
        duration: UNDO_DURATION,
        actionLabel: "작업취소",
        onAction: () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          // 서버 요청 자체가 안 나갔으므로 로그인 상태도 그대로 유지됨
        },
      });
    },
    [navigate, finalizeWithdrawal, showToast],
  );

  return { requestWithdrawal };
}
