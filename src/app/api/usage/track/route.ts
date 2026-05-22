import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { recordUsageEvent } from "@/lib/usage-analytics";

const ALLOWED_EVENTS = new Set([
  "portal_opened",
  "portal_page_view",
  "resource_viewed",
  "resource_downloaded",
  "skill_viewed",
  "skill_downloaded",
  "tool_viewed",
  "tool_used",
  "newsletter_article_opened",
]);

function asText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 300) : null;
}

export async function POST(request: Request) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const event = asText(body.event);
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;

  await recordUsageEvent(getDb(), {
    email,
    clerkUserId: userId,
    event,
    path: asText(body.path),
    resourceSlug: asText(body.resourceSlug),
    metadata:
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? body.metadata
        : {},
  });

  return NextResponse.json({ ok: true });
}
