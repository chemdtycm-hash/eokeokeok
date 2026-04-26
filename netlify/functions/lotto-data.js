import { getStore } from "@netlify/blobs";

const FALLBACK = {
  round: 1221,
  date: "2026-04-25",
  numbers: [3, 28, 31, 32, 42, 45],
  bonus: null,
  source: "fallback",
  fetchedAt: null
};

export default async () => {
  const store = getStore("lotto");
  let latest = null;

  try {
    latest = await store.get("latest", { type: "json" });
  } catch (error) {
    latest = null;
  }

  if (!latest) latest = FALLBACK;

  return new Response(JSON.stringify({
    ok: true,
    latest
  }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
};
