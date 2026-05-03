# Newsletter Authoring Rules

Rules for natively-written posts going forward (post 2026-05-04).

**Why these rules exist:** AI engines (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot) retrieve content at the passage level, not the page level. They preferentially cite passages that look like direct answers to user queries: question-shaped headings, structured bullets with bold lead terms, and stats with explicit dates. Following these patterns multiplies citation chances per post.

**Scope:** Applies to native markdown/MDX posts authored in this repo. **Does NOT apply to the 29 imported beehiiv HTML posts** — their HTML snapshot is fragile and programmatic edits would break beehiiv's render. Imported posts stay as-is.

---

## Rule 2.1 — H2s as questions

Every H2 in a post body must be phrased as a question a buyer would type into search.

### Why
AI retrieval models match user queries to passage headings. A heading that already mirrors a question gets retrieved before a heading that names a concept.

### How

| Don't | Do |
|---|---|
| `## Speed-to-lead overview` | `## How fast should B2B SaaS respond to inbound leads?` |
| `## Pricing` | `## How much does a Revenue Leak Audit cost?` |
| `## Architecture` | `## How does mudiAgent run on-premises without cloud?` |
| `## Common mistakes` | `## Why do most outbound campaigns fail in 2026?` |

### Pattern
- Lead with `How`, `Why`, `What`, `When`, `Which`, or `Should`
- Include the buyer's noun (lead, audit, agent, pipeline, ARR)
- Year-stamp where relevant ("in 2026")
- Keep under 12 words

---

## Rule 2.2 — Bold-lead bullets

Every bullet in a list must follow `**Term.** Definition.` format.

### Why
AI engines parse bullets as discrete fact units. A bolded lead term acts as the entity, the definition acts as the value. The pair becomes citable as a standalone passage.

### How

**Don't:**
```markdown
- We diagnose pipeline leaks
- We build the fix
- We retainer-monitor it
```

**Do:**
```markdown
- **Diagnostic.** 5-day audit of your CRM and Stripe data. Output: prioritized leak report with euro amounts and formulas. €2,000.
- **Build.** 1-2 week implementation per leak (speed-to-lead, scoring, outbound). You own the system. €5-8K per fix.
- **Retainer.** Monthly Revenue Recovery Report showing exact euros recovered. €3-5K/month.
```

### Pattern
- Lead term in **bold**, ending with a period
- Definition starts with a capital letter
- One sentence per bullet (max two short ones)
- Keep the term short (1-3 words)
- Use proper nouns where applicable (`**HubSpot.**` beats `**The CRM.**`)

---

## Rule 2.3 — Dated stats inline

Every numeric claim must include both a number and a year.

### Why
Stats without dates are unciteable — AI engines won't surface a number they can't anchor in time. A dated stat ("4.1B weekly queries in Q1 2026") signals freshness and gets preferential placement in answer boxes.

### How

| Don't | Do |
|---|---|
| "ChatGPT gets billions of queries" | "ChatGPT processed 4.1B weekly queries in Q1 2026" |
| "Most leads never get contacted" | "30% of B2B SaaS inbound leads never get contacted in 2025" |
| "Average response time is hours" | "Average inbound response time in B2B SaaS was 42 hours in 2025" |
| "Our newsletter has thousands of readers" | "Read by 5,000+ B2B operators in May 2026" |

### Pattern
- `[number] [unit] [context] in [period]`
- Period can be: `Q1 2026`, `2026`, `January 2026`, `May 2026`
- For internal data: source it from `src/lib/data-points.ts` — single source of truth
- For external data: cite source inline ("per Gartner Q1 2026 study") or link the source
- Avoid bare numbers ("hundreds of", "many", "most") — replace or remove

---

## Compounding effect

When all 3 rules combine in one passage:

```markdown
## How much pipeline does slow inbound response cost B2B SaaS in 2026?

The average B2B SaaS responds to inbound leads in 42 hours in 2025 (per Gartner Lead Response Study, 2025). Conversion drops 80% after 5 minutes. The math:

- **Lead volume.** 100 demo requests per month at €10K average ACV in 2026.
- **Response decay.** 80% conversion loss past the 5-minute window in 2025.
- **Annual leakage.** €80K per year in lost pipeline from response speed alone.
```

This passage answers a buyer's question (2.1), structures the answer for retrieval (2.2), and dates every number (2.3). AI engines treat it as a self-contained citation candidate.

---

## Enforcement

- Apply on every newly-authored post starting 2026-05-04
- Code-review checklist: search post for an H2 that isn't a question, a bullet without `**bold.**`, a number without a year — flag and fix before publish
- Rule applies regardless of post length — a 3-paragraph post follows the same rules as a 2,000-word one

## Out of scope

- 29 imported beehiiv HTML posts — left as-is
- Resource pages (`/resources/[slug]`) — those follow their own structure
- Service / landing pages — already use these patterns where relevant; no enforcement loop needed
