import type { Metadata } from "next";
import { safeRedirectUrl } from "@/lib/auth-redirect";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create account · Muditek",
  description: "Free Muditek account. Weekly playbooks, full newsletter archive, direct calendar access.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
  const params = await searchParams;
  return <SignUpForm redirectUrl={safeRedirectUrl(params.redirect_url)} />;
}
