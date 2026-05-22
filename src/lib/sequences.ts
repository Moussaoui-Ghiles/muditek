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
    delayDays: 3,
    subject: "Quit paying for lead lists",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`Hey ${safeName},`)}
        ${p(`Most lead lists you buy are stale, overpriced, and sold to your competitors too.`)}
        ${p(`Here's the better way, and you can run it yourself. Pick a tight niche and location. Not "businesses" but "dental clinics in Lyon." Pull them straight from Google Maps with their name, site, phone, and reviews. Then keep only the ones that fit you, the ones with no website or weak reviews, whatever signals they need what you sell. Now you have a clean, current list nobody else is working.`)}
        ${p(`The Google Maps Outbound playbook in the portal walks the full build, with AI doing the pulling and filtering for you. You could have your first list today.`)}
        ${ctaButton(`${base}/playbooks/google-maps-outbound`, "Open the Google Maps playbook")}
      `);
    },
  },
  {
    step: 3,
    delayDays: 7,
    subject: "Your cold emails are getting deleted",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`Hey ${safeName},`)}
        ${p(`When cold email doesn't work, it's almost never the sending. It's the first line.`)}
        ${p(`"Hope you're well, I wanted to reach out about..." tells them in one second it's a template. Deleted.`)}
        ${p(`The fix: open with something only true about them. A specific detail, a recent move, a problem their kind of business has. Then one plain sentence on what you do about it. Then one small ask. That's the entire email.`)}
        ${p(`The cold-email skill in the portal writes them that way for you, personalized per prospect, so you're never staring at a blank draft.`)}
        ${ctaButton(`${base}/skills/cold-email`, "Open the cold-email skill")}
      `);
    },
  },
  {
    step: 4,
    delayDays: 11,
    subject: "Your buyers asked AI about you. It said nothing.",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const base = portalUrl || "https://muditek.com/portal";
      return wrapEmail(`
        ${p(`Hey ${safeName},`)}
        ${p(`Your next customer probably won't find you by scrolling Google. They'll ask ChatGPT or an AI search for the best in your category near them, and go with whatever it names.`)}
        ${p(`If your site isn't built so AI can read and recommend it, you're not in that answer. Same goes for the competitors ranking above you on plain Google.`)}
        ${p(`Gut check: search your own category the way a customer would, on Google and on an AI tool. Not there? That's the leak.`)}
        ${p(`Start with the SEO audit skill in the portal. It tells you exactly why you're invisible and what to fix first. The AI-search skill handles getting named in AI answers.`)}
        ${ctaButton(`${base}/skills/seo-audit`, "Run the SEO audit skill")}
        ${p(`That's the three I wanted to send. If one of these is the problem you actually care about, reply and tell me where it's stuck. I'll point you to the fastest fix.`)}
      `);
    },
  },
];
