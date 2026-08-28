import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type UnknownRecord = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toArray(value: unknown): UnknownRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
}

function normalizeLead(item: UnknownRecord) {
  return {
    name: [text(item.firstName), text(item.lastName)].filter(Boolean).join(" "),
    jobTitle: text(item.jobTitle) || text(item.title) || text(item["title "]) || "",
    emailAddress: text(item.emailAddress) || text(item.email) || text(item.personalEmail) || "",
    phone: text(item.phone) || text(item.workPhone) || text(item.phoneNumber) || "",
    location: text(item.location) || text(item.city) || text(item.country) || "",
    companyName: text(item.companyName) || text(item.company) || "",
    websiteURL: text(item.websiteURL) || text(item.website) || "",
    linkedInURL: text(item.linkedInURL) || text(item.linkedinURL) || text(item.linkedin) || "",
  };
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error: "This workbench needs Apify connected before it can run live enrichment.",
        setupRequired: true,
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const inputUrl = typeof body?.url === "string" ? body.url.trim() : "";
  const maxRecords = Math.min(Math.max(Number(body?.maxRecords) || 10, 1), 100);

  if (!inputUrl) {
    return NextResponse.json({ error: "LinkedIn URL or company URL is required." }, { status: 400 });
  }

  try {
    new URL(inputUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
  }

  const actor = process.env.APIFY_APOLLO_ACTOR_ID || "code_crafter~apollo-io-scraper";
  const actorPath = actor.replace("/", "~");
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorPath)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=180`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      getPersonalEmails: true,
      getWorkEmails: true,
      totalRecords: maxRecords,
      url: inputUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `Apify request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const bodyJson = await response.json();
  const items = Array.isArray(bodyJson)
    ? bodyJson
    : Array.isArray(bodyJson?.items)
      ? bodyJson.items
      : Array.isArray(bodyJson?.data)
        ? bodyJson.data
        : [];
  const results = toArray(items).map(normalizeLead).filter((lead) => lead.name || lead.emailAddress || lead.linkedInURL);

  return NextResponse.json({
    inputUrl,
    actor: actor,
    maxRecords,
    results,
  });
}
