---


# Plug-In

<img width="1915" height="945" alt="image" src="https://github.com/user-attachments/assets/08fad005-72f6-45f3-aa73-4b18ba644603" />

---

## 프로젝트 개요

### 1. 프로젝트 목적

> 전기차 충전소에 후기를 남기는 커뮤니티

기존 공공 충전소 지도 서비스(예: EV맵)는 위치·상태 등 정형 정보 제공에 그쳐, 실제 대기시간·고장 빈도·이용 만족도 같은 비정형 경험 정보는 확인할 수 없었습니다.
전기차 보급 확대로 충전소 이용 수요가 지속 증가하는 상황에서, 기존 지도 서비스 위에 '후기 공유' 기능을 결합해 정보 비대칭을 해소하고자 본 프로젝트를 기획했습니다.

### 2. 기간

`2026.06.16 ~ 2026.07.15`

### 3. 팀 구성

팀명 : 일단 만들조<br />
인원 : 박경환, 이명훈

| 이름   | 역할       | 담당                                                                                                                                                                                                                                                                  |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 공통   | Full-stack | **[BE]** 외부 API(한국전력) 연동, 인증/인가(JWT 발급, 회원가입 유효성 검사·중복확인, 토큰 재발급), 라즈베리파이 실시간 데이터 연동, 후기 CRUD<br>**[FE]** 충전소 지도 렌더링/마커·클러스터링, 로그인·회원가입·마이페이지 화면, 후기 CRUD, 실시간 혼잡도 차트, QA 진행 |
| 박경환 | Full-stack | **[BE/FE]** 마이페이지(정보조회·수정, 비밀번호 변경, 프로필수정, 회원탈퇴), 충전소 즐겨찾기 등록/삭제, 후기 좋아요 등록/삭제 **[BE]** 문의게시판 댓글 CRUD                                                                                                            |
| 이명훈 | Full-stack | **[BE/FE]** 공지게시판, 문의게시판 CRUD, 라즈베리 파이 데이터 시뮬레이션 설계 **[FE]** 문의게시판 댓글 CRUD                                                                                                                                                           |

### 4. 프로젝트 결과

공공기관 서비스가 제공하지 못한 '실제 이용 경험'을 후기·별점 기반의 정성적 지표로 채워, 이용자가 방문 전 충전소 상태를 신뢰도 높게 가늠할 수 있도록 했습니다. 
이를 통해 정형 정보만으로는 알 수 없었던 대기시간·고장 빈도·만족도 정보를 커뮤니티 안에서 투명하게 공유하는 것을 목표로 합니다.

---

## 기술스택

### 1. Front

![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22.22.3-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

### 2. Back

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.16-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)

### 3. DB

![Oracle](https://img.shields.io/badge/Oracle_21_XE-F80000?style=for-the-badge&logo=oracle&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-3.5.15-DA1F31?style=for-the-badge)
![ERDCloud](https://img.shields.io/badge/ERDCloud-4A90D9?style=for-the-badge)

### 4. ETC

![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![GitHub Projects](https://img.shields.io/badge/GitHub_Projects-181717?style=for-the-badge&logo=github&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![draw.io](https://img.shields.io/badge/draw.io-F08705?style=for-the-badge&logo=diagramsdotnet&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)

---

## 아키텍처

<img width="1672" height="941" alt="ChatGPT Image 2026년 7월 16일 오후 12_05_24" src="https://github.com/user-attachments/assets/b0cfb6b8-62b8-425f-b136-d439970006c6" />

---

## 주요 기능

### 1. 충전소 지도 조회
> 지도위에 전기차 충전소 위치를 제공
<img width="1916" height="945" alt="image" src="https://github.com/user-attachments/assets/6e572574-19bb-4a5d-a082-b7ee9672db7e" />

 - Naver Maps JS API를 이용하여 지도(커스터 마이징)를 기본 배경으로 구성<br/>
 - 외부 API(한국전력 공공 API)를 연동해 실제 충전소 위치·상세 정보를 지도 위에 매핑(커스터 마이징 마커)<br/>
 - 사용자가 줌 인/아웃시에 충전소 가독성을 향상을 위한 클러스터링 구현<br/>
  
  

### 2. JWT기반 회원 인증
> JWT를 이용한 회원의 인증/인가 검증
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/37877be1-77bc-4dbb-9304-6f5aeb50b5ee" />

 - Access·Refresh 토큰을 발급<br/>
 - Refresh 토큰을 이용해 Access 토큰 만료시 재발급(Rotation)<br/>
 - Axios 인터셉터를 통한 자동 토큰 갱신<br/>
 - JWT filter를 이용해 JWT토큰 검증<br/>
 - 로그인이 필요한 기능에 대한 Spring SecurityFilterChain를 이용<br/>


### 3. 핵심 MVP

충전소 상세보기(가용한 충전기 수, 충전기 타입, 현재 충전기 사용여부, 평균 별점 등), 사용자가 이용한 충전소에 대한 후기, 별점 작성 / 다른 사용자가 남긴 후기 조회(페이징 처리, 정렬 처리(좋아요순, 최신)) / 자신이 남긴 후기에 대한 수정/삭제



### 4. 추가 기능

#### 1. 마이페이지
 - 마이페이지를 통한 자신의 유저정보 조회, 수정, 프로필 등록 및 변경, 회원탈퇴<br/>

#### 2. 공지게시판

#### 3. 문의게시판

#### 4. 충전소 즐겨찾기 / 후기 좋아요
 - 자신이 자주 가는 충전소 즐겨찾기 등록 및 삭제 / 즐겨찾기한 충전소만 모아보기 <br/>
 - 충전소 후기에 대한 좋아요 등록 및 삭제, 게시물 좋아요순 / 최신순으로 조회 <br/>

---

## 실행 방법

```bash

```

### 환경 변수 예시

```

```

---

## 라이선스
