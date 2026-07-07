// src/App.jsx
import React from "react";

import { Routes, Route } from "react-router-dom";

// Layout & Global Components
import MainLayout from "./components/layout/MainLayout/MainLayout";
import StationDetail from "./features/station/StationDetail";
import ReviewForm from "./features/review/ReviewForm";
import SignUp from "./features/user/SignUp";
import Login from "./features/user/Login";
import ReviewList from "./features/review/ReviewList";
import MyPage from "./features/user/MyPage";
import MyPageEdit from "./features/user/MyPageEdit";
import MyPagePassword from "./features/user/MyPagePassword";
import MyPageWithdraw from "./features/user/MyPageWithdraw";

// 화면 레이아웃 및 중첩 라우팅 테스트를 위한 임시(Dummy) 컴포넌트
const DummyPage = ({ title }) => (
  <div
    style={{
      padding: "24px",
      color: "#FFFFFF",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}
  >
    <h2>{title} 페이지</h2>
    <p>사이드바 내부 라우팅 전환 테스트 화면입니다.</p>
    <p>배경의 지도가 리렌더링되지 않고 유지되는지 확인하십시오.</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* 부모 라우트: Header와 Map을 포함하는 전역 레이아웃 */}
      <Route element={<MainLayout />}>
        {/* 기본 경로 (/): 오버레이 컨텐츠 없이 지도만 노출 */}
        <Route index element={null} />

        {/* 임시 라우트 연결 (URL 변경 시 오버레이 영역에 표출) */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="myPage" element={<MyPage />} />
        <Route path="myPage/edit" element={<MyPageEdit />} />
        <Route path="myPage/password" element={<MyPagePassword />} />
        <Route path="myPage/withdraw" element={<MyPageWithdraw />} />
        <Route path="boards" element={<DummyPage title="게시판 목록" />} />

        {/* 신규 추가: 지도 마커 클릭 시 이동하는 충전소 상세 라우트 */}
        <Route path="stations/:stationId" element={<StationDetail />} />
        {/* 신규 추가: StationDetail/후기 전체보기의 "후기 작성" 버튼에서 이동 */}
        <Route
          path="stations/:stationId/reviews/form"
          element={<ReviewForm />}
        />
        <Route
          path="stations/:stationId/reviews/:reviewId/edit"
          element={<ReviewForm />}
        />
        <Route path="stations/:stationId/reviews" element={<ReviewList />} />

        {/* 404 라우트 */}
        <Route
          path="*"
          element={<DummyPage title="404 - 찾을 수 없는 페이지" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
