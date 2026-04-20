import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { sendResourceEmail } from "@/lib/email";
import {
  sendWelcomeEmail,
  sendDropNotification,
  sendSequenceEmail,
} from "@/lib/email-templates";
import { NURTURE_SEQUENCE } from "@/lib/sequences";

type TestType = "lead-magnet" | "nurture-step" | "drop" | "welcome";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = (await request.json()) as {
    type: TestType;
    to: string;
    campaignId?: string;
    step?: number;
    contentTitle?: string;
  };

  const { type, to, campaignId, step, contentTitle } = body;

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const sql = getDb();

  try {
    if (type === "lead-magnet") {
      if (!campaignId) {
        return NextResponse.json({ error: "campaignId required" }, { status: 400 });
      }
      const rows = await sql`
        SELECT title, resource_url FROM campaigns WHERE id = ${campaignId}
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }
      const resendId = await sendResourceEmail(to, rows[0].title, rows[0].resource_url);
      await sql`
        INSERT INTO email_log (email, type, subject, resend_email_id)
        VALUES (${to}, 'test-lead-magnet', ${rows[0].title + " (test)"}, ${resendId})
      `.catch(() => undefined);
      return NextResponse.json({ sent: true, resendId });
    }

    if (type === "nurture-step") {
      const s = NURTURE_SEQUENCE.find((x) => x.step === step);
      if (!s) {
        return NextResponse.json({ error: "Invalid step" }, { status: 400 });
      }
      const checkoutUrl = `${baseUrl}/buy?email=${encodeURIComponent(to)}`;
      const html = s.buildHtml("there", checkoutUrl);
      await sendSequenceEmail(to, `[TEST] ${s.subject}`, html, s.step);
      return NextResponse.json({ sent: true });
    }

    if (type === "drop") {
      const title = contentTitle || "Sample new drop";
      await sendDropNotification(to, "there", title, "unused", baseUrl);
      return NextResponse.json({ sent: true });
    }

    if (type === "welcome") {
      await sendWelcomeEmail(to, "there", baseUrl);
      return NextResponse.json({ sent: true });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
