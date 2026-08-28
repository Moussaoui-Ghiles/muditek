# Local render pipeline

## Requirements

- Node.js 18 or later.
- Playwright and its Chromium browser.
- The bundled `slides.html` and `render.mjs` in the same work folder.

## Setup

```bash
mkdir slideshow-work
cp assets/slides-template.html slideshow-work/slides.html
cp scripts/render.mjs slideshow-work/render.mjs
cd slideshow-work
npm init -y
npm install --save-dev playwright
npx playwright install chromium
```

Edit `slides.html`, then render:

```bash
node render.mjs
```

The renderer finds every `<section class="slide">` in document order and writes numbered PNG files.

## Image and font handling

Prefer local files for logos and images. Use paths relative to `slides.html`.

The starter uses local font fallbacks, so it renders without a network request. If you add a web font, confirm the license and render once with the network unavailable.

## Required checks

- Each output is 1080 x 1920 pixels.
- Output count equals the number of slide sections.
- No element extends past the slide edge.
- No broken image icon or alt text is visible.
- Text remains readable in a phone-size preview.
- Rendering succeeds without a paid provider or model request.
