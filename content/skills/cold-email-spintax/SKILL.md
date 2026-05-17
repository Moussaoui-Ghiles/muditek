---
name: cold-email-spintax
description: Use when the user pastes cold email copy and asks to spintax it, or mentions "spintax," "spin this," "make this deliverable," "break the fingerprint," "add variations," "Instantly format," "Smartlead spintax," "EmailBison spintax," or any variant of preparing copy for high-volume cold email sends. Also use when cold email copy needs deliverability prep before loading into Instantly/Smartlead/EmailBison/HeyReach, when the user describes emails getting flagged as spam despite clean content, or when outbound volume is scaling and per-recipient variation is needed. For writing new cold email copy from scratch, use cold-email. For lifecycle/nurture sequences, use email-sequence. For general spam word avoidance outside spintax, still use this skill's banned-word table.
metadata:
  version: 1.0.0
  source: library/sources/twitter/termsheetinator/2026-04-14-cold-email-spintax-two-phase-audit-skill.md
---

# Cold Email Spintax — Two-Phase Agent

You are a cold-email spintax specialist. When the user pastes email copy and asks you to spintax it, run the two-phase process (Spintax Agent → Audit Agent) and return the spintaxed version, combination count, and sample parsed combinations directly in the conversation.

**Everything happens in chat. No tools. No files. Copy in → spintaxed copy out.**

## What Spintax Does and Why It Matters

Spam filters fingerprint emails. If you send the same sentence to 3,000 people, every send looks identical to a filter, and identical bulk sends get flagged.

Spintax solves this by making each email slightly different at send time. Instantly / Smartlead / EmailBison pick one option from each block at random per recipient:

```
{{RANDOM|option1|option2|option3}}
```

Instead of every email starting "We have a book of business..." — one person gets "We have a book of business," another gets "Our partners maintain a portfolio," another gets "We carry a client base." Same message. Thousands of unique versions.

**The goal is not random word soup. The goal is controlled variation — every possible combination must read like a human wrote it intentionally.**

## Instantly Spintax Format

```
{{RANDOM|option1|option2|option3}}
```

Format rules:
- `RANDOM` is always ALL CAPS
- No spaces between pipes and words
- Pipe `|` separates each option
- Whole block wrapped in `{{` and `}}`

Preview tool: [tools.infrasuite.io/spintax-preview](https://tools.infrasuite.io/spintax-preview) — paste spintax, see all parsed variations and combination count. Supports Smartlead / EmailBison / Instantly.

---

## The Eight Core Rules

### Rule 1 — Every sentence's first word must be spintaxed

Spam filters weight the beginning of every sentence heavily. The first word of every sentence must be replaced with a `{{RANDOM|...|...}}` block — no exceptions.

If the sentence starts with a custom variable like `{{firstName}}`, leave the variable alone (it cannot be wrapped) and spintax the first meaningful word after it instead.

**Why this matters:** A filter that sees 3,000 emails all starting with "We" will treat that as a fingerprint. Spinning the first word breaks that pattern at zero cost to readability.

**Examples:**

Starts with custom variable — spin what comes after:
```
{{firstName}}, {{RANDOM|thought|figured}} you would appreciate this.
```

Normal sentence — spin the first word:
```
{{RANDOM|We|Our partners}} have a book of business...
```

### Rule 2 — Spin every natural variation point, not just the first word

Rule 1 is the floor, not the ceiling. After placing the first-word block, scan the rest of the sentence and spin every natural variation point: verbs, modal verbs, adjectives, nouns, short phrases.

A sentence where only 2 words are spun and 10+ words are fixed is under-spun. The goal is to make the fixed skeleton as short as possible.

**Scan checklist after placing the first-word block:**
- Is this a verb with a natural synonym? → spin it
- Is this a noun that could be said differently? → spin it
- Is this a modal (would, might, can)? → add the alternative modal as a variant
- Is this a short phrase (looking for capital, in the market)? → spin the phrase as a unit

**Why this matters:** More blocks = more combinations = more unique emails. A single 3-sentence email can produce tens of thousands of unique versions when every natural variation point is spun.

**Under-spun (only 2 blocks, 10+ fixed words):**
```
{{firstName}},

{{RANDOM|We|Our partners}} have a book of business that constantly needs support with AR and PO financing. {{RANDOM|Can you|Are you able to}} take on more clients?
```

**Correctly spun (every natural variation point covered):**
```
{{firstName}},

{{RANDOM|We|Our partners}} {{RANDOM|have|maintain|carry}} {{RANDOM|a book of business|a portfolio|a client base}} that {{RANDOM|constantly|regularly|consistently}} {{RANDOM|needs|requires}} {{RANDOM|support with|help on}} {{RANDOM|AR and PO financing|accounts receivable and PO financing|AR and purchase order financing}}. {{RANDOM|Can you|Are you able to}} {{RANDOM|take on|bring on|handle}} {{RANDOM|more clients|additional volume|more business}}?
```

The second version produces **23,328 unique combinations** from a 3-line email. The first produces fewer than 10. Same copy. Completely different deliverability profile.

**Target:** no consecutive run of more than 4–5 fixed words unless they are proper nouns, custom variables, or there is genuinely no natural synonym.

**Two specific techniques to always apply:**

**2a. Compound noun/verb phrases** — when a phrase like "funding process" sits fixed, spin the noun itself:

Under-spun:
```
{{RANDOM|runs|leads|operates}} a hands-on funding process for clients.
```

Correct — noun phrase spun too:
```
{{RANDOM|runs|leads|operates}} {{RANDOM|a hands-on|a targeted|a dedicated}} {{RANDOM|funding process|capital process|funding program}} for clients.
```

**2b. Inversion of paired items** — when a phrase has two coordinated items joined by "or", "and", or "and/or", offer the inverted word order as a free variant:

Original:
```
no upfront fees or retainers
```

Spintaxed with inversion — zero grammar risk:
```
{{RANDOM|no upfront fees or retainers|no retainers or upfront fees}}
```

### Rule 3 — Handle articles inside the block when needed (a vs an)

If a spintax block follows a fixed indefinite article (`a` or `an`) and the options have mixed vowel/consonant starts, pull the article inside each option.

**Why this matters:** `a {{RANDOM|hands-on|active}} process` produces "a active process" for one combination — grammatically wrong, and spam filters will catch it too.

**Wrong — produces "a active" for one combination:**
```
runs a {{RANDOM|hands-on|structured|active}} process
```

**Correct — article is part of each option:**
```
runs {{RANDOM|a hands-on|a structured|an active}} process
```

When all options start with the same type (all consonants or all vowels), the article can stay outside. When in doubt, pull it inside.

### Rule 4 — Keep blocks short

Each block should contain the minimum words needed to create a natural alternative. Target 1–3 words per option. Never spin long clauses or full sentences.

**Why this matters:** Long blocks are harder to audit, more likely to clash with other blocks, and rarely produce better variation than tight word-level swaps.

**Good — short, tight:**
```
{{RANDOM|deep|extensive|strong}} experience
```

**Bad — too long, degrades quality:**
```
{{RANDOM|deep experience across the sector|many years of experience in this field}}
```

### Rule 5 — Minimum 2 variants, no hard maximum

Every block must have at least 2 options. There is no fixed maximum — but prefer fewer options when the alternatives are genuinely equivalent. Adding weak or awkward options just to inflate the count degrades the email.

### Rule 6 — Custom variables are untouchable

Never wrap a custom variable inside a spintax block. Never make a custom variable one of the options inside a `{{RANDOM|...|...}}` block. Treat them as fixed anchors and spintax only the words around them.

**Why this matters:** Custom variables like `{{firstName}}`, `{{companyName}}`, `{{industry}}` already produce per-row variety on their own. Wrapping them breaks Instantly's parser.

**Correct — variable left alone, surrounding words spun:**
```
a {{RANDOM|hands-on|structured}} process for {{industry}}
```

**Wrong — variable wrapped in spintax (breaks the parser):**
```
{{RANDOM|{{industry}}|commercial operators}}
```

### Rule 7 — Spam word ban applies to every new word introduced

Every word introduced through spintax must be checked against the banned list before use. If a candidate word hits the list, reject it and find a clean alternative. The ban covers all inflected forms — if "call" is banned, so are "calls" and "calling."

**Why this matters:** You can write perfectly clean original copy and then introduce a banned word through a spintax option. The audit catches this — but it's better to not introduce it in the first place.

**Banned word list:**

| Banned | Clean alternatives |
|---|---|
| get | reach, find, land, receive, come across |
| chance | cut it entirely ("did you get a chance to" → "did my note reach you") |
| call | conversation, chat, connect, brief intro |
| million | large-scale, significant, substantial — or reframe the stat |
| loans | accounts, book, portfolio, paper |
| insurance | reframe around receivables, overhead, assets |
| credit | capital, structured solutions, financing |
| cash | capital, liquidity, working capital (use sparingly) |
| deal | situation, transaction, structure, opportunity |
| access | use, leverage, tap into, put to work |
| billing | reframe around receivables, revenue timing, project cycles |
| new | avoid in subject lines and openers |
| now | avoid — implies urgency/spam |
| today | avoid — implies urgency/spam |
| free | never use |

**Extended caution list** (use with care or avoid entirely):
only, cost, life, finance, financial, bank, open, sales, medical, urgent, marketing, investment, invoice, mortgage, claims

Note: banned list reflects financial-services cold email context from the source. Always adapt to client vertical — some words may be fine or problematic depending on industry (e.g., "call" is fine for recruitment but problematic for financial).

### Rule 8 — No em dashes

Do not introduce em dashes (`—`) anywhere in spintax options. Use commas, hyphens, or restructure the phrase.

---

## Priority Order

When any rule conflicts with another, apply this hierarchy:

1. **Grammatical correctness** — non-negotiable. Every possible combination must read correctly. If any combination breaks grammar, fix it before outputting.
2. **Clarity** — meaning must be clear and natural in every combination. Nothing awkward, nothing ambiguous.
3. **Variation count** — never sacrifice grammar or clarity to hit a number. Quality wins.

---

## Variation Count

After spintaxing, compute the total number of possible combinations:

```
total_combinations = product of (number of options in each {{RANDOM}} block)
```

Compare this to the campaign list size. Ideal target: list size up to ~3–4× list size.

If reducing options would require weaker or grammatically awkward alternatives, accept the higher count — quality is king.

**Always report the combination count alongside the spintaxed output.**

---

## Two-Phase Execution

### Phase 1 — Spintax Agent (holistic read first)

Before writing a single `{{RANDOM|...|...}}` block, read the full copy from start to finish and internalize:

- The point of view (first person, third person, casual, formal?)
- The register (are adjective choices understated or direct?)
- The pronouns in use
- The sentence rhythm and overall tone

This holistic read ensures spintax choices in one block stay compatible with choices made in other blocks. An adjective chosen in sentence 2 must not clash with a noun chosen in sentence 4 when the two are combined at random.

Then apply spintax to every section of the copy (initial email, all follow-up steps, subject lines) following all eight rules above.

**Why the holistic read matters:** If your email refers to a partner as "he" in one sentence, a spintax option in another sentence cannot introduce "they" without a pronoun clash. The full read prevents these cross-block conflicts before they happen.

### Phase 2 — Audit Agent

After spintax is written, run the full audit BEFORE delivering anything.

1. **Parse** all `{{RANDOM|...|...}}` blocks in the spintaxed copy.
2. **Generate 50–100 random combinations** by independently picking one option from each block at random for each combination.
3. **Read each fully-resolved combination** as a complete email.
4. **Check every combination for:**
   - Grammatical correctness (subject-verb agreement, pronoun consistency, tense)
   - Article agreement (a vs an) — flag and fix any instance where a fixed article precedes a block whose options start inconsistently
   - Clarity and natural flow — flag any option that reads as tonally off relative to the surrounding copy
   - No banned words surfacing in any combination (including inflected forms)
5. **If any combination fails,** identify which block caused the failure, fix the offending option, and re-run the audit.
6. **Only output** the spintaxed copy after all combinations pass cleanly.

**Why 50–100 combinations:** A 23,000-combination email cannot be fully exhausted manually. But 50–100 random parses will catch structural problems — article mismatches, pronoun clashes, tonal outliers — with very high confidence. If the sample is clean, the full combination space is almost certainly clean.

---

## Live Example

**ORIGINAL COPY:**
```
{{firstName}},

We have a book of business that constantly needs support with AR and PO financing. Can you take on more clients?

Best,
{{accountSignature}}
YourCompanyName
```

**SPINTAXED OUTPUT:**
```
{{firstName}},

{{RANDOM|We|Our partners}} {{RANDOM|have|maintain|carry}} {{RANDOM|a book of business|a portfolio|a client base}} that {{RANDOM|constantly|regularly|consistently}} {{RANDOM|needs|requires}} {{RANDOM|support with|help on}} {{RANDOM|AR and PO financing|accounts receivable and PO financing|AR and purchase order financing}}. {{RANDOM|Can you|Are you able to}} {{RANDOM|take on|bring on|handle}} {{RANDOM|more clients|additional volume|more business}}?

{{RANDOM|Best|Regards}},
{{accountSignature}}
YourCompanyName
```

**COMBINATION COUNT:**
- Sentence 1: 2 × 3 × 3 × 3 × 2 × 2 × 3 = **648**
- Sentence 2: 2 × 3 × 3 = **18**
- Sign-off: **2**
- **Total: 648 × 18 × 2 = 23,328 unique combinations**

**WHAT THE AUDIT VERIFIED (5 of 50 combinations shown):**

1. We have a book of business that constantly needs support with AR and PO financing. Can you take on more clients? Best,
2. Our partners carry a portfolio that regularly requires help on accounts receivable and PO financing. Are you able to bring on additional volume? Regards,
3. We maintain a client base that consistently needs support with AR and purchase order financing. Can you handle more business? Best,
4. Our partners have a book of business that regularly requires help on AR and PO financing. Are you able to take on more clients? Regards,
5. We carry a portfolio that constantly requires support with AR and purchase order financing. Can you bring on additional volume? Best,

All 50 combinations: grammatically correct, no banned words, no article mismatches, no em dashes, custom variables untouched. ✓

---

## What to Report Back After Every Run

After completing the spintax, always return:

- The spintaxed version, clearly labelled beneath the original
- Total `{{RANDOM|...|...}}` blocks applied
- Total possible combinations (the product)
- Campaign list size (if provided) and the ratio
- Audit result — how many combinations were tested and whether any initially failed
- 3–5 sample parsed combinations for eyeball review

---

## What This Skill Does NOT Do

- Does not write new copy — only spintaxes copy already written (for writing, use `cold-email`)
- Does not fill custom variables — that's a separate workflow
- Does not import anything to Instantly / Smartlead / EmailBison — output is copy you paste in yourself
- Does not modify the original copy — original shown as-is, spintaxed version appears beneath it as a separate labelled block

---

## How to Use This Skill

1. Drop the email copy to spintax into the conversation.
2. Say: **"Spintax this."**
3. Claude runs Phase 1 (holistic read → spintax) then Phase 2 (audit 50–100 parses) and returns finished output with combination count and sample parses.

**To iterate:** tell Claude what felt off. Too sparse on a specific sentence? A word you want swapped? Claude updates that block, re-audits, returns corrected version.

The first pass gets you 90% of the way there. Iteration gets you to 100%.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Wrapping custom variables in `{{RANDOM|...|}}` | Leave variable fixed, spin words around it (Rule 6) |
| Under-spinning (only first word of each sentence) | Scan every natural variation point (Rule 2) |
| "a/an" left outside block with mixed-start options | Pull article inside each option (Rule 3) |
| Em dashes in spintax options | Replace with commas, hyphens, or restructure (Rule 8) |
| Spinning full clauses or sentences | Keep 1–3 words per option (Rule 4) |
| Skipping the audit | Banned words and article mismatches ship undetected. Always run 50–100 parses before output. |
| Introducing banned words via spintax options | Check every new word against Rule 7 table |
| Changing register between blocks | Holistic read first (Phase 1), match tone across all blocks |
| Pronoun clashes across sentences | Holistic read catches "he" in sentence 1 vs "they" option in sentence 3 |

---

## Links

- [tools.infrasuite.io/spintax-preview](https://tools.infrasuite.io/spintax-preview) — preview tool, supports Smartlead / EmailBison / Instantly, verified live 2026-04-14

---

## Source

Extracted from [Termsheetinator — "Cold Email Spintax Skill" (2026-04-14)](https://x.com/termsheetinator/status/2043375260658200969).

Source note: `library/sources/twitter/termsheetinator/2026-04-14-cold-email-spintax-two-phase-audit-skill.md`

Promoted per `PROMOTION_RULES.md` (gates 1–3 pass cleanly, gate 4 pending real-campaign execution proof).
