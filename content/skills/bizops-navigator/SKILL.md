---
name: bizops-navigator
description: Navigate and operate the BizOps business operating system. Use when routing requests to the right folder, skill, or MCP — or when handling knowledge intake (source ingestion, claim distillation, skill promotion).
---

# BizOps Navigator

## Vault structure

The vault is organized by business function. Each main folder has its own `CLAUDE.md` and `.claude/`.

| Folder | Purpose | Key skills / MCPs |
|---|---|---|
| `marketing/offers/` | 3 offer docs (PE, Revenue Machine, EU AI Act) | `offer-creation` |
| `marketing/outreach/` | LinkedIn connections by segment | `linkedin-outreach`, `phantombuster`, `apify-lead-generation` |
| `marketing/pipeline/` | Pre-sale prospects + tracker | — |
| `marketing/linkedin/` | Content calendar + strategy | `linkedin-content-writer` |
| `marketing/newsletter/` | beehiiv newsletter | beehiiv MCP |
| `marketing/lead-magnets/` | Free resources (PDFs, guides) | — |
| `clients/` | Won clients (post-sale) | Stripe MCP |
| `finance/` | Invoices, receivables, expenses | Stripe MCP |
| `library/sources/` | 37 ingested sources | `source-ingest`, `source-distill` |
| `library/compiled/` | Compiled playbooks from source library | `library-compile` |
| `library/research/` | Research summaries | — |
| `library/contracts/` | Client agreements | — |
| `muditek/` | Products (MudiAgent, website) | — |
| `self/` | Founder OS (goals, scorecard, identity) | — |
| `decisions/` | Business rules (5 decision docs) | — |
| `brand/` | Logo variants + client brand assets | — |
| `templates/` | 7 reusable templates | — |

## Routing rules

| Request type | Route to |
|---|---|
| Offer work | `marketing/offers/` + `offer-creation` skill |
| Run outreach | `marketing/outreach/` + `linkedin-outreach` skill |
| Check pipeline | `marketing/pipeline/pipeline.md` |
| Research a prospect | `marketing/pipeline/<company>/` |
| Write LinkedIn post | `marketing/linkedin/` + `linkedin-content-writer` skill |
| Newsletter | `marketing/newsletter/` + beehiiv MCP |
| Invoice / payment | `finance/` + Stripe MCP |
| Client delivery status | `clients/<company>/` |
| Ingest a URL | `library/sources/` + `source-ingest` skill |
| Synthesize sources | `library/sources/` + `source-distill` skill |
| Compile knowledge into playbooks | `library/compiled/` + `library-compile` skill |
| Check goals / scorecard | `self/goals.md`, `self/scorecard.md` |
| Pricing / go-no-go | `decisions/` |
| Build lead lists | `marketing/outreach/` + `apify-lead-generation` skill |
| Process LinkedIn inbox | `linkedin-inbox-sdr` skill |

## Knowledge pipeline

### Core contract
- Treat source notes as evidence, not skills.
- Use fixed taxonomy only from `library/sources/TAXONOMY.md`.
- Follow storage rules from `library/sources/STRUCTURE.md`.
- Promote claims only via `PROMOTION_RULES.md`.

### Workflow
1. Ingest — save source in platform/creator path, populate frontmatter.
2. Distill — extract 3-7 operational claims.
3. Classify — assign exactly 1 `main_category` and 1 `sub_category`.
4. Promote decision — apply gate from `PROMOTION_RULES.md`.
   - If pass: create/update skill in `.claude/skills/`.
   - If fail: keep as source reference only.

## Pipeline lifecycle
- Pre-sale prospects live in `marketing/pipeline/<company>/`.
- Pipeline tracker at `marketing/pipeline/pipeline.md`.
- When a prospect hits `won`, their folder moves to `clients/`.
- Qualification: `decisions/decision-go-no-go-client.md`.
- Pricing: `decisions/decision-pricing-bands.md`.

## Query patterns
- "Show all sources by creator X in category Y"
- "List promotable claims from last N sources"
- "What's the pipeline status?"
- "Run outreach to PE segment"
- "Write a LinkedIn post about X"
- "Invoice client Y"
- "What are my 90-day goals?"
