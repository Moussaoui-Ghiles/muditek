/**
 * Three-email welcome sequence for new Muditek newsletter subscribers.
 *
 * Email 1 is sent immediately by the subscribe/account-link routes. Emails 2
 * and 3 are sent by the daily sequence cron, three and seven days after Email
 * 1 was successfully delivered to Resend.
 */

import { createHash } from "node:crypto";

export const WELCOME_SEQUENCE_ENROLLMENT_TYPE = "welcome-sequence-v1-e1";

export function welcomeSequenceIdempotencyKey(email: string): string {
  const recipientHash = createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
  return `${WELCOME_SEQUENCE_ENROLLMENT_TYPE}:${recipientHash}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

export interface WelcomeEmailContext {
  baseUrl?: string;
  preferencesUrl?: string;
  unsubscribeUrl?: string;
}

function wrapEmail(
  content: string,
  preview: string,
  context: WelcomeEmailContext = {},
): string {
  const baseUrl = (context.baseUrl || "https://muditek.com").replace(/\/$/, "");
  const preferencesUrl = context.preferencesUrl || `${baseUrl}/newsletter`;
  const unsubscribeUrl = context.unsubscribeUrl || `${baseUrl}/newsletter`;

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111;">
      ${content}
      <p style="margin:32px 0 0;font-size:15px;color:#444;line-height:1.6;">Ghiles</p>
      <hr style="border:none;border-top:1px solid #eee;margin:28px 0 18px;" />
      <p style="margin:0;font-size:12px;color:#777;line-height:1.6;">
        You received this because you subscribed to Muditek.
        <a href="${escapeHtml(preferencesUrl)}" style="color:#555;">Manage preferences</a>
        &middot;
        <a href="${escapeHtml(unsubscribeUrl)}" style="color:#555;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function p(content: string): string {
  return `<p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#1a1a1a;">${content}</p>`;
}

function sectionTitle(content: string): string {
  return `<p style="margin:24px 0 8px;font-size:16px;line-height:1.5;color:#111;"><strong>${content}</strong></p>`;
}

function textLink(href: string, label: string): string {
  return `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;"><a href="${escapeHtml(href)}" style="color:#111;text-decoration:underline;">${escapeHtml(label)}</a></p>`;
}

export interface SequenceStep {
  step: number;
  delayDays: number;
  subject: string;
  preview: string;
  buildHtml: (name: string, context?: WelcomeEmailContext) => string;
}

export const WELCOME_SEQUENCE: SequenceStep[] = [
  {
    step: 1,
    delayDays: 0,
    subject: "Welcome. Turn your best operator's judgment into a system",
    preview: "Two practical playbooks to capture how your business works and make it reusable.",
    buildHtml: (_name: string, context: WelcomeEmailContext = {}) => {
      const baseUrl = (context.baseUrl || "https://muditek.com").replace(/\/$/, "");

      return wrapEmail(
        `
          ${p("Welcome, and thank you for subscribing.")}
          ${p("I'm Ghiles. I help you turn B2B operations into workflow-based AI systems.")}
          ${p("In these emails, I document what works, what fails, and what it takes to make AI useful inside a real business. You'll hear from me at least once a month.")}
          ${p("To thank you for joining, I want to give you a useful place to start. These two playbooks solve the same problem from opposite sides.")}

          ${sectionTitle("The Judgment Moat")}
          ${p("When the quality of the work depends on your best operator, the bottleneck is not the AI. It is the judgment that person uses but has never written down.")}
          ${p("This playbook shows you how to capture those decisions, add a review process, and give the rest of your team a consistent standard.")}
          ${textLink(`${baseUrl}/portal/playbooks/judgment-moat`, "Read The Judgment Moat")}

          ${sectionTitle("The Skill Creator Blueprint")}
          ${p("Once the judgment is written down, this playbook shows you how to turn one repeated process into an AI workflow your team can reuse without explaining the rules again every time.")}
          ${textLink(`${baseUrl}/portal/playbooks/skill-creator-blueprint`, "Read The Skill Creator Blueprint")}

          ${p("Both are free inside the Muditek portal. Start with the one closest to the problem you have now.")}
        `,
        "Two practical playbooks to capture how your business works and make it reusable.",
        context,
      );
    },
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Build an offer a cold buyer can believe",
    preview: "One skill builds the offer. The other finds what a cold buyer will not understand, trust, or accept.",
    buildHtml: (_name: string, context: WelcomeEmailContext = {}) => {
      const baseUrl = (context.baseUrl || "https://muditek.com").replace(/\/$/, "");

      return wrapEmail(
        `
          ${p("An offer can make perfect sense to the person who created it and still fall apart in front of a cold buyer.")}
          ${p("You know the background, the mechanism, and the proof. The buyer only sees what the offer makes clear and supports.")}
          ${p("I built two skills to handle those jobs in order.")}

          ${sectionTitle("Offer Creation")}
          ${p("This skill researches the market, then helps you define the buyer, problem, outcome, method, terms, qualification, and delivery.")}
          ${p("It forces the offer beyond clever positioning into something you can actually sell and fulfill.")}
          ${textLink(`${baseUrl}/portal/skills/offer-creation`, "Build or improve your offer")}

          ${sectionTitle("Cold Offer Review")}
          ${p("Once the offer exists, this skill audits it as if the buyer has never heard of you.")}
          ${p("It separates what passes, what fails, and what remains unproven. Then it identifies the earliest point where the buyer cannot make the next decision.")}
          ${textLink(`${baseUrl}/portal/skills/cold-offer-review`, "Review your offer as a cold buyer")}

          ${p("Run Offer Creation first. Run Cold Offer Review second.")}
          ${p("The first makes the offer coherent. The second shows whether its important claims are clear, supported, and safe to test before you spend money on traffic or outreach.")}
        `,
        "One skill builds the offer. The other finds what a cold buyer will not understand, trust, or accept.",
        context,
      );
    },
  },
  {
    step: 3,
    delayDays: 7,
    subject: "A question about your pipeline",
    preview: "This is only relevant if you sell high-value B2B services through sales calls.",
    buildHtml: (_name: string, context: WelcomeEmailContext = {}) =>
      wrapEmail(
        `
          ${p("I don't know whether this applies to your business, so let me qualify it first.")}
          ${p("You sell to other businesses. A new client is worth at least €10,000 in the first year. You know which companies and decision-makers you want to reach. And someone on your side has room to take more sales calls.")}
          ${p("If any of that is missing, this probably isn't for you.")}
          ${p("If it all fits, I can run the outbound for you: find the right buyers, handle the outreach and qualification, and put qualified meetings on your calendar.")}
          ${p("The monthly infrastructure fee covers the domains, inboxes, data and software. I make my money only when a qualified meeting actually happens. If the right person doesn't show up, you don't pay for the meeting.")}
          ${p("If this describes your business and you want me to see whether I can reach your buyers, reply to this email. Tell me what you sell and who you want meetings with.")}
          ${p("I'll give you a straight yes or no.")}
        `,
        "This is only relevant if you sell high-value B2B services through sales calls.",
        context,
      ),
  },
];
