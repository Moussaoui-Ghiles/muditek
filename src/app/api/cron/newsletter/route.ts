import { NextResponse } from "next/server";
import {
  processNewsletterCampaigns,
  sunsetExpiredReactivation,
} from "@/lib/newsletter-campaign";
import { newsletterSendingEnabled } from "@/lib/newsletter-sending";

export const maxDuration = 300;

export async function GET(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!newsletterSendingEnabled()) {
    return NextResponse.json({ paused: true, reason: "NEWSLETTER_EMAILS_ENABLED is not true" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
  const [campaign, sunset] = await Promise.all([
    processNewsletterCampaigns(baseUrl),
    sunsetExpiredReactivation(),
  ]);
  return NextResponse.json({ campaign, sunset });
}
