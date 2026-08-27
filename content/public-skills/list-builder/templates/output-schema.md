# List build output schema

Agree on the fields before research. Add project-specific fields only when a
source can support them.

## Company file

| Field | Required | Meaning |
| --- | --- | --- |
| `company_name` | Yes | Display name from the best available source. |
| `normalized_domain` | Yes | Lowercase root domain used for deduplication. |
| `fit_decision` | Yes | `fit`, `not_fit`, or `unknown`. |
| `fit_evidence` | Yes | Short source-supported reason for the decision. |
| `source_url` | Yes | URL that supports the company record. |
| `observed_at` | Yes | Date the source was checked. |
| `exclusion_reason` | When excluded | Written reason tied to an approved rule. |

## Contact file

| Field | Required | Meaning |
| --- | --- | --- |
| `company_domain` | Yes | Joins the contact to the company file. |
| `full_name` | Yes | Person name as published by the source. |
| `job_title` | Yes | Current title from the cited source. |
| `profile_url` | Yes | Stable public profile or source URL. |
| `email` | When approved | Address returned by the approved provider. |
| `email_source` | With email | Provider or published source. |
| `verification_status` | With email | `valid`, `invalid`, `risky`, `catch_all`, or `unknown`. |
| `observed_at` | Yes | Date the contact source was checked. |
| `suppression_status` | Yes | `clear`, `suppressed`, or `unknown`. |

## Reconciliation file

Report raw rows, unique companies, fit decisions, exclusions, source overlap,
contacts found, verification states, suppressed rows, delivered rows, provider
spend, failed sources, and unresolved coverage gaps. Do not combine discovery
and verification into one success count.
