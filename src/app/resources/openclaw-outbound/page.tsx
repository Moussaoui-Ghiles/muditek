import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OpenClawOutboundPage() {
  redirect("/r/openclaw-outbound");
}
