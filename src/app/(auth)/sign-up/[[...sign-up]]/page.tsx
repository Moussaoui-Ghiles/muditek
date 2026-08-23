import type { Metadata } from "next";
import { safeRedirectUrl } from "@/lib/auth-redirect";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create account · Muditek",
  description: "Create a free Muditek account to download advanced skill bundles.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
  const params = await searchParams;
  return <SignUpForm redirectUrl={safeRedirectUrl(params.redirect_url)} />;
}
