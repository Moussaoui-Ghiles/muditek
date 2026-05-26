import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    processed: 0,
    archived: true,
    message:
      "Legacy LinkedIn comment campaigns are archived. Resource acquisition now happens through portal resource links.",
  });
}
