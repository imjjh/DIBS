## DIBS
**럭셔리 & 한정판 쇼핑을 위한 프리미엄 리셀 플랫폼**

---

## 🗓️ 개발 기간
- 2025.11.30 ~ 현재

## Tech Stack

- **Core**: Spring Boot 3.4.1, Java 21
- **Security**: Spring Security, OAuth2 Client, JWT (Access/Refresh Token)
- **Database**: MySQL 8.4, Spring Data JPA
- **Optimization**: **QueryDSL 5.0**, MapStruct 1.6.3, Swagger(SpringDoc) 2.8.5
- **Infrastructure**: AWS S3, **AWS CloudFront (OAC)**, AWS EC2, Redis, Docker, Caddy, Github Actions (CI/CD)

---

## ✨ 핵심 기술 및 구현 기능

### 1. 인증 및 권한 관리 (Auth)
- [x] **OAuth2 소셜 로그인**: 카카오 등 소셜 계정을 통한 간편 로그인 구현
- [x] **JWT 보안**: Access Token(Header)과 Refresh Token(Redis 저장)을 이용한 보안 강화 및 로그아웃 처리
- [x] **RBAC (Role-Based Access Control)**: 일반 사용자(Buyer)와 판매자(Seller) 권한 분리 및 접근 제어

### 2. 판매자 센터 및 대시보드 (Seller Center)
- [x] **판매자 온보딩**: 사업자 정보 등록 및 심사 로직 (Pending -> Approved/Rejected)
- [ ] **인사이트 대시보드**: 누적 매출액, 등록 상품 수, 방문자 수 등 통계 요약
- [ ] **상품 라이프사이클 관리 (CRUD)**:
  - [x] AWS S3 연동 실시간 이미지 업로드
  - [x] 카테고리별 상품 등록 및 수정/삭제
  - [ ] **상품 상세 인사이트**: 조회수, 좋아요, 최근 판매 로그(Recent Sales) 시각화

### 3. 검색 기능
- [x] **동적 필터링 (QueryDSL)**: 카테고리, 키워드, 정렬 조건에 따른 검색 엔진 구현
- [x] **상품 상세**: 상태별(판매중, 준비중, 품절) 구매 버튼 활성화 제어

### 4. 동시성 및 결제 (InProgress)
- [ ] **Redis 분산락**: 선착순 구매 시 발생하는 동시성 이슈를 해결하기 위한 분산락 설계
- [ ] **주문 및 결제 흐름**: 장바구니부터 주문 완료까지의 트랜잭션 처리
- [ ] **성능 테스트**: JMeter를 활용한 트래픽 시뮬레이션 및 병목 지점 개선 예정

---

## 🏗️ Architecture (Planned)
- **Infrastructure**: 
  - **CloudFront**: 전역 CDN 배포, SSL(ACM) 처리 및 캐싱 최적화
  - **Caddy**: 리버스 프록시를 통한 서비스 분기 및 내부 HTTPS 관리
  - **Docker**: 서비스 컨테이너화 및 운영 환경 관리
- **Traffic Flow**: 
  - **Data Flow**: User ➜ **CloudFront** ➜ **Caddy** ➜ **Next.js (BFF)** ➜ **Spring Boot**
  - **Auth Flow**: User ➜ **CloudFront** ➜ **Caddy** ➜ **Spring Boot** (OAuth2 인증 시 직접 통신)
- **Media Delivery**:
  - User ➜ **CloudFront (OAC)** ➜ **S3** (보안 이미지 스토리지)
- **CI/CD**: Github Actions를 통한 빌드 및 배포 자동화 구현