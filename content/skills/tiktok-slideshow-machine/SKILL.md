---
name: TikTok Slideshow Machine
description: Turn a verified TikTok slideshow reference into editable 9:16 HTML slides and local PNG files. Preserve the reference's structure, use only supported claims, render in the browser, and complete a manual visual and posting check.
version: 1.0.0
---

# TikTok Slideshow Machine

Build a slideshow from a real reference and render it locally. The bundle does not post to TikTok and does not require a paid API.

## What is included

- `assets/slides-template.html`: self-contained two-slide starter.
- `scripts/render.mjs`: Playwright renderer for every `<section class="slide">`.
- `scripts/download-logo.sh`: optional favicon downloader with no API key.
- `prompts/`: source review, hook, caption, and copy constraints.
- `references/`: layout, rendering, visual QA, and manual posting rules.
- `templates/`: JSON records for a source format and local assets.

## Required input

Collect:

1. the original post URL or complete screenshots;
2. the capture date and any visible metrics;
3. every slide in order;
4. the new topic and verified source material;
5. the account name, visual tokens, and approved CTA;
6. the intended output folder.

Do not copy a format from memory. Do not invent missing slides, metrics, product verdicts, quotations, or first-person tests.

## 1. Reverse-engineer the reference

Use `prompts/reverse-engineer.md`.

Record:

- hook structure;
- slide count and role of each slide;
- information density;
- text position and hierarchy;
- image or logo treatment;
- transition from setup to payoff;
- final action;
- elements that are evidence versus decoration.

Save the result with `templates/format-schema.template.json`. Metrics are evidence about the captured post, not a forecast for the new post.

## 2. Lock the new content

Write a short content ledger:

- exact claim;
- supporting facts and sources;
- promised payoff;
- slide-by-slide evidence;
- approved CTA;
- facts that are unknown or private.

The new slideshow may reuse the reference's structure and visual logic. It may not reuse unsupported facts or present another creator's result as the user's result.

## 3. Prepare the work folder

Create an empty folder, then copy:

```bash
cp assets/slides-template.html ./work/slides.html
cp scripts/render.mjs ./work/render.mjs
```

Install Playwright in the work project if it is not already available:

```bash
npm install --save-dev playwright
npx playwright install chromium
```

## 4. Edit the slides

Open `work/slides.html` and replace every bracketed placeholder.

Keep:

- a 1080 x 1920 canvas;
- one role per slide;
- readable contrast;
- safe margins around all text;
- a clear order from hook to payoff;
- one action after the payoff.

Add or remove `<section class="slide">` elements as required. The renderer discovers the sections automatically.

Use `scripts/download-logo.sh` only when a real logo helps the reader identify a named product. Verify the result and keep the source domain in the asset record.

## 5. Render

From the work folder:

```bash
node render.mjs
```

The script creates `slide-01.png`, `slide-02.png`, and so on at 1080 x 1920 pixels.

## 6. Inspect every image

Use `references/recurring-mistakes.md` as the QA checklist.

Do not approve the set from the HTML alone. Open every PNG and check it at full size and as a small phone preview.

Fix and render again when:

- text is clipped or hard to scan;
- the visual order is unclear;
- a source image or logo failed;
- the hook promises information the later slides do not provide;
- the final slide asks for more than one action.

## 7. Write the caption

Use `prompts/caption-generator.md`. The caption must add context or attribution. It must not repeat the hook or add an unsupported result.

## 8. Hand off for manual posting

Return:

- the ordered PNG files;
- the caption;
- any hashtags supported by current manual research;
- the approved CTA;
- source links;
- the completed manual checklist.

Do not automate posting or claim a post is live.
