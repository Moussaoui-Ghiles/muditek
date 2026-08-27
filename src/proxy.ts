import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { LIBRARY_MANIFEST } from "@/lib/library-manifest";

const isPublicRoute = createRouteMatcher([
  // Marketing
  "/",
  "/about",
  "/privacy",
  "/ai-implementation",
  "/mudiagent",
  "/mudiagent-vs-chatgpt",
  "/pe-ops",
  "/pe-ops-vs-juniper-square",
  "/ai-act",
  "/ai-act/(.*)",
  "/mudikit-vs-skool",
  "/mudikit-vs-circle",
  "/who-we-help",
  "/who-we-help/(.*)",
  "/case-studies",
  "/case-studies/(.*)",
  "/revenue-leak-audit",
  "/appointment-setting",
  "/appointment-setting-pricing",
  "/library",
  "/skills",
  "/skills/(.*)",
  "/playbooks",
  "/playbooks/(.*)",
  "/newsletter",
  "/newsletter/(.*)",
  "/tools",
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
  "/api/portal/skills/(.*)/download",
  "/api/library/(.*)",
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
  const destination = new URL(`/playbooks/${encodeURIComponent(resourceSlug)}`, req.url);
  return NextResponse.redirect(destination);
}

const REMOVED_TOOL_SLUGS = new Set([
  "revenue-leak-calculator",
  "google-maps-lead-finder",
  "google-maps-company-finder",
  "linkedin-serper-lead-finder",
  "apollo-lead-finder",
  "website-url-scraper",
  "website-text-contact-extractor",
  "serp-news-search",
  "serp-autocomplete-suggestions",
  "serp-flight-search",
  "serp-hotel-search",
  "tavily-web-research",
  "open-meteo-forecast",
]);

const handleClerkRequest = clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api/portal/tools/")) {
    return NextResponse.json(
      { error: "Public provider-backed tools are disabled." },
      { status: 410 },
    );
  }

  const removedTool = req.nextUrl.pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (removedTool && REMOVED_TOOL_SLUGS.has(decodeURIComponent(removedTool[1]))) {
    return new NextResponse(null, { status: 410 });
  }

  const legacyResource = req.nextUrl.pathname.match(/^\/(?:r|resources)\/([^/]+)\/?$/);
  if (legacyResource) {
    const slug = decodeURIComponent(legacyResource[1]);
    const item = LIBRARY_MANIFEST.find((candidate) => candidate.slug === slug);
    if (!item || item.status === "archived" || item.status === "removed") {
      return new NextResponse(null, { status: 410 });
    }
    const target = item.status === "redirected"
      ? item.redirectTarget
      : `/${item.kind}s/${encodeURIComponent(item.slug)}`;
    if (!target) return new NextResponse(null, { status: 410 });
    return NextResponse.redirect(new URL(target, req.url), 308);
  }

  const redirectToUnlock = legacyPlaybookRedirect(req);
  if (redirectToUnlock) return redirectToUnlock;

  if (isPublicRoute(req)) return;
  const { userId } = await auth();
  if (userId) return;
  const signInUrl = new URL("/sign-in", req.url);
  signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(signInUrl);
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const sensitiveNewsletterPath =
    req.nextUrl.pathname.startsWith("/preferences/") ||
    req.nextUrl.pathname.startsWith("/newsletter/confirm/");
  if (sensitiveNewsletterPath) {
    const response = NextResponse.next();
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }
  return handleClerkRequest(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|md)).*)",
    "/playbooks/(.*)",
    "/(api|trpc)(.*)",
  ],
};
