import { NextResponse } from "next/server";

const HOST = "muditek.com";
const KEY = "95c23738d0fe72cb55203d9698fb8bcd";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// IndexNow protocol — instantly notify Bing/Yandex/Seznam of changed URLs.
// POST { urls: string[] }  → returns { ok, status }
// Auth: x-admin-key header must match ADMIN_KEY env var (or call from same origin during build).
export async function POST(req: Request) {
  const adminKey = process.env.ADMIN_KEY;
  const auth = req.headers.get("x-admin-key");
  if (adminKey && auth !== adminKey) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { urls?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const urls = (body.urls ?? []).filter((u) => typeof u === "string" && u.startsWith(`https://${HOST}`));
  if (urls.length === 0) {
    return NextResponse.json({ ok: false, error: "no valid urls" }, { status: 400 });
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls.slice(0, 10000),
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({ ok: res.ok, status: res.status, count: urls.length });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    host: HOST,
    keyLocation: KEY_LOCATION,
    usage: "POST { urls: string[] } with x-admin-key header to notify Bing/Yandex of changes.",
  });
}
