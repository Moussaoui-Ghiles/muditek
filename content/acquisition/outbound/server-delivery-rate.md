## Definition

**Server-delivery rate = unique prospects with at least one email delivered to the recipient mail server ÷ unique prospects emailed**

Count each prospect once. Keep the observation window fixed.

## What the event means

The sending system recorded delivery to the recipient mail server. It does not prove primary-inbox placement, reading, attention, or interest.

Authentication is a sending requirement. It is not evidence that the intended buyer saw the message.

## Audit conditions

- Deduplicate prospects.
- Exclude attempts outside the cohort window.
- Confirm delivery and bounce events are recorded consistently.
- Preserve the sending domain and mailbox configuration used by the cohort.

## What to investigate

A weak rate points to contact accuracy, bounces, authentication, sending configuration, or sender reputation. The rate cannot identify which cause applies. Inspect the underlying events before changing copy or offer.
