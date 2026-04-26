# 억억억 Netlify 자동 업데이트 파일

폴더 구조:

eokeokeok
├─ index.html
├─ manifest.webmanifest
├─ sw.js
├─ icon-192.png
├─ icon-512.png
├─ package.json
├─ netlify.toml
└─ netlify
   └─ functions
      ├─ update-lotto.mjs
      └─ lotto-data.mjs

설명:
- update-lotto.mjs: 매주 토요일 한국시간 22:30에 동행복권 최신 회차를 조회해서 Netlify Blobs에 저장
- lotto-data.mjs: 앱에서 최신 회차 데이터를 읽을 때 사용하는 함수 주소

배포 후 확인:
1. Netlify에 폴더 전체 재업로드
2. Functions 탭에서 update-lotto가 Scheduled로 보이는지 확인
3. 아래 주소 접속 확인:
   https://너의주소.netlify.app/.netlify/functions/lotto-data

주의:
- 자동 실행은 published deploy에서만 동작
- 처음에는 Functions 탭에서 update-lotto를 Run now로 한 번 실행해도 됨
