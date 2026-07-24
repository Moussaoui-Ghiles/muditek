import { NextResponse } from "next/server";
import { unsubscribeNewsletterByToken } from "@/lib/newsletter-subscription";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const found = await unsubscribeNewsletterByToken(token);
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const found = await unsubscribeNewsletterByToken(token);
  if (!found) {
    return NextResponse.redirect(
      new URL(`/preferences/${token}`, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }
  return NextResponse.redirect(
    new URL(`/preferences/${token}?unsubscribed=1`, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
}
