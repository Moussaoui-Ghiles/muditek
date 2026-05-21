/**
 * Nurture sequence configuration.
 *
 * Step 1 = portal/resource access (handled separately, instant).
 * Steps 2-5 help portal leads use the resources and reply with the system they want built.
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

export const NURTURE_SEQUENCE: SequenceStep[] = [
  {
    step: 2,
    delayDays: 2,
    subject: "How to use the resource you opened",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const safeUrl = escapeHtml(portalUrl || "https://muditek.com/portal");
      return wrapEmail(`
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          Hey ${safeName},
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          The resource you opened is useful only if you turn it into a workflow.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          My usual path is simple: pick one painful business process, write the exact steps, turn the repeated parts into prompts, scripts, or agent skills, then keep the owner reviewing outputs instead of doing the manual work.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          If you want to use the portal well, do not collect ten resources. Pick one and make it operational this week.
        </p>
        <p style="margin: 22px 0;">
          <a href="${safeUrl}"
             style="display: inline-block; padding: 13px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
            Open the portal
          </a>
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
          The reason it moved fast: the hard parts were written down as operating patterns before the build started. We reused judgment, not random boilerplate.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          That is what I care about with AI systems: less demo energy, more production workflow.
        </p>
        <p style="margin: 0; font-size: 16px; line-height: 1.65;">
          Tools are not the secret. The operating system around them is.
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
          Most people open the portal, grab a resource, and move on. Some try to build one piece of it. Almost no one connects them.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          Not because they cannot. The missing part is usually ownership: who uses it, what input starts it, what output is accepted, and what happens when the automation is wrong.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          That&rsquo;s the difference between &ldquo;AI helps me&rdquo; and &ldquo;AI runs the work.&rdquo;
        </p>
        <p style="margin: 0; font-size: 16px; line-height: 1.65;">
          If you build from any resource in the portal, define those four things first.
        </p>
      `);
    },
  },
  {
    step: 5,
    delayDays: 12,
    subject: "What are you trying to automate?",
    buildHtml: (name: string, portalUrl?: string) => {
      const safeName = escapeHtml(name);
      const safeUrl = escapeHtml(portalUrl || "https://muditek.com/portal");
      return wrapEmail(`
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          ${safeName},
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          I am not going to pretend a download is the same as an implemented system.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          If you are working through one of the portal resources, reply with the workflow you want to automate and where it breaks today.
        </p>
        <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.65;">
          I read replies. The useful ones usually turn into a teardown, a build note, or a future resource.
        </p>
        <p style="margin: 22px 0;">
          <a href="${safeUrl}"
             style="display: inline-block; padding: 14px 28px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600;">
            Open the portal
          </a>
        </p>
        <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.6;">
          Start with the clearest bottleneck. That is usually enough.
        </p>
      `);
    },
  },
];
