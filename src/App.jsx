// src/App.jsx
import React from "react";

import { Routes, Route } from "react-router-dom";

// Layout & Global Components
import MainLayout from "./components/layout/MainLayout/MainLayout";
import RequireAuth from "./components/common/RequireAuth/RequireAuth";
import StationDetail from "./features/station/StationDetail";
import ReviewForm from "./features/review/ReviewForm";
import SignUp from "./features/user/SignUp";
import Login from "./features/user/Login";
import ReviewList from "./features/review/ReviewList";
import BoardLayout from "./features/board/BoardLayout";
import BoardHome from "./features/board/BoardHome";
import BoardList from "./features/board/BoardList";
import BoardDetail from "./features/board/BoardDetail";
import BoardForm from "./features/board/BoardForm";
import MyPage from "./features/user/MyPage";
import MyPageEdit from "./features/user/MyPageEdit";
import MyPagePassword from "./features/user/MyPagePassword";
import MyPageWithdraw from "./features/user/MyPageWithdraw";
import BookmarkList from "./features/bookmark/BookmarkList";
import CongestionPanel from "./features/chart/CongestionPanel";

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
      <Route element={<MainLayout />}>
        <Route index element={null} />

        <Route path="congestion" element={<CongestionPanel />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />

        <Route element={<BoardLayout />}>
          <Route path="notices" element={<BoardList boardType="notice" />} />
          <Route
            path="notices/form"
            element={<BoardForm boardType="notice" />}
          />
          <Route
            path="notices/:noticeNo"
            element={<BoardDetail boardType="notice" />}
          />
          <Route
            path="notices/:noticeNo/edit"
            element={<BoardForm boardType="notice" />}
          />

          <Route path="inquirys" element={<BoardList boardType="inquiry" />} />
          <Route
            path="inquirys/form"
            element={<BoardForm boardType="inquiry" />}
          />
          <Route
            path="inquirys/:inquiryNo"
            element={<BoardDetail boardType="inquiry" />}
          />
          <Route
            path="inquirys/:inquiryNo/edit"
            element={<BoardForm boardType="inquiry" />}
          />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="myPage" element={<MyPage />} />
          <Route path="myPage/edit" element={<MyPageEdit />} />
          <Route path="myPage/password" element={<MyPagePassword />} />
          <Route path="myPage/withdraw" element={<MyPageWithdraw />} />
          <Route path="bookmarks" element={<BookmarkList />} />
        </Route>

        <Route path="stations/:stationId" element={<StationDetail />} />

        <Route
          path="stations/:stationId/reviews/form"
          element={<ReviewForm />}
        />
        <Route
          path="stations/:stationId/reviews/:reviewId/edit"
          element={<ReviewForm />}
        />
        <Route path="stations/:stationId/reviews" element={<ReviewList />} />

        <Route
          path="*"
          element={<DummyPage title="404 - 찾을 수 없는 페이지" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
