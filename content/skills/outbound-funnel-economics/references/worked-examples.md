# Worked Examples

## Contents

1. Mature cold-email cohort
2. LinkedIn cohort with unknown reach
3. Named-account unit protection
4. Zero-customer cohort
5. Pilot requirement
6. Exact versus simplified payback
7. Invalid comparison

## 1. Mature cold-email cohort

Inputs:

- 1,000 unique prospects emailed;
- 950 had at least one message accepted by the recipient mail server;
- 55 gave a relevant positive reply;
- 35 entered a qualified conversation;
- 25 booked, 20 held, 8 became qualified opportunities, and 2 became customers;
- fully loaded cohort acquisition cost: 2,700;
- expected first-year collected revenue per customer: 18,000;
- expected direct first-year delivery cost: 7,200.

Selected outputs:

- accepted-message rate: `950 / 1,000 = 95%`;
- positive-reply rate: `55 / 950 = 5.7895%`;
- qualified-conversation rate: `35 / 950 = 3.6842%`;
- customer rate: `2 / 1,000 = 0.2%`;
- observed CAC: `2,700 / 2 = 1,350`;
- expected first-year gross profit per customer: `18,000 - 7,200 = 10,800`;
- expected first-year gross profit per held meeting: `10,800 * 2 / 20 = 1,080`, labeled mixed because the funnel is actual and customer economics are expected.

The rates show transitions. They do not prove whether targeting, timing, offer, proof, copy, or sales execution caused any loss.

## 2. LinkedIn cohort with unknown reach

If 400 prospects entered a LinkedIn path but the campaign did not define or record what “reached” means, omit `reached`.

The calculator must return LinkedIn reach, relevant-response, and reach-based qualified-conversation rates as unknown. It may still calculate customer rate if customers are attributed to the 400-entry cohort.

Do not substitute accepted connections, sent messages, profile views, or replies for the missing reach definition.

## 3. Named-account unit protection

Suppose 50 accounts were activated. One account generated three replies and two meetings.

For the entity funnel, that account contributes at most one to:

- reached accounts;
- engaged accounts;
- accounts with a qualified conversation;
- accounts with a booked meeting;
- accounts with a held meeting;
- qualified-opportunity accounts;
- customer accounts.

Record three replies and two meeting events in the operational ledger, not in the account funnel.

## 4. Zero-customer cohort

For a matured cohort with 1,000 entries, 4,000 in acquisition cost, and zero customers:

- customer rate is `0 / 1,000 = 0%`;
- CAC is `undefined_zero_customers`, not zero;
- the 4,000 spend remains visible;
- first-year gross profit per held meeting is zero only when meetings held is positive, customer count is explicit zero, and the cohort is matured;
- gross-profit LTV:CAC cannot be calculated because no finite observed CAC exists.

## 5. Pilot requirement

Inputs:

- pilot cost: 6,000;
- 1,000 original entries;
- expected gross profit within the first 12 months: 10,000 per customer;
- additional post-acquisition onboarding cost included in this decision: 1,000 per customer.

Defined contribution is `10,000 - 1,000 = 9,000`.

- cost per entry: `6,000 / 1,000 = 6`;
- continuous required customer rate: `6 / 9,000 = 0.0667%`;
- break-even customers: `ceiling(6,000 / 9,000) = 1`;
- whole-customer operational threshold: `1 / 1,000 = 0.1%`.

These are requirements, not predicted conversion rates.

## 6. Exact versus simplified payback

Cohort CAC is 2,500. Monthly gross profit per customer is:

`[1,000, 600, 600, 600]`

Cumulative gross profit is 1,000 after month one, 1,600 after month two, 2,200 after month three, and 2,800 after month four. Exact payback is month four.

Using a stable 600 monthly gross profit assumption would produce `2,500 / 600 = 4.1667 months`. That is a separate simplified estimate and ignores the larger first month.

## 7. Invalid comparison

Do not compare a cold-email positive-reply rate with a LinkedIn relevant-response rate as if the denominators represented the same event.

Do not compare a 30-day immature customer rate with a 120-day matured customer rate as final channel performance.

Report both cohorts separately and identify the exact comparability failure.
