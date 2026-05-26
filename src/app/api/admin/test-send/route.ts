import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  sendWelcomeEmail,
  sendDropNotification,
} from "@/lib/email-templates";

type TestType = "lead-magnet" | "nurture-step" | "drop" | "welcome";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = (await request.json()) as {
    type: TestType;
    to: string;
    step?: number;
    contentTitle?: string;
  };

  const { type, to, contentTitle } = body;

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    if (type === "lead-magnet") {
      return NextResponse.json(
        { error: "Archived delivery emails are disabled. Use portal resource links instead." },
        { status: 410 },
      );
    }

    if (type === "nurture-step") {
      return NextResponse.json(
        { error: "Manual nurture test sends are disabled while the sequence is paused." },
        { status: 410 },
      );
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
