import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  controlNewsletterCampaign,
  getNewsletterCampaign,
} from "@/lib/newsletter-campaign";

const ACTIONS = new Set(["start", "pause", "resume", "cancel", "retry"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;
  const { id } = await params;
  return NextResponse.json({ campaign: await getNewsletterCampaign(id) });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  try {
    const body = await request.json();
    const action = String(body?.action ?? "");
    if (!ACTIONS.has(action)) {
      return NextResponse.json(
        { error: "action must be start, pause, resume, cancel, or retry" },
        { status: 400 },
      );
    }
    const campaign = await controlNewsletterCampaign(
      id,
      action as "start" | "pause" | "resume" | "cancel" | "retry",
    );
    return NextResponse.json({ ok: true, campaign });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 },
    );
  }
}
