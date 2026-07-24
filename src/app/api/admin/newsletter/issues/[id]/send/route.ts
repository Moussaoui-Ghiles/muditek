import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  controlNewsletterCampaign,
  getNewsletterCampaign,
  getNewsletterCampaignPreflight,
  processNewsletterCampaigns,
} from "@/lib/newsletter-campaign";

const ACTIONS = new Set(["start", "pause", "resume", "cancel", "retry", "process"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;
  const { id } = await params;
  return NextResponse.json({
    campaign: await getNewsletterCampaign(id),
    preflight: await getNewsletterCampaignPreflight(id),
  });
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
        { error: "Invalid campaign action" },
        { status: 400 },
      );
    }
    if (action === "process") {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
      const result = await processNewsletterCampaigns(baseUrl, 1, id);
      return NextResponse.json({ ok: true, worker: result });
    }
    const campaign = await controlNewsletterCampaign(
      id,
      action as "start" | "pause" | "resume" | "cancel" | "retry",
      { confirmation: typeof body?.confirmation === "string" ? body.confirmation : undefined },
    );
    return NextResponse.json({ ok: true, campaign });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 },
    );
  }
}
