# Metric Specification

## Contents

1. Status vocabulary
2. Funnel metrics
3. Acquisition cost and customer economics
4. Break-even and pilot requirements
5. Payback
6. Cohort comparison and marginal expansion
7. Mathematical edge cases

## 1. Status vocabulary

| Status | Meaning |
|---|---|
| `observed` | Calculated from supplied actual inputs under a fixed definition |
| `expected` | Calculated from explicitly expected inputs |
| `assumption` | Calculated from scenario assumptions |
| `mixed` | Combines different labeled bases, such as actual funnel yield and expected customer gross profit |
| `provisional` | Observed before the cohort matured |
| `unknown` | A required input was absent or its definition was unresolved |
| `not_applicable` | The denominator is explicitly zero or the metric does not apply to the motion |
| `invalid` | Inputs conflict, violate the unit contract, or cannot support the calculation |
| `economically_impossible` | Positive cost cannot be recovered under zero/negative contribution or required rate exceeds 100% |

## 2. Funnel metrics

Every count is the number of unique original entities reaching the named stage.

### Cold email

| Metric | Formula | What it establishes | What it cannot establish |
|---|---|---|---|
| Accepted-message rate | `accepted / entries` | Share of emailed prospects with at least one message accepted by the recipient mail server | Inbox placement, human reach, attention, or interest |
| Positive-reply rate | `positive_engagements / accepted` | Share of technically accepted prospects giving a relevant positive reply | Whether targeting, timing, offer, proof, or copy caused the result |
| Qualified-conversation rate | `qualified_conversations / accepted` | Share of technically accepted prospects entering a defined commercial conversation | Why other prospects did not qualify |

### LinkedIn

| Metric | Formula | What it establishes | What it cannot establish |
|---|---|---|---|
| Reach rate | `reached / entries` | Share satisfying the predefined LinkedIn reach event | A universal notion of delivery or attention |
| Relevant-response rate | `positive_engagements / reached` | Share of reached prospects giving a relevant response | Whether profile, fit, timing, offer, or message caused the result |
| Qualified-conversation rate | `qualified_conversations / reached` | Share of reached prospects entering a defined commercial conversation | Why other responses did not qualify |

### Named-account outreach

| Metric | Formula | What it establishes | What it cannot establish |
|---|---|---|---|
| Account-reach rate | `reached / entries` | Share of activated accounts where an intended buyer was reached | Buyer authority, interest, or offer relevance |
| Relevant-engagement rate | `positive_engagements / entries` | Share of activated accounts creating relevant two-way engagement | Which component caused the result |
| Qualified-conversation rate | `qualified_conversations / entries` | Share of activated accounts creating a defined commercial conversation | Why other accounts did not progress |

### Common downstream metrics

| Metric | Formula | Decision use |
|---|---|---|
| Conversation-to-booking rate | `meetings_booked / qualified_conversations` | Inspect ask, response handling, qualification path, first commitment, and scheduling |
| Attendance rate | `meetings_held / meetings_booked` | Inspect meeting purpose, scheduling, expectations, qualification, and follow-up |
| Opportunity rate | `qualified_opportunities / meetings_held` | Inspect account/buyer fit, authority, qualification, and discovery |
| Win rate | `customers / qualified_opportunities` | Inspect proof, risk, terms, decision process, sales execution, and offer |
| Customer rate | `customers / entries` | Measure complete cohort yield; use earlier transitions to locate investigation |

The investigation list is a question queue, not a causal diagnosis.

## 3. Acquisition cost and customer economics

### Fully loaded cohort acquisition cost

Sum every direct and consistently allocated cost used to create and convert the cohort through the defined acquisition boundary:

- data and verification;
- research;
- channel infrastructure;
- software;
- internal labor at a documented loaded rate;
- contractors or agency fees;
- management and review time;
- allocated setup costs;
- other stated acquisition costs.

### Customer acquisition cost

`CAC = fully loaded cohort acquisition cost / customers from the same cohort`

If customers are explicitly zero, report `undefined_zero_customers`: the spend is real, but there is no finite observed CAC. If the cohort is immature, label any non-zero result provisional.

### Cost per cohort entry

`cost per entry = fully loaded cohort acquisition cost / entries`

This measures cost per original entity before funnel leakage. It does not measure entity quality.

### Cost per entity reaching a stage

`cost per stage entity = fully loaded cohort acquisition cost / unique original entities reaching that stage`

The calculator may report cost per relevant engagement, qualified conversation, booked-meeting entity, held-meeting entity, and qualified opportunity. This is average cohort cost allocated across entities reaching a stage. It is not the incremental cost of creating the next entity at that stage and does not prove stage quality.

### First-year gross profit per customer

Preferred direct-cost form:

`first-year gross profit per customer = collected first-year revenue per customer - direct first-year delivery cost per customer`

Gross-margin shortcut, only when the supplied margin applies consistently:

`first-year gross profit per customer = collected first-year revenue per customer * gross margin`

Do not use signed pipeline value as collected revenue. A projection may use realistically collectible expected revenue if labeled expected.

### Contribution per customer for a defined horizon

`defined contribution = gross profit within the stated horizon - additional post-acquisition sales/onboarding cost included in the decision`

The horizon and cost boundary must be explicit. Avoid double counting any cost already included in acquisition or delivery cost.

### Expected first-year gross profit per held meeting

`expected first-year gross profit per held meeting = expected first-year gross profit per customer * customers / meetings_held`

This often combines observed funnel yield with expected customer gross profit and must therefore be labeled `mixed`. It is gross profit associated with a held meeting before remaining acquisition/sales costs and the required profit buffer. It is not an allowable meeting price by itself.

### Gross-profit LTV:CAC

`gross-profit LTV:CAC = lifetime gross profit per customer / CAC`

`lifetime gross profit per customer = lifetime collected revenue per customer - lifetime direct delivery cost per customer`

State actual versus projected retention, collections, and delivery-cost assumptions. Do not apply a universal “good” ratio.

### First-year gross-profit coverage of CAC

`first-year gross-profit coverage of CAC = first-year gross profit per customer / CAC`

This states how many times the supplied first-year gross profit covers observed CAC. It is not lifetime value, cash payback, ROI, or net profit.

### Expected first-year cohort gross contribution after acquisition cost

`expected first-year cohort gross contribution after acquisition = first-year gross profit per customer * customers - cohort acquisition cost`

When customer count and cost are actual but customer gross profit is expected, label the result mixed. It excludes overhead, tax, financing, and any omitted acquisition or delivery cost; never call it net profit.

## 4. Break-even and pilot requirements

### Break-even customers

`break-even customers = ceiling(defined campaign cost / defined contribution per customer)`

Use the same stated horizon in the cost-recovery decision and contribution. This is a required count, not a forecast.

### Required customer rate

Equivalent forms:

`required customer rate = cost per entry / defined contribution per customer`

`required customer rate = break-even cost before rounding / entries`

The calculator uses the continuous rate, then separately reports the rounded whole-customer requirement. If the continuous rate exceeds `1`, or the rounded required customers exceed cohort entries, label the scenario economically impossible under the supplied economics.

### Difference caused by rounding

Example: a campaign cost of 2,700 and contribution of 10,300 requires `0.2621` customers mathematically, but a business cannot acquire a fraction of a customer. The break-even count is one. For a 1,000-entry cohort, the continuous required customer rate is `0.0262%`, while the operational whole-customer threshold is `0.1%`. Report both when the distinction matters.

## 5. Payback

### Exact monthly payback

Starting from month one, add monthly gross profit per acquired customer. The payback month is the first month where cumulative gross profit is greater than or equal to CAC.

If the supplied series never reaches CAC, report `not_recovered_within_series`, not infinite and not zero.

### Simplified payback

`simplified payback months = CAC / stable monthly gross profit per customer`

Use only when monthly gross profit is expected to remain stable. Label it an estimate. Do not use this shortcut when onboarding fees, annual prepayments, seasonality, changing delivery costs, or churn materially change the monthly pattern.

Cash payback requires cash collections and cash costs. Gross-profit payback is not automatically cash payback.

## 6. Cohort comparison and marginal expansion

### Comparability gate

Compare only cohorts sharing:

- acquisition motion;
- original entity unit;
- definition version;
- attribution window;
- maturity treatment;
- cost boundary and allocation logic for economic comparisons;
- substantially similar observation opportunity.

If only some conditions match, compare only the supported subset and name the excluded conclusions.

### Metric delta

`absolute delta = candidate metric - baseline metric`

`relative delta = absolute delta / baseline metric`

If the baseline is zero, relative delta is not applicable. A delta reports change; it does not prove cause.

### Marginal expansion

`additional gross contribution = expected additional customers * expected contribution per customer`

`net incremental contribution = additional gross contribution - additional cost`

`required additional customers = ceiling(additional cost / expected contribution per customer)`

This is a scenario, not an authorization to spend. Expected additional customers and contribution must remain labeled assumptions or expected inputs unless already observed.

## 7. Mathematical edge cases

- Missing numerator or denominator: `unknown`.
- Explicit zero denominator: `not_applicable`.
- Later-stage count above earlier-stage count: affected chain `invalid`.
- Negative count or cost: `invalid`.
- Fractional entity count: `invalid`.
- Zero customers with positive spend: CAC `undefined_zero_customers`.
- Zero or negative contribution with positive campaign cost: `economically_impossible`.
- Required customer rate above 100%: `economically_impossible`.
- Gross margin outside `[0, 1]`: `invalid`.
- Direct-cost and gross-margin methods disagree beyond currency rounding: `invalid` until one governs.
- Monthly gross-profit series containing cumulative rather than monthly values: correct the input; the calculator cannot infer intent safely.
