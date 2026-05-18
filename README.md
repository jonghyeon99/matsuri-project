# 愛知祭 · 아이치 마츠리 가이드

일본 아이치현의 마츠리(축제) 정보를 한국어로 제공하는 웹사이트입니다.  
아이치현 공식 관광 사이트 [AichiNow](https://aichinow.pref.aichi.jp)의 이벤트 데이터를 자동으로 수집·번역하여 제공합니다.

🌐 **[사이트 바로가기](https://matsuri-project.vercel.app)**

---

## 주요 기능

- 현재 진행 중인 마츠리 및 곧 열릴 마츠리 목록
- 지역별 마츠리 검색
- 날짜별 마츠리 검색
- 키워드 검색
- 마츠리 상세 정보 모달 (Google Maps 지도 포함)
- 매주 월요일 자동 크롤링으로 최신 데이터 유지

---

## 기술 스택

### 프론트엔드
| 기술 | 설명 |
|------|------|
| Next.js 16 (App Router) | React 기반 프레임워크 |
| TypeScript | 타입 안전성 |
| Google Maps Embed API | 마츠리 장소 지도 표시 |
| Vercel | 배포 |

### 백엔드
| 기술 | 설명 |
|------|------|
| Java 21 | 언어 |
| Spring Boot | REST API 서버 |
| Spring Data JPA | ORM |
| PostgreSQL Driver | DB 연결 |
| Railway | 배포 |

### 데이터베이스
| 기술 | 설명 |
|------|------|
| PostgreSQL | 관계형 DB |
| Supabase | 클라우드 PostgreSQL 호스팅 |

### 크롤러
| 기술 | 설명 |
|------|------|
| Python 3.13 | 언어 |
| BeautifulSoup4 | HTML 파싱 |
| requests | HTTP 요청 |
| psycopg2 | PostgreSQL 연결 |
| Google Cloud Translation API | 일본어→한국어 번역 |
| python-dotenv | 환경변수 관리 |
| GitHub Actions | 매주 월요일 자동 실행 |

---

## 프로젝트 구조

```
matsuri-project/
├── .github/
│   └── workflows/
│       └── crawler.yml        # GitHub Actions 크롤러 자동화
├── frontend/                  # Next.js 프론트엔드
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MatsuriCard.tsx
│   │   │   ├── MatsuriSlider.tsx
│   │   │   ├── MatsuriModal.tsx
│   │   │   └── MatsuriDecor.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── region/            # 지역별 검색
│   │   ├── date/              # 날짜별 검색
│   │   ├── search/            # 키워드 검색
│   │   ├── page.tsx           # 메인 홈
│   │   └── layout.tsx
│   └── .env.local             # 환경변수 (로컬)
├── backend/                   # Spring Boot 백엔드
│   └── src/main/
│       ├── java/com/matsuri/backend/
│       │   ├── entity/Matsuri.java
│       │   ├── repository/MatsuriRepository.java
│       │   └── controller/MatsuriController.java
│       └── resources/
│           └── application.yml
└── crawler/                   # Python 크롤러
    ├── crawler.py
    ├── requirements.txt
    └── .env                   # 환경변수 (로컬)
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/matsuris` | 전체 마츠리 목록 |
| GET | `/api/matsuris/ongoing` | 현재 진행 중인 마츠리 |
| GET | `/api/matsuris/upcoming` | 곧 열릴 마츠리 |
| GET | `/api/matsuris/cities` | 도시 목록 |
| GET | `/api/matsuris/city/{city}` | 도시별 마츠리 |
| GET | `/api/matsuris/date/{date}` | 날짜별 마츠리 |
| GET | `/api/matsuris/search?keyword=` | 키워드 검색 |
| GET | `/api/matsuris/{id}` | 마츠리 상세 |

---

## 환경변수 설정

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=https://your-railway-url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### backend/application.yml
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
```

### crawler/.env
```
DB_HOST=your-supabase-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=your-db-user
DB_PASSWORD=your-db-password
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key
```

---

## 자동 크롤링

GitHub Actions를 통해 **매주 월요일 오전 3시 (KST)** 에 자동으로 크롤링이 실행됩니다.  
앞으로 3개월치의 마츠리 데이터를 수집·번역하여 Supabase DB에 저장합니다.

수동 실행은 GitHub 저장소 → Actions → Weekly Crawler → Run workflow로 가능합니다.

---

## 데이터 출처

- **AichiNow** (愛知県観光コンベンション局): https://aichinow.pref.aichi.jp
- 번역: Google Cloud Translation API

---

## 브랜치 전략

```
main   → 배포 브랜치 (Railway, Vercel 자동 배포)
dev    → 개발 브랜치
feature/xxx → 기능 개발 브랜치
```
