/**
 * Nurture sequence configuration.
 *
 * Step 1 = portal/resource access (handled separately, instant).
 * Steps 2-5 are a re-engagement arc: each spotlights one real portal system
 * (with its real numbers) to pull the subscriber back in to explore what they
 * haven't opened yet.
 *
 * Voice: direct, factual, specific numbers. No SaaS fluff. No MudiKit pitch.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapEmail(content: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 540px; margin: 0 auto; padding: 40px 20px; color: #111;">
      ${content}
      <p style="margin: 32px 0 0; font-size: 15px; color: #444; line-height: 1.6;">
        - Ghiles
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0 18px;" />
      <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
        You&rsquo;re on this list because you joined the Muditek portal or opened a resource.
      </p>
    </div>
  `;
}

export interface SequenceStep {
  step: number;
  delayDays: number;
  subject: string;
  buildHtml: (name: string, portalUrl?: string) => string;
}

function p(content: string): string {
  return `<p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">${content}</p>`;
}

function ctaButton(href: string, label: string): string {
  return `
    <p style="margin: 24px 0;">
      <a href="${escapeHtml(href)}"
         style="display: inline-block; padding: 13px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
        ${label}
      </a>
    </p>
  `;
}

export const NURTURE_SEQUENCE: SequenceStep[] = [
  {
    step: 2,
    delayDays: 2,
    subject: "2,000 leads a day for $10/month",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`Hey ${safeName},`)}
        ${p(`The fastest system to get running in the portal is the Google Maps one.`)}
        ${p(`Claude Code points at Google Maps, pulls businesses by location and category, and hands you a clean lead list. 2,000 a day, for about $10 a month.`)}
        ${p(`The playbook is the full build. The portal also has the tool already wired up, so you can pull a list before you build anything yourself.`)}
        ${p(`If pipeline is the thing keeping you up, start here.`)}
        ${ctaButton(`${base}/playbooks/google-maps-outbound`, "Open the Google Maps playbook")}
      `);
    },
  },
  {
    step: 3,
    delayDays: 5,
    subject: "300K cold emails. 153 calls booked. $1,200.",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`${safeName},`)}
        ${p(`Once you have a list, this is what you do with it.`)}
        ${p(`OpenClaw Outbound is the cold email system I documented in the portal. 300,000 emails in a month, 153 calls booked, $1,200 in total cost. Infrastructure, warmup, sending, the full setup.`)}
        ${p(`Agencies quote ten times that for the same output and call it a retainer.`)}
        ${p(`It's one of the playbooks you probably haven't opened yet.`)}
        ${ctaButton(`${base}/playbooks/openclaw-outbound`, "Open the OpenClaw playbook")}
      `);
    },
  },
  {
    step: 4,
    delayDays: 8,
    subject: "7 text files replaced a $75K/year hire",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`${safeName},`)}
        ${p(`The instinct when you're drowning in admin is to hire. Here's the cheaper version.`)}
        ${p(`The Chief of Staff Blueprint in the portal is a full build: 7 text files that do what a $75K/year executive assistant did. Inbox, scheduling, prep, follow-up.`)}
        ${p(`Want the sales version instead? The Agentic SDR guide runs three channels for $269 a month and booked 157 calls.`)}
        ${p(`Both are sitting in the portal. Worth a look before your next hire.`)}
        ${ctaButton(`${base}/playbooks`, "Open the playbooks")}
      `);
    },
  },
  {
    step: 5,
    delayDays: 12,
    subject: "Which of these do you actually want running?",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`${safeName},`)}
        ${p(`You've had a few of these now. Lead scraping, cold outbound, an AI chief of staff, a data agent that enriches and organizes on its own.`)}
        ${p(`Simple question: which one do you actually want running in your business?`)}
        ${p(`Reply with that, and where it breaks today. One paragraph is enough. I read replies, and the useful ones turn into teardowns or new resources.`)}
        ${p(`If you'd rather just dig, there are fifteen systems in the portal and you've probably opened two.`)}
        ${ctaButton(base, "Open your portal")}
      `);
    },
  },
];
