import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Simple in-memory rate limiter: max 5 submissions per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  // Rate limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { name, email, campaignId, comment } = body;

  if (!name || !email || !campaignId) {
    return NextResponse.json(
      { error: "Name, email, and campaignId are required" },
      { status: 400 }
    );
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  const sql = getDb();

  // Check campaign exists, is active, and not expired
  const campaigns = await sql`
    SELECT id, title FROM campaigns
    WHERE id = ${campaignId}
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  `;

  if (campaigns.length === 0) {
    return NextResponse.json(
      { error: "This campaign is no longer active" },
      { status: 400 }
    );
  }

  // Upsert submission
  await sql`
    INSERT INTO submissions (campaign_id, name, email, comment)
    VALUES (${campaignId}, ${name.trim()}, ${email.trim().toLowerCase()}, ${comment?.trim() || null})
    ON CONFLICT (campaign_id, email) DO NOTHING
  `;

  return NextResponse.json({
    success: true,
    message: `You'll receive ${campaigns[0].title} via email within 24 hours.`,
  });
}
