---
name: Muditek
description: A high-contrast AI systems library, commercial site, and member workspace.
colors:
  marketing-background: "#050A0F"
  marketing-foreground: "#E8EBEE"
  marketing-card: "#0C1118"
  marketing-layer: "#14191F"
  marketing-border: "#1F262E"
  amber: "#F59E0B"
  portal-background: "#0C0C0E"
  portal-card: "#151517"
  portal-border: "#232326"
  portal-foreground: "#E8E8EC"
  portal-muted: "#D4D4D8"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  portal:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  marketing-action: "2px"
  control: "10px"
  surface: "12px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  section: "96px"
components:
  marketing-button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.marketing-background}"
    rounded: "{rounded.marketing-action}"
    padding: "16px 28px"
  marketing-button-secondary:
    backgroundColor: "{colors.marketing-background}"
    textColor: "{colors.marketing-foreground}"
    rounded: "{rounded.marketing-action}"
    padding: "16px 28px"
  portal-button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.portal-background}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  portal-input:
    backgroundColor: "{colors.portal-card}"
    textColor: "{colors.portal-foreground}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
---

# Design System: Muditek

## Overview

**Creative North Star: "The Operator's Control Room"**

Muditek uses a dark, high-contrast visual system that feels like a serious operating environment. Amber marks the next action and important state. It is scarce enough to remain useful. Public marketing and library pages use large type, strong pacing, technical diagrams, and controlled motion. Authenticated screens use the same identity with tighter spacing, Geist typography, and familiar controls.

The system rejects generic SaaS card grids, gated-excerpt patterns, decorative AI effects, and invented visual proof. It also rejects a cinematic treatment inside task screens. Visual expression belongs on public pages. The portal stays quiet enough for repeated use.

**Key Characteristics:**

- Dark navy public canvas with a single amber action color.
- Near-black portal surfaces with dense, familiar controls.
- Strong type hierarchy, short labels, and readable body text.
- Tonal depth first. Shadows appear only when state or hierarchy needs them.
- Responsive structure and reduced-motion alternatives at every breakpoint.

## Colors

The palette uses deep navy and neutral black surfaces, pale cool text, and one amber accent.

### Primary

- **Signal Amber:** The only primary action and active-state color. Use it for the current CTA, selected state, focus reinforcement, and concise highlights.

### Neutral

- **Night Navy:** The public page canvas. It carries cinematic media without losing contrast.
- **Deep Navy Card:** The public raised surface for tools, source panels, and meaningful grouped content.
- **Steel Layer:** The quiet secondary surface for filters and low-priority controls.
- **Cool White:** Primary text on dark public surfaces.
- **Portal Black:** The authenticated workspace canvas.
- **Portal Graphite:** The portal card and input surface.
- **Portal Silver:** Secondary portal text that remains readable at body size.

**The Amber Signal Rule.** Amber identifies an action or state. It never becomes background decoration.

**The Readable Muted Rule.** Muted body text must meet a 4.5:1 contrast ratio. Lower-contrast text is limited to large decorative labels that still meet 3:1.

## Typography

**Display Font:** Inter, with the system sans fallback.
**Body Font:** Inter, with the system sans fallback.
**Portal Font:** Geist, with the system sans fallback.

**Character:** Public type is forceful and compact. Portal type is neutral and precise. Instrument Serif can appear as a rare editorial accent, never as a control label.

### Hierarchy

- **Display** (900, fluid up to 6rem, 0.95 line height): Public hero headings only.
- **Headline** (900, 2.25rem to 4rem, 1.0 line height): Major public sections.
- **Title** (600 to 900, 1.125rem to 1.75rem, 1.2 line height): Asset names and tool sections.
- **Body** (400, 1rem, 1.7 line height): Explanations and long-form content, limited to 70 characters per line.
- **Portal** (400 to 600, 0.875rem, 1.5 line height): Repeated interface content and data.
- **Label** (600, 0.75rem, normal or lightly tracked): Short navigation, field, status, and metadata labels.

**The Two-Register Rule.** Public pages use Inter and broad spacing. Portal screens use Geist and tighter fixed scales.

**The Legible Display Rule.** Display text never exceeds 6rem and never tracks tighter than -0.04em.

## Elevation

The system is flat by default. Public depth comes from tonal layering, media, narrow highlights, and occasional ambient glow. Portal depth comes from adjacent surface colors and clear borders. Wide soft shadows and a 1px border never decorate the same static card.

### Shadow Vocabulary

- **Interactive lift** (`0 8px 8px rgba(0, 0, 0, 0.24)`): A short hover response on a public interactive surface.
- **Overlay separation** (`0 12px 32px rgba(0, 0, 0, 0.45)`): Menus and dialogs only.

**The Flat-at-Rest Rule.** Static content surfaces use a tone or a border. A shadow signals elevation or an interaction state.

## Components

### Buttons

- **Shape:** Public actions use square, precise corners (2px). Portal controls use compact, gently rounded corners (10px).
- **Primary:** Signal Amber with dark text. Use one primary action per decision area.
- **Hover / Focus:** Hover may move a public action by no more than 2px. Every action receives a visible 3px focus ring. Reduced motion removes translation.
- **Secondary:** Transparent or dark surface, Cool White text, and one clear border. The label states the resulting action.

### Cards / Containers

- **Corner Style:** Public editorial sections can remain square. Tool and portal surfaces use 10px to 12px corners.
- **Background:** Deep Navy Card for public functional content. Portal Graphite for account content.
- **Shadow Strategy:** Flat at rest. Use the elevation vocabulary only for overlays or interactive lift.
- **Border:** One restrained full border when separation is necessary. No colored side stripe.
- **Internal Padding:** 24px to 32px in public tools. 16px to 24px in the portal.

### Inputs / Fields

- **Style:** Dark filled surface, 10px corners, persistent labels, and readable placeholder text.
- **Focus:** Border change plus a 3px focus ring. Focus never depends on color alone.
- **Error / Disabled:** Error includes text and `aria-describedby`. Disabled controls retain readable labels and cannot be mistaken for active controls.

### Navigation

Public navigation keeps Appointment Setting, AI Implementation, Library, About, one qualification CTA, and one account action. Active and focus states are explicit. Mobile navigation uses a real button, locks page scroll while open, closes with Escape, and returns focus to its trigger.

Portal navigation uses standard sidebar and breadcrumb patterns. It exposes Advanced Skills, Recent Activity, Downloads and Versions, Newsletter Preferences, and Account. It does not show empty future sections.

### Library Asset Page

Each asset page starts with an answer, then states the problem, inputs, outputs, prerequisites, files, version, source, and relevant next step. The page remains readable without authentication. A gate can protect only the complete advanced download.

## Do's and Don'ts

### Do:

- **Do** preserve the dark navy, amber, high-contrast identity across public routes.
- **Do** keep public pages expressive and portal pages dense and task-focused.
- **Do** use semantic HTML, visible focus, keyboard interaction, and reduced-motion alternatives.
- **Do** test every changed layout at 390px, 768px, and 1440px.
- **Do** keep one relevant commercial next step on each public asset.

### Don't:

- **Don't** use equal-offer layouts that make three unrelated services appear equally important.
- **Don't** use generic SaaS card grids, gated excerpts, or newsletter popups as a funnel substitute.
- **Don't** represent invented metrics, composite case studies, unsupported claims, or decorative proof.
- **Don't** use generic AI tool marketing, gradient text, decorative glass, or visual effects without meaning.
- **Don't** overdecorate portal screens, ship empty beta cards, or replace familiar controls with custom ones.
- **Don't** use colored side stripes, large static card shadows, or corners above 16px on cards and fields.
