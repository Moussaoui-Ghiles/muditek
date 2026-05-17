# Render Pipeline (Validated)

How to turn a `slides.html` file into shippable 1080×1920 PNGs.

## Stack

- **Playwright** (already installed at `/Users/ghilesmoussaoui/.npm/_npx/705bc6b22212b352/node_modules/playwright`)
- **Headless Chromium** via Playwright
- **Node.js** ≥18 (already installed via Homebrew)
- **Geist + Fraunces + Geist Mono** loaded from Google Fonts CDN at render time

## Step-by-step

### 1. Copy the template into the issue folder

```bash
cp .claude/skills/tiktok-slideshow-machine/assets/slides-template.html \
   marketing/tiktok/niches/<niche>/content/<YYYY-MM-DD>/issue-NXXX/slides/slides.html

cp .claude/skills/tiktok-slideshow-machine/scripts/render.mjs \
   marketing/tiktok/niches/<niche>/content/<YYYY-MM-DD>/issue-NXXX/slides/render.mjs
```

### 2. Edit `slides.html` with topic content

Replace placeholder copy in slide 1 (hook headline + sub + body) and slide 2 (logos + tool names + tier labels).

Verify relative paths to logos. From `slides/slides.html` 4 levels up to `niches/<niche>/`:

```html
<img src="../../../../asset-library/logos/cursor.png" alt="Cursor">
```

### 3. Symlink Playwright into the slides folder

Each issue folder needs `node_modules` to resolve `import { chromium } from 'playwright'`:

```bash
cd marketing/tiktok/niches/<niche>/content/<YYYY-MM-DD>/issue-NXXX/slides
ln -sf /Users/ghilesmoussaoui/.npm/_npx/705bc6b22212b352/node_modules node_modules
```

### 4. Render

```bash
node render.mjs
```

Output: `slide-01.png`, `slide-02.png` (and so on for multi-slide formats), 1080×1920 at deviceScaleFactor 2 (so actual file is 2160×3840 — TikTok auto-downsamples).

### 5. Visual QA

Read each PNG. Check:

- ✓ All real logos load (no broken `alt` text shown)
- ✓ No category labels overlap logos
- ✓ No orphan words ("for" alone on its own line — fix with `text-wrap: balance` or rewriting copy)
- ✓ Brand mark visible top-left
- ✓ Pyramid is symmetric (each tier centered)
- ✓ Footer reads correctly

### 6. If logos are missing

Download via the bundled script:

```bash
.claude/skills/tiktok-slideshow-machine/scripts/download-logo.sh \
  cursor cursor.com \
  marketing/tiktok/niches/<niche>/asset-library/logos
```

Then re-render. Logos save as 128×128 PNG via Google's free favicon API (no key needed, ~5KB each).

## Why Playwright over alternatives

| Approach | Why not |
|---|---|
| `chrome --headless --screenshot` | macOS Chrome path issues, no element-targeted screenshots, captures whole window |
| Take screenshot of browser | Includes browser chrome, not 1:1 1080×1920 |
| Puppeteer | Same idea but Playwright is what's already installed |
| Image generation API (GPT-Image / Nano Banana) | Cost + can't render text reliably + project rule = no paid API |
| Canva manual | Slow, breaks the per-issue 5-min budget |

## Why Google's favicon API for logos

| Source | Why not |
|---|---|
| Clearbit | Deprecated late 2024 |
| Brandfetch | Now requires API key (paid) |
| Simple Icons | Single-color SVG only — strips brand colors |
| Wikipedia/Wikimedia | Inconsistent availability + URL stability |
| Manual download from each brand | Doesn't scale to 30+ logos per issue |
| Google s2 favicon API | ✅ Free, no key, 128px (enough at 92px display), reliable, handles brand colors |
