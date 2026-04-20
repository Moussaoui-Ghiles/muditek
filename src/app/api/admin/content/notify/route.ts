import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendDropNotification } from "@/lib/email-templates";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 300;

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://linkingin.vercel.app";

  // Get new content items (is_new = true)
  const newItems = await sql`
    SELECT title, category FROM content_items WHERE is_new = true ORDER BY category, title
  `;

  if (newItems.length === 0) {
    return NextResponse.json({ message: "No new content to notify about", sent: 0 });
  }

  // Build summary
  const summary = newItems.map((i) => `${i.title} (${i.category})`).join(", ");

  // Get all active subscribers
  const subscribers = await sql`
    SELECT email, name FROM subscribers WHERE status = 'active'
  `;

  let sent = 0;
  let errors = 0;

  for (const sub of subscribers) {
    try {
      await sendDropNotification(
        sub.email,
        sub.name || "there",
        `${newItems.length} new items: ${summary}`,
        "unused",
        baseUrl
      );
      sent++;
    } catch {
      errors++;
    }
  }

  // Mark all items as no longer new
  await sql`UPDATE content_items SET is_new = false WHERE is_new = true`;

  return NextResponse.json({
    newItems: newItems.length,
    subscribers: subscribers.length,
    sent,
    errors,
  });
}
