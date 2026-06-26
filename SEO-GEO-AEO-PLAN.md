# Muditek.com SEO / GEO / AEO Execution Plan (2026)

Source of truth for execution. Built from a 5-specialist read-only audit of this repo + the live site (2026-06-25), grounded in fresh 2026 research on SEO, GEO (generative-engine optimization), and AEO (answer-engine optimization). Every item traces to a finding ID.

---

## 1. State of play

muditek.com is technically excellent and self-sabotaged in two places. Every marketing route is fully server-rendered (2,400–5,000+ words of real HTML, self-canonicals, unique titles, a correct linked `@id` entity graph of Organization + WebSite + Person, and type-appropriate per-page schema), the AI search-crawler allowlist is 2026-correct (OAI-SearchBot / Claude-SearchBot / PerplexityBot allowed, training bots blocked), IndexNow is wired with a valid key, and the prior `/buy` and OG-image issues are resolved — so JS-blind AI crawlers already get full, citable content (STRENGTH-01/02, SCHEMA-02/03, GEO-07). The two real wounds are both self-inflicted: `robots.ts` disallows **Google-Extended** (and Applebot-Extended), opting the entire site out of Gemini grounding and Google AI Overviews — the single largest AI answer surface — while it deliberately opts INTO ChatGPT/Claude/Perplexity (GEO-01 across all four reports); and `/ai-act`, one of the three core offers, is an empty directory that 307s crawlers into a Clerk sign-in wall (CRAWL-01). Beyond that, the content is written for a human scrolling a hero, not for snippet extraction: no answer-first BLUF blocks, slogan headings instead of verbatim questions, comparison "tables" that are CSS-grid `<div>`s, and no visible author/date (AEO-02/03/04/05). The off-site brand-mention footprint — the dominant AI-citation signal per Ahrefs — is near-zero, and AI referrals/crawler hits are completely unmeasured (GEO-04/05, GEO-11). Foundation is a 9/10; the gap to dominance is one robots line, one missing page, an on-page restructure, and an off-site brand campaign only Ghiles can run.

---

## 2. Decisions needed from Ghiles

1. **Reverse the Google-Extended (and Applebot-Extended) block?** *(GEO-01, AEO-01, SCHEMA-01, CONT-01, GEO-02)* — The token conflates AI-search grounding with model training; there is no robots-level way to allow one and block the other. Allowing it accepts some Gemini/Vertex training exposure in exchange for eligibility in Google AI Overviews + Gemini citations. **Recommended default: allow both.** For a public marketing site whose entire thesis is AI citation, the grounding upside dwarfs training exposure, and the posture is otherwise inconsistent. Keep the pure-training blocks (GPTBot/ClaudeBot/CCBot) — those are separate and defensible.

2. **Build `/ai-act` as a real pillar page, or redirect it away?** *(CRAWL-01, CONT-03, AEO-12)* — EU AI Act is in full application Aug 2026 and is a high-intent, low-competition cluster the ICP actively searches. Muditek owns real implementation data (fintech KYC audit log = Art. 9 risk management; telecom zero cloud egress = data sovereignty). **Recommended default: build it** as a genuine information-gain page grounded in the two existing case studies, add to `proxy.ts` + `sitemap.ts`. It is not thin programmatic filler.

3. **How aggressive on new demand-led content pages?** *(CONT-05, CONT-02)* — **Recommended default: ship 5 pillar pages, each anchored to one real case study with numbers no competitor has** (speed-to-lead, on-prem telecom, SaaS benchmarks, KYC automation, agency content). No thin templated fan-out. Each page must clear the information-gain bar or it doesn't ship.

4. **Connect an AI-visibility / keyword tool?** *(GEO-06)* — Citation share-of-voice across ChatGPT/Perplexity/Gemini is the actual GEO outcome metric and is currently untracked. **Recommended default: yes — stand up one monitor** (Profound, Peec, or DataForSEO LLM scraper, or a scheduled internal prompt job). Requires a budget/account decision.

5. **MudiKit relaunch framing (only if/when `SHOW_MUDIKIT_ON_WEBSITE` flips true)** *(CONT-08, SCHEMA-02/08, INDEX-01)* — `mudikit-vs-skool` / `mudikit-vs-circle` target "mudikit" which has near-zero external volume = thin pages that risk sitewide demotion. **Recommended default: kill/reframe both to demand-led queries** ("Claude Code skills library vs Skool", "AI operator toolkit vs Circle"), and do not ship self-serving AggregateRating without real third-party reviews. *(Deferred until MudiKit relaunch.)*

---

## 3. Phase 0 — Auto-fixes (no approval needed)

All `owner=claude-auto`, pure correctness. Ordered by impact. (The Google-Extended robots line itself is gated on Decision 1; everything else is unblocked.)

- [ ] **AI-referral analytics instrumentation** *(GEO-04, high)* — Add `src/lib/client-analytics.ts`: first-touch utility reading `document.referrer` + `utm_source`, tagging AI-assistant sources (chatgpt.com/openai, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai) as a session property/event into PostHog + GA4. Wire into `src/components/posthog-provider.tsx`. Build one PostHog insight + one GA4 custom channel group "AI Assistants".
- [ ] **Server-side AI crawler hit logging** *(GEO-05, high)* — Middleware/route handler logging request UA + path for known AI crawler UAs into a simple `/admin` view. Earliest leading indicator of citation candidacy.
- [ ] **AVIF/WebP image pipeline + optimized LCP hero** *(CWV-01, high)* — Add `images: { formats: ['image/avif','image/webp'] }` to `next.config.mjs`. Export `documents-desk` as AVIF/WebP, reference the optimized asset in the `src/app/page.tsx` preload (line 85) and `<video poster>` (line 95).
- [ ] **Comparison grids → real `<table>`; step/leak sequences → `<ol>`** *(AEO-04, high)* — Convert CSS-grid `<div>` matrices in `mudiagent-vs-chatgpt`, `pe-ops-vs-juniper-square`, `mudiagent`, `pe-ops`, `revenue-leak-audit`, `industry-page.tsx`, `case-studies/[slug]` to semantic `<table>`; convert phase/leak lists to `<ol>`. Identical Tailwind styling, no copy change.
- [ ] **BreadcrumbList on deep service/industry/comparison pages** *(SCHEMA-04, medium)* — Add to `industry-page.tsx`, `pe-ops`, `mudiagent`, `revenue-leak-audit`, both vs-pages. Mirror the existing `case-studies/[slug]` `@id` pattern.
- [ ] **Heading-hierarchy fix** *(AEO-11, medium)* — Demote tiny eyebrow labels (currently `<h2>`) to styled `<p>/<span>`; promote the dominant descriptive headline (currently `<h3>`) to `<h2>`. Bundle with AEO-03 rephrase.
- [ ] **Sitemap real per-page `lastModified`** *(AEO-06, medium)* — Drive `sitemap.ts` from real `dateModified` constants in comparison pages, `lib/industries.ts`, `lib/case-studies.ts`; stable date for static pages. Drop `force-dynamic` unless runtime-needed.
- [ ] **ProfilePage schema on `/about`** *(SCHEMA-05, medium)* — `ProfilePage`/`AboutPage` JSON-LD with `mainEntity → {@id #ghiles}` + `dateModified`, linking by `@id` only.
- [ ] **Comparison pages: WebPage → Article** *(SCHEMA-06, medium)* — Convert bare `WebPage` node to `Article` with `author {@id #ghiles}`, `publisher {@id #organization}`, `mainEntityOfPage`, `articleSection:"Comparison"`. Keep the ItemList. Resolves the OG `type=article` ↔ JSON-LD mismatch.
- [ ] **`/buy` single source of truth** *(INDEX-01, medium)* — Remove `/buy` from `next.config.mjs` `redirects()` and let `buy/page.tsx` own the logic (so a future MudiKit relaunch reaches `/mudikit`). Add a code comment.
- [ ] **`/tools` index redirect** *(CRAWL-02, low)* — `308 /tools → /tools/revenue-leak-calculator` in `next.config.mjs` to stop the 307-to-sign-in.
- [ ] **WebSite SearchAction integrity** *(CRAWL-03, low)* — Implement `?q=` filtering on `newsletter/page.tsx` or remove the SearchAction from `layout.tsx`.
- [ ] **Calculator static benchmark blocks** *(CONT-06, medium)* — Add an "Industry Benchmarks" section above the interactive tool: 3 answer-first 40–60 word blocks under verbatim-question H2s with named sources. Static HTML, survives JS rendering.
- [ ] **Case-study answer-first summaries** *(CONT-04, high)* — For all 5 case studies, add a static summary above the visual table: verbatim-question H2 + 40–60 word self-contained answer pulling the real metrics from `lib/case-studies.ts`.
- [ ] **IndexNow publish trigger** *(INDEXNOW-01, medium)* — Call `POST /api/indexnow` from the newsletter/content publish flow and on new case-study/industry deploys. Infrastructure exists; currently dormant.
- [ ] **Speakable on answer blocks** *(SCHEMA-09, low)* — Extend the newsletter `SpeakableSpecification` pattern to the new BLUF blocks.
- [ ] **Keep, don't expand** *(AISURF-01/GEO-08)* — `llms.txt` / `llms-full.txt` / `.md` negotiation stay as-is (harmless, zero proven lift). No further investment.

---

## 4. Phase 1 — On-page AEO + schema (gated on Ghiles copy approval)

Structural restructure of high-value pages. Markup-only items shipped in Phase 0; these change on-page wording (`owner=claude-needs-decision`).

- **Answer-first BLUF blocks** *(AEO-02)*: after each hero, a verbatim-question H2 + one self-contained 40–60 word paragraph. Copy largely exists in the bottom FAQ — elevate it. Pages: `page.tsx` ("What does Muditek actually do?"), `mudiagent` ("What is an on-premises AI digital employee?"), `pe-ops` ("What is private equity operations automation?"), `revenue-leak-audit` ("What is a revenue leak audit?"), `mudiagent-vs-chatgpt` ("Can I build an AI agent with ChatGPT?"), `pe-ops-vs-juniper-square` ("What is the best Juniper Square alternative?").
- **Verbatim-question headings** *(AEO-03)*: rephrase each major section H2 as the question it answers, slogan demoted to a styled sub-line.
- **FAQ questions → real query phrasing** *(AEO-10, SCHEMA-07)*: in `faq-block.tsx`, mirror each objection-statement with the actual search query in the `<h3>`. Keep FAQPage JSON-LD for AI parsing only — **zero Google rich result** (deprecated May 7 2026).
- **Visible author byline + dateline (E-E-A-T)** *(AEO-05)*: `By Ghiles Moussaoui, Founder · Updated {dateModified}` on service, comparison, case-study pages. Data already in JSON-LD; surface it.
- **Evidence density / crawlable citations** *(AEO-07)*: attach a real linked source to each external stat (a16z, IBM Cost of a Data Breach, the 42-hour speed-to-lead study). Drop any stat that can't be sourced — never fabricate. (Princeton GEO: cited sources + quoted stats each ~+30–40% AI visibility.)
- **Author authority** *(AEO-09, SCHEMA-08)*: expand `/about` bio and the Person `sameAs` array with real existing profiles. Strip self-serving AggregateRating before any MudiKit relaunch.
- **Year handling** *(AEO-12)*: centralize the hardcoded "in 2026" into a computed-year constant.

---

## 5. Phase 2 — Content clusters + information-gain pages (gated on Decisions 2 & 3)

Build ONLY where the site owns differentiating data — no thin fan-out (mass programmatic is sitewide-toxic in 2026).

- **Dead-weight brand-term pages** *(CONT-02, CONT-08)*: `/mudiagent`, `/pe-ops`, `/revenue-leak-audit` capture zero top-of-funnel intent → give each a demand-led alt-H1/subtitle mirroring a real query. `/mudikit-vs-skool` and `/mudikit-vs-circle` are thin by definition → kill or reframe before any MudiKit launch.
- **Sequenced new pages:**
  1. **`/ai-act` pillar** *(Decision 2)* — "What does the EU AI Act require for financial services and telecom in 2026?" grounded in the fintech (Art. 9) + telecom (data sovereignty) case studies. Add to `proxy.ts` + `sitemap.ts`.
  2. **5 case-study-backed pillar pages** *(Decision 3)*: (a) speed-to-lead 47min→60s; (b) on-prem telecom SLA without cloud egress; (c) B2B SaaS pipeline benchmarks 2026; (d) KYC automation 14-day→48h; (e) agency content 20h→20min.
  3. **Newsletter sitemap audit** *(CONT-07)* — flag content-rich AI/n8n/SDR/revops/compliance issues `portal_article=true` so they enter the sitemap. DB action; sitemap logic already correct.
  4. **MudiKit skills catalog** *(CONT-10, only if flag flips)* — public crawlable catalog; 63-skill library currently fully walled off.

---

## 6. Phase 3 — GEO off-site (Ghiles-only, runs in parallel over months)

The dominant AI-citation lever and the real bottleneck. Off-site mentions beat backlinks ~3:1 for AI citation (Ahrefs 75k brands, r=0.66 vs 0.22). Ranked by evidence:

1. **YouTube** (strongest single signal, r=0.74) — channel with case-study walkthroughs, chapter-timestamped. Add channel URL to footer + `/about`.
2. **Unlinked brand mentions** of "Muditek" / "Ghiles Moussaoui" tied to the exact target entities across Reddit, Quora, podcasts, roundups.
3. **Named, verifiable client reference** — at least one logo-on-page or first-name-plus-firm-type reference the client approves.
4. **Directory listings** — G2 / Capterra / Trustpilot for mudiAgent and pe-ops.
5. **Entity profiles** — Crunchbase + Wikidata, then feed resulting URLs into `sameAs` in `layout.tsx`.
6. **Bing Webmaster Tools** — submit sitemap + verify domain; feeds the Bing index ChatGPT Search pulls from.
7. **Digital PR / guest posts** naming Muditek.

---

## 7. Measurement

Instrument outcomes, not just clicks (clicks collapsing ~38% as AI Overviews intercept ~half of queries):

- **AI referrals** *(GEO-04)* — PostHog insight + GA4 "AI Assistants" channel group. Currently mislabeled as "direct". Single most important GEO traffic KPI.
- **AI crawler hit rate** *(GEO-05)* — server-side log of OAI-SearchBot / PerplexityBot / Claude-SearchBot fetches by path.
- **AI citation share-of-voice** *(GEO-06, Decision 4)* — per-platform monitor (only 11% of domains are cited by both ChatGPT and Google AI Overviews → per-platform tracking is mandatory).
- **Branded search + impressions** — GSC, the lagging signal that off-site mentions are landing.
- **Snippet/answer-block performance** — gate: page must already rank top-5 for AEO extraction to fire.
- **IndexNow submission log + Bing indexation coverage.**

---

## 8. Sequenced timeline

- **Week 0 — Decisions (Ghiles):** 1–5. Decision 1 (Google-Extended) is the single highest-leverage action — unblock first.
- **Week 1 — Claude executes Phase 0:** Google-Extended fix → AI-referral analytics + crawler logging → AVIF/LCP → table/`<ol>` + breadcrumb + heading-hierarchy → sitemap `lastModified` → ProfilePage + Article schema → `/buy` + `/tools` + SearchAction → calculator & case-study answer blocks → IndexNow trigger. Mostly no inter-dependencies; batch them.
- **Week 2 — Claude executes Phase 1 (copy approval per item):** BLUF blocks → verbatim-question headings → FAQ rephrase → byline/dateline → evidence citations → author bio + sameAs → year centralization.
- **Weeks 3–5 — Claude executes Phase 2 (Decisions 2 & 3):** `/ai-act` pillar → 5 case-study pillars → newsletter sitemap flagging → MudiKit catalog if Decision 5 flips.
- **Weeks 1–∞ — Ghiles executes Phase 3 in parallel:** YouTube (start now, highest leverage) → Bing WMT (week 1) → Reddit/Quora/podcasts → named client reference → G2/Capterra/Trustpilot → Crunchbase/Wikidata → digital PR.
- **Continuous — Measurement:** dashboards in Week 1; AI-visibility monitor once Decision 4 budget approved. Judge by AI citation share + AI referrals + branded search, not blue-link clicks.
