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
  "/playbooks/(.*)",
  "/opengraph-image",
  "/twitter-image",
  "/(.*)/opengraph-image",
  "/(.*)/twitter-image",
  // Product
  "/mudikit",
  "/welcome",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin(.*)",
  // Campaign landing
  "/c/(.*)",
  // Resource unlock links
  "/r/(.*)",
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
  "/api/portal/billing",
  "/api/indexnow",
]);

export default clerkMiddleware(async (auth, req) => {
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
