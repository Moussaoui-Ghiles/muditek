import { NextResponse } from "next/server";

export function disabledPublicToolResponse() {
  return NextResponse.json(
    { error: "This provider-backed public tool has been removed." },
    {
      status: 410,
      headers: {
        "Cache-Control": "public, max-age=300",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    },
  );
}
