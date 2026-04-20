/**
 * Nurture sequence configuration.
 *
 * Step 1 is skipped — it's the resource delivery already handled by MudiKit campaigns.
 * Steps 2-5 are the nurture emails that sell the MudiKit subscription.
 *
 * Email copy is placeholder — Ghiles writes the real versions.
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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
      ${content}
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="margin: 0; font-size: 13px; color: #999;">
        You're receiving this because you downloaded a resource from one of my LinkedIn posts.
      </p>
    </div>
  `;
}

export interface SequenceStep {
  step: number;
  delayDays: number;
  subject: string;
  buildHtml: (name: string, checkoutUrl?: string) => string;
}

export const NURTURE_SEQUENCE: SequenceStep[] = [
  {
    step: 2,
    delayDays: 2,
    subject: "How I actually use this in my business",
    buildHtml: (name: string) => {
      const safeName = escapeHtml(name);
      return wrapEmail(`
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">Hey ${safeName},</h2>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          That resource you grabbed? It's one piece of a system I run every day.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          I don't just share AI tools — I run my entire business on them. Lead gen, outreach, content, client delivery. All orchestrated through Claude Code skills and an Obsidian vault that AI agents read and execute.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          The playbook you downloaded is how one part works. The full system is how they all connect.
        </p>
        <p style="margin: 0; font-size: 16px; color: #444; line-height: 1.6;">
          More on that in a few days.
        </p>
      `);
    },
  },
  {
    step: 3,
    delayDays: 5,
    subject: "From $0 to a $50K client — the system behind it",
    buildHtml: (name: string) => {
      const safeName = escapeHtml(name);
      return wrapEmail(`
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">Quick story, ${safeName}.</h2>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          I built a $50K platform for a merchant banking firm. Investor onboarding, KYC automation, document generation, e-signatures — the full stack.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          That client came from LinkedIn. Same content strategy, same systems, same skills running behind the scenes.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          35+ systems deployed. $3M+ in revenue generated and saved. Not because I'm faster than everyone else — because the system runs without me.
        </p>
        <p style="margin: 0; font-size: 16px; color: #444; line-height: 1.6;">
          The tools I use to do this aren't secret. I've been sharing them one post at a time. But there's a faster way to get all of them at once.
        </p>
      `);
    },
  },
  {
    step: 4,
    delayDays: 8,
    subject: "Most people stop at the free resource",
    buildHtml: (name: string) => {
      const safeName = escapeHtml(name);
      return wrapEmail(`
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">${safeName}, real talk.</h2>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          Most people download the free resource, skim it, and move on. Some try to implement one piece. Very few build the full system.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          The difference isn't talent or time. It's having the complete picture — the skills that connect, the templates that work together, the vault structure that makes AI agents actually useful.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          One playbook is a starting point. A full system is what generates results.
        </p>
        <p style="margin: 0; font-size: 16px; color: #444; line-height: 1.6;">
          Tomorrow I'll show you what the full system looks like.
        </p>
      `);
    },
  },
  {
    step: 5,
    delayDays: 12,
    subject: "The full system — everything I use, packaged",
    buildHtml: (name: string, checkoutUrl?: string) => {
      const safeName = escapeHtml(name);
      const safeUrl = escapeHtml(checkoutUrl || "#");
      return wrapEmail(`
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">${safeName},</h2>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          I packaged everything. The skills, the playbooks, the vault template, the outreach templates — the complete system I use to run my business with AI.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px; color: #444; line-height: 1.6;">
          I packaged it as <strong>MudiKit</strong>. Here's what's inside:
        </p>
        <ul style="margin: 0 0 16px; padding-left: 20px; font-size: 15px; color: #444; line-height: 1.8;">
          <li>15+ Claude Code skills for outreach, content, lead gen, and more</li>
          <li>6 step-by-step playbooks</li>
          <li>A complete vault template with CLAUDE.md files and decision frameworks</li>
          <li>Outreach message templates with A/B variants</li>
          <li>New skills and playbooks every month</li>
        </ul>
        <p style="margin: 0 0 24px; font-size: 16px; color: #444; line-height: 1.6;">
          $47/month. Cancel anytime. Every month you get new drops as the tools evolve.
        </p>
        <a href="${safeUrl}"
           style="display: inline-block; padding: 14px 28px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Get MudiKit
        </a>
        <p style="margin: 20px 0 0; font-size: 14px; color: #666; line-height: 1.5;">
          If you've been piecing things together from free resources — this is the shortcut.
        </p>
      `);
    },
  },
];
