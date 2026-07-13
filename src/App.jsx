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
      {/* 부모 라우트: Header와 Map을 포함하는 전역 레이아웃 */}
      <Route element={<MainLayout />}>
        {/* 기본 경로 (/): 오버레이 컨텐츠 없이 지도만 노출 */}
        <Route index element={null} />

        <Route path="congestion" element={<CongestionPanel />} />

        {/* 임시 라우트 연결 (URL 변경 시 오버레이 영역에 표출) */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />

        {/* 공지사항 / 문의게시판: 상단 탭(BoardLayout)으로 서로 이동 가능하게 중첩 라우팅
            "게시판" 헤더 버튼은 항상 이 그룹의 기본 진입점인 /notices로 이동 */}
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

          {/* 백엔드 표기 "inquirys"에 맞춰 경로 통일, 표시 텍스트는 한글 유지 */}
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

        {/* 마이페이지 계열: RequireAuth로 묶어서 비로그인 시 URL 직접 접근을 차단.
            (기존에는 MyPage.jsx에만 개별 체크가 있어 edit/password/withdraw는
            URL로 바로 진입 가능한 취약점이 있었음) */}
        <Route element={<RequireAuth />}>
          <Route path="myPage" element={<MyPage />} />
          <Route path="myPage/edit" element={<MyPageEdit />} />
          <Route path="myPage/password" element={<MyPagePassword />} />
          <Route path="myPage/withdraw" element={<MyPageWithdraw />} />
          <Route path="bookmarks" element={<BookmarkList />} />
        </Route>

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
