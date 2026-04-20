import { NextResponse } from "next/server";

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB_ID =
  process.env.BEEHIIV_PUBLICATION_ID ||
  "pub_2effd3a4-1768-4ed7-8c9b-ff764a036162";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, tags, utm_source, utm_medium, custom_fields } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    if (!BEEHIIV_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 }
      );
    }

    const payload: Record<string, unknown> = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
    };

    if (tags && Array.isArray(tags) && tags.length > 0) {
      payload.custom_fields = [
        ...(custom_fields || []),
        ...tags.map((tag: string) => ({
          name: "tags",
          value: tag,
        })),
      ];
    }

    if (utm_source) payload.utm_source = utm_source;
    if (utm_medium) payload.utm_medium = utm_medium;

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("beehiiv API error:", res.status, errData);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
