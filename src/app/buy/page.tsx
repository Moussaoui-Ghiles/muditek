import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawEmail = Array.isArray(params.email) ? params.email[0] : params.email;
  const email = rawEmail?.trim();

  redirect(email ? `/mudikit?email=${encodeURIComponent(email)}` : "/mudikit");
}
