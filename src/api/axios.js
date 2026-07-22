import axios from "axios";
const BASE_URL = "http://localhost:8008/api";
const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config: original, response } = err;
    if (response.status !== 401) {
      return Promise.reject(err);
    }
    const isExpired = String(response.data.message).includes(
      "만료된 토큰입니다.",
    );
    if (!isExpired || original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(original);
    } catch (e) {
      ["token", "refreshToken", "userId", "nickname", "role"].forEach((k) =>
        localStorage.removeItem(k),
      );
      sessionStorage.setItem("authExpired", "1");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(e);
    }
  },
);
export default api;
