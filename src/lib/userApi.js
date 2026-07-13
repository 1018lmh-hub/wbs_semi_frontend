import api from "../api/axios";
export const fetchUserProfile = async () => {
  const res = await api.get("/users");
  return res.data.data;
};
export const updateUserNickname = async (newNickname) => {
  const res = await api.patch("/users", { newNickname });
  return res.data;
};
export const updateUserProfile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.patch("/users/profile", formData);
  return res.data;
};
export const deleteUserProfile = async () => {
  const res = await api.delete("/users/profile");
  return res.data;
};
export const updateUserPwd = async (userPwd, newPwd) => {
  const res = await api.patch("/users/password", { userPwd, newPwd });
  return res.data;
};
export const deleteUser = async (userPwd) => {
  const res = await api.delete("/users", { data: { userPwd } });
  return res.data;
};
