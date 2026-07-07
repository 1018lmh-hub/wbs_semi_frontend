// src/lib/userApi.js
import api from "../api/axios";

export const fetchUserProfile = async () => {
  const res = await api.get("/users");
  return res.data.data;
};

export const updateUserNickname = async (newNickname) => {
  const res = await api.patch("/users", { newNickname });
  return res.data;
};

// 프로필 이미지 변경 — file은 필수 (null 요청 자체를 프론트에서 막음, 컨트롤러도 required=true로 변경됨)
// SignUp과 동일하게 key는 "file" (@RequestParam(name="file"))
export const updateUserProfile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.patch("/users/profile", formData);
  return res.data; // { code, message, data: null } — 응답에 이미지 URL이 없어 재조회 필요
};

// 프로필 삭제 (기본 이미지로 되돌리기) — DELETE /users/profile
export const deleteUserProfile = async () => {
  const res = await api.delete("/users/profile");
  return res.data;
};

// 비밀번호 변경 — 백엔드 DTO: { userPwd(기존), newPwd(신규) }
export const updateUserPwd = async (userPwd, newPwd) => {
  const res = await api.patch("/users/password", { userPwd, newPwd });
  return res.data;
};

// 회원탈퇴 (논리적 삭제) — 백엔드 DTO: { userPwd }
export const deleteUser = async (userPwd) => {
  const res = await api.delete("/users", { data: { userPwd } });
  return res.data;
};
