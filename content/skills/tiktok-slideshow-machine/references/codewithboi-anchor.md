# Validated Reference Format — codewithboi Pyramid

The default format anchor for AI-tools niche issues. Replicate, do not redesign.

## Why this format

| Metric | codewithboi original | toujourshuss French copy |
|---|---|---|
| Likes | 77,000 | 24,500 |
| Saves | **55,900** | 22,700 |
| Comments | 632 | 353 |
| Shares | 5,687 | 2,285 |
| Slides | 2 | 2 |
| Save-ratio | 0.73 | 0.93 |

Replicated verbatim by another creator with translation only — proves the format is the unit of virality, not the creator.

## Anatomy

### Slide 1 — Hook (cream editorial)

- Background: cream `#EFEAE0`
- Top-left: small mono caps brand mark (`TESTED.AI`)
- Top-right: `Issue N°XXX · YYYY`
- Editorial 96px tab line
- Massive Fraunces serif headline (~150px) — 3-5 lines, italic accent for emphasis
- Sub-line under amber bar: 1 short sentence
- Body: 2 short lines, italic call-out
- Bottom: amber arrow + "Swipe for the full pyramid" mono caps

### Slide 2 — Pyramid (cream)

- Same brand mark + topbar
- Editorial tab line
- Smaller Fraunces serif headline + 1-line description
- Pyramid layout, top to bottom:
  - Tier 1 (1 logo): the keystone tool, 124×124 with subtle amber glow
  - Tier 2 (2 logos)
  - Tier 3 (4 logos)
  - Tier 4 (5 logos)
  - Tier 5 (6 logos)
  - Tier 6 (7 logos)
- Each tier has a category dot-label above (`• General assistants`, `• Development`, etc.)
- Below pyramid, dashed divider: "Automation · the layer beneath everything" + 7-logo row
- Bottom: thin border + footer "SAVE · SHARE" left, "→ TESTED.AI IN BIO" amber right

## Logo treatment

- Each logo: 92×92 (124 for keystone) cream-soft `#FAFAF6` rounded-square card
- 1px subtle border `rgba(31,28,24,0.08)`
- 4px subtle shadow
- Logo image: 76% of card, object-fit contain
- Tool name below in 14px Geist semibold

## Typography

- Display: **Fraunces** 600-700 (Google Font, free) — pair italic for emphasis
- Body: **Geist** 500-700 (Google Font, free)
- Mono: **Geist Mono** 500-600 for labels, brand mark, page numbers

## Color tokens

```
--cream: #EFEAE0          (slide bg)
--cream-soft: #F5F1E6     (logo cards)
--ink: #1F1C18            (primary text)
--ink-mid: #5B554D        (body text)
--ink-low: #8C857A        (mono labels)
--accent: #D26A3D         (amber accents)
--logo-bg: #FAFAF6
```

## When NOT to use this format

- New niches without validated viral references
- Topics that don't naturally tier (e.g. "how-to" content)
- After 5+ issues if save-rate <2,000 — switch to theasagency editorial format (see `references/theasagency-anchor.md` if added)
