---
name: tiktok-slideshow-machine
description: This skill should be used when the user asks to "make a TikTok slideshow", "produce an issue", "build the next TESTED.AI post", "render slides", "scrape TikTok for viral references", "add a niche", "swap the format", or mentions TESTED.AI / theme page / pyramid format / CPA affiliate. Operates inside `marketing/tiktok/` to produce shippable 1080×1920 PNG slides + caption + posting checklist for faceless TikTok theme pages.
version: 1.0.0
---

# TikTok Slideshow Machine

Produce shippable TikTok slideshow content for faceless theme pages monetized via CPA affiliate offers. Operates inside `marketing/tiktok/` in the BizOps vault.

## Hard rules

1. **Anchor every issue to a real viral reference.** Before designing or rendering anything, scrape TikTok via Claude in Chrome and capture screenshots of at least 1 viral post (>10K views) in the niche. Save references to `niches/<niche>/asset-library/references/`. Do NOT design from imagination.
2. **Use real brand logos, not CSS mockups.** Download via Google's free favicon API using `scripts/download-logo.sh`. Verify each PNG is valid before rendering.
3. **Render to PNG via Playwright headless.** Use the bundled `scripts/render.mjs` (chromium, viewport 1080×1920, deviceScaleFactor 2). Output is the file the user posts.
4. **Manual posting only.** Output ends at PNG slides + `POST.md`. Never automate the TikTok app itself.
5. **Native text overlay only on the hook slide.** Type the hook copy natively in TikTok app per slide. Per the roman-khaves source note, TikTok ranks posts with native overlays higher. Bake everything else into the PNG.
6. **No paid tools.** Claude + GPT Plus + free APIs only. No Apify, no Brandfetch, no Nano Banana paid API, no proxies.
7. **No fabrication.** Never invent metrics, viral counts, or product-specific verdicts. Cite scraped data with timestamp. Mark estimates clearly.

## When to use

Trigger on user phrases including:

- "make / build / produce a TikTok slideshow"
- "build the next TESTED.AI post" / "issue NXXX"
- "render slides" / "swap the format" / "test a new format"
- "add a niche" / "scrape TikTok for viral refs"
- "next issue from backlog"
- "post for tonight" / "post for the morning"

## When NOT to use

- LinkedIn content → use `linkedin-content-writer`
- Long-form X / threads → separate skill
- Video content → slideshows only
- Anything tied to Ghiles' face / Muditek brand → this is faceless, kept separate

## Standard workflows

### A. Scrape and reverse-engineer viral references for a niche

Trigger: user adds a new niche OR validation hasn't been refreshed in >30 days.

1. Ensure `mcp__claude-in-chrome__*` tools are loaded via ToolSearch.
2. Navigate `tiktok.com/search?q=<niche-keywords>`.
3. Extract photo posts from `[data-e2e="search_top-item"]`. Filter posts with `/photo/` URLs.
4. Sort by view count. Pick top 3-5 with >10K views.
5. For each post, navigate, click through carousel using `mcp__claude-in-chrome__computer` (right arrow ~coords [728, 687]), capture each slide via `zoom` action with `region: [388, 14, 968, 763]`.
6. Document creator, URL, likes, saves, comments, shares, slide count, save-ratio, format description in `niches/<niche>/validation.md`.
7. Identify formats replicated by ≥2 creators. High save-ratio (>1.0) signals high-bookmark-value content.

### B. Produce one shippable issue (the validated pipeline)

Reference implementation: `marketing/tiktok/niches/ai-tools/content/2026-05-04/issue-027/`.

1. **Pick topic.** Pull the next from `niches/<niche>/backlog.md` OR write a new one tied to the validated format anchor.
2. **Pick format anchor.** Read `references/codewithboi-anchor.md` for the default. For variants see niche-specific format references.
3. **Download missing logos.** For any tool not yet in `niches/<niche>/asset-library/logos/`:
   ```bash
   .claude/skills/tiktok-slideshow-machine/scripts/download-logo.sh <name> <domain> niches/<niche>/asset-library/logos
   ```
4. **Copy template + renderer.** Per `references/render-pipeline.md`:
   ```bash
   cp .claude/skills/tiktok-slideshow-machine/assets/slides-template.html niches/<niche>/content/<YYYY-MM-DD>/issue-NXXX/slides/slides.html
   cp .claude/skills/tiktok-slideshow-machine/scripts/render.mjs niches/<niche>/content/<YYYY-MM-DD>/issue-NXXX/slides/render.mjs
   ```
5. **Edit `slides.html`.** Swap topic copy, swap logo paths to current tool list. Verify relative paths to `asset-library/logos/` (4 levels up from `slides/`).
6. **Render.** From the slides folder:
   ```bash
   ln -sf /Users/ghilesmoussaoui/.npm/_npx/705bc6b22212b352/node_modules node_modules
   node render.mjs
   ```
   Outputs `slide-01.png`, `slide-02.png` etc. at 1080×1920, deviceScaleFactor 2.
7. **Visual QA.** Read each PNG. Check: real logos load, no overlapping labels, no orphan words, brand mark visible. See `references/render-pipeline.md` for the full QA list.
8. **Write `POST.md`.** Caption, hashtags, native-overlay text, sound guidance, posting checklist. Use the issue-027 `POST.md` as template.

Output structure:

```
content/<YYYY-MM-DD>/issue-NXXX/
├── slides/
│   ├── slides.html      (editable)
│   ├── render.mjs       (renderer)
│   ├── node_modules     (symlink — gitignored)
│   ├── slide-01.png     (1080×1920 hook)
│   └── slide-02.png     (1080×1920 pyramid)
└── POST.md              (caption + native overlay + checklist)
```

### C. Add a new niche

1. Run workflow A to scrape viral references.
2. Pick the format with the highest save-ratio that's been replicated by ≥2 creators.
3. Document in `niches/<niche>/brand.md` (colors, fonts, motif, account handle, bio strategy).
4. Build asset library: download initial logo set via `scripts/download-logo.sh` for the tools the niche covers.
5. Write `niches/<niche>/backlog.md` with at least 14 issues queued.
6. Run workflow B for the first issue.

### D. Update tracker after a post lands

Trigger: user reports post results.

1. Append a row to `marketing/tiktok/tracker.csv` with `post_id`, `posted_at`, `views_24h`, `views_7d`, `likes`, `saves`, `shares`, `comments`, `bio_clicks`, `cpa_conversions`, `usd_earned`.
2. Compare against format-level performance over last 7-14 days.
3. If a format's view-median <50K across 5+ posts → mark it `status: kill` and switch to next anchor.
4. If a format's view-median >100K → produce v2 with 1-2 small variations to A/B.

## Folder map

```
marketing/tiktok/
├── CLAUDE.md
├── tracker.csv
├── offers/{cpa-network-research,offer-bank}.md
└── niches/<niche>/
    ├── validation.md       (scraped viral refs)
    ├── backlog.md          (next 14 issues queued)
    ├── brand.md            (colors, fonts, motif)
    ├── asset-library/
    │   ├── logos/          (downloaded brand favicons, 128×128 PNG)
    │   └── references/     (screenshots of viral posts)
    └── content/<YYYY-MM-DD>/issue-NXXX/
        ├── slides/         (slides.html + render.mjs + slide-XX.png)
        └── POST.md         (caption + checklist)
```

## Bundled resources

### Scripts (`scripts/`)

- **`render.mjs`** — Playwright headless Chromium renderer. Reads `slides.html`, screenshots each `<section>` element to a 1080×1920 PNG.
- **`download-logo.sh`** — wraps `curl` against Google's favicon API. Verifies the result is a valid PNG.

### Assets (`assets/`)

- **`slides-template.html`** — the validated codewithboi pyramid template. Copy into each new issue's `slides/` folder, then edit copy + logo paths.

### References (`references/`)

- **`codewithboi-anchor.md`** — the default format anchor (validated 77K likes / 55.9K saves, replicated). Color tokens, typography stack, layout spec.
- **`render-pipeline.md`** — step-by-step rendering, dependency setup, why Playwright + Google favicon API.
- **`posting-checklist.md`** — the human-operator checklist for the TikTok app. What to do after the PNGs are rendered.

## Source material

Read these source notes before strategic decisions about format, cadence, account scaling, or monetization:

- `library/sources/twitter/roman-khaves/2026-04-04-tiktok-ai-slideshow-app-growth-system` — most complete blueprint
- `library/sources/twitter/ky-markets/2026-04-04-cpa-affiliate-faceless-tiktok-system` — CPA economics
- `library/sources/twitter/oliver-henry/2026-01-16-ai-agent-tiktok-marketing-larry` — hook formula, real numbers
- `library/sources/twitter/jacobgrowth/2026-03-23-content-pipeline-openclaw-postiz-content-rewards` — distribution stack
- `library/sources/twitter/davie-fogarty/2026-04-04-ai-brand-builder-ecom-vs-agencies` — CONTRARIAN counter-take, flag risk before scaling

## Build plan

Original plan: `~/.claude/plans/alright-can-you-build-binary-codd.md`. Validated implementation completed 2026-05-05 with issue-027 of TESTED.AI.
