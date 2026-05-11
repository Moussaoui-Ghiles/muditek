import type { Metadata } from "next";
import { safeRedirectUrl } from "@/lib/auth-redirect";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in — Muditek",
  description: "Sign in to your Muditek portal.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
  const params = await searchParams;
  return <SignInForm redirectUrl={safeRedirectUrl(params.redirect_url)} />;
}
