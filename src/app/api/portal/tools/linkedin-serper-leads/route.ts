import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "This workbench needs Serper connected before it can run live searches.",
        setupRequired: true,
      },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const role = typeof body?.role === "string" ? body.role.trim() : "";
  const market = typeof body?.market === "string" ? body.market.trim() : "";
  const company = typeof body?.company === "string" ? body.company.trim() : "";
  const max = Math.min(Math.max(Number(body?.max) || 10, 1), 20);

  if (!role && !market && !company) {
    return NextResponse.json({ error: "Add at least one search field." }, { status: 400 });
  }

  const query = [
    "site:linkedin.com/in",
    role,
    market,
    company ? `"${company}"` : "",
  ].filter(Boolean).join(" ");

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ q: query, num: max }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `Serper request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = await response.json();
  const results = Array.isArray(data.organic)
    ? data.organic.slice(0, max).map((item: Record<string, unknown>) => ({
        title: typeof item.title === "string" ? item.title : "",
        link: typeof item.link === "string" ? item.link : "",
        snippet: typeof item.snippet === "string" ? item.snippet : "",
      })).filter((item: { title: string; link: string }) => item.title && item.link)
    : [];

  return NextResponse.json({ query, results });
}
