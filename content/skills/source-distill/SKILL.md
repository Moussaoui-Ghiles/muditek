---
name: source-distill
description: Distill captured BizOps sources into reusable, testable claims and decide promotion readiness. Use when sources are already saved and the user asks for synthesis, actionable takeaways, or candidate skills.
---

# Source Distill

## Inputs
- One or more existing source notes in `library/sources/**`.
- Optional target outcome (e.g., GTM execution, automation blueprint).

## Required references
- `PROMOTION_RULES.md`
- `library/sources/TAXONOMY.md`

## Distillation output (per source)
1. `core_thesis` (1-2 lines)
2. `operational_claims` (3-7 bullets)
3. `evidence_strength` (`high` | `medium` | `low`)
4. `reuse_potential` (`high` | `medium` | `low`)
5. `promotion_decision` (`promote` | `hold`)
6. `why` (brief justification)

## Cross-source synthesis (when 2+ sources)
- Merge overlapping claims.
- Remove duplicates and vague phrasing.
- Produce `candidate_capabilities` list (named patterns that could become skills).

## Promotion gate
Promote only if all are true:
- Reusable across contexts
- Testable (clear input/output behavior)
- High leverage (saves meaningful time or reduces risk)
- Not just personality/opinion content

If promoted:
- Draft a skill in `.claude/skills/<skill-name>/SKILL.md` with clear behavior contract.
If held:
- Keep as source evidence; do not force promotion.

## Guardrails
- Do not blur source evidence with production-ready skill logic.
- Keep language concrete; avoid buzzwords.
- Preserve taxonomy consistency with source notes.

## Completion message
Return:
- promoted candidates (if any)
- held claims (with reasons)
- recommended next skill(s) to build
