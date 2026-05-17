---
name: source-ingest
description: Ingest external knowledge sources (YouTube, X/Twitter, articles) into the BizOps library in a consistent format. Use when the user sends one or more links and wants them stored with creator-aware paths, extracted content/transcript, and fixed taxonomy fields.
---

# Source Ingest

## Inputs
- One or more URLs.
- Optional user hint for category.

## Required references
- `library/sources/TAXONOMY.md`
- `library/sources/STRUCTURE.md`

## Output contract (mandatory)
For every source note, include frontmatter with:
- `platform`
- `source_type`
- `creator`
- `creator_slug`
- `title`
- `url`
- `date_ingested`
- `main_category` (exactly 1, from taxonomy)
- `sub_category` (exactly 1, from taxonomy)
- `topic` (optional short label)
- `status: captured`

## Storage rules
- YouTube: `library/sources/youtube/<creator-slug>/<yyyy-mm-dd>-<title-slug>.md`
- Twitter/X: `library/sources/twitter/<creator-slug>/<yyyy-mm-dd>-<title-slug>.md`
- Articles: `library/sources/articles/<domain-slug>/<yyyy-mm-dd>-<title-slug>.md`

## Workflow
1. Fetch content/transcript.
2. **Dedup check (mandatory before any writing):** normalize the URL (strip query params like `?s=20`, trailing slashes, protocol), then:
   ```bash
   grep -rl "^url:.*<normalized-url>" library/sources/
   ```
   If match found → STOP. Report the existing file path to the user. Ask whether to (a) skip, (b) update existing note with new distillation, or (c) create companion note with explicit cross-reference + note_type: follow-up. Do NOT write a duplicate silently.
3. Identify creator + normalized slug. **Check for existing slug variants first:**
   ```bash
   ls library/sources/<platform>/ | grep -i "<creator-keyword>"
   ```
   If folder already exists for this creator under a different slug → use the EXISTING slug. Never create a second folder for the same person.
4. Assign taxonomy category pair from fixed tree.
5. Create source note with:
   - why this matters (short)
   - distilled claims (3–7 bullets)
   - raw extracted text/transcript
6. Save to correct platform/creator path.

## Creator slug rules
- **Slug format:** lowercase, kebab-case, ASCII only. Strip underscores/periods/special chars from handles.
- **Precedence:** (1) existing slug in library if creator already has files, (2) normalized Twitter/YouTube HANDLE if new creator, (3) creator NAME only if handle is not usable.
- **Never create a second folder for the same person.** If uncertain, grep library for the creator's name + URL pattern first. Handles like `@Saboo_Shubham_` → slug `saboo-shubham` (the same creator is NOT `shubham-saboo`).
- **Known creator aliases** (maintain as discovered):
  - Dimitar Angelov = `dimitar-angelov` (handle: @dimitarangg)
  - Shubham Saboo = `saboo-shubham` (handle: @Saboo_Shubham_)
  - Levi Munneke = `levi-munneke` (handle: @levikmunneke)

## Guardrails
- Never invent new categories during ingestion.
- If uncertain category: use fallback
  - `main_category: bizops`
  - `sub_category: internal-processes`
  and mark for later review.
- A source note is evidence, not a skill.
- **Never silently overwrite or duplicate.** Always dedup-check first, always surface existing files to the user before writing.

## Completion message
Return:
- saved paths
- creator for each URL
- selected `main_category/sub_category` for each URL
- any items flagged for review
- **dedup result per URL:** new ingest / matched existing / companion note of <path>
