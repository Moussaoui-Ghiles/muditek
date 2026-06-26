# Muditek SEO/GEO/AEO Tracker Spec

Grounded in the actual repo. Here is the spec.

---

# Spec: `/admin/seo` — Muditek Search & AI Visibility Dashboard

One page. One login. Traffic on top. Everything reads from Neon so Ghiles never opens PostHog, GA4, or Search Console himself — those become the plumbing, this becomes the dashboard.

## 0. Principles (read first)

- **One place.** `/admin/seo`, inside the existing Clerk-gated `/admin` shell. Add `"/admin/seo": "Search & AI"` to the `PAGE_LABELS` map in `src/components/admin/admin-shell.tsx`.
- **Traffic is the hero.** First thing on screen, biggest numbers, plain English.
- **Plain labels, no jargon.** Section titles are questions a non-technical owner asks, not acronyms. "GEO/AEO/SoV" never appear in the UI.
- **Neon is the single source.** Every external API (GA4, GSC, Bing, OpenAI, Perplexity) is pulled by a cron into a Neon table. The dashboard only ever queries Neon — fast, offline-safe, no API quotas on page load.
- **Reuse the existing pattern exactly.** Page = `src/app/admin/seo/page.tsx` (`force-dynamic`) + `seo-content.tsx` (client) that `fetch("/api/admin/seo")`. API route gated by `getAdminAccess()` from `@/lib/admin-auth`. Tables created by idempotent `ensureSeoSchema(sql)` files in `src/lib/`, mirroring `content-items-schema.ts`. Crons in `vercel.json` authed with `Bearer ${CRON_SECRET}`, same as `/api/cron/process`.

---

## 1. Data sources → how each lands in Neon

| # | Signal | External source | Ingestion path | Neon table |
|---|---|---|---|---|
| A | AI-assistant visits (chatgpt/perplexity/gemini/copilot/claude) | First-party (already detected in `client-analytics.ts`) | **Beacon** — extend `fireAiReferralOnce` callback in `posthog-provider.tsx` to also `POST /api/track/ai-referral`, which inserts a row. No cron. | `ai_referrals` |
| B | Traffic by channel (organic / direct / referral / social / paid) | **GA4 Data API** (Default Channel Grouping is authoritative and reconciles with what Ghiles sees in GA) | Daily cron `/api/cron/seo-traffic` pulls yesterday's sessions by channel | `seo_traffic_daily` |
| C | Google impressions, clicks, avg position, top queries, top pages | **Google Search Console API** (`searchanalytics.query`) | Daily cron `/api/cron/seo-gsc`, pulls the day `today−3` (GSC lags ~2-3 days) | `gsc_daily`, `gsc_queries`, `gsc_pages` |
| D | AI citation share-of-voice | **OpenAI API** (web-search tool) + **Perplexity API** (sonar, returns citations) run against a fixed prompt set | Daily cron `/api/cron/seo-citations` | `seo_prompts`, `ai_citations` |
| E | Which AI crawlers fetched which pages | First-party server logs | **Middleware write** in `proxy.ts` — detect known bot UAs, fire-and-forget insert via `after()` / `waitUntil` | `crawler_hits` |
| F | Instant-indexing submissions | First-party (the existing `/api/indexnow` endpoint) | Add a Neon insert inside the existing POST handler | `indexnow_submissions` |
| G | Bing impressions/clicks/position | **Bing Webmaster Tools API** (`GetRankAndTrafficStats`, `GetQueryStats`) | Daily cron `/api/cron/seo-bing` — **gated on Ghiles creating a Bing WMT account + API key** | `bing_daily`, `bing_queries` |

GA4 and GSC use the **same Google Cloud service-account JSON**; share the GA4 property and the GSC property with that service account's email once. Store as `GOOGLE_SA_JSON` (base64) + `GA4_PROPERTY_ID` + `GSC_SITE_URL`. PostHog stays as the deep-dive/debug layer — it is not a dashboard data source.

---

## 2. Neon tables

Created via `src/lib/seo-schema.ts` exporting `ensureSeoSchema(sql)` (one module-level `schemaReady` guard, called at the top of every SEO cron + the admin API), same shape as `ensureContentItemsSchema`.

```
-- A. First-party AI-assistant visits (the most important GEO KPI)
ai_referrals (
  id            BIGSERIAL PRIMARY KEY,
  ai_source     TEXT NOT NULL,          -- chatgpt|perplexity|gemini|copilot|claude
  referrer      TEXT,
  landing_path  TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
)
-- index on (created_at), (ai_source, created_at)

-- B. Channel totals from GA4
seo_traffic_daily (
  date            DATE NOT NULL,
  channel         TEXT NOT NULL,         -- Organic Search|Direct|Referral|Organic Social|Paid|Email|Unassigned
  sessions        INT  NOT NULL DEFAULT 0,
  engaged_sessions INT NOT NULL DEFAULT 0,
  conversions     INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (date, channel)
)

-- C. Google Search Console
gsc_daily (
  date         DATE PRIMARY KEY,
  impressions  INT, clicks INT,
  ctr          NUMERIC(6,4),
  avg_position NUMERIC(6,2)
)
gsc_queries (
  date DATE, query TEXT, impressions INT, clicks INT,
  ctr NUMERIC(6,4), avg_position NUMERIC(6,2),
  PRIMARY KEY (date, query)
)
gsc_pages (
  date DATE, page TEXT, impressions INT, clicks INT,
  ctr NUMERIC(6,4), avg_position NUMERIC(6,2),
  PRIMARY KEY (date, page)
)

-- D. AI citation tracking
seo_prompts (
  id          SERIAL PRIMARY KEY,
  prompt      TEXT NOT NULL,             -- buyer question
  cluster     TEXT,                      -- mudiagent|pe-ops|ai-act|revenue-leak|brand
  active      BOOLEAN DEFAULT true
)
ai_citations (
  id              BIGSERIAL PRIMARY KEY,
  prompt_id       INT REFERENCES seo_prompts(id),
  platform        TEXT NOT NULL,         -- chatgpt|perplexity
  run_date        DATE NOT NULL,
  muditek_cited   BOOLEAN NOT NULL,      -- muditek.com OR "Muditek"/"Ghiles Moussaoui" in answer/sources
  muditek_position INT,                  -- order of mention, null if absent
  competitors     JSONB,                 -- ["juniper-square.com", ...]
  sources         JSONB,                 -- all cited URLs
  answer_excerpt  TEXT,                  -- first ~500 chars, for the drill-down
  UNIQUE (prompt_id, platform, run_date)
)

-- E. AI crawler hits
crawler_hits (
  id         BIGSERIAL PRIMARY KEY,
  bot_name   TEXT NOT NULL,              -- OAI-SearchBot|PerplexityBot|Claude-SearchBot|Googlebot|Google-Extended|Bingbot|...
  ua         TEXT,
  path       TEXT NOT NULL,
  status     INT,
  fetched_at TIMESTAMPTZ DEFAULT now()
)
-- index on (bot_name, fetched_at), (path)

-- F. IndexNow log
indexnow_submissions (
  id           BIGSERIAL PRIMARY KEY,
  url          TEXT NOT NULL,
  http_status  INT,
  submitted_at TIMESTAMPTZ DEFAULT now()
)

-- G. Bing
bing_daily ( date DATE PRIMARY KEY, impressions INT, clicks INT, avg_position NUMERIC(6,2) )
bing_queries ( date DATE, query TEXT, impressions INT, clicks INT, PRIMARY KEY (date, query) )
```

---

## 3. Cron jobs (`vercel.json`)

Add to the existing `crons` array (already on Pro — 3 crons run today). All staggered after the existing 8-10am jobs, all authed with `Bearer ${CRON_SECRET}`:

```json
{ "path": "/api/cron/seo-traffic",   "schedule": "0 11 * * *" },
{ "path": "/api/cron/seo-gsc",       "schedule": "0 11 * * *" },
{ "path": "/api/cron/seo-bing",      "schedule": "30 11 * * *" },
{ "path": "/api/cron/seo-citations", "schedule": "0 12 * * *" }
```

- `seo-citations` is the only one with real per-run cost (OpenAI + Perplexity calls). Default to **daily** at 30 active prompts × 2 platforms = 60 calls/day (~cents). If cost matters, switch to weekly (`0 12 * * 1`).
- Crawler hits, IndexNow, and AI-referral beacon are **event-driven — no cron.**
- Each cron route: `export const maxDuration = 60;`, calls `ensureSeoSchema(sql)` first, upserts with `ON CONFLICT ... DO UPDATE` so re-runs are idempotent.

---

## 4. Dashboard sections (top to bottom, plain labels)

### Headline strip (4 big tiles, the only thing above the fold)
1. **Visitors (last 30 days)** — total sessions, sparkline, vs prior 30d.
2. **AI-assistant visits (last 30 days)** — count + week-over-week %. This is the number Ghiles checks first.
3. **Google shows you (last 28 days)** — total impressions + avg position.
4. **AI recommends you** — citation score (% of tracked buyer questions where Muditek is named), best platform.

### Section 1 — "Where your visitors come from" (the hero)
- Stacked area chart over time, one band per channel: **Organic Search, AI Assistants, Direct, Referral, Social** (`seo_traffic_daily` for the GA channels; AI Assistants band comes from `ai_referrals` so it's split out, not buried in Direct).
- Below it, an **AI-assistant breakdown** card: a small bar list — ChatGPT, Perplexity, Gemini, Copilot, Claude — with counts and 30d trend (from `ai_referrals.ai_source`).
- Table: channel · visitors (30d) · vs prior · share of total.

### Section 2 — "What Google shows you for"
- Three numbers with trend: **Impressions, Clicks, Average position** (`gsc_daily`).
- **Top questions you appear for** — top 15 `gsc_queries` (query · impressions · clicks · position).
- **Top pages** — top 15 `gsc_pages` (page · impressions · clicks · position).
- Plain-English note under clicks: "Clicks can stay flat while impressions rise — AI Overviews answer the query without the click. Watch impressions + position."

### Section 3 — "Are AI assistants recommending you?"
- **Your citation score per platform** (ChatGPT, Perplexity): % of active prompts where `muditek_cited = true`, with trend line over time (`ai_citations`).
- **Competitor leaderboard**: most-cited domains across your prompt set (aggregated from `competitors`/`sources` JSON) — shows who's beating you.
- **Question drill-down**: table of each prompt · cited yes/no per platform · expandable `answer_excerpt`. So Ghiles can read the actual answer ChatGPT gave a buyer.

### Section 4 — "Are AI bots reading your pages?"
- **Last seen per bot**: OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, Google-Extended, Bingbot — last fetch time + 30d hit count (`crawler_hits`). Green if seen in last 7d.
- **Pages crawled vs never crawled**: cross-reference distinct `crawler_hits.path` against `sitemap.ts` URLs → flag any core page no AI bot has fetched (the earliest "we're invisible" warning).
- Recent-fetches table (bot · path · time).

### Section 5 — "Bing & instant indexing"
- **IndexNow log**: last 20 `indexnow_submissions` (url · status · time) + "X of last 30 publishes submitted, all HTTP 200."
- **Bing** (only renders once `BING_WEBMASTER_API_KEY` exists): impressions, clicks, avg position from `bing_daily`. Until then, show a one-line "Connect Bing Webmaster Tools to light this up."

---

## 5. What "good" looks like (shown inline as target chips)

| Number | Good | Why |
|---|---|---|
| Total visitors | Up month-over-month | Trend matters more than absolute on a small B2B site |
| AI-assistant visits | **Non-zero and rising**; aim toward 5-15% of sessions over 6-12 mo | Currently ~0 and mislabeled as Direct; macro shift is real. Single most important GEO KPI |
| AI breakdown | ChatGPT first to move, then Perplexity/Gemini | Matches where B2B buyers actually research |
| GSC impressions | Steadily up | Leading indicator that off-site mentions + content are landing |
| GSC clicks | May stay flat — **don't panic** | AI Overviews intercept ~38% of clicks; judge impressions + position instead |
| Avg position | <10 = page 1; **<3 = citation-eligible** | AI Overviews/answers pull almost entirely from top-3 results |
| Citation score | Any citation = a win; target **>25% of tracked prompts on ≥1 platform** | Only ~11% of domains are cited by both ChatGPT and Google — per-platform is the real game |
| Competitor leaderboard | You climbing, named competitors not pulling away | Share-of-voice is relative |
| Crawler hits | Every core page fetched by each AI bot **at least monthly**, frequency rising | A core page never crawled = it cannot be cited. Earliest leading indicator |
| IndexNow | **100% of publishes submitted, HTTP 200** | Free, instant Bing/ChatGPT-Search indexing |

---

## 6. Build order — ranked by value, simplest first

| Order | Build | Value | Effort | Depends on |
|---|---|---|---|---|
| **1** | **AI-assistant visits → Neon** (Section 1 AI card + headline tile #2). Add `/api/track/ai-referral` + `ai_referrals` table + 4 lines in `posthog-provider.tsx`. | Highest (the GEO North Star, currently invisible) | Tiny — detection already exists in `client-analytics.ts` | none |
| **2** | **Crawler-hit log** (Section 4). UA-match + `after()` insert in `proxy.ts` + `crawler_hits`. | High (earliest leading indicator) | Low | none |
| **3** | **IndexNow log** (Section 5a). One insert inside the existing `/api/indexnow` POST + `indexnow_submissions`. | Medium | Tiny | none |
| **4** | **Channel traffic from GA4** (Section 1 hero chart). `seo-traffic` cron + `seo_traffic_daily`. | High (traffic is the hero ask) | Medium — GA4 service-account auth | `GOOGLE_SA_JSON`, `GA4_PROPERTY_ID` |
| **5** | **Google Search Console** (Section 2). `seo-gsc` cron + 3 tables. | High (the lagging truth) | Medium — reuses same service account | same Google SA, `GSC_SITE_URL` |
| **6** | **AI citation share-of-voice** (Section 3). `seo_prompts` seed + `seo-citations` cron + parser + `ai_citations`. | High (the real GEO outcome) | High — API cost + answer parsing | `OPENAI_API_KEY`, `PERPLEXITY_API_KEY` |
| **7** | **Bing Webmaster** (Section 5b). `seo-bing` cron + 2 tables. | Medium | Medium | Ghiles creates Bing WMT account + `BING_WEBMASTER_API_KEY` |

Ship 1-3 first (all first-party, no external accounts, dashboard already useful in a day). 4-5 unlock once the one Google service account is wired. 6 is the highest-signal but heaviest. 7 waits on Ghiles.

---

## 7. New env vars

`GOOGLE_SA_JSON` (base64 service-account, shared on both GA4 + GSC properties), `GA4_PROPERTY_ID`, `GSC_SITE_URL`, `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `BING_WEBMASTER_API_KEY`. Already present: `DATABASE_URL`, `CRON_SECRET`, `ADMIN_KEY`, `ADMIN_EMAILS`.

## 8. Files to create

- `src/app/admin/seo/page.tsx`, `src/app/admin/seo/seo-content.tsx`
- `src/app/api/admin/seo/route.ts` (gated by `getAdminAccess`; one query bundle returning all sections)
- `src/app/api/track/ai-referral/route.ts`
- `src/app/api/cron/seo-traffic/route.ts`, `seo-gsc/route.ts`, `seo-citations/route.ts`, `seo-bing/route.ts`
- `src/lib/seo-schema.ts` (`ensureSeoSchema`)
- `src/lib/seo-prompts.ts` (initial buyer-question seed set, ~30 prompts across the mudiagent / pe-ops / ai-act / revenue-leak / brand clusters)
- Edits: `vercel.json` (4 crons), `src/components/admin/admin-shell.tsx` (nav label), `src/components/posthog-provider.tsx` (beacon call), `src/app/api/indexnow/route.ts` (log insert), `proxy.ts` (crawler-hit write).