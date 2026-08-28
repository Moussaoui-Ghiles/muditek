---
title: How to Build a Cold Email System for 10,000 Sends a Day
status: approved
asset_type: playbook
created: 2026-08-28
updated: 2026-08-28
tags:
  - gtm/outbound
  - cold-email
  - infrastructure
---

# How to Build a Cold Email System for 10,000 Sends a Day

At 10,000 sends a day, copy is not the bottleneck. Capacity and control are.

You need enough domains, mailboxes, qualified contacts and people to handle replies. You also need stop rules and a recovery plan. Without those controls, higher volume creates more waste.

Run the calculator above before buying anything. It uses only the limits, rates and costs you enter.

## Start with five different numbers

Do not use "10,000 emails" to describe all of these:

- **Daily sends:** initial emails and follow-ups combined.
- **Daily sequence starts:** new contacts entering the campaign.
- **Average messages per contact:** the initial email plus follow-ups actually sent.
- **Monthly new contacts:** fresh records needed to sustain the start rate.
- **Reachable accounts:** qualified companies with a usable path to the right buyer.

At 10,000 sends a day across 22 sending days, monthly volume is 220,000 messages.

That does not mean you can start 10,000 new contacts every day. Follow-ups must fit inside the same daily cap.

Check the send cap with:

```text
steady-state daily sends
  ≈ daily sequence starts × average messages actually sent per contact
```

If the sequence averages 2.5 messages per contact, a 10,000-send cap supports about 4,000 new starts per day, not 10,000.

## 1. Do the maths before buying infrastructure

Use these formulas:

```text
monthly sends
  = daily sends × sending days

required mailboxes
  = daily sends ÷ sends per mailbox per day, rounded up

required domains
  = required mailboxes ÷ mailboxes per domain, rounded up

monthly new contacts
  = daily sequence starts × sending days

list runway in sending days
  = approved unsent contacts ÷ daily sequence starts
```

The calculator also applies your funnel rates in order:

```text
positive replies
  = monthly sends × positive reply rate

meetings booked
  = positive replies × reply-to-booking rate

meetings held
  = meetings booked × show rate

qualified meetings
  = meetings held × qualification rate

deals
  = qualified meetings × close rate
```

### Worked example

The calculator can load this example:

| Input | Value |
|---|---:|
| Daily sends | 10,000 |
| Sending days | 22 |
| Sends per mailbox per day | 20 |
| Mailboxes per domain | 3 |
| Daily sequence starts | 4,000 |
| Average messages per contact | 2.5 |
| Positive reply rate | 0.1% |
| Reply-to-booking rate | 25% |
| Show rate | 70% |
| Qualification rate | 80% |
| Close rate | 20% |

The example assumes the sequence sends 2.5 messages per contact on average. The 10,000-send cap therefore supports 4,000 new starts per day and needs 88,000 new contacts per month.

The arithmetic also produces 220 positive replies, 55 meetings booked, 38.5 meetings held, 30.8 qualified meetings and 6.16 projected deals. These are worked numbers, not results or benchmarks. Replace every input with your own limits and rates.

Use the [Outbound Funnel Economics workflow](/portal/skills/outbound-funnel-economics) once a real campaign cohort has matured.

Do not buy the system until you can answer:

1. Can the reachable market sustain the required new-account volume?
2. Can the list operation produce and verify enough new contacts each month?
3. Can a named operator review the expected replies?
4. Does the full cost work at your observed qualified-meeting and close rates?

## 2. Build an infrastructure register

Create one row per sending domain. Keep the register outside the sending platform.

```text
domain
registrar
purchase_date
renewal_date
mailbox_provider
mailboxes
spf_status
dkim_status
dmarc_status
warmup_started_at
send_started_at
daily_limit
current_state
operator
notes
```

Use a clear state for every domain:

```text
purchased
configuring
warming
ready
active
paused
retired
```

Set up the infrastructure in this order:

1. Confirm the provider and registrar terms.
2. Create approved domain variations.
3. Check availability and ownership.
4. Buy only the domains in the approved capacity plan.
5. Configure SPF, DKIM and DMARC.
6. Provision the mailboxes.
7. Connect the mailboxes to the sequencer.
8. Warm and increase volume within written provider limits.
9. Record every state change in the register.

A successful connection does not prove inbox placement. Authentication, acceptance and delivery are different events.

Enter current written prices in the calculator. Do not use old screenshots or remembered provider prices.

## 3. Prepare infrastructure recovery before launch

Define the failure boundary first. A problem may belong to one mailbox, one domain, one campaign, one list or the complete provider account.

When a written stop rule triggers:

1. Pause the smallest confirmed failure boundary.
2. Save provider errors, bounce codes, campaign IDs, send counts, DNS state and the exact list version.
3. Check whether the failure follows the mailbox, domain, campaign or list.
4. Keep the same suspect list away from clean infrastructure.
5. Fix only the cause supported by the evidence.
6. Recheck authentication and connection state.
7. Run a small approved test within provider limits.
8. Return only the repaired scope to rotation.
9. Record the incident and the person who approved the restart.

Do not use replacement domains to bypass a provider restriction.

Keep this recovery pack outside the sequencer:

```text
domain_and_mailbox_register.csv
dns_and_authentication_records
campaign_configuration_exports
approved_copy_and_variable_map
list_source_and_verification_log
suppression_list
provider_support_case_ids
incident_log
```

Use this incident log:

```text
detected_at
affected_scope
trigger
evidence
immediate_action
root_cause
repair
test_result
restart_approved_by
restarted_at
```

## 4. Build enough qualified list supply

Qualify companies before paying to enrich people.

For every list build:

1. Write the company-fit rules and hard exclusions.
2. Collect companies and keep the collection URL or file.
3. Deduplicate by company and domain.
4. Remove clients, prior contacts, opt-outs and other suppression records.
5. Review a mixed sample of accepted and rejected companies.
6. Enrich people only at approved companies.
7. Verify the contact path under one written standard.
8. Keep failed and unknown records visible.
9. Run your normal CSV list-quality audit before upload.

Track list supply in one table:

```text
segment
approved_companies
approved_contacts
unsent_contacts
daily_start_cap
runway_days
next_refresh_date
owner
```

Do not treat database coverage estimates as purchasing forecasts. Measure company acceptance, contact coverage and verification on your own sample.

## 5. Give copywriters and agents a complete brief

Use this handoff:

```text
Segment and audience:
Company size:
Target roles:
Example company:

Approved offer:
Approved proof:
Claims the copy must not make:
Available list variables:
Fallback for each variable:
Reply destination:
Reply owner:
```

Test different reasons to care, not five rewrites of the same idea.

Before upload, confirm:

- every variation tests a different message hypothesis;
- every variable exists in the final file;
- missing values have safe fallbacks;
- every proof claim is approved;
- the offer and reply path stay consistent.

## 6. Configure and approve the campaign

Keep two separate caps:

- maximum total sends per day;
- maximum new sequence starts per day.

The start cap must leave room for follow-ups. Estimate it with the actual average messages sent per contact, then adjust it from real campaign data.

Before launch:

1. Upload the final approved lead file.
2. Confirm suppression and deduplication counts.
3. Map every variable and fallback.
4. Load the approved initial email and follow-ups.
5. Check the sending days, times and time zones.
6. Check tracking, links and unsubscribe handling.
7. Check sender rotation and both daily caps.
8. Send internal test messages from every variation.
9. Name the reply owner and backup.
10. Record the final approval.

Legal requirements and provider rules depend on the campaign and recipient location. Review them before launch. Do not copy another operator's unsubscribe or tracking settings without that review.

## 7. Give every reply a human owner

Automation may classify a reply and draft a response. A person still approves what gets sent.

Use this reply queue:

```text
reply_received_at
prospect
company
campaign
reply_text
classification
classification_reason
draft_response
reviewer
review_status
sent_at
suppression_updated_at
notes
```

Keep these states separate:

```text
reply received
positive reply
qualified conversation
meeting booked
meeting held
qualified opportunity
customer
cash collected
```

A draft is not a sent reply. Calendar availability is not a booking. A booking is not a held or qualified meeting.

Set a response target that the named operator can maintain. Measure actual response time and outcomes before changing it.

## 8. Run one weekly operating review

End the review with decisions, not a dashboard.

| Check | Decision |
|---|---|
| Sends and new starts | Keep or change the start cap |
| Bounce and provider errors | Continue, inspect or stop the affected scope |
| Mailbox and domain state | Keep active, pause or retire |
| List runway | Confirm the next qualified list is ready |
| Replies by segment | Keep, revise or stop the segment |
| Reply queue | Reassign overdue reviews and fix failures |
| Meetings and revenue | Continue, change or stop the campaign |

Track the full chain:

```text
prospects contacted
→ positive replies
→ qualified conversations
→ meetings booked
→ meetings held
→ qualified opportunities
→ customers
→ cash collected
```

Volume is an input. The commercial result is the end of the chain.

## Launch checklist

- [ ] The reachable market can sustain the new-contact requirement.
- [ ] The calculator uses current written limits and prices.
- [ ] The sequence-start cap leaves room for follow-ups.
- [ ] Every domain and mailbox exists in the infrastructure register.
- [ ] SPF, DKIM, DMARC and sender connections were checked.
- [ ] The recovery pack and incident owner exist.
- [ ] Company-fit rules and exclusions are written.
- [ ] Suppression and deduplication are complete.
- [ ] Contact verification follows one standard.
- [ ] A mixed list sample passed human review.
- [ ] Every message, variable and fallback is approved.
- [ ] Legal and provider requirements were reviewed.
- [ ] The reply owner and backup are named.
- [ ] Stop rules and restart approval are written.

## Weekly checklist

- [ ] Reconcile sends, starts and remaining approved contacts.
- [ ] Review bounce and provider errors by campaign and domain.
- [ ] Remove unhealthy senders from rotation.
- [ ] Compare positive replies and qualified conversations by segment.
- [ ] Review overdue replies, opt-outs and automation failures.
- [ ] Confirm the next list is qualified, suppressed and verified.
- [ ] Update domain states, warm-up dates and retirement decisions.
- [ ] Record meetings held, qualified opportunities, customers and cash.
- [ ] Change one controlled part of the system at a time.

## What this guide does not supply

- provider accounts or current prices;
- legal approval;
- a qualified market and contact file;
- approved offer, proof or copy;
- a sending platform configuration;
- a reply automation workflow;
- first-party campaign results.

Use the model to size the system and the records to run it. Your team still owns every input and every live send.
