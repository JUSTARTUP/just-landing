# just-landing

JUST 동아리 랜딩 페이지 (React + Vite, GitHub Pages).

## 개발

```bash
npm install
npm run dev      # 로컬 개발 서버
npm test         # 백오피스 base64 인코딩 셀프체크
```

`main`에 push하면 GitHub Actions가 빌드해서 Pages에 배포합니다.
(최초 1회: 레포 Settings → Pages → Source를 **GitHub Actions**로 설정)

## 매년 인수인계할 때

**코드 수정 없이 백오피스에서 바꾸는 것** — `src/data/site.json`
- 년도 (메뉴, 연간 일정 페이지, 홈 커리큘럼 제목, "JUST의 N년")
- 연간 일정 단계
- PRIZE / PROJECT 목록 (프로젝트 이미지는 `public/projects/`에 올라감)

**백오피스 들어가는 법**
1. 사이트 맨 아래 푸터의 `Just` 로고를 빠르게 10번 클릭 (또는 주소 뒤에 `#/admin`)
2. GitHub → Settings → Developer settings → Fine-grained tokens에서
   `JUSTARTUP/just-landing` 레포 **Contents: Read and write** 권한 토큰 발급
3. 토큰 입력 → 불러오기 → 수정 → 저장하고 배포하기 (1~2분 뒤 반영)

토큰이 곧 관리자 권한이라, 다음 운영진은 레포 collaborator로 추가해 주세요.

**코드에서 직접 바꾸는 것** — 홈 문구(`src/pages/Home.jsx`), Q&A(`src/pages/Qna.jsx`), SNS 링크(`src/Layout.jsx`)
