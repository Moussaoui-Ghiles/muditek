import type { Metadata } from "next";
import { safeRedirectUrl } from "@/lib/auth-redirect";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create your free account — Muditek",
  description: "Free Muditek account: 14 playbooks, full newsletter archive, book-a-call access.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
  const params = await searchParams;
  return <SignUpForm redirectUrl={safeRedirectUrl(params.redirect_url)} />;
}
