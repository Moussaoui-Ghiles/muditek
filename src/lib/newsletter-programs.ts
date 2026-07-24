export type NewsletterLifecycleStep = {
  step: number;
  delayDays: number;
  subject: string;
  previewText: string;
  html: string;
};

export type NewsletterProgramDraft = {
  slug: string;
  subject: string;
  previewText: string;
  html: string;
  campaignType: "reactivation" | "editorial";
  audienceFilter: "ENGAGED" | "COLD" | "UNSEGMENTED" | null;
};

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

export const NEWSLETTER_LIFECYCLE: NewsletterLifecycleStep[] = [
  {
    step: 1,
    delayDays: 0,
    subject: "start here: one workflow",
    previewText: "Pick one repeated task. I’ll show you how to make it AI-executable.",
    html: `
      <p>You’re in.</p>
      <p>Each week I’ll break down one real business workflow: what starts it, what information it needs, what AI can handle, and where a human still matters.</p>
      <p>Start with one task your team repeats every week. Write down three things:</p>
      <ol>
        <li>What triggers the task?</li>
        <li>What information does the person need?</li>
        <li>What does a good finished result look like?</li>
      </ol>
      <p>Reply with the task. If it is a good candidate for AI, I’ll tell you the first part I would change.</p>
      <p>Ghiles</p>
    `,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "why your AI output still sounds generic",
    previewText: "The model is rarely the problem. It is missing your business.",
    html: `
      <p>Most teams blame the model when AI produces generic work.</p>
      <p>The model is usually missing three things:</p>
      <ol>
        <li><strong>Business context:</strong> who you serve, how you decide, and how you speak.</li>
        <li><strong>Executable workflows:</strong> the prompts and SOPs that describe how good work gets done.</li>
        <li><strong>Source material:</strong> the past emails, calls, documents, and examples that define your standard.</li>
      </ol>
      <p>Without those three folders, every employee starts from a blank chat and edits the same generic output again.</p>
      <p>Pick one workflow from the first email. Put its context, instructions, and three examples in one folder. Then run the task again. That comparison tells you whether the problem was the model or the missing business knowledge.</p>
      <p>Ghiles</p>
    `,
  },
  {
    step: 3,
    delayDays: 8,
    subject: "the 10-hour test",
    previewText: "A simple threshold for deciding whether a workflow is worth rebuilding.",
    html: `
      <p>Not every repeated task deserves automation.</p>
      <p>I use a simple first test: if one workflow consumes at least 10 team-hours a week, produces a repeatable output, and depends on information you already own, it is worth auditing.</p>
      <p>For one week, track:</p>
      <ol>
        <li>How often the task happens.</li>
        <li>Minutes spent each time.</li>
        <li>Where people wait, copy data, or redo work.</li>
      </ol>
      <p>That gives you a real baseline. No “AI transformation” guesswork.</p>
      <p>If your company has 20+ people and you find a workflow above that threshold, I can map what to automate, what to augment, and what should stay human.</p>
      <p><a href="${BOOKING_URL}">Book a 30-minute workflow call</a></p>
      <p>Ghiles</p>
    `,
  },
];

const REACTIVATION_HTML = `
  <p>You subscribed to my previous B2B Agents newsletter. Then I stopped publishing consistently, and the direction changed.</p>
  <p>I’m restarting it with one clear promise: one useful email a week showing how a real business workflow becomes AI-executable. No AI news roundup. No tool dump.</p>
  <p>Each issue will show the trigger, inputs, instructions, source material, and human checks behind the workflow.</p>
  <p>If that is useful to you, confirm once below. If not, do nothing. I’ll mark this address dormant and stop sending.</p>
  <p><a href="{{NEWSLETTER_CONFIRM_URL}}">Keep me on the newsletter</a></p>
  <p>Ghiles</p>
`;

export const NEWSLETTER_REACTIVATION_DRAFTS: NewsletterProgramDraft[] = [
  {
    slug: "newsletter-reset-engaged",
    subject: "should I keep sending this?",
    previewText: "The newsletter is changing. Choose whether you want the new version.",
    html: REACTIVATION_HTML,
    campaignType: "reactivation",
    audienceFilter: "ENGAGED",
  },
  {
    slug: "newsletter-reset-cold",
    subject: "should I keep sending this?",
    previewText: "The newsletter is changing. Choose whether you want the new version.",
    html: REACTIVATION_HTML,
    campaignType: "reactivation",
    audienceFilter: "COLD",
  },
  {
    slug: "newsletter-reset-unsegmented",
    subject: "should I keep sending this?",
    previewText: "The newsletter is changing. Choose whether you want the new version.",
    html: REACTIVATION_HTML,
    campaignType: "reactivation",
    audienceFilter: "UNSEGMENTED",
  },
];
