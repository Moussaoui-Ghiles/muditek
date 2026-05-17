/**
 * Nurture sequence configuration.
 *
 * Step 1 = resource delivery (handled separately, instant).
 * Steps 2-5 are the nurture emails that move free-resource leads to MudiKit.
 *
 * Voice: direct, factual, specific numbers. No SaaS fluff.
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
        You&rsquo;re on this list because you grabbed a resource from one of my LinkedIn posts.
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
    subject: "What I actually do with that playbook",
    buildHtml: (name: string) => {
      const safeName = escapeHtml(name);
      return wrapEmail(`
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          Hey ${safeName},
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          That resource you grabbed is one piece of how I actually run Muditek.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          The setup: skills sit in <code style="font-family: ui-monospace, monospace; background: #f5f5f5; padding: 1px 5px; border-radius: 3px; font-size: 14px;">~/.claude/skills/</code>. Claude Code reads them and does the work. Outreach, content, lead capture, client delivery. Most of my day is reviewing what an agent already drafted, not drafting from scratch.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          The playbook you downloaded is one of those systems. The vault structure behind it is what makes them stack.
        </p>
        <p style="margin: 0; font-size: 16px; line-height: 1.65;">
          More on that in a few days.
        </p>
      `);
    },
  },
  {
    step: 3,
    delayDays: 5,
    subject: "$50K platform shipped on the same setup",
    buildHtml: (name: string) => {
      const safeName = escapeHtml(name);
      return wrapEmail(`
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          Quick story, ${safeName}.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          One of my clients is a merchant banking firm. They needed investor onboarding, KYC automation, document generation, e-signatures, the whole stack, multi-jurisdiction, compliant.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          We built and shipped it in weeks. They paid $50K, kept the source code, no SaaS lock-in.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          The reason it moved fast: the hard parts were already solved in the playbooks. We reused the knowledge, not the code.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          That client came from a LinkedIn post. Same content engine that&rsquo;s in the kit.
        </p>
        <p style="margin: 0; font-size: 16px; line-height: 1.65;">
          Tools aren&rsquo;t the secret. The way they connect is.
        </p>
      `);
    },
  },
  {
    step: 4,
    delayDays: 8,
    subject: "Most people stop at the download",
    buildHtml: (name: string) => {
      const safeName = escapeHtml(name);
      return wrapEmail(`
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          ${safeName},
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          Most people grab a resource and move on. Some try to build one piece of it. Almost no one connects them.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          Not because they can&rsquo;t. The <em>connections</em> are the part nobody ships in the PDF. The vault structure. The naming conventions skills use to find each other. The decision rules that tell an agent what to do when context is missing.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          That&rsquo;s the difference between &ldquo;AI helps me&rdquo; and &ldquo;AI runs the work.&rdquo;
        </p>
        <p style="margin: 0; font-size: 16px; line-height: 1.65;">
          Tomorrow: the kit, packaged.
        </p>
      `);
    },
  },
  {
    step: 5,
    delayDays: 12,
    subject: "MudiKit: same files I work from",
    buildHtml: (name: string, checkoutUrl?: string) => {
      const safeName = escapeHtml(name);
      const safeUrl = escapeHtml(checkoutUrl || "https://muditek.com/mudikit");
      return wrapEmail(`
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          ${safeName},
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          I packaged it.
        </p>
        <ul style="margin: 0 0 18px; padding-left: 20px; font-size: 15.5px; line-height: 1.85;">
          <li>64 shipped Claude Code skills</li>
          <li>Implementation playbooks and portal resources</li>
          <li>The vault template: CLAUDE.md hierarchy + decision rules</li>
          <li>Outreach templates and operating files</li>
          <li>New drops every week</li>
        </ul>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          $47 a month. Cancel anytime. Keep what you&rsquo;ve downloaded.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          For context: clients pay €40K-100K to have me install these systems. $47 is what it costs to install them yourself.
        </p>
        <p style="margin: 22px 0;">
          <a href="${safeUrl}"
             style="display: inline-block; padding: 14px 28px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
            Get the kit
          </a>
        </p>
        <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.6;">
          If you&rsquo;ve been piecing this together from public posts, this is the shortcut.
        </p>
      `);
    },
  },
];
