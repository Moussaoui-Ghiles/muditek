import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

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
  let resourceCount = 0;
  let portalArticleCount = 0;
  let databaseReadable = Boolean(env("DATABASE_URL"));

  if (databaseReadable) {
    try {
      const sql = getDb();
      const [resourceRows, articleRows] = await Promise.all([
        sql`SELECT COUNT(*)::int AS count FROM content_items`,
        sql`
          SELECT COUNT(*)::int AS count
          FROM newsletter_issues
          WHERE status = 'sent'
            AND slug IS NOT NULL
            AND html IS NOT NULL
            AND length(trim(html)) > 0
            AND (
              stats->>'portal_article' = 'true'
              OR stats->>'portalArticle' = 'true'
            )
        `,
      ]);
      resourceCount = Number(resourceRows[0]?.count ?? 0);
      portalArticleCount = Number(articleRows[0]?.count ?? 0);
    } catch {
      databaseReadable = false;
    }
  }
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
            ? "This environment is using a test key."
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
            ? "This environment is using a test secret."
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
      key: "serpapi",
      label: "LinkedIn lead finder",
      ok: Boolean(env("SERPAPI_API_KEY")),
      required: true,
      detail: env("SERPAPI_API_KEY")
        ? "SERPAPI_API_KEY is configured."
        : "SERPAPI_API_KEY is missing. The LinkedIn workbench cannot run live searches yet.",
    }),
    check({
      key: "blob",
      label: "File uploads",
      ok: Boolean(env("BLOB_READ_WRITE_TOKEN")),
      required: true,
      detail: env("BLOB_READ_WRITE_TOKEN")
        ? "Vercel Blob uploads are configured."
        : "BLOB_READ_WRITE_TOKEN is missing. PDF and HTML resource uploads need it.",
    }),
    check({
      key: "resend",
      label: "Newsletter sending",
      ok: Boolean(env("RESEND_API_KEY")),
      required: true,
      detail: env("RESEND_API_KEY") ? "RESEND_API_KEY is configured." : "RESEND_API_KEY is missing.",
    }),
    check({
      key: "database",
      label: "Portal database",
      ok: databaseReadable,
      required: true,
      detail: databaseReadable ? "DATABASE_URL is configured and readable." : "DATABASE_URL is missing or unreadable.",
    }),
    check({
      key: "portal-resources",
      label: "Portal resources",
      ok: resourceCount > 0,
      required: true,
      detail:
        resourceCount > 0
          ? `${resourceCount} CMS resources are available.`
          : "No CMS resources are loaded yet.",
    }),
    check({
      key: "portal-newsletter-articles",
      label: "Portal newsletter articles",
      ok: portalArticleCount > 0,
      required: false,
      detail:
        portalArticleCount > 0
          ? `${portalArticleCount} newsletter articles are visible in the portal.`
          : "No sent emails are marked as portal articles yet. The archive stays empty until you mark articles in admin.",
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
