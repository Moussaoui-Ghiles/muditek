# Muditek Tracking Stack

Last updated: 2026-05-04

All four trackers are LIVE on production (https://muditek.com). Free tier on every tool.

---

## What's wired

| Tool | Purpose | Where to view | Activation |
|---|---|---|---|
| **Vercel Analytics** | Page views, unique visitors, top pages, top referrers, top countries, devices | https://vercel.com/moussaoui-ghiles-projects/muditek-web/analytics | Auto (no env var needed) |
| **Vercel Speed Insights** | Core Web Vitals (LCP, CLS, INP) — Google ranking factor | https://vercel.com/moussaoui-ghiles-projects/muditek-web/speed-insights | Auto |
| **Google Analytics 4** | Behavior, funnels, events, conversions, audience demographics | https://analytics.google.com → property "muditek.com" | Env var: `NEXT_PUBLIC_GA_ID=G-TDNMCBV9KC` |
| **PostHog** | Session replays (free), event tracking, funnel analysis | https://us.posthog.com → project "Muditek" | Env var: `NEXT_PUBLIC_POSTHOG_KEY=phc_ukSm...` |
| **Google Search Console** | Search queries, impressions, clicks, indexed pages, schema errors | https://search.google.com/search-console | Verification file: `/public/googledd3d9c5a82f16369.html` |

---

## Code locations

| File | What it does |
|---|---|
| `src/app/layout.tsx` | Wires all 4 trackers in root layout |
| `src/components/google-analytics.tsx` | GA4 script tag (only renders if `NEXT_PUBLIC_GA_ID` env var set) |
| `src/components/posthog-provider.tsx` | PostHog client provider with `useEffect` init (only inits if `NEXT_PUBLIC_POSTHOG_KEY` set) |
| `public/googledd3d9c5a82f16369.html` | GSC HTML verification file |

The components are gated by env var presence — pulling a key removes the tracker without code changes.

---

## Env vars on Vercel (production)

```
NEXT_PUBLIC_GA_ID=G-TDNMCBV9KC
NEXT_PUBLIC_POSTHOG_KEY=phc_ukSmQcjUFsjCmzXBEkutddn3se4yCHTn8FwZqyedyGaa
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  (default if unset)
GOOGLE_SITE_VERIFICATION=(optional, only needed if you switch from file to meta-tag verification)
```

To list: `vercel env ls production`
To rotate a key: `vercel env rm NEXT_PUBLIC_POSTHOG_KEY production && vercel env add NEXT_PUBLIC_POSTHOG_KEY production`

---

## What each tool answers

**Vercel Analytics** — "How much traffic did the site get yesterday?"
- Realtime visitors, pageviews per route, top referrers
- No event tracking. Just pageviews. Cheapest signal.

**Vercel Speed Insights** — "Are pages fast enough for Google?"
- LCP, CLS, INP measured from real visitors
- Direct ranking factor in Google's algorithm
- Per-route breakdown to find slow pages

**GA4** — "Which channels and pages convert?"
- Acquisition reports (organic / direct / referral / social)
- Demographics + interests
- Custom events for /buy clicks, signups, etc. (need wiring later)
- Standard for B2B reporting

**PostHog** — "What do users actually do on the site?"
- Session replays — watch real visits
- Funnel analysis (e.g. landing → /buy → checkout)
- Heatmaps, event tracking
- Free up to 1M events/month

**GSC** — "How is Google seeing the site?"
- Search queries that show muditek.com in results
- Impressions, clicks, CTR, average position
- Indexing status of all 70+ routes
- Schema validation errors
- The only place to see ACTUAL SEO traffic from Google

---

## Expected traffic timeline

This is a fresh site with new schema and brand-new pages. Realistic timeline:

| When | What to expect |
|---|---|
| Day 0 (today) | All trackers show ~0 visitors except your own visits |
| Day 1-3 | Google starts crawling after sitemap submission. GSC shows "Discovered, not indexed" |
| Day 3-7 | Pages get indexed. GSC shows impressions for branded queries ("muditek") |
| Week 2-4 | Long-tail keywords start ranking. First non-branded impressions in GSC |
| Month 2-3 | Industry pages + comparison pages compete for "X vs Y" and "[industry] AI" queries |
| Month 3-6 | Backlinks (from your LinkedIn posts, newsletter, partnerships) compound |
| Month 6+ | AI engine citations (ChatGPT, Perplexity, Gemini) start appearing if schema is well-formed |

**Distribution drives traffic faster than schema:**
- LinkedIn post linking to /who-we-help → instant clicks (today)
- Newsletter issue with new case study link → instant clicks
- Schema is a multiplier, not a starter

---

## Daily/weekly check routine

**Daily (1 min):**
- Vercel Analytics dashboard → "is the site getting any traffic at all?"

**Weekly (5 min):**
- GSC → Performance → which queries are surfacing impressions?
- GSC → Coverage → any indexing errors?
- PostHog → Live events → any real users beyond me?

**Monthly (15 min):**
- GA4 → Acquisition → which channels delivered conversions?
- Speed Insights → are any pages slowing down?
- Submit any new pages to GSC for fast indexing

---

## Custom events to wire later (when traffic justifies)

Currently only pageviews tracked. When traffic > 1K visits/day, wire:

- `cta_click` (which CTA, which page) — PostHog + GA4
- `mudikit_subscribe_started` (entered email on /buy) — PostHog
- `mudikit_subscribe_completed` (Stripe webhook fires)
- `newsletter_signup` (any source)
- `discovery_audit_booked` (Outlook booking redirect fires)

Snippet for PostHog event:
```ts
import posthog from 'posthog-js';
posthog.capture('cta_click', { cta: 'mudikit_buy', page: '/' });
```

Snippet for GA4 event:
```ts
window.gtag?.('event', 'cta_click', { cta_name: 'mudikit_buy', page_path: '/' });
```

---

## Privacy / GDPR notes

- No cookie consent banner shipped (would need one if EU traffic > 5%).
- PostHog set to `person_profiles: "identified_only"` — no anonymous user fingerprinting until you call `posthog.identify()` on signup.
- GA4 collects IP-anonymized data by default in EU.
- Vercel Analytics is cookieless.

If serving heavy EU traffic later, add a consent banner (e.g. CookieYes free tier) and gate GA4 + PostHog scripts behind consent.

---

## How to deactivate a tracker

Pull the env var on Vercel:
```bash
cd /Users/ghilesmoussaoui/Desktop/BizOps/muditek/website/muditek-web
vercel env rm NEXT_PUBLIC_POSTHOG_KEY production
vercel --prod --yes --force
```

The component renders `null` when env is absent, so removal is safe and instant.

---

## How to roll keys

Rotate Posthog key example:
```bash
vercel env rm NEXT_PUBLIC_POSTHOG_KEY production
echo "phc_NEW_KEY_HERE" | vercel env add NEXT_PUBLIC_POSTHOG_KEY production
vercel --prod --yes --force
```

GA4 doesn't expose a key — the `G-XXXX` ID is public, no rotation needed.
