import axios from "axios";

const BASE_URL = "http://localhost/api";

const api = axios.create({ baseURL: BASE_URL });

/* 요청 인터셉터 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/*
  응답 인터셉터
  첫 번째 함수 : 응답이 성공(2XX)일 때 실행
  두 번째 함수 : 응답이 실패(2XX 아님 / 네트워크 에러)일 때 실행 => refresh로직을 끼워넣어야함
*/
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // err.config => "방금 실패한 요청에 대한 설정 정보 전체"
    // -> url, method, headers, params, data(body)
    // 이 정보를 가지고 있어야 우리가 실패한 요청 URL로 다시 요청을 보낼 수 있음

    const { config: original, response } = err;
    //console.log(original);
    // console.log(response);

    // 401이 아니면 걍 에러 반환
    if (response.status !== 401) {
      return Promise.reject(err);
    }
    // 만료가 아닌 401이 오면 빠이빠이
    const isExpired = String(response.data.message).includes(
      "만료된 토큰입니다.",
    );
    if (!isExpired || original._retry) {
      return Promise.reject(err);
    }

    original._retry = true;
    // _retry : 재시도한 요청이 또 401로 오면 이미 refresh한거다 요거를 알아채서 무한루프를 막는 용도

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      // 밑에 적는 코드
      // console.log(data);
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      // 막혔던 원래 요청을 시도
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(original); // 이 설정대로 다시 요청 보내줘
    } catch (e) {
      // refresh토큰도 만료 / 이상한게 -> 로그아웃
      ["token", "refreshToken", "userId", "nickname", "role"].forEach((k) =>
        localStorage.removeItem(k),
      );

      // 전체 새로고침(window.location.href)으로 이동하면 현재 React 트리(ToastProvider 포함)가
      // 모두 사라지므로, 여기서 직접 토스트를 띄울 수 없음.
      // 대신 세션에 플래그만 남기고, /login 페이지가 마운트될 때 그 플래그를 읽어서 토스트를 띄움.
      sessionStorage.setItem("authExpired", "1");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(e);
    }
  },
);

export default api;
