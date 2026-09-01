import { NextResponse } from "next/server";
import {
  getLeadMagnet,
  renderMagnetEmailHtml,
  resolveMagnetAssetUrl,
} from "@/lib/lead-magnets";
import { sendMagnetEmail } from "@/lib/asset-email";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 6;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count++;
  return true;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const magnet = getLeadMagnet(slug);
    if (!magnet) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
    const assetUrl = resolveMagnetAssetUrl(magnet, email, baseUrl);
    const bodyHtml = renderMagnetEmailHtml(magnet, assetUrl);

    await sendMagnetEmail({
      email,
      slug: magnet.slug,
      subject: magnet.emailSubject,
      bodyHtml,
      baseUrl,
    });

    return NextResponse.json({
      ok: true,
      mode: magnet.mode,
      assetUrl: magnet.mode === "page" ? assetUrl : null,
      button: magnet.button,
    });
  } catch (err) {
    console.error("lead magnet delivery error", err);
    return NextResponse.json({ error: "Delivery failed" }, { status: 500 });
  }
}
