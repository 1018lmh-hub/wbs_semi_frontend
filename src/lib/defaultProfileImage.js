// src/lib/defaultProfileImage.js
// 프로필 이미지가 없는 경우 공통으로 사용하는 기본 프로필 (ReviewItem, MyPage 등에서 공유)
export const DEFAULT_PROFILE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'>` +
      `<rect width='40' height='40' rx='20' fill='#243754'/>` +
      `<circle cx='20' cy='16' r='7' fill='#8A99AD'/>` +
      `<path d='M6 34c0-8 6-12 14-12s14 4 14 12' fill='#8A99AD'/>` +
      `</svg>`,
  );
