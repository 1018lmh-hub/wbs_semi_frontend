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
import BoardHome from "./features/board/BoardHome";

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

        {/* 게시판 선택 화면 (공지/문의) */}
        <Route path="boards" element={<BoardHome />} />

        {/* 공지사항 라우트 (목록/상세/작성/수정 컴포넌트는 다음 세션에서 구현, 지금은 Dummy) */}
        <Route path="notices" element={<DummyPage title="공지사항 목록" />} />
        <Route
          path="notices/form"
          element={<DummyPage title="공지사항 작성" />}
        />
        <Route
          path="notices/:noticeNo"
          element={<DummyPage title="공지사항 상세" />}
        />
        <Route
          path="notices/:noticeNo/edit"
          element={<DummyPage title="공지사항 수정" />}
        />

        {/* 문의게시판 라우트 (동일하게 Dummy) */}
        <Route
          path="inquiries"
          element={<DummyPage title="문의게시판 목록" />}
        />
        <Route
          path="inquiries/form"
          element={<DummyPage title="문의글 작성" />}
        />
        <Route
          path="inquiries/:inquiryNo"
          element={<DummyPage title="문의글 상세" />}
        />
        <Route
          path="inquiries/:inquiryNo/edit"
          element={<DummyPage title="문의글 수정" />}
        />

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
