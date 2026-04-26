import { getStore } from "@netlify/blobs";

const FIRST_DRAW_DATE = new Date("2002-12-07T12:00:00Z"); // 로또 1회 기준 토요일
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function estimateLatestRound() {
  const now = new Date();
  const diff = Math.floor((now - FIRST_DRAW_DATE) / ONE_WEEK);
  return Math.max(1, diff + 1);
}

async function fetchRound(round) {
  const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
const res = await fetch(url, {
  headers: {
    "user-agent": "Mozilla/5.0",
    "accept": "application/json"
  }
});

const text = await res.text();

// JSON인지 확인
if (!text.startsWith("{")) {
  throw new Error("API 응답이 JSON이 아님 (차단됨)");
}

const data = JSON.parse(text);
  if (data.returnValue !== "success") return null;

  return {
    round: Number(data.drwNo),
    date: data.drwNoDate,
    numbers: [
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6
    ].map(Number),
    bonus: Number(data.bnusNo),
    source: "dhlottery",
    fetchedAt: new Date().toISOString()
  };
}

async function findLatestRound() {
  const estimate = estimateLatestRound();

  for (let round = estimate + 2; round >= Math.max(1, estimate - 12); round--) {
    const result = await fetchRound(round);
    if (result) return result;
  }

  throw new Error("최신 회차를 찾지 못했습니다.");
}

export default async () => {
  const latest = await findLatestRound();

  const store = getStore("lotto");
  await store.setJSON("latest", latest);

  return new Response(JSON.stringify({
    ok: true,
    message: "latest lotto result updated",
    latest
  }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
};

// 한국 토요일 추첨 후 여유 있게: 매주 토요일 13:30 UTC = 한국 토요일 22:30
export const config = {
  schedule: "30 13 * * 6"
};
