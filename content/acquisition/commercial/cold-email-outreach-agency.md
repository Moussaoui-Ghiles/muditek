## A cold-email agency has two jobs

The agency must reach the right people and operate the sending system correctly. Good copy cannot repair missing buyer paths or broken authentication. Technical setup cannot make an irrelevant offer useful.

Audit both jobs before comparing fees.

## Check the sending foundation

Ask for evidence, not a deliverability score.

- Which domains and inboxes will send?
- Who owns them?
- Are SPF, DKIM, and DMARC published correctly?
- How are bounce events and suppressions handled?
- How are unsubscribe requests applied across campaigns?
- Which sending limits and stop rules are enforced?
- Does the agency store credentials, message content, or contact data after the contract ends?

Use the [email authentication checker](/tools/email-authentication-checker) to inspect public records. Authentication is necessary, but it does not prove inbox placement.

## Check the market and data

After the market rule is approved, request a sample before launch. The sample should show the account rule, buyer role, source, verification state, exclusions, and any public signal used to set priority.

The agency should distinguish a company match from a reachable buyer. A company without a verified path to an approved role is not ready for outreach.

Exclude catch-all or unverified addresses unless the buyer has explicitly accepted that risk and the verification method is documented.

## Check the message process

The buyer should approve claims, proof, price, exclusions, and the first ask. A testing plan should change one meaningful variable at a time inside a fixed cohort.

Five cosmetic rewrites are not five useful tests. A valid test might compare two buyer roles, two offer mechanisms, or two asks while the list source and observation window stay fixed.

## Check reporting

The report should separate sent, server-delivered, bounced, replied, positively replied, qualified, booked, held, proposed, and closed. It should also state which cohort and time window produced each number.

If the agency reports only sends, open rate, and meetings, you cannot locate the failed stage.

Read [Google's email sender guidelines](https://support.google.com/a/answer/81126) and use the [outbound failure diagnostic](/playbooks/outbound-failure-diagnostic) before changing copy.
