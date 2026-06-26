# Muditek SEO/GEO/AEO Scaling Spec

Verified Wave A is live and mapped the repo's content primitives. Here is the spec.

---

# Muditek SEO / GEO / AEO Scaling System (2026)

The repeatable engine that turns "a query with real demand + a real Muditek data asset" into a published, citation-ready page, plus the off-site brand-mention rhythm. Built on what already ships in this repo: typed data layer (`lib/case-studies.ts`, `lib/industries.ts`, `lib/data-points.ts`), data-driven `sitemap.ts`, `JsonLd` component with the `#ghiles`/`#organization` `@id` graph, the live `POST /api/indexnow` endpoint, AI-referral tagging in `lib/client-analytics.ts`, the `/admin` dashboard surface, and `api/cron/*` jobs.

The whole system rests on one inviolable rule: **a page exists only because Muditek owns a number nobody else can publish.** No data asset, no page. This is what keeps a scaling engine from becoming the thin-content fan-out that is sitewide-toxic in 2026.

---

## 0. The two-key gate (intake)

Nothing enters the pipeline without BOTH keys present. This is the single most important control in the system.

| Key | What it means | Who confirms |
|---|---|---|
| **Demand key** | A real, recurring question humans search AND/OR AI engines get asked, with a visible answer gap (current AI answers are generic, undated, or uncited). | Claude validates (probes), Ghiles confirms it maps to ICP |
| **Data key** | A primary-source Muditek asset that answers it: a case-study metric, a measured benchmark, a calculator model output, or a named build artifact. Must be true and shareable (client consent where applicable). | Ghiles owns. Non-negotiable. |

If only the demand key exists, the correct output is **not** a page. It is either (a) an off-site answer (Reddit/Quora/YouTube) or (b) a backlog item parked until a real data asset is earned through client work.

---

## 1. Content production pipeline

Eight stages, each tagged by owner using the plan's taxonomy: `claude-auto` (Claude executes in-repo, no decision), `claude-assisted` (Claude drafts, Ghiles approves copy), `ghiles-only` (only Ghiles can do it).

```
[0] Intake gate ─ demand + data asset           ghiles-only (confirm) + claude-assisted (validate)
[1] Demand validation ─ probe AI engines + web   claude-auto
[2] Data extraction ─ numbers → typed lib record  ghiles-only (numbers) + claude-auto (encode)
[3] Draft ─ BLUF + body from the record only       claude-assisted
[4] Structure + schema ─ AEO markup, JsonLd         claude-auto
[5] QA gate ─ info-gain lint + schema + no-JS       claude-auto
[6] Publish ─ sitemap pickup + IndexNow + links     claude-auto
[7] Off-site seeding ─ distribute the data asset    ghiles-only
[8] Measure ─ tracker, feed back into [0]           claude-auto (dash) + ghiles-only (review)
```

### Stage detail and automation boundary

**[1] Demand validation — `claude-auto`.** Before writing, prove the demand. Claude runs the target question through `WebSearch` / `last30days` and through actual AI engines (paste the question into ChatGPT/Perplexity/Gemini and record the answer). Output: a 4-line `demand-note` per topic — (a) is it asked, (b) who currently gets cited, (c) what the cited answers are missing, (d) the exact verbatim question phrasing to use as the page's H2. If no answer gap exists, kill the topic.

**[2] Data extraction — `ghiles-only` numbers, `claude-auto` encode.** Real numbers come from Ghiles or the engagement log; Claude never invents a figure. Claude encodes the asset as a typed record in a `lib/` registry (the same pattern as the existing `CASE_STUDIES` array). Each record MUST carry: `uniqueNumber` (the only-here figure), `source` + `lastUpdated` (mirroring `data-points.ts`), `targetQuestion`, `blufAnswer` (40–60 words), `citedSources[]` (≥2 externally verifiable), `dateModified`.

**[3] Draft — `claude-assisted`.** Claude writes from the typed record + cited stats only. Structure is fixed (see checklist). Ghiles's voice rules apply: no em-dashes, no fluff, outcomes not jargon. Ghiles approves copy.

**[4] Structure + schema — `claude-auto`.** Render through the shared pillar template (extends the existing `industry-page.tsx` pattern): verbatim-question H2s, answer-first BLUF paragraph, semantic `<table>`/`<ol>` (not grid divs), visible `By Ghiles Moussaoui, Founder · Updated {dateModified}` byline, and `JsonLd` emitting `Article` + `BreadcrumbList` with `author {@id #ghiles}` / `publisher {@id #organization}`, plus `SpeakableSpecification` on the BLUF. This is pure correctness, no decision.

**[5] QA gate — `claude-auto`.** Three machine checks before merge (see §5 lint). Fails the build if any record lacks a unique number, a source, a dateModified, or a BLUF in the 40–60-word band.

**[6] Publish — `claude-auto`.** The page slug is added to the typed registry; `sitemap.ts` already iterates these arrays so inclusion is automatic. A `scripts/publish-page.ts` calls `POST /api/indexnow` (endpoint live, `x-admin-key`) with the new URL. Claude adds 2–3 contextual internal links from related existing pages (case study ↔ industry ↔ comparison).

**[7] Off-site seeding — `ghiles-only`.** The same data asset gets distributed off-site (§4). On-site page + off-site mention of the same entity/number is the compounding move; off-site mentions beat backlinks ~3:1 for AI citation.

**[8] Measure — `claude-auto` dashboard, `ghiles-only` review.** Tracker (§5) surfaces leading indicators; the Friday loop decides the next cycle.

### Semi-automatable in this repo vs needs Ghiles

| In-repo / Claude-auto | Needs Ghiles |
|---|---|
| Scaffold a page from a typed `lib/` record | Supply/confirm the real numbers and client consent |
| All JSON-LD (`Article`/`Breadcrumb`/`Speakable`) | Approve copy (voice, claims) |
| Sitemap inclusion (auto via array iteration) | Decide which competitor/benchmark is worth a page |
| IndexNow ping on publish | Every off-site action (his identity, his channel) |
| Internal-link insertion | AI-visibility monitor budget (Decision 4) |
| Info-gain lint, schema validation, no-JS render check | Record the YouTube walkthrough |
| `/admin/seo` tracker dashboard | The weekly review judgement call |

---

## 2. The information-gain bar (every page must clear all five)

A page ships only if it passes the full gate. This is the thin-content firewall.

1. **The only-here number.** The page contains ≥1 primary-source figure (a Muditek case-study/benchmark/calculator result) that does not appear on any competitor or generic page. Recorded as `uniqueNumber` in the registry.
2. **The subtraction test.** Delete every Muditek-specific datum. If the page still has a reason to exist, it is commodity content. Kill it. (This is the test `/mudiagent`, `/pe-ops` brand-term pages and `/mudikit-vs-skool` fail.)
3. **Verbatim demand.** The page answers a question proven asked in §1 demand validation, phrased as the literal H2. No invented questions.
4. **Quotable BLUF.** A self-contained 40–60-word answer block directly under the hero that an AI could lift verbatim. Princeton GEO: cited sources + quoted stats each add ~30–40% AI visibility.
5. **Provenance.** Visible author + dateline, plus ≥2 externally verifiable cited stats with real links. Any stat that can't be sourced is dropped, never fabricated.

A page failing any single bar does not get downgraded to "publish anyway." It gets parked until the missing piece exists.

---

## 3. Safe programmatic pattern (only where real data exists)

**The rule that makes it safe:** every generated page maps **1:1 to a row in a hand-maintained typed dataset where each row carries a primary-source number**. The page count is bounded by real data rows, never by a keyword cartesian product (no industry × city × competitor fan-out). A build-time lint (§5) fails if any generated record lacks a unique number + source + dateModified.

### Named candidates (and their data source and cap)

| Pattern | Route | Data source (1 row = 1 real asset) | Cap today | Safe? |
|---|---|---|---|---|
| **Case studies** | `/case-studies/[slug]` | `lib/case-studies.ts` (real engagements, before/after) | 5 | ✅ canonical safe pattern — already live |
| **Industry pillars** | `/who-we-help/[industry]` | `lib/industries.ts`, each anchored to its case study + ≥1 industry benchmark | 5 | ✅ only because each cites real case-study numbers |
| **Benchmark pages** | `/benchmarks/[metric]` (new) | new `lib/benchmarks.ts` — metrics Muditek **measured across ≥N engagements** (e.g. median speed-to-lead, LP onboarding before/after) | grows with engagements | ✅ only for measured aggregates, never invented averages |
| **Comparison pages** | `/[product]-vs-[competitor]` | hand-curated: real tool ICP evaluates + documented true differentiator + real "X vs Y / X alternative" demand | 2 live, ~2–3 more | ✅ curated, NOT fan-out |
| **Calculator output** | `/tools/[calculator]` | a real model with sourced constants | 1 (revenue-leak) | ✅ one per real model |

### Explicitly UNSAFE (do not build)

- **Brand-term pages** with near-zero external volume: `/mudikit-vs-skool`, `/mudikit-vs-circle` — flagged thin, kill or reframe to demand-led queries before any MudiKit relaunch.
- **City/region × service fan-out** — no real per-location data exists.
- **Competitor × competitor matrices** where Muditek has no documented differentiator.
- **Invented "industry average" benchmarks** — only publish numbers Muditek actually measured.

New benchmark and comparison rows are added **as the data is earned**, one row at a time, each passing §2. The engine scales with real client work, not with templates.

---

## 4. Off-site cadence (weekly operating rhythm, solo-founder realistic)

Budget: **~3 hours/week**, all `ghiles-only`. Ranked by the plan's evidence (YouTube r=0.74; unlinked brand mentions r=0.66 vs backlinks 0.22). The move is always: distribute the **same data asset** the on-site page is built on.

### Front-loaded one-time setup (Week 0, ~3–4 hrs once)
- Bing Webmaster Tools: verify domain + submit sitemap (feeds the Bing index ChatGPT Search reads).
- Create/claim YouTube channel; add URL to footer + `/about` + `sameAs` in `layout.tsx`.
- Claim G2 / Capterra / Trustpilot profiles for mudiAgent and pe-ops.
- Create Crunchbase + Wikidata entity entries; feed resulting URLs back into `sameAs`.
- Stand up the AI-visibility monitor (Decision 4 budget) — per-platform, since only ~11% of domains are cited by both ChatGPT and Google AI Overviews.

### Weekly recurring (the rhythm)
| Cadence | Action | Time |
|---|---|---|
| **Every week** | 2–3 genuine Reddit/Quora answers in threads where a Muditek number is a natural, helpful mention (not a drop). Unlinked brand mention of "Muditek" / "Ghiles Moussaoui" tied to the target entity. | ~45 min |
| **Every week** | 1 YouTube Short (60–90s) from a case-study number, OR progress on the biweekly long video. | ~30–45 min |
| **Every 2 weeks** | 1 long YouTube walkthrough (chapter-timestamped) of a case study or build. Strongest single AI-citation signal. | ~1.5 hr |
| **Monthly rotation** (1 task/week, 4-week cycle) | W1: directory — solicit/post a G2/Capterra review. W2: entity — update Crunchbase/Wikidata + `sameAs`. W3: digital PR — 1 pitch to a journalist / podcast / roundup naming Muditek. W4: named client reference — advance one logo-on-page or first-name-plus-firm-type approval. | ~30–45 min |

Realistic net: ~1 long video + 2 Shorts + ~10 genuine forum mentions + 1 rotation task per month. Quality and genuineness over volume; spammy mentions damage the entity.

---

## 5. Weekly review loop (tied to the tracker)

### The tracker — `/admin/seo` (new dashboard, `claude-auto` to build)
A single `/admin` view (sits alongside `/admin/usage`, `/admin/leads`) fed by sources that already exist or are one job away:

| Panel | Source | Status |
|---|---|---|
| AI referrals (chatgpt/perplexity/gemini/copilot/claude) | `lib/client-analytics.ts` → PostHog/GA4 | live, just surface it |
| AI crawler hit rate by path (OAI-SearchBot, PerplexityBot, Claude-SearchBot) | server-side UA log (per plan GEO-05) | build a `api/cron` log sink |
| IndexNow submission log + Bing coverage | `/api/indexnow` responses | live endpoint, log results |
| Branded search + impressions | GSC (manual paste or API) | manual until API |
| AI citation share-of-voice per platform | AI-visibility monitor | pending Decision 4 |

### The loop — Friday, 30 minutes (`ghiles-only` judgement)
1. **Read leading indicators first.** New pages get crawled before they get cited: check AI crawler hits on pages shipped in the last 30 days. Hits = citation candidacy; zero hits after 2 weeks = a structural problem to fix, not a content one.
2. **Read AI referrals + branded-search trend.** These are the lagging proof off-site mentions are landing. Judge by these, not blue-link clicks (clicks are collapsing ~38% under AI Overviews).
3. **Decide next week's one page.** Confirm a real data asset exists for it. If none exists this week, ship an on-page improvement to an existing page instead (BLUF, citation, fresher dateModified) — never a thin page to hit a quota.
4. **Queue the off-site rotation task** for the week (W1–W4 cycle).
5. **Log the decision** (one line) so the cadence is auditable and the backlog stays honest.

Gate reminder for the loop: AEO snippet/answer-block wins only fire once a page already ranks top-5, so don't expect extraction on brand-new pages — expect crawler hits first, citations later.

---

## Page-production checklist (copy-paste, run per page)

```
INTAKE
[ ] Demand key: question proven asked (web + ≥2 AI engines), answer gap documented
[ ] Data key: real Muditek number exists, true, shareable (client consent if applicable)

DATA  (lib/ registry record)
[ ] uniqueNumber (the only-here figure) set
[ ] source + lastUpdated set (data-points.ts pattern)
[ ] targetQuestion = verbatim demand phrasing
[ ] blufAnswer 40–60 words, self-contained
[ ] citedSources[] ≥2, externally verifiable, real links
[ ] dateModified set

STRUCTURE  (shared pillar template)
[ ] BLUF answer block directly under hero
[ ] Section H2s phrased as the verbatim questions they answer
[ ] Comparisons = semantic <table>; sequences = <ol> (no grid divs)
[ ] Visible byline: "By Ghiles Moussaoui, Founder · Updated {dateModified}"
[ ] Voice: no em-dashes, no fluff, outcomes not jargon

SCHEMA  (JsonLd component)
[ ] Article: author {@id #ghiles}, publisher {@id #organization}, mainEntityOfPage, dateModified
[ ] BreadcrumbList with @id graph
[ ] SpeakableSpecification on the BLUF
[ ] (FAQPage only as AI-parse aid — expect zero Google rich result, deprecated May 2026)

QA GATE  (info-gain lint, must pass)
[ ] Passes subtraction test (dies without Muditek data)
[ ] Lint: record has uniqueNumber + source + dateModified + BLUF in 40–60 band
[ ] Renders full content with JS disabled (AI crawler view)
[ ] Schema validates

PUBLISH
[ ] Slug added to typed registry → sitemap auto-includes
[ ] scripts/publish-page.ts → POST /api/indexnow with new URL
[ ] 2–3 contextual internal links from related pages

OFF-SITE  (same data asset)
[ ] At least 1 off-site mention queued (YouTube / Reddit / Quora / directory)

MEASURE
[ ] Appears in /admin/seo; crawler-hit watch starts (review in 2 weeks)
```

---

## Cadence summary (the operating rhythm)

| When | On-site (Claude-assisted) | Off-site (Ghiles-only) | Review |
|---|---|---|---|
| Week 0 | Build `/admin/seo` tracker, info-gain lint, publish script | Bing WMT, YouTube, directories, entity profiles, monitor | Baseline |
| Every week | 1 page from a real asset, OR 1 improvement if no asset | 2–3 forum mentions + 1 Short + 1 rotation task | Fri 30-min loop |
| Every 2 weeks | (pacing target ~2 net-new pillar pages/month) | 1 long YouTube walkthrough | — |
| Monthly | Newsletter sitemap flag audit (`portal_article=true`) | Rotation completes one full W1–W4 cycle | Monthly trend read |

Net realistic throughput: **~2 information-gain pages/month, never thin**, plus continuous on-page hardening and a steady off-site brand-mention drip — the safe scaling profile for a solo founder where citation beats ranking and one toxic fan-out can sink the whole domain.

Relevant repo files this engine builds on: `/Users/ghilesmoussaoui/Desktop/BizOps/muditek/website/muditek-web/src/lib/case-studies.ts`, `src/lib/industries.ts`, `src/lib/data-points.ts`, `src/app/sitemap.ts`, `src/components/json-ld.tsx`, `src/app/api/indexnow/route.ts`, `src/lib/client-analytics.ts`, `src/app/case-studies/[slug]/page.tsx`, and the new files to add: `src/lib/benchmarks.ts`, `src/lib/content-pillars.ts`, `scripts/publish-page.ts`, `scripts/lint-info-gain.ts`, `src/app/admin/seo/page.tsx`. Full prior context: `/Users/ghilesmoussaoui/Desktop/BizOps/muditek/website/muditek-web/SEO-GEO-AEO-PLAN.md`.