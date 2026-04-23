import type { Metadata } from "next";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create your free account — Muditek",
  description: "Free Muditek account: 14 playbooks, full newsletter archive, book-a-call access.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
