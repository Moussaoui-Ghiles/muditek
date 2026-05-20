import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "This workbench needs SerpAPI connected before it can run live searches.",
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

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(max));
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `SerpAPI request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 }
    );
  }

  const data = await response.json();
  const results = Array.isArray(data.organic_results)
    ? data.organic_results.slice(0, max).map((item: Record<string, unknown>) => ({
        title: typeof item.title === "string" ? item.title : "",
        link: typeof item.link === "string" ? item.link : "",
        snippet: typeof item.snippet === "string" ? item.snippet : "",
      })).filter((item: { title: string; link: string }) => item.title && item.link)
    : [];

  return NextResponse.json({ query, results });
}
