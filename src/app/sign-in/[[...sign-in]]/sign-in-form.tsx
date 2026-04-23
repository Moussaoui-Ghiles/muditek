"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInForm() {
  return (
    <main className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex size-8 items-center justify-center rounded-md bg-[#e8e8ec] text-[#0a0a0c] text-sm font-bold">M</div>
          <span className="text-sm font-semibold tracking-tight">Muditek</span>
        </div>
        <SignIn
          localization={{
            signIn: {
              start: {
                title: "Sign in to Muditek",
                subtitle: "Welcome back. Access your portal, playbooks, and archive.",
              },
            },
          }}
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#e8e8ec",
              colorBackground: "#0a0a0c",
              colorInputBackground: "#151517",
              colorInputText: "#e8e8ec",
              colorText: "#e8e8ec",
              colorTextSecondary: "#a0a0a6",
              borderRadius: "6px",
              fontFamily: "var(--font-geist-sans), -apple-system, system-ui, sans-serif",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none border border-white/[0.06] p-8",
              headerTitle: "text-2xl font-bold tracking-tight",
              headerSubtitle: "text-sm text-foreground/60",
              footerActionLink: "text-foreground font-semibold hover:underline",
            },
          }}
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/portal"
        />
      </div>
    </main>
  );
}
