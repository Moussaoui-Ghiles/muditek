// Public playbook preview pages. Static data module.
// Each entry powers a crawlable /playbooks/<slug> page that previews real
// info-gain (excerpt, what's-inside) and gates the full asset behind a free
// account at /portal/playbooks/<slug>. Mirrors the case-studies pattern.

export type PlaybookCategory =
  | "outbound"
  | "sales"
  | "marketing"
  | "seo"
  | "agentic-engineering";

export type PlaybookAccent = "primary" | "emerald" | "sky" | "neutral";

export interface PlaybookMetric {
  value: string;
  label: string;
}

export interface Playbook {
  slug: string;
  /** Short display title (card + breadcrumb). */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** H1 promise. One line, the outcome the reader gets. */
  hook: string;
  whoItsFor: string;
  outcome: string;
  category: PlaybookCategory;
  keywords: string[];
  /** Specific, real bullets of what the full playbook contains. */
  whatsInside: string[];
  /** 150-300 words of real, standalone-valuable content (the info-gain). */
  excerpt: string;
  topMetrics?: PlaybookMetric[];
  /** Source asset type. Drives the CTA label. */
  format: "html" | "pdf";
  /** ISO date. Real last-updated for sitemap + schema. */
  date: string;
}

export const CATEGORY_META: Record<
  PlaybookCategory,
  { label: string; accent: PlaybookAccent }
> = {
  outbound: { label: "Outbound & Lead Gen", accent: "emerald" },
  sales: { label: "Sales & SDR", accent: "emerald" },
  marketing: { label: "Marketing", accent: "primary" },
  seo: { label: "SEO & GEO", accent: "sky" },
  "agentic-engineering": { label: "Agentic Engineering", accent: "primary" },
};

export const PLAYBOOKS: Playbook[] = [
  {
    slug: "google-maps-outbound",
    title: "Google Maps Outbound Playbook",
    metaTitle: "Google Maps Outbound Playbook: Scrape Local Leads | Muditek",
    metaDescription: "Use Claude Code on a $10/mo server to scrape, enrich, and sequence local business leads from Google Maps that nobody else is emailing.",
    hook: "Turn Google Maps' 265 million business listings into a daily pipeline of enriched local leads using one Claude Code prompt and a $10/mo server.",
    whoItsFor: "B2B founders and agency operators who already have a sharp ICP and offer, and want a self-running outbound engine instead of another headcount.",
    outcome: "A scraping and sequencing machine that drops 500 to 2,000 enriched, never-touched local leads into your pipeline every morning, run by you alone.",
    category: "outbound",
    keywords: ["google maps lead scraping","scrape local business leads","claude code outbound automation","cold email local businesses","google maps outbound playbook","vps cold email infrastructure","enrich leads from google maps","signal based cold email personalization"],
    whatsInside: [
      "The exact Claude Code prompt that builds a Python Google Maps scraper end to end and tells you which RapidAPI endpoints to use",
      "The two-API stack: Business Data Finder (Maps listings) plus Website Contacts Finder (owner email extraction)",
      "Four public Google Maps signals (no website, low reviews, no photos, outdated site) with the verbatim outreach line for each",
      "The 7-step VPS setup: Hostinger or Hetzner, Claude Code plus tmux, Tailscale VPN, Instantly or Smartlead, Telegram alerts, 6am cron",
      "The three-channel stack: email volume engine (35 domains, 105 inboxes, 2,000 sends/day), LinkedIn warm layer, X intent scanner",
      "Honest economics: 2-6% reply rate, 20-40 qualified calls/month, 25% close rate, and where the numbers break",
      "The Monday-to-month-four setup timeline",
      "The build-this-if vs do-not-build-this-if qualification checklist",
    ],
    excerpt: "Most B2B teams pull leads from Apollo, ZoomInfo, and LinkedIn Sales Nav. Same leads, same inboxes, same pile of identical pitches. Google Maps has 265 million business listings: local businesses with outdated websites, 11 Google reviews, and no photos on their profile. Real owners with real pain you can see before writing a single word. And barely anyone is cold emailing them.\n\nThe signal is the personalization. No website becomes \"Couldn't find a website on your Google profile, so I built you a free demo.\" Low reviews becomes \"You have 11 reviews, most competitors in your area have 50+.\" No photos ties to a real outcome: \"businesses with photos get 42% more direction requests.\" These signals are public and verifiable, so outreach feels relevant instead of random.\n\nYou build the pipeline with one Claude Code prompt: \"Build a Python scraper that hits Google Maps for 'dentists in Austin, TX', pulls name, address, phone, website, rating, review count, then crawls each website to extract the owner contact email, outputs to CSV.\" Two RapidAPI endpoints do the work: a Business Data Finder and a Website Contacts Finder.\n\nInfrastructure is a $7-12/mo VPS on Hostinger or Hetzner, Claude Code plus tmux for persistent sessions, Tailscale for access, and a 6am cron job. You wake up to 500 to 2,000 fresh enriched leads. Email runs volume (35 domains, 105 inboxes, 2,000 sends/day with follow-ups at 3, 5, 8, and 14 days), LinkedIn builds familiarity, X catches intent. Honest caveat: these are top-of-range numbers, deliverability is the hardest part, and this targets SMB and local, not enterprise.",
    topMetrics: [
      { value: "265M", label: "Google Maps listings" },
      { value: "$10/mo", label: "VPS scraping cost" },
      { value: "2,000", label: "Enriched leads per day" },
      { value: "2-6%", label: "Reply rate on hyper-local outreach" },
    ],
    format: "html",
    date: "2026-05-11",
  },
  {
    slug: "cold-email-claude-code-blueprint",
    title: "Cold Email at $0.03 a Lead",
    metaTitle: "Cold Email at $0.03 a Lead: Claude Code Stack | Muditek",
    metaDescription: "The exact Claude Code stack, client folder, and three skills that ship a live cold email campaign for the price of the data. About 20 minutes, about $60.",
    hook: "Ship a live cold email campaign end to end for $0.03 a verified lead, with your only job being a two-minute audit.",
    whoItsFor: "Founders and GTM operators who run outbound and want a coding agent to do the list-building, copy, and campaign assembly instead of an agency retainer.",
    outcome: "A campaign that used to take two days of skilled labor now goes from one voice prompt to live in about 20 minutes, with no added headcount.",
    category: "outbound",
    keywords: ["cold email automation with claude code","ai cold email agent","cold email cost per lead","leadmagic verified email enrichment","automate cold email campaign","claude code gtm stack","ai outbound campaign assembly","cold email agency alternative"],
    whatsInside: [
      "The six-piece stack: Claude Code in Antigravity, Wispr Flow voice input, LeadMagic enrichment, Instantly/Lemlist/Smartlead sending, the client folder, and your judgment",
      "The identical six-folder client structure (List Building, ICP Context, Context, Call Recordings, Onboarding Notes, Campaign Briefs) that lets you reuse skills across every account",
      "Why the ABM list sits at 10K to 50K domains and what breaks below and above that band",
      "The three skills that run it: Copywriting (60-80 words, give-first, no calendar ask), List Building, and Campaign Assembly",
      "The operator preamble every skill opens with, plus the single under-90-second prompt that oneshots a campaign",
      "The exact 20-minute run: 105 verified, minus 50 deduped, minus 9 blocked, 28 live with an A/B test",
      "The two-minute audit and the same four misses every time: subject lines, CTA, sequence at day 4/9/16, and variable spot-check",
      "The self-improving loop that reads reply data daily and cross-client compounding across 400+ companies",
    ],
    excerpt: "Three years ago this campaign was two full days of skilled work. Map the TAM, pull personas, scrape titles, enrich domains, verify, scrub the block list, write fresh copy, upload, configure the sequence, QA every variable. That is what the retainer paid for. It now costs the price of the data and a coffee's worth of review time.\n\nThe shift in one line: you stop paying for the execution. The only hard cost left is the data. Per verified email is $0.03. A 2,000-credit cap holds the data cost near $60 a run. Your time in the loop is about two minutes, the audit.\n\nWhen a client signs, the first thing you build is the agent's folder, identical for every account: List Building, ICP Context, Context, Call Recordings, Onboarding Notes, Campaign Briefs. The model isn't smart. The folder is.\n\nThree skills do the heavy lifting. Copywriting enforces 60 to 80 words, opens give-first never with credentials, no meeting ask in the first message, mirrors the prospect's language. List Building queries the API, dedupes against live campaigns, verifies, scrubs the block list. Campaign Assembly creates the campaign, uploads leads, configures the sequence, sets up the subject-line A/B test.\n\nOne spoken prompt runs it: open the client folder, take the ICP titles, cross-reference the ABM list, use the LeadMagic API for verified emails, cap credits at 2,000, draft the copy, build the campaign, oneshot it. The run returns 105 verified prospects, drops 50 dupes and 9 blocked, lands at 28 live. The audit is ceremonial. The real work happened in the twenty minutes before.",
    topMetrics: [
      { value: "$0.03", label: "per verified email" },
      { value: "~$60", label: "data cost per run, 2,000-credit cap" },
      { value: "~20 min", label: "one prompt to live campaign" },
      { value: "28", label: "verified prospects out, campaign live" },
    ],
    format: "html",
    date: "2026-05-30",
  },
  {
    slug: "ai-marketing-team-playbook",
    title: "Build an AI Marketing Team That Stops Producing Slop",
    metaTitle: "AI Marketing Team: 5-Gate Anti-Slop System | Muditek",
    metaDescription: "The five-gate system, role-card prompts, and draft-vs-critique protocol to run a marketing team of AI agents that argue before they publish.",
    hook: "Run a marketing team of AI agents that argue before they publish, so your AI stops shipping the beige paragraph everyone else does.",
    whoItsFor: "For operators and founders who want AI to produce real marketing work, not a confident yes-man that agrees with every brief.",
    outcome: "An agent team that drafts, attacks its own work, and hands you a reviewable decision memo, with no added marketing headcount.",
    category: "agentic-engineering",
    keywords: ["ai marketing team","ai agents marketing","multi-agent prompt system","stop ai slop","role card prompt schema","ai content review workflow","adversarial ai agents","decision memo ai content"],
    whatsInside: [
      "The five-gate checklist (Intake, Specialist, Adversary, Lead, Memo) and the exact slop each gate stops if you delete it",
      "The Marketing Intake Gate: the five questions the Lead must get answered (objective, audience, channel, proof, constraint) before any drafting starts",
      "The Role Card Schema: Job / Input / Output / Forbidden / Stop, plus filled Writer and Skeptic cards built to disagree",
      "The persona-prompt vs filter-prompt table showing why 'you are an expert copywriter' produces a cosplay bot",
      "The Draft vs Critique Protocol: a fixed three-round fight that ends in checkable claims, not 'I like it / I don't'",
      "The Content Decision Memo template: core promise, case for, case against, key assumptions, kill condition, risks, next action, confidence",
      "The Four Seats (Researcher, Writer, Skeptic, Editor) and how the same system maps onto demand gen, product marketing, and sales",
      "The honest limits: garbage proof in, garbage memo out, and why the Writer and Skeptic must be two real agents not one prompt",
    ],
    excerpt: "A single AI agrees with you too much. Ask if your draft is good, it tells you it is great. Ask for a hook, it hands you the safe one. A bigger model does not fix this. The fix is an org chart, not a smarter model.\n\nA usable team comes down to five gates. Miss one and the whole thing leaks. Without Intake, the team perfectly executes the wrong brief. Without Specialist, every role blurs into the same mush. Without Adversary, the team hypes your draft and ships slop. Without Lead, you get a pile of disconnected fragments. Without Memo, you make the same mistake next campaign.\n\nGate 1 is the Marketing Intake Gate. Before drafting starts, the Lead must get five things clear: Objective (pipeline, signups, awareness, retention), Audience (role, stage of awareness, the pain in their words), Channel, Proof (real evidence and numbers, plus what you are NOT allowed to claim), and Constraint (brand rules, banned words, legal lines, length). Give it \"we need something for the launch\" and it should come back with questions, not copy. The refusal is the feature.\n\nRoles are filters, not personas. A weak prompt says \"you are an expert copywriter, make this engaging.\" A strong one says: \"one promise, one reader. Tag every claim to a real source. Refuse if there is no claim to make.\" The Writer wants to ship. The Skeptic wants to cut. Their jobs point in opposite directions by design, so you never fake the tension. The output is not \"publish this,\" it is a decision memo: core promise, case for, case against, key assumptions, kill condition, next action.",
    format: "html",
    date: "2026-06-04",
  },
  {
    slug: "agentic-sdr-setup-guide",
    title: "Agentic SDR Setup Guide",
    metaTitle: "Agentic SDR Setup Guide: 3-Channel Outbound | Muditek",
    metaDescription: "Run X, cold email, and LinkedIn as one coordinated agentic SDR system. The sequence, stack, data model, and rollout logic. No large human SDR team.",
    hook: "Run X, cold email, and LinkedIn as one coordinated outbound machine without first hiring a large human SDR team.",
    whoItsFor: "Founders and operators who already have a clear offer and sharp ICP and want repeatable outbound run by AI agents, not more headcount.",
    outcome: "A documented multi-channel SDR system where agents read signals, send the right touch, log it, and escalate exceptions, so outbound economics behave like software instead of headcount.",
    category: "outbound",
    keywords: ["agentic sdr setup","ai sdr system","multi-channel outbound sequence","cold email linkedin x outbound","ai outbound automation stack","automated outbound without headcount","outbound orchestration system","ai sdr playbook"],
    whatsInside: [
      "The 3-channel rhythm: X DM on day 1, cold email day 3, LinkedIn day 5, progressive follow-ups day 7 to 14, run as one sequence with one memory",
      "Channel jobs: X for attention arbitrage, email for the real offer, LinkedIn as the identity layer, follow-up for compounding value, each kept in character",
      "The lean stack: Hostinger VPS, Tailscale, OpenClaw orchestration, Telegram command bot, Instantly, PhantomBuster, Drippi, Apollo, and one shared database",
      "The data-first system of record: who the prospect is, why selected, what signal triggered outreach, which angle is active, which channel touched, what happened next",
      "The minimum documentation stack: ICP and exclusions, signal-to-problem map, channel rules, offer library, escalation rules, logging rules",
      "Six message rules plus the bad-automation list to avoid (fake personalization, compliment openers, just-checking-in follow-ups)",
      "The 6-step rollout: Strategy, Infrastructure, Message System, Hardening, Controlled Launch, Optimization, over 6 to 8 weeks",
      "The build-this-if vs do-not-build-this-if qualification checklist before you automate anything",
    ],
    excerpt: "The bottleneck in outbound is rarely effort. It is coordination. Traditional outbound breaks when volume rises: follow-ups get skipped when calendars fill, messaging drifts the moment reps improvise, logging gets messy so the team stops learning, and channels run as separate campaigns instead of one system. The fix is to turn three channels into one sequence with one memory. Day 1 an X DM creates early relevance, light and intentionally low pressure. Day 3 cold email carries the clearest commercial message: name the problem, point to a believable mechanism, make a small low-friction offer, not a forced meeting. Day 5 LinkedIn adds identity and context, peer-to-peer. Day 7 to 14 follow-ups add something new each time: sharper diagnosis, clearer mechanism, example, framework, or proof, never just repeating the ask. Do not paste the same message everywhere. Each channel gets a different job and stays in character. Small offers that work: short teardown, problem breakdown, setup guide, decision framework, compact diagnostic. The database comes before the message. An agent without documentation is just automated randomness. You need one clean system of record and a judgment layer: ICP and exclusions, a signal-to-problem map, channel rules, an offer library, escalation rules, and logging rules. The real job of AI here is narrow: read the signal, map it to a likely problem, select the right message pattern, send or queue the touch, log what happened, escalate exceptions. The model is not your GTM brain. The lean core stack runs around $269 a month, but the moat is the architecture: one environment, one orchestrator, one command surface, one clean data layer. If the offer or list is weak, the same stack will simply scale irrelevance faster.",
    topMetrics: [
      { value: "$269", label: "approximate lean core stack per month" },
      { value: "157", label: "conservative modeled calls per month" },
      { value: "4,140", label: "modeled daily touches across channels" },
      { value: "6-8 weeks", label: "for a proper rollout" },
    ],
    format: "pdf",
    date: "2026-05-11",
  },
  {
    slug: "coding-agent-seo-playbook",
    title: "Coding Agents Can Run Your SEO",
    metaTitle: "Run SEO With Coding Agents: 17 Recipes | Muditek",
    metaDescription: "17 paste-ready prompts that turn Claude Code or Codex into a full SEO team. Live SERP data, evidence-based edits, audit trail. No SEO background needed.",
    hook: "Paste 17 production-grade prompts into Claude Code or Codex and run a full enterprise SEO team out of one terminal.",
    whoItsFor: "Founders, operators, agencies, and in-house SEO teams who are tired of generic AI prompts and want real, evidence-based SEO work run by an agent across 1 page or 20,000.",
    outcome: "Recover stuck pages, build site-wide internal links, refresh stale content, and ship client-ready audit PDFs without hiring a junior SEO, a writer, a developer, or a PM.",
    category: "seo",
    keywords: ["run SEO with Claude Code","coding agent SEO automation","Codex SEO prompts","AI SEO recipes for agents","on-page SEO MCP setup","automate internal linking AI agent","recover stuck page SEO prompt","evidence-based AI SEO workflow"],
    whatsInside: [
      "Recipe 1: Recover a stuck page in one command, targeting 34 Google ranking factors across six families with a scan, fix, rescan loop",
      "Recipe 2: Site-wide internal links from 50 to 20,000+ pages using a resumable JSON manifest, 75-page runs, 10-page batches, max 3 links per page",
      "The three-layer model: live SERP data (on-page-seo MCP) + 17 years of interpretation heuristics + the recipes themselves",
      "The two non-negotiable rules: preserve human writing (the racterScores AGC signal) and justify every change with a specific scan signal",
      "Five-minute setup: connect the on-page-seo MCP, plus WordPress REST (Application Passwords) or SSH, easy vs safer .env method",
      "Recipes 9 and 10: full client website audit and single-page audit as polished PDFs with a 30/60/90 plan",
      "Recipe 11: diagnose-only 'why isn't this page ranking' returning the top 1 to 3 likely causes with no edits",
      "Recipes 14-17: local SEO suite covering NAP, GBP alignment, LocalBusiness schema, and a cross-region cannibalization checker",
    ],
    excerpt: "Most \"AI SEO automation\" fails for one reason: the model gets a URL, a keyword, and \"optimize this page,\" so it parrots back the same advice every consultant has sold for ten years. It has no idea what's ranking right now, what entities competitors cover, or which of 200+ ranking factors your page is missing. The fix is not a smarter prompt. It is feeding the agent the same intelligence a senior SEO wants before touching a page: live SERP data, competitor benchmarks, entity gaps, Highly Related Words, category signals, internal link opportunities, and algorithmic scores, then telling it exactly what to do, step by step, with verification.\n\nThis playbook is built on a three-layer model. Layer 1 is real-time data through the on-page-seo MCP. Layer 2 is interpretation context (17+ years of SEO heuristics) bundled inside the MCP so the agent knows which gaps matter and which are noise. Layer 3 is the 17 recipes.\n\nTwo rules are non-negotiable. Rule 1: preserve human writing. The Google algorithm leak surfaced racterScores, a value monitoring Artificially Generated Content, so the target is doing the SEO work around the human writing, not on top of it. Rule 2: justify each change with evidence. Every edit ties to a specific signal in the scan report (missing entity, weak alt-text, thin content versus competitors). Every recipe ends with an HTML report showing before/after scores, which entities were added, which were skipped and why. Recipe 1 alone targets 34 ranking factors and in one real run worked for nearly 25 minutes, updating the page multiple times.",
    format: "html",
    date: "2026-05-26",
  },
  {
    slug: "clawchief-blueprint",
    title: "The Chief of Staff Blueprint",
    metaTitle: "Chief of Staff Blueprint: Replace a $75K EA | Muditek",
    metaDescription: "Turn an AI agent into an autonomous chief of staff with 8 markdown files, 4 skills, and 3 cron jobs. Inbox, calendar, outreach, tasks. Verbatim build.",
    hook: "Replace a $75K executive assistant with 8 markdown files, 4 skills, and 3 cron jobs that run your inbox, calendar, and outreach while you sleep.",
    whoItsFor: "Founders and operators who already run an AI agent and want it to act like a proactive chief of staff, not a passive chatbot.",
    outcome: "The boring 80% of an EA's day becomes files and crons, with no added headcount, while judgment and relationships stay yours.",
    category: "agentic-engineering",
    keywords: ["replace executive assistant with AI agent","AI chief of staff setup","autonomous AI agent inbox calendar","OpenClaw chief of staff blueprint","cron job AI assistant automation","AI agent priority map auto-resolver","agentic operating system markdown files"],
    whatsInside: [
      "The 3-layer rule: skills define how to act, files define who to act for, crons define when to wake up",
      "priority-map.md person and program block templates with P0 to P3 urgency and four action modes",
      "auto-resolver.md and its five-condition safe-auto-resolve checklist for acting alone vs drafting vs escalating",
      "HEARTBEAT.md, the exact 11-step sequence the agent runs every 15 minutes",
      "tasks.md structure plus the 9 non-negotiable task-file rules and overnight archive to tasks-completed.md",
      "meeting-notes.md 7-step ingestion workflow that turns calls into tasks with a JSON ledger",
      "All 4 skills (executive-assistant, business-development, daily-task-manager, daily-task-prep) with gog queries and reply templates",
      "The 3 cron job configs, 13 install values, 7-step install flow, and full validation checklist",
    ],
    excerpt: "Most AI assistants are passive. A chief of staff wakes up. It checks your inbox at 8:15am, your calendar at 8:30, your CRM at 9, and only interrupts you when something actually needs you. This blueprint defines the missing operating system in three portable layers. Skills tell the agent how to act. Files tell it who to act for. Crons tell it when to wake up. Without all three you have a chatbot. With all three you have an operator.\n\nPrioritization lives in priority-map.md and nowhere else: every signal maps to people, programs, an urgency level (P0 interrupt now, P1 same day, P2 digest, P3 archive), and one of four action modes. Resolution policy lives in auto-resolver.md, which only acts alone when all five conditions are true: the signal is clearly understood, the source of truth is known, the action is operational not strategic, authority is already clear, and a mistake would be low-cost and recoverable. If any fail, it drafts and asks.\n\nHEARTBEAT.md is the 11-step sequence the agent runs every 15 minutes, 8am to 9pm, around 52 sweeps a day. It reads the priority map, the auto-resolver, meeting notes, and the live task file, runs the executive-assistant workflow, auto-resolves low-risk items, and replies HEARTBEAT_OK when there is nothing useful to say. Three cron jobs drive it: the EA sweep, a 2am daily task prep that builds tomorrow's list, and a 2am sourcing job that pulls 10 verified leads into your CRM. Common mistake: enabling all 3 crons before customizing the priority map, which buys you 52 useless sweeps a day.",
    topMetrics: [
      { value: "$75K/yr", label: "EA salary the stack replaces" },
      { value: "8 / 4 / 3", label: "markdown files, skills, cron jobs" },
      { value: "~45 min", label: "clone to first heartbeat" },
      { value: "52", label: "inbox sweeps per day, 8am to 9pm" },
    ],
    format: "html",
    date: "2026-05-11",
  },
  {
    slug: "geo-playbook",
    title: "Cited, Not Ranked: The GEO Playbook",
    metaTitle: "GEO Playbook: Get Cited by AI Search | Muditek",
    metaDescription: "The complete GEO playbook to make ChatGPT, Perplexity, Claude and Google AI Overviews find, read, and cite your content. Base setup takes one hour.",
    hook: "Make ChatGPT, Perplexity, Claude and Google AI Overviews cite your content, with a base setup that takes about one hour.",
    whoItsFor: "Operators and founders who want their brand named and cited inside AI answers, not buried on page two of Google.",
    outcome: "Your pages get found, read, and cited accurately by AI engines without adding headcount or a week of SEO work.",
    category: "seo",
    keywords: ["generative engine optimization playbook","how to get cited by chatgpt","llms.txt setup guide","optimize for ai overviews","get cited by perplexity","geo vs seo","ai search optimization for brands","indexnow bing ai search"],
    whatsInside: [
      "Step 1: sort the five AI crawler types in robots.txt (training, search and retrieval, user-triggered, opt-out tokens, undeclared) so you do not vanish from AI search",
      "Step 2: write an llms.txt site summary, with a copy-paste format and a filled-in Acme Analytics example, plus where to submit it",
      "Step 4: serve llms-full.txt and .md routes that cut a 15,000-token HTML page to ~3,000 tokens of pure content",
      "Steps 5-6: register with Google Search Console and Bing, turn on IndexNow with the exact key file and POST payload to ping changed URLs",
      "Step 9: the per-project page template (citable summary, comparison, use cases, install commands) that actually earns citations",
      "Part 4: the nine tested content changes ranked by lift, Cite Sources, Quotation, Statistics each +30-40%, Keyword Stuffing 10% worse than nothing",
      "Part 5: the tactics that waste time, ai.txt, HTML comment hints, user-agent cloaking, FAQ-stuffing, and the JSON-LD reality",
      "Part 6: the honest limits, llms.txt has no proven citation lift yet, and AI attribution is wrong 60%+ of the time",
    ],
    excerpt: "The page ChatGPT cites and the page Google ranks are usually two different pages. Only 6.82% of the pages ChatGPT cites also sit in Google's top 10, and nearly a third of the most-cited AI pages do not rank on Google at all. 83% of AI Overview citations come from pages outside the organic top 10. On queries that surface an AI answer, organic clicks fall about 61%, but brands cited inside that answer pick up a +35% click lift while everyone else bleeds out.\n\nGEO is a brand-visibility play, not a traffic play. It is worth one hour of setup, not a week. The base is five moves: sort AI crawlers in robots.txt (block training, allow search and retrieval, or the site vanishes from AI search), publish an llms.txt summary at the root, serve llms-full.txt plus .md routes that strip a 15,000-token HTML page down to about 3,000 tokens, register with Google Search Console and Bing, and turn on IndexNow so Bing is notified the moment you publish. Bing matters more than its market share: Copilot, DuckDuckGo, Yahoo and ChatGPT search all run on the Bing index underneath.\n\nWhat actually moves citation, from controlled testing across a 10,000-query benchmark: Cite Sources, Quotation Addition, and Statistics Addition each lift visibility 30 to 40%. Keyword stuffing scores about 10% worse than doing nothing. Front-load value, 44.2% of citations come from the first 30% of the text. Pure FAQ format actively hurts, the opposite of what most GEO-score tools advise.",
    topMetrics: [
      { value: "6.82%", label: "of ChatGPT-cited pages also rank in Google's top 10" },
      { value: "83%", label: "of AI Overview citations come from outside the organic top 10" },
      { value: "+115%", label: "visibility lift from Cite Sources on a page ranked #5" },
      { value: "~1 hour", label: "base setup time for the first five steps" },
    ],
    format: "html",
    date: "2026-06-01",
  },
  {
    slug: "claude-code-tips",
    title: "Claude Code Power User Playbook",
    metaTitle: "Claude Code Power User Playbook: 45 Tips | Muditek",
    metaDescription: "45 Claude Code tips from someone who runs a whole business through it. Voice input, git worktrees, handoff docs, parallel subagents, and more.",
    hook: "Run your whole operation through Claude Code: voice input, parallel agents, and clean context handoffs that 10x your output.",
    whoItsFor: "For operators and founders who want to run real work through Claude Code, not just dabble in vibe-coding.",
    outcome: "You get more done per day by delegating tedious digital work to 3 parallel Claude Code agents without hiring anyone.",
    category: "agentic-engineering",
    keywords: ["claude code tips","claude code power user","claude code voice input","git worktrees claude code","claude code subagents parallel","claude code context handoff","run claude code from phone","claude code workflow"],
    whatsInside: [
      "Voice-to-Claude setup (superwhisper, MacWhisper, EarPods) that runs 3-5x faster than typing, even on a plane",
      "The HANDOFF.md pattern: write a handoff doc, review it, start fresh so the next agent loads one file and finishes the task",
      "Git worktrees recipe to run 3 independent Claude Code agents shipping features simultaneously from one repo",
      "Background subagents with Ctrl+B plus model selection (Opus/Sonnet/Haiku) for parallel codebase analysis",
      "Slim the system prompt from ~19k to ~9k tokens, plus lazy-load MCP tools with ENABLE_TOOL_SEARCH",
      "The tmux write-test cycle that lets Claude run git bisect and fix CI autonomously",
      "cc-safe command audit to catch risky approved commands like rm -rf before they wipe your home directory",
      "The self-check verification prompt: double-check every claim and produce a table of what was verified",
    ],
    excerpt: "Most people use Claude Code at 10% of its power. A few recipes from the playbook that stand alone:\n\nVoice beats typing. Using a local transcription model (superwhisper, MacWhisper, or open-source Super Voice Assistant), you communicate 3-5x faster. Even when words get mistranscribed, Claude infers intent. The author whispers into Apple EarPods in offices and on planes and runs his entire business this way.\n\nContext is like milk, best served fresh and condensed. Start a new session for every new topic. Before clearing, ask Claude to write a HANDOFF.md explaining what was tried, what worked, what did not, so the next fresh agent loads only that file and finishes the task. Review it, then start clean.\n\nRun agents in parallel. A git worktree is a branch plus its own directory: git worktree add ../my-project-feature-1 feature-1, then cd in and launch Claude. Three worktrees equal three agents shipping features at once. Press Ctrl+B to push a command to the background, and spawn background subagents on Opus, Sonnet, or Haiku for different parts of a large codebase.\n\nCut the overhead. Claude Code's system prompt and tool definitions eat about 19k tokens (~10% of 200k) before you start. Patching trims that to ~9k. Add ENABLE_TOOL_SEARCH to lazy-load MCP tools only when needed.\n\nVerify everything. A favorite prompt: \"double check everything, every single claim in what you produced, and at the end make a table of what you were able to verify.\" And run cc-safe to scan approved commands for danger like rm -rf or sudo.",
    topMetrics: [
      { value: "45", label: "tips, Tip 0 through Tip 45" },
      { value: "~10k", label: "tokens saved by slimming the system prompt (~50%)" },
      { value: "3", label: "parallel agents via git worktrees" },
      { value: "200k", label: "context window on Opus 4.5" },
    ],
    format: "html",
    date: "2026-05-11",
  },
  {
    slug: "skill-creator-blueprint",
    title: "The Skill Creator Blueprint",
    metaTitle: "How to Build Claude Skills That Work | Muditek",
    metaDescription: "Build reusable Claude Skills that remember your business rules. The 3-layer architecture, SKILL.md rules, and skill-creator auto-build loop, explained.",
    hook: "Teach Claude your process once in a single file, and every person on your team gets the same expert output forever.",
    whoItsFor: "Operators and founders who use Claude daily and are tired of re-explaining the same rules, formats, and workflows every session.",
    outcome: "A repeatable system that turns your unwritten work process into explicit AI Skills, so output stays consistent across your whole team with no added headcount.",
    category: "agentic-engineering",
    keywords: ["how to build claude skills","claude skill.md format","skill-creator claude code","3-layer skill architecture","mcp vs skills","progressive disclosure claude skills","when to create a claude skill","agent skills marketplace"],
    whatsInside: [
      "The 3-layer architecture (Header, Instructions, Reference Files) and how progressive disclosure lets you stack 50+ Skills with zero slowdown",
      "The two non-negotiable rules for writing SKILL.md: only write what Claude doesn't already know, and keep it under 500 lines",
      "The 5-step skill-creator auto-build loop: Ask, Generate, Test, Evaluate, Repeat, with the real app-launch prompt example",
      "How to match instruction 'degrees of freedom' to the task: High, Moderate, and Low freedom patterns",
      "MCP vs Skills explained with the kitchen-vs-recipe model, and why most people have a kitchen full of tools and zero recipes",
      "The decision test for when to build a Skill vs just stating it in chat",
      "Real metadata and content-body examples from a working presentation Skill, plus the full folder structure",
      "How to install Skills via the /plugin command and the document-skills and example-skills packs",
    ],
    excerpt: "Skills solve three pains at once: re-giving the same instructions every session, Claude never remembering your rules and formats, and a team where only the good prompters benefit. You teach Claude your process once in a single file, it remembers forever, and everyone gets the same quality.\n\nWhat separates Skills that work from Skills that choke on context is the 3-layer architecture. Layer 1 is the Header: YAML metadata with name and description that Claude reads at startup, costing only a few dozen tokens, so you can install many Skills without filling the context window. Whether a Skill actually fires depends heavily on getting that description right. Layer 2 is Instructions, loaded only when triggered, kept under 500 lines. Layer 3 is Reference Files, loaded on demand. This progressive disclosure feeds information gradually, avoiding a one-time overload.\n\nTwo rules govern the content section. First: \"Default assumption: Claude is already very smart. Only add context Claude doesn't already have.\" Skip general programming basics and library docs. Write company-specific rules, internal tool quirks, and team formatting standards. Second: match the degrees of freedom to the task. High freedom for creative work (text direction, not scripts), low freedom when consistency is crucial and mistakes are fatal (specific scripts, few parameters).\n\nMCP vs Skills is kitchen vs recipe. MCP gives Claude access to tools, your CRM, inbox, database. Skills are the step-by-step recipes for using those tools your way. Most people have a kitchen full of tools and zero recipes. The decision test: if you have explained the same rules, format, or process to Claude more than twice, that is a Skill waiting to be built.",
    topMetrics: [
      { value: "400,856", label: "open-source Skills available" },
      { value: "<500", label: "lines max per SKILL.md" },
      { value: "5 steps", label: "in the skill-creator loop" },
    ],
    format: "html",
    date: "2026-05-11",
  },
  {
    slug: "claude-code-self-evolving",
    title: "Claude Code: Self-Evolving System",
    metaTitle: "Claude Code Self-Evolving System Setup | Muditek",
    metaDescription: "Build a Claude Code setup that captures every correction, turns it into a verified rule, and drops corrections from 4-5 per session to near zero by session 20.",
    hook: "Turn Claude Code into a system that captures every correction and turns it into a permanent rule it never breaks again.",
    whoItsFor: "Operators and founders who run Claude Code on real projects and are tired of re-correcting the same mistakes every session.",
    outcome: "A self-improving Claude Code setup that drops corrections from 4-5 per session to near zero by session 20, with no extra engineers.",
    category: "agentic-engineering",
    keywords: ["claude code self-evolving system","claude code CLAUDE.md setup","claude code memory and rules","claude code subagents architect reviewer","claude code hooks settings.json","claude code learned rules verification","agentic engineering claude code"],
    whatsInside: [
      "The four-layer architecture: cognitive core (CLAUDE.md), specialized subagents, path-scoped rules, and the evolution engine",
      "The exact CLAUDE.md decision framework Claude runs before writing code: grep first, blast radius, ask one question, smallest change, verification plan",
      "settings.json allow/deny permissions plus three automation hooks (SessionStart, PreToolUse, Stop) that make checks structural, not optional",
      "Path-scoped security, API-design, and performance rules that only load when editing matching files to keep context lean",
      "Architect and reviewer subagent definitions with isolated context, scoped tools, and fixed output formats",
      "The evolution engine SKILL.md: verification sweep, hypothesis-driven observations, correction capture, and session scoring",
      "The promotion ladder: corrected once, corrected twice auto-promotes to learned-rules.md, observed 3+ times, graduates to CLAUDE.md after 10+ sessions",
      "A one-command setup script and a 9-point test checklist to prove every layer works",
    ],
    excerpt: "Most learning systems are journals. This one is an immune system. The core idea: a rule without a verification check is a wish. A rule with a verification check is a guardrail. Only guardrails survive. Here is the loop in practice. Session 1: you tell Claude \"we never use ternary operators here, always use if/else.\" The evolution skill logs the correction to corrections.jsonl and generates a verify pattern: Grep(\"? .* : \", path=\"src/\") returns 0 matches. Session 3: Claude writes a ternary again, you correct it, and because it is the second time on the same pattern it auto-promotes to learned-rules.md with the verification check attached. Session 5: before writing anything, a silent verification sweep runs every verify line in learned-rules.md. By session 20 the system has 8 learned rules with checks, 3 graduated to permanent config, 2 pruned, and corrections are near zero. The promotion ladder is explicit: corrected once goes to corrections.jsonl, corrected twice goes to learned-rules.md, observed 3+ times goes to learned-rules.md, and anything in learned-rules for 10+ sessions graduates to CLAUDE.md or rules/. Observations are never guesses. You formulate a testable claim, grep for counter-examples immediately, and only log it with evidence. learned-rules.md is capped at 50 lines, which forces graduation or pruning. CLAUDE.md stays under 150 lines or instruction adherence drops. Three SessionStart, PreToolUse, and Stop hooks make the checks structural so no step depends on Claude remembering to run it.",
    topMetrics: [
      { value: "4-5 → 0", label: "corrections per session" },
      { value: "20", label: "sessions to full evolution" },
      { value: "50", label: "line cap on learned-rules.md" },
      { value: "<150", label: "lines max for CLAUDE.md" },
    ],
    format: "html",
    date: "2026-05-11",
  },
];

export const PLAYBOOK_SLUGS = PLAYBOOKS.map((p) => p.slug);

export function getPlaybook(slug: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.slug === slug);
}
