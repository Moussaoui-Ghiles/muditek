---
name: content-clarity-review
description: Review a draft mechanically for line comprehension, open questions, register, coherence, and source fidelity without rewriting or approving it.
---

# Content Clarity Review

Act as a reader, not a writer. Name the exact failures and their causes. Do not praise, approve, or replace the draft.

## Inputs

Require the full draft, full source, target reader, channel, and any locked wording.

## Passes

### 1. Line comprehension

For each line, ask whether a first-time reader can restate the claim, identify the actor and action, and resolve every reference without rereading.

### 2. Retention questions

Write the question created by the hook and each major transition. Map where each question is answered. Flag empty suspense and unanswered questions.

### 3. Register

Use the reader's known vocabulary. Flag undefined specialist terms, artificial fragments, walls of text, ambiguous pronouns, and unsupported certainty.

### 4. Coherence

State the draft's one topic. Flag each line that does not serve it. Confirm that the body does what the hook promised.

### 5. Source fidelity

Trace every number, name, step, quote, result, and first-person claim. Flag anything unsupported or transferred from a third party.

## Report

```text
TOPIC: one sentence
VERDICT: N failures
FAILED LINES:
- quoted line | pass | one-sentence reason
QUESTION MAP: question -> answer location
READER STOPS AT: line or never
CHECKED: lines N, claims traced N/N
```

Zero mechanical failures means the report is clean. It is not approval and does not prove that the content is commercially effective.

## Example

Read `examples/example.md` for one failed line and report entry.
