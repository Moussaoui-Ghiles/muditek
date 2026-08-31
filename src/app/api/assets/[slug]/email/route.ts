import { NextResponse } from "next/server";
import { getPortalSkill } from "@/lib/portal-skills";
import { getPublicPlaybook } from "@/lib/public-library";
import {
  assetDownloadToken,
  subscribeAndSendAsset,
} from "@/lib/asset-email";

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

    const skill = getPortalSkill(slug);
    const playbook = skill ? null : getPublicPlaybook(slug);
    if (!skill && !playbook) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (skill) {
      const token = assetDownloadToken(slug, email);
      await subscribeAndSendAsset({
        email,
        slug,
        title: skill.name,
        kind: "skill",
        linkPath: `/api/portal/skills/${encodeURIComponent(slug)}/download?e=${encodeURIComponent(email)}&t=${token}`,
      });
    } else if (playbook) {
      await subscribeAndSendAsset({
        email,
        slug,
        title: playbook.title,
        kind: "playbook",
        linkPath: `/playbooks/${encodeURIComponent(slug)}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("asset email error", err);
    return NextResponse.json({ error: "Delivery failed" }, { status: 500 });
  }
}
