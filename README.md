# just-landing

JUST 동아리 랜딩 페이지 (React + Vite, GitHub Pages + Firebase Firestore).

## 개발

```bash
npm install
npm run dev
```

`main`에 push하면 GitHub Actions가 빌드해서 Pages에 배포합니다.
(최초 1회: 레포 Settings → Pages → Source를 **GitHub Actions**로 설정)

## 백오피스

- 들어가기: 사이트 맨 아래 `Just` 로고를 빠르게 5번 클릭 (또는 주소 뒤에 `#/admin`)
- 로그인 없이 년도 / PRIZE / PROJECT 수정. 저장하면 **즉시** 사이트에 반영 (재배포 없음)
- ⚠️ Firestore가 누구나 쓰기 가능한 상태 (운영진이 감수하기로 결정). 데이터가 망가지면 `site/main`·`projects`를 지우고 "기존 데이터 가져오기"로 복구
- 연간 일정 문구는 Firebase 콘솔 → Firestore → `site/main` 문서의 `yearSteps`에서 수정 (`{기수}`는 2022년=1기 기준 기수, `{다음연도}`는 년도 + 1로 표시됨)

## Firebase 최초 설정 (1회)

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성 (무료 Spark 요금제로 충분)
2. 프로젝트 설정 → 내 앱 → 웹 앱 추가 → 설정값(`apiKey`, `projectId`, `appId`)을 `src/lib/firebase.js`에 입력
3. Firestore Database 만들기 (프로덕션 모드) → 규칙 탭에 `firestore.rules` 내용 붙여넣고 게시
4. 백오피스 들어가서 "기존 데이터 가져오기" 한 번 클릭

설정 전에는 `src/data/site.json`으로 사이트가 그대로 동작합니다.

## 코드에서 직접 바꾸는 것

홈 문구(`src/pages/Home.jsx`), Q&A(`src/pages/Qna.jsx`), SNS 링크(`src/Layout.jsx`)
