import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { deleteUser } from "../../lib/userApi";
const UNDO_DURATION = 8000;
export function useAccountWithdrawal() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const timerRef = useRef(null);
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
        },
      });
    },
    [navigate, finalizeWithdrawal, showToast],
  );
  return { requestWithdrawal };
}
