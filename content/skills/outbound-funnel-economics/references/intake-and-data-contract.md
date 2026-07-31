# Intake and Data Contract

## Contents

1. Intake sequence
2. Cohort and unit contract
3. Evidence register
4. Calculator JSON schema
5. Data normalization and reconciliation
6. Material missing inputs

## 1. Intake sequence

Search available artifacts first. Ask only for inputs that remain material after the search.

### Decision

- What exact decision should this analysis inform?
- Is this a historical audit, pilot requirement, projection, comparison, or marginal expansion scenario?
- Which campaign, segment, offer, and period are in scope?

### Cohort

- What event puts an entity into the cohort?
- Is the unique original entity a prospect or an account?
- What are the cohort start and end dates?
- What attribution window connects customers and costs to this cohort?
- Has the cohort had enough time to mature under the normal sales cycle? What evidence supports that answer?

### Definitions

- What exactly counts as technical acceptance, LinkedIn reach, relevant response, qualified conversation, booked meeting, held meeting, qualified opportunity, and customer?
- What definition version governed the records?
- What unique key and deduplication rule were used?
- Are reschedules, repeat meetings, multiple contacts per account, reactivations, and assisted wins handled consistently?

### Costs and customer value

- Which direct and shared acquisition costs belong to the cohort?
- How were shared costs allocated?
- Are internal labor and management included at a stated loaded rate?
- What collected revenue and direct delivery cost horizon is used?
- Are figures actual, expected, assumed, or unknown?
- Is any sales or onboarding cost being subtracted after acquisition, and is it already present in acquisition cost or delivery cost?

## 2. Cohort and unit contract

Use one of these motions:

| Motion | Original entity | Required entry definition | Early stages |
|---|---|---|---|
| `cold_email` | Unique prospect | Prospect received the first eligible email attempt | Accepted by recipient mail server, positive reply, qualified conversation |
| `linkedin` | Unique prospect | Prospect entered the predefined LinkedIn path | Reached through the exact path, relevant response, qualified conversation |
| `named_account` | Unique account | Account received the first action in its approved account plan | At least one intended buyer reached, relevant two-way account engagement, qualified conversation |

All downstream stage counts must remain on the original entity unit:

- `meetings_booked`: unique original entities with at least one attributable meeting booked;
- `meetings_held`: unique original entities with at least one attributable meeting held;
- `qualified_opportunities`: unique original entities meeting the fixed opportunity definition;
- `customers`: unique original entities meeting the fixed win definition.

Keep total meeting events, message attempts, replies, contacts, and opportunities in a separate operational ledger. They can measure workload, but they cannot be inserted into an entity funnel.

## 3. Evidence register

Record each material input with:

| Field | Purpose |
|---|---|
| `input_name` | Stable name used in the calculation |
| `value` | Supplied value; never silently default a missing value to zero |
| `basis` | `actual`, `expected`, `assumption`, or `unknown` |
| `source` | File, report, system, or user statement |
| `location` | Sheet, row, field, query, or note location |
| `period` | Period represented by the input |
| `extracted_at` | Date the evidence was obtained |
| `definition` | Exact event or financial definition |
| `limitation` | Missing coverage, stale data, attribution risk, or other constraint |

## 4. Calculator JSON schema

The calculator accepts one document containing `cohorts` and optional `expansion_scenarios`.

```json
{
  "schema_version": "1.0",
  "currency": "USD",
  "cohorts": [
    {
      "cohort_id": "email-2026-07-a",
      "name": "July cold-email cohort",
      "motion": "cold_email",
      "basis": "actual",
      "matured": true,
      "requested_analyses": ["funnel", "cac", "customer_economics", "break_even", "payback"],
      "period": {"start": "2026-07-01", "end": "2026-07-31"},
      "analysis_date": "2026-09-30",
      "entry_definition": "Unique prospects receiving a first eligible email attempt",
      "definition_version": "outbound-v1",
      "attribution_window": "90 days from first eligible attempt",
      "win_definition": "Signed agreement and first payment collected",
      "evidence_register": [
        {
          "input_name": "counts.entries",
          "basis": "actual",
          "source": "CRM campaign export",
          "location": "campaign_id=email-2026-07-a",
          "period": "2026-07-01 through 2026-07-31",
          "extracted_at": "2026-09-30",
          "definition": "Distinct prospect_id receiving a first eligible attempt",
          "limitation": "Suppression audit stored separately"
        }
      ],
      "normalization_notes": ["Deduplicated on stable CRM prospect_id"],
      "known_unknowns": ["Inbox placement is not observable"],
      "counts": {
        "entries": 1000,
        "accepted": 950,
        "positive_engagements": 55,
        "qualified_conversations": 35,
        "meetings_booked": 25,
        "meetings_held": 20,
        "qualified_opportunities": 8,
        "customers": 2
      },
      "cost_boundary": "All acquisition work through first payment collection",
      "costs_confirmed_complete": true,
      "excluded_costs": ["General company overhead"],
      "costs": [
        {"id": "data", "category": "data", "amount": 600, "treatment": "direct", "basis": "actual"},
        {"id": "labor", "category": "internal_labor", "amount": 1800, "treatment": "direct", "basis": "actual"},
        {"id": "software", "category": "software", "amount": 300, "treatment": "allocated", "allocation_method": "one third of monthly fee by active cohort", "basis": "actual"}
      ],
      "economics": {
        "basis": "expected",
        "contribution_horizon": "first 12 months",
        "first_year_collected_revenue_per_customer": 18000,
        "first_year_direct_delivery_cost_per_customer": 7200,
        "additional_post_acquisition_cost_per_customer": 500,
        "lifetime_collected_revenue_per_customer": 30000,
        "lifetime_direct_delivery_cost_per_customer": 12000,
        "stable_monthly_gross_profit_per_customer": 900,
        "monthly_gross_profit_per_customer": [1800, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900]
      }
    }
  ],
  "expansion_scenarios": [
    {
      "scenario_id": "add-researcher",
      "baseline_cohort_id": "email-2026-07-a",
      "basis": "assumption",
      "additional_cost": 3000,
      "expected_additional_customers": 1,
      "expected_contribution_per_customer": 10300,
      "contribution_horizon": "first 12 months"
    }
  ]
}
```

### Required cohort fields

- `cohort_id`: unique non-empty string.
- `motion`: `cold_email`, `linkedin`, or `named_account`.
- `basis`: `actual`, `expected`, or `assumption`.
- `matured`: `true`, `false`, or `null` when unknown.
- `requested_analyses`: one or more of `funnel`, `cac`, `customer_economics`, `break_even`, and `payback`; defaults to `funnel`.
- `entry_definition`, `definition_version`, and `attribution_window`: non-empty strings.
- `counts.entries`: explicit non-negative integer.

### Evidence and normalization fields

- `evidence_register`: one row per material input or grouped input set, using the evidence-register fields above.
- `normalization_notes`: deduplication, mapping, reconciliation, and exception notes.
- `known_unknowns`: unresolved evidence gaps that must remain visible in the final audit.

These fields do not change arithmetic. They make the calculation auditable and prevent a clean number from hiding weak provenance.

### Motion-specific count keys

| Key | Cold email | LinkedIn | Named account |
|---|---|---|---|
| `entries` | Unique prospects emailed | Unique prospects entering the path | Activated accounts |
| `accepted` | Unique prospects with at least one accepted message | Not used | Not used |
| `reached` | Not used | Unique prospects meeting the predefined reach event | Accounts where an intended buyer was reached |
| `positive_engagements` | Unique prospects with a relevant positive reply | Unique prospects with a relevant response | Accounts with relevant two-way engagement |
| `qualified_conversations` | Unique prospects | Unique prospects | Unique accounts |
| Downstream keys | Unique prospects | Unique prospects | Unique accounts |

Omit an untracked value. Supply `0` only when the source confirms zero under the fixed definition.

### Cost fields

- `amount` must be non-negative.
- `treatment` is `direct` or `allocated`.
- Every allocated item requires `allocation_method`.
- `basis` is `actual`, `expected`, or `assumption`.
- Use a unique `id` per line. Do not enter the same expense in multiple categories.
- `cost_boundary` states where acquisition cost starts and ends.
- `costs_confirmed_complete` is `true` only after reconciling every intended category; otherwise the report labels the amount as supplied rather than fully loaded.
- `excluded_costs` lists known exclusions, including an explicit empty list when none are known.

### Optional comparisons

Request a comparison explicitly:

```json
"comparisons": [
  {
    "comparison_id": "july-vs-june",
    "baseline_cohort_id": "email-2026-06-a",
    "candidate_cohort_id": "email-2026-07-a"
  }
]
```

The calculator compares only cohorts with matching motion, unit, definition version, attribution window, and maturity treatment. Passing this mechanical gate does not prove that a changed segment, offer, message, or operator caused the delta.

### Economics fields

Use currency per acquired customer. Supply direct delivery cost or `first_year_gross_margin`, but not both unless they reconcile. Gross margin must be a decimal between `0` and `1`.

`additional_post_acquisition_cost_per_customer` is subtracted only when defining contribution for break-even. Do not include a cost here if it is already in cohort acquisition cost or direct delivery cost.

The monthly payback series represents monthly gross profit per acquired customer in chronological order. A cumulative series is invalid.

## 5. Data normalization and reconciliation

### Entity rules

- Cold email and LinkedIn: prefer a stable CRM prospect/contact ID. If absent, document the normalized fallback key and collision risk.
- Named account: use a stable CRM account ID or normalized legal/company identity. Preserve subsidiaries when the account plan treats them separately.
- Retain the original source IDs used to create the normalized key.

### Stage reconciliation

Expected stage order:

- Cold email: `entries >= accepted >= positive_engagements >= qualified_conversations >= meetings_booked >= meetings_held >= qualified_opportunities >= customers`.
- LinkedIn: `entries >= reached >= positive_engagements >= qualified_conversations >= meetings_booked >= meetings_held >= qualified_opportunities >= customers`.
- Named account: same as LinkedIn, using accounts.

A later stage exceeding an earlier stage is a data or definition conflict. Correct the mapping or mark the affected chain invalid; do not clip the value.

### Cost reconciliation

Reconcile cost lines to invoices, payroll/load assumptions, contractor bills, and allocation schedules. Record excluded categories explicitly. If a source total and the line-item total differ, explain the difference before calculating CAC.

## 6. Material missing inputs

These gaps prevent the named calculation:

| Missing input | Blocked result |
|---|---|
| Entry definition or count | Every end-to-end rate and cost per entry |
| LinkedIn reach definition | Reach-based LinkedIn rates |
| Cohort maturity evidence | Final customer rate, win rate, and realized CAC interpretation |
| Customers | CAC denominator and customer-yield metrics |
| Cost ledger | CAC, cost per entry, break-even based on cohort cost |
| Contribution horizon or positive contribution | Break-even customer count and required customer rate |
| Lifetime gross profit | Gross-profit LTV:CAC |
| Monthly gross-profit series or stable monthly gross profit | CAC payback |
| Comparable definition version | Cohort delta interpretation |

Deliver the supported subset. Never fill these gaps with external averages.
