import { NextResponse } from "next/server";
import { processNewsletterLifecycle } from "@/lib/newsletter-lifecycle";
import { newsletterSendingEnabled } from "@/lib/newsletter-sending";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lifecycle = newsletterSendingEnabled()
    ? await processNewsletterLifecycle(
        process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com",
      )
    : { processed: 0, sent: 0, paused: true };

  return NextResponse.json({
    processed: 0,
    archived: true,
    lifecycle,
    message:
      "Legacy LinkedIn comment campaigns are archived. Resource acquisition now happens through portal resource links.",
  });
}
