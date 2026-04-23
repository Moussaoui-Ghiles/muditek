import type { Metadata } from "next";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in — Muditek",
  description: "Sign in to your Muditek portal.",
};

export default function SignInPage() {
  return <SignInForm />;
}
