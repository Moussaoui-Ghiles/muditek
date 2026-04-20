import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = body.email as string | undefined;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    request.headers.get("origin") ||
    "https://linkingin.vercel.app";

  const url = await createCheckoutSession(baseUrl, email);

  return NextResponse.json({ url });
}
