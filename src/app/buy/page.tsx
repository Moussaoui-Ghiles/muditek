import { redirect } from "next/navigation";
import { SHOW_MUDIKIT_ON_WEBSITE } from "@/lib/portal-features";

export const dynamic = "force-dynamic";

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawEmail = Array.isArray(params.email) ? params.email[0] : params.email;
  const email = rawEmail?.trim();

  if (!SHOW_MUDIKIT_ON_WEBSITE) redirect("/");

  redirect(email ? `/mudikit?email=${encodeURIComponent(email)}` : "/mudikit");
}
