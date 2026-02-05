## DIBS
**럭셔리 & 한정판 쇼핑을 위한 프리미엄 리셀 플랫폼**

---

## 🗓️ 개발 기간
- 2025.11.30 ~ 현재

## Tech Stack

- **Core**: Spring Boot 3.4.1, Java 21
- **Security**: Spring Security, OAuth2 Client, JWT (Access/Refresh Token)
- **Database**: MySQL 8.4, Spring Data JPA
- **Optimization**: QueryDSL 5.0, MapStruct 1.6.3, Swagger(SpringDoc) 2.8.5
- **Infrastructure**: AWS S3, AWS CloudFront (OAC), AWS EC2, Redis, Docker, Caddy

---

## ✨ 핵심 기술 및 구현 기능

### 1. 인증 및 권한 관리 (Auth)
- [x] **OAuth2 소셜 로그인**: 카카오 등 소셜 계정을 통한 간편 로그인 구현
- [x] **JWT 보안**: Access Token(Header)과 Refresh Token(Redis 저장)을 이용한 보안 강화 및 로그아웃 처리
- [x] **RBAC (Role-Based Access Control)**: 일반 사용자(Buyer)와 판매자(Seller) 권한 분리 및 접근 제어

### 2. 판매자 센터 및 대시보드 (Seller Center)
- [x] **판매자 온보딩**: 사업자 정보 등록 및 심사 로직 (Pending -> Approved/Rejected)
- [x] **상품 라이프사이클 관리 (CRUD)**:
  - [x] AWS S3 연동 실시간 이미지 업로드
  - [x] 카테고리별 상품 등록 및 수정/삭제

### 3. 검색 기능
- [x] **동적 필터링 (QueryDSL)**: 카테고리, 키워드, 정렬 조건에 따른 검색 엔진 구현
- [x] **상품 상세**: 상태별(판매중, 준비중, 품절) 구매 버튼 활성화 제어

### 4. 장바구니 및 구매 프로세스 (Shopping Experience)
- [x] **장바구니**:
  - **QueryDSL 최적화**: 복잡한 조인 없이 필요한 데이터만 프로젝션(DTO)하여 조회 속도 개선

### 5. 성능 및 안정성 (Engineering)
- [x] **Redis 분산락**: 선착순 구매 및 재고 차감 시 발생하는 동시성 이슈(Race Condition) 해결
- [x] **동시성 검증**: 통합 테스트(Multi-threaded Integration Test) 기반의 100건 이상의 동시 주문 시뮬레이션을 통한 로직 안정성 및 데이터 정합성 확보 확인
- [ ] **인프라 최적화**: AWS CloudFront + OAC를 통한 S3 버킷 보안 및 콘텐츠 전송 가속화

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