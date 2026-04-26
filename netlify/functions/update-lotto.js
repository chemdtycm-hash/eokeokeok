import { getStore } from "@netlify/blobs";

async function fetchLatest() {
  const url = "https://smok95.github.io/lotto/results/latest.json";

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 eokeokeok-lotto",
      "accept": "application/json"
    }
  });

  const data = await res.json();

  return {
    round: Number(data.no ?? data.round ?? data.drwNo),
    date: data.date ?? data.drwNoDate ?? "",
    numbers: (data.numbers ?? data.nums ?? [
      data.drwtNo1, data.drwtNo2, data.drwtNo3,
      data.drwtNo4, data.drwtNo5, data.drwtNo6
    ]).slice(0, 6).map(Number),
    bonus: Number(data.bonus ?? data.bnusNo ?? data.numbers?.[6] ?? 0),
    source: "smok95-github-json",
    fetchedAt: new Date().toISOString()
  };
}

export default async () => {
  const latest = await fetchLatest();

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

export const config = {
  schedule: "30 13 * * 6"
};
