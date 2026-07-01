// src/App.jsx
import React from "react";

import { Routes, Route } from "react-router-dom";

// Layout & Global Components
import MainLayout from "./components/layout/MainLayout/MainLayout";
import Map from "./features/map/Map"; // 테스트 중이므로 Map 컴포넌트 import 유지 (현재 MainLayout 내부에서 직접 렌더링 중)

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
        {/* 기본 경로 (/): 사이드바 컨텐츠 없이 지도만 노출 */}
        <Route index element={null} />

        {/* 임시 라우트 연결 (URL 변경 시 사이드바 영역에 표출) */}
        <Route path="login" element={<DummyPage title="로그인" />} />
        <Route path="signup" element={<DummyPage title="회원가입" />} />
        <Route path="boards" element={<DummyPage title="게시판 목록" />} />

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
