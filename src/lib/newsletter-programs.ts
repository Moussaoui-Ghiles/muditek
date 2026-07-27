import type { NewsletterAudienceFilter } from "@/lib/newsletter-audience";

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
  campaignType: "editorial";
  audienceFilter: NewsletterAudienceFilter | null;
};

export const NEWSLETTER_LIFECYCLE: NewsletterLifecycleStep[] = [
  {
    step: 1,
    delayDays: 0,
    subject: "start with the outbound math",
    previewText: "Before tools or copy, work out what one qualified meeting is worth.",
    html: `
      <p>You’re in.</p>
      <p>I’m documenting how I build outbound systems that produce qualified sales meetings, including the tests that fail.</p>
      <p>The first number is simple:</p>
      <p><strong>Average deal value × close rate on qualified meetings = expected value of one meeting.</strong></p>
      <p>If a deal is worth €10,000 and one in five qualified meetings closes, one meeting is worth €2,000 on average. Everything else—budget, volume, and what you can afford to pay—starts there.</p>
      <p>Reply with your average deal value and close rate. I’ll send the math back.</p>
      <p>Ghiles</p>
    `,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "cold email usually dies before the copy",
    previewText: "Three operational failures kill most campaigns before the message gets a fair test.",
    html: `
      <p>Most cold-email campaigns blame the copy. The failure usually happened earlier:</p>
      <ol>
        <li>They sent from the main company domain.</li>
        <li>They bought a broad list instead of starting from a real market signal.</li>
        <li>They judged one script instead of testing controlled variants.</li>
      </ol>
      <p>A clever opening line cannot rescue damaged infrastructure or the wrong buyer list.</p>
      <p>Reply with the market you sell to. I’ll tell you the first list source I would test.</p>
      <p>Ghiles</p>
    `,
  },
  {
    step: 3,
    delayDays: 8,
    subject: "the offer I’m testing",
    previewText: "A small infrastructure fee, then payment only when a qualified meeting shows.",
    html: `
      <p>I’m testing a simple service for B2B firms with €10K+ deals:</p>
      <ol>
        <li>I build the sending infrastructure.</li>
        <li>I source and verify the exact decision-makers.</li>
        <li>I test the messaging and handle replies.</li>
        <li>You pay a small tech fee, then a fixed price per qualified meeting that actually shows up.</li>
      </ol>
      <p>No show, no meeting fee. “Qualified” is written into the agreement before anything sends.</p>
      <p>This only fits companies with a sales-led offer, enough reachable buyers, and someone who can take the calls.</p>
      <p>Reply with your average deal value, close rate, and who you sell to. If the numbers work, I’ll say so and we’ll take it from there. If they don’t, I’ll tell you that instead.</p>
      <p>Ghiles</p>
    `,
  },
];

export const NEWSLETTER_CAMPAIGN_DRAFTS: NewsletterProgramDraft[] = [
  {
    slug: "outbound-build-log-introduction",
    subject: "what I’m building now",
    previewText: "A transparent reset: qualified meetings, real tests, and the numbers behind them.",
    html: `
      <p>I stopped publishing consistently. That’s on me.</p>
      <p>I’m back with a narrower focus: building an outbound engine for B2B firms with high-value deals.</p>
      <p>The model is simple: a small fee covers the infrastructure, then the client pays per qualified meeting that actually shows up.</p>
      <p>I’ll publish the work behind it: which niches reply, where the lists come from, what damages deliverability, how replies become meetings, and which tests die.</p>
      <p>No fake revenue screenshots. No weekly AI-news roundup.</p>
      <p>If you sell a €10K+ B2B offer, reply with your target buyer. I’ll tell you whether the market is large enough to test.</p>
      <p>Ghiles</p>
    `,
    campaignType: "editorial",
    audienceFilter: "OUTBOUND_INTEREST",
  },
  {
    slug: "outbound-meeting-value",
    subject: "what one qualified meeting is worth",
    previewText: "The formula that tells you whether outbound economics work before you spend anything.",
    html: `
      <p>Before domains, copy, or lead lists, calculate one number:</p>
      <p><strong>Average deal value × close rate on qualified meetings.</strong></p>
      <p>A €10,000 deal at a 20% close rate makes one qualified meeting worth €2,000 in expected revenue.</p>
      <p>If the meeting costs €300, the acquisition cost is roughly €1,500 per closed deal before the infrastructure fee. The client keeps most of the upside, and the operator only earns when a real buyer shows.</p>
      <p>The calculation also exposes bad fits. A low-ticket offer, a tiny market, or nobody available to close the calls will not work because the unit economics fail.</p>
      <p>Reply with your deal value and close rate. I’ll run the calculation with your numbers.</p>
      <p>Ghiles</p>
    `,
    campaignType: "editorial",
    audienceFilter: "PORTAL_ACTIVE_30D",
  },
  {
    slug: "outbound-three-failures",
    subject: "the three ways cold email dies",
    previewText: "Most campaigns fail before their copy gets a fair test.",
    html: `
      <p>Most cold-email postmortems blame the message.</p>
      <p>The campaign often died earlier:</p>
      <ol>
        <li><strong>Infrastructure:</strong> sending from the main domain or ramping volume before inboxes are ready.</li>
        <li><strong>Data:</strong> buying a broad database export instead of starting with a registry, trigger, or other reason the buyer belongs in the list.</li>
        <li><strong>Testing:</strong> sending one script and calling the channel dead.</li>
      </ol>
      <p>The copy matters after those three are controlled. Until then, rewriting the opening line is theatre.</p>
      <p>Reply with the market you target. I’ll send back the first list source and signal I would test.</p>
      <p>Ghiles</p>
    `,
    campaignType: "editorial",
    audienceFilter: "RECENT_90D",
  },
];
