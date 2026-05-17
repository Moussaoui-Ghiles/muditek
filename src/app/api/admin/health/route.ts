import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type HealthState = "ok" | "warn" | "error";

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function keyMode(value: string): "live" | "test" | "unknown" | "missing" {
  if (!value) return "missing";
  if (value.includes("_live_") || value.includes("pk_live") || value.includes("sk_live")) {
    return "live";
  }
  if (value.includes("_test_") || value.includes("pk_test") || value.includes("sk_test")) {
    return "test";
  }
  return "unknown";
}

function check({
  key,
  label,
  ok,
  required,
  detail,
}: {
  key: string;
  label: string;
  ok: boolean;
  required: boolean;
  detail: string;
}) {
  return {
    key,
    label,
    state: ok ? "ok" : required ? "error" : "warn",
    required,
    detail,
  } satisfies {
    key: string;
    label: string;
    state: HealthState;
    required: boolean;
    detail: string;
  };
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const clerkPublishableMode = keyMode(env("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"));
  const clerkSecretMode = keyMode(env("CLERK_SECRET_KEY"));

  const checks = [
    check({
      key: "clerk-publishable",
      label: "Clerk publishable key",
      ok: clerkPublishableMode === "live",
      required: true,
      detail:
        clerkPublishableMode === "live"
          ? "Live key configured."
          : clerkPublishableMode === "test"
            ? "Production is still using a test key."
            : "Missing or unrecognized key.",
    }),
    check({
      key: "clerk-secret",
      label: "Clerk secret key",
      ok: clerkSecretMode === "live",
      required: true,
      detail:
        clerkSecretMode === "live"
          ? "Live secret configured."
          : clerkSecretMode === "test"
            ? "Production is still using a test secret."
            : "Missing or unrecognized secret.",
    }),
    check({
      key: "apify",
      label: "Google Maps lead finder",
      ok: Boolean(env("APIFY_TOKEN")),
      required: true,
      detail: env("APIFY_TOKEN") ? "APIFY_TOKEN is configured." : "APIFY_TOKEN is missing.",
    }),
    check({
      key: "serper",
      label: "LinkedIn lead finder",
      ok: Boolean(env("SERPER_API_KEY")),
      required: true,
      detail: env("SERPER_API_KEY") ? "SERPER_API_KEY is configured." : "SERPER_API_KEY is missing.",
    }),
    check({
      key: "blob",
      label: "Image uploads",
      ok: Boolean(env("BLOB_READ_WRITE_TOKEN")),
      required: true,
      detail: env("BLOB_READ_WRITE_TOKEN")
        ? "Vercel Blob uploads are configured."
        : "BLOB_READ_WRITE_TOKEN is missing.",
    }),
    check({
      key: "resend",
      label: "Newsletter sending",
      ok: Boolean(env("RESEND_API_KEY")),
      required: true,
      detail: env("RESEND_API_KEY") ? "RESEND_API_KEY is configured." : "RESEND_API_KEY is missing.",
    }),
    check({
      key: "stripe",
      label: "MudiKit checkout",
      ok: Boolean(env("STRIPE_SECRET_KEY") && env("STRIPE_PRICE_ID")),
      required: true,
      detail:
        env("STRIPE_SECRET_KEY") && env("STRIPE_PRICE_ID")
          ? "Stripe secret and price are configured."
          : "Stripe secret or price is missing.",
    }),
    check({
      key: "database",
      label: "Portal database",
      ok: Boolean(env("DATABASE_URL")),
      required: true,
      detail: env("DATABASE_URL") ? "DATABASE_URL is configured." : "DATABASE_URL is missing.",
    }),
  ];

  const blocking = checks.filter((item) => item.state === "error").length;
  const warnings = checks.filter((item) => item.state === "warn").length;

  return NextResponse.json({
    status: blocking > 0 ? "blocked" : warnings > 0 ? "warning" : "ready",
    blocking,
    warnings,
    checks,
  });
}
