# Recurring Mistakes — Don't Repeat

Audit list of mistakes already made on past issues. Check every new slide against this list BEFORE rendering, not after.

## Layout

1. **Half-empty slides.** Hook text at top + dead vertical space at bottom = looks unfinished. Slide must have visual gravity all the way down — either fill with content, push the body lower, or anchor the bottom with a strong visual element. `margin-top: auto` on the footer creates the dead zone — kill it or fill it.
2. **Top-heavy gravity.** Headline + sub-block + body all clustered in top third = 60%+ empty cream below. Vertical-center the main content block OR scale headline up until it fills the screen.
3. **Inconsistent density between slides.** Slide 1 = 40% filled. Slide 4 = 90% filled. Same slideshow = jarring. Every slide should have similar visual weight.
4. **Swipe arrow/footer floating.** When pushed to bottom by `margin-top: auto`, leaves a void above. Either anchor footer to content (no auto-push) or add a transitional element (rule line, preview tile, decorative motif) between body and footer.
5. **No bottom anchor on hook slide.** Editorial cream + serif text alone = no visual stopping power. Add: oversized numeric callout, decorative rule, preview-of-next-slide tile, or repeated motif row.

## Content

6. **Fabricated metrics.** "I tested 200+ tools" / fake follower counts / made-up revenue numbers. Per CLAUDE.md no-fabrication rule. Only cite numbers that come from a source — and attribute.
7. **Fake series markers.** "Issue N°027" on a first-ever post = looks like fake authority. No issue numbers until series actually exists.
8. **Brand name missing from slides.** Account handle must appear top-left AND in footer CTA — otherwise viewer has no way to remember the page.
9. **Wrong CTA for upload format.** "Swipe for the full pyramid" on a video upload = dishonest. Match CTA copy to actual playback mode (auto-play vs swipe).

## Format

10. **Template reuse without re-checking fit.** Copying issue-027 template into a 5-slide deck without redesigning for different content shape. Each topic needs layout that fits the content, not vice versa.
11. **No comparison to validated viral reference after render.** Hard rule #1 of the skill = anchor every issue to a real viral reference. After render, side-by-side with the reference. If gravity / density / typography hierarchy differs significantly, fix.

## Process

12. **Render → show user → user finds dead space → redo.** QA must happen before showing. Visual check: does any slide have >25% empty space below the last text block? If yes, fix before showing.
13. **No pre-render checklist applied.** Use this file as the checklist for every new slide. Read it before writing slides.html, not after.

## Per-render checklist (apply BEFORE first render)

- [ ] Every slide fills the vertical space (no >25% bottom dead zone)
- [ ] All slides have similar density (visual weight is consistent across the deck)
- [ ] Brand handle in top-left + footer of every slide
- [ ] No fabricated metrics — every number traces to a source
- [ ] No fake series markers unless series exists
- [ ] CTA copy matches upload format (swipe vs auto-play)
- [ ] Bottom of slide is anchored — by content, decorative element, or footer pressed against content (no `margin-top: auto` voids)
- [ ] Compared side-by-side to validated viral reference for the format
