import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Legacy LinkedIn comment campaigns are archived. Use portal resource links instead.",
    },
    { status: 410 }
  );
}
