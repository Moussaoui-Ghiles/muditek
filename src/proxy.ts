import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  // Marketing
  "/",
  "/about",
  "/mudiagent",
  "/mudiagent-vs-chatgpt",
  "/pe-ops",
  "/pe-ops-vs-juniper-square",
  "/mudikit-vs-skool",
  "/mudikit-vs-circle",
  "/who-we-help",
  "/who-we-help/(.*)",
  "/case-studies",
  "/case-studies/(.*)",
  "/revenue-leak-audit",
  "/newsletter",
  "/newsletter/(.*)",
  "/tools/(.*)",
  "/preferences/(.*)",
  "/subscribe",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/llms-full.txt",
  "/(.*).md",
  "/opengraph-image",
  "/twitter-image",
  "/(.*)/opengraph-image",
  "/(.*)/twitter-image",
  // Product
  "/mudikit",
  "/buy",
  "/welcome",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin(.*)",
  // Campaign landing
  "/c/(.*)",
  // Resource unlock links
  "/r/(.*)",
  "/resources",
  "/resources/(.*)",
  // APIs (public or self-authenticating)
  "/api/submit",
  "/api/subscribe",
  "/api/account/ensure",
  "/api/admin/(.*)",
  "/api/newsletter/(.*)",
  "/api/checkout",
  "/api/stripe/webhook",
  "/api/resend/webhook",
  "/api/cron/(.*)",
  "/api/init",
  "/api/portal/covers/(.*)",
  "/api/portal/newsletter-covers/(.*)",
  "/api/portal/billing",
  "/api/indexnow",
]);

const LEGACY_PLAYBOOK_FILE_SLUGS: Record<string, string> = {
  "agentic-sdr-setup-guide": "agentic-sdr-setup-guide",
  "ai-data-agent-guide": "ai-data-agent-guide",
  "ai-productivity-scorecard": "ai-productivity-scorecard",
  "claude-code-self-evolving": "claude-code-self-evolving",
  "claude-code-tips": "claude-code-tips",
  "claude-code-tips-playbook": "claude-code-tips",
  "claude-dispatch-guide": "claude-dispatch-guide",
  "clawchief-blueprint": "clawchief-blueprint",
  "cowork-setup-guide": "cowork-setup-guide",
  "google-maps-outbound": "google-maps-outbound",
  "google-maps-outbound-playbook": "google-maps-outbound",
  "gtm-skills-guide": "gtm-skills-guide",
  "judgment-moat": "judgment-moat",
  "judgment-moat-playbook": "judgment-moat",
  "openclaw-outbound": "openclaw-outbound",
  "sequoia-autopilot-playbook": "sequoia-autopilot-playbook",
  "skill-creator-blueprint": "skill-creator-blueprint",
};

function legacyPlaybookRedirect(req: Request) {
  const url = new URL(req.url);
  const match = url.pathname.match(/^\/playbooks\/([^/]+)\.(?:html|pdf)$/i);
  if (!match) return null;

  const fileSlug = decodeURIComponent(match[1]).trim().toLowerCase();
  const resourceSlug = LEGACY_PLAYBOOK_FILE_SLUGS[fileSlug] ?? fileSlug;
  const destination = new URL(`/r/${encodeURIComponent(resourceSlug)}`, req.url);
  return NextResponse.redirect(destination);
}

export default clerkMiddleware(async (auth, req) => {
  const redirectToUnlock = legacyPlaybookRedirect(req);
  if (redirectToUnlock) return redirectToUnlock;

  if (isPublicRoute(req)) return;
  const { userId } = await auth();
  if (userId) return;
  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|md)).*)",
    "/playbooks/(.*)",
    "/(api|trpc)(.*)",
  ],
};
