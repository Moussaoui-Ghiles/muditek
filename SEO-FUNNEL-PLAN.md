# SEO/GEO/AEO Funnel Plan — Resume Checklist

_Last updated: 2026-06-28. Canonical plan for the muditek.com content-funnel build. Resume from here._

## Locked strategy (do not re-litigate)
- muditek.com is a **pure content + traffic machine that funnels mainstream operators/founders into a FREE portal account.** Consulting is DEAD.
- Core theme = **AI agents / agentic engineering that replace real human work with no added headcount.** GTM/sales/marketing are sub-categories, not the spine.
- **The mechanic (proven):** valuable assets were login-gated = invisible to Google. Fix = build PUBLIC, statically-generated preview pages with real **info-gain** (hook + what's-inside + 150-300 word real excerpt) so they rank/get AI-cited, then **gate the full asset behind `/portal/...`** (free signup auto-subscribes the email).
- Guardrail: every programmatic page MUST carry real info-gain or the whole domain risks a thin-content demotion. **No em-dashes anywhere** (Ghiles's rule). No fabrication.

## SHIPPED — live on muditek.com (origin/main)
- [x] **Wave A technical plumbing** — robots Google/Applebot-Extended unblocked, JSON-LD entity graph, real sitemap dates, AI-referral tracking.
- [x] **Playbooks — 20 pages** `/playbooks` + `/playbooks/[slug]`. Data: `src/lib/playbooks.ts`.
- [x] **Skills — 47 pages** `/skills` + `/skills/[slug]`. Data: `src/lib/skills-public.ts`.
- [x] **Tool pages — 8 pages + index** `/tools` + `/tools/[slug]` (Google Maps + LinkedIn lead finders × verticals: agency, local-service, restaurant, b2b-saas, ecommerce, agency-decision-makers). Data: `src/lib/tools-public.ts`. Gate CTA → `/portal/tools/<toolSlug>`. publicHref added to `src/app/portal/tools-catalog.ts`. (origin/main `8cb8f0c`)
- [x] **Consulting trim** (origin/main `72fbb67`): 301-redirects in `next.config.mjs` for `/pe-ops` + `/mudiagent` → `/portal`, `/revenue-leak-audit` → calculator, `/mudiagent-vs-chatgpt` + `/pe-ops-vs-juniper-square` + `/who-we-help/*` → `/tools`; removed the stale `/tools` → calculator redirect that shadowed the new index. Every Book-a-Call / Outlook CTA replaced with a free-portal CTA on homepage, about, case-studies, revenue-leak-calculator; footer Contact → mailto. Homepage hero subhead + CTAs repointed to portal (H1 kept). Nav "Solutions" dropdown → "Tools" dropdown; footer dead Solutions/Industries columns + vs-page links removed. Offer routes dropped from `src/app/sitemap.ts`.
- [x] **Workflows — 50 pages + index + gated downloads** (origin/main `676eae0`): `/workflows` + `/workflows/[slug]` (50 SSG pages + OG images). Data: `src/lib/workflows-public.ts` (generated from `wf_docs.json` filtered to the 50, all n8n, 0 em-dashes, 233-270 word excerpts). Each public page = title + whatItDoes + node-graph timeline + apps chips + setup checklist + excerpt (all crawlable), HowTo + BreadcrumbList JSON-LD, gate CTA → `/portal/workflow-archive/[slug]`. Gated detail page `src/app/portal/workflow-archive/[slug]/page.tsx` + client `download-button.tsx` hit the existing `GET /api/portal/workflow-archive/[slug]/download`. Wired proxy public routes, sitemap, navbar (desktop + mobile), footer Learn column. Build verified: excerpt/node-graph/setup/JSON-LD/CTA all present in prerendered HTML.

## Wave 1 (Workflows) — DONE. Source data retained in `<SCRATCH>` (wf_docs.json = 109 docs, wf_top50_slugs.json = the 50). Do NOT re-run the 110-agent documentation workflow (cost ~7.5M tokens). 50 slugs still listed in the appendix below as insurance.

## OPEN DECISION — needs Ghiles (do not assume)
- **Homepage consulting prose still live, NOT yet rewritten** (I only did the approved hero + CTA swaps): the "Every engagement starts with a diagnostic, if we can't quantify the waste you don't pay" **guarantee section** + the **FAQ answers** ("we bill outcomes... guarantee in euros") in `src/app/page.tsx`, and similar guarantee/diagnostic FAQ copy. Asked Ghiles "leave or kill" — UNANSWERED as of compaction. Also the `MudikitCta` blocks on homepage + about reference "$47/mo MudiKit" / "skip the call" while MudiKit is dark. Confirm before touching (founder voice).

## Deploy procedure (CRITICAL — local main is diverged/stale)
Local `main` does NOT have the shipped funnel; all of it is on origin/main. NEVER build/commit on local main.
1. `git -C <repo> fetch origin` → `git -C <repo> worktree add --detach <SCRATCH>/wave-next origin/main` (a worktree may already exist at `<SCRATCH>/wave-next` from this session — reuse it; `git -C <wt> fetch && git -C <wt> reset --hard origin/main` to refresh).
2. In worktree: `cp <repo>/.env.local .` then `pnpm install --offline --ignore-scripts --prefer-offline` (Turbopack rejects a symlinked node_modules — must be real).
3. Edit in the worktree. `npx tsc --noEmit` (0) + `npm run build` (0). Grep the excerpt in prerendered HTML.
4. `git add <only your files>` (NEVER `git add .` — `tmp/` not gitignored) → commit, end msg with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
5. `gh auth switch --user Moussaoui-Ghiles` → `git push origin HEAD:main` → `gh auth switch --user Ghiles-CTO` (Ghiles-CTO push = 403). Repo: github.com/Moussaoui-Ghiles/muditek.
6. Poll `curl -s https://muditek.com/sitemap.xml | grep -c "/workflows/"` until the count appears (~2-5 min Vercel build).

## Key files / patterns
- Static-gen template to copy: `src/app/skills/` (index `page.tsx`, `[slug]/page.tsx`, `[slug]/opengraph-image.tsx`) + `src/lib/skills-public.ts`. Tool pages `src/app/tools/` + `src/lib/tools-public.ts` are the freshest copy.
- Reuse: `src/components/json-ld.tsx` `<JsonLd>`, `src/components/scroll-reveal.tsx`, `src/components/newsletter-inline.tsx`, `src/lib/og.tsx` `ogImage({eyebrow,accent,title,subtitle})`.
- Workflow data layer (already exists): `src/lib/workflow-archive.ts`, `src/lib/workflows-schema.ts`; gated download `GET /api/portal/workflow-archive/[slug]/download`; gated index `src/app/portal/workflow-archive/page.tsx` (list-only, no detail page yet).
- DB: Neon, `workflows` table (1,847 canonical: 1,804 n8n + 43 Make). `raw_json` JSONB. Query with `node` importing `<repo>/node_modules/@neondatabase/serverless/index.mjs` + `--env-file=<repo>/.env.local` (DATABASE_URL). `title` is on `content_items` (join `c.id = w.content_item_id`), NOT on `workflows`.
- Portal QA login (from muditek-web/CLAUDE.md): biz@ghiless.com.

## Gotchas
- Documentation workflow hit the account usage cap on a 110-agent burst, and transient "Server is temporarily limiting requests" on re-runs. It is now DONE (109/110). Do not re-run.
- Workflow tool `args` arrives as a STRING in the script — parse with `typeof args === 'string' ? JSON.parse(args) : args`.
- `tmp/` in the repo is NOT gitignored — stage explicit files only.
- Dedup programmatic pages by title signature (the 50 are already deduped).

## Appendix — the approved 50 workflow slugs (rank order)
1 voice-agent-tutorial-demo-64e15b
2 main-workflow-linkedin-scraper-cold-outreach-4e4e1d
3 prospectiq-engine-e139a8
4 linkedin-leads-scraping-enrichment-main-3b7d98
5 3-steps-lead-gen-automation-e0096e
6 googlesheetsdataprocessingandapiintegration-bcb122
7 s2l-2-cd3ad5
8 main-workflow-websitedatacrawleraiagent-ffe07b
9 ai-loom-outreach-skool-5589a8
10 create-email-campaign-from-linkedin-post-interactions-1a1af1
11 build-a-phone-agent-to-qualify-outbound-leads-and-inbound-calls-with-r-02efa7
12 apollo-scraper-dbc8f7
13 seo-blog-post-trends-template-25682b
14 google-maps-full-bba4ef
15 ai-powered-seo-keyword-research-automation-the-vibe-marketer-c57cb7
16 analyzeemailsandsendai-generatedresponses-7eef21
17 prospect-research-automation-skool-5b6fb8
18 property-lead-contact-enrichment-from-crm-859b58
19 enrichpipedriveleadswithclearbitandfilter-23fc28
20 marketing-team-agent-8d0d33
21 lead-generation-outreach-eb06f5
22 batchprocessdocumentswithaiandaggregateresults-cd313a
23 form-triggeredleadenrichmentandcrmupdate-c355d3
24 vsl-scraper-writer-shared-75a348
25 ai-social-video-generator-with-gpt-4-kling-blotato-auto-post-to-instag-6a7742
26 enrich-company-data-from-google-sheet-with-openai-agent-and-scraper-to-bfd0be
27 a8cd0476-6976-4027-8bf9-bceb5d9df1dd-1f7983
28 ai-powered-information-monitoring-with-openai-google-sheets-jina-ai-an-12de4a
29 search-linkedin-companies-score-with-ai-and-add-them-to-google-sheet-c-0fedbd
30 ai-social-media-publisher-from-wordpress-462b65
31 extractanddeduplicatedataforairtableupdate-16e611
32 webcontentanalyzerandtextprocessor-fcf1e5
33 automated-ai-powered-social-media-content-factory-for-x-facebook-insta-5f19fa
34 fab1cb75-cd14-497f-a3e5-2ff2f5243710-a6662f
35 analyzecustomerdataandupdatesupabasedatabase-ca16b0
36 telegrambotmanagetasksandupdategooglesheets-0df4c6
37 social-media-ai-agent-telegram-bc99a1
38 scraper-096db1
39 business-whatsapp-ai-rag-chatbot-105ddd
40 ai-phone-agent-with-retellai-b63bb7
41 telegramchatbotwithredismemoryandopenaiintegration-a35017
42 high-level-service-page-seo-blueprint-report-9f861b
43 executeapirequestsandprocessdataontrigger-f5003a
44 simple-linkedin-profile-collector-6d1ea6
45 ai-agent-to-chat-with-you-search-console-data-using-openai-and-postgre-cfdf15
46 unique-qrcode-coupon-assignment-and-validation-for-lead-generation-sys-9d8bb3
47 seo-post-756192
48 automated-research-report-generation-with-openai-wikipedia-google-sear-41c697
49 generate-seo-optimized-wordpress-content-with-perplexity-research-df66d1
50 organizeandsummarizegoogledrivefiles-a6f902
