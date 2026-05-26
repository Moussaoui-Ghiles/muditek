const PRETTY_MAP: Record<string, string> = {
  googlesheets: "Google Sheets",
  googledrive: "Google Drive",
  googledocs: "Google Docs",
  googleslides: "Google Slides",
  googlecalendar: "Google Calendar",
  gmail: "Gmail",
  openai: "OpenAI",
  openaiapi: "OpenAI",
  anthropic: "Anthropic",
  perplexity: "Perplexity",
  airtable: "Airtable",
  notion: "Notion",
  slack: "Slack",
  discord: "Discord",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter",
  x: "X / Twitter",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  pipedrive: "Pipedrive",
  zendesk: "Zendesk",
  stripe: "Stripe",
  paypal: "PayPal",
  shopify: "Shopify",
  wordpress: "WordPress",
  webflow: "Webflow",
  twilio: "Twilio",
  mailgun: "Mailgun",
  mailchimp: "Mailchimp",
  klaviyo: "Klaviyo",
  apify: "Apify",
  serper: "Serper",
  brightdata: "Bright Data",
  zoom: "Zoom",
  calendly: "Calendly",
  asana: "Asana",
  trello: "Trello",
  clickup: "ClickUp",
  monday: "Monday",
  jira: "Jira",
  github: "GitHub",
  gitlab: "GitLab",
  notiondatabase: "Notion DB",
  dropbox: "Dropbox",
  s3: "AWS S3",
  awsS3: "AWS S3",
  pinecone: "Pinecone",
  qdrant: "Qdrant",
  supabase: "Supabase",
  postgres: "Postgres",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis",
  pdf: "PDF",
  csv: "CSV",
  jsonparser: "JSON",
};

const LANGCHAIN_PREFIX = "langchain.";

function basePretty(raw: string): string {
  return raw
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function prettyAppLabel(rawApp: string): string {
  if (!rawApp) return "?";
  const lower = rawApp.toLowerCase().trim();

  if (lower.startsWith(LANGCHAIN_PREFIX)) {
    const stem = lower.slice(LANGCHAIN_PREFIX.length);
    if (stem.startsWith("lmchat")) {
      const provider = stem.slice("lmchat".length);
      return PRETTY_MAP[provider] || basePretty(provider) || "LLM";
    }
    if (stem === "agent") return "AI Agent";
    if (stem === "chattrigger") return "Chat Trigger";
    if (stem === "memorybufferwindow") return "Memory";
    if (stem === "chainllm") return "Chain";
    if (stem === "vectorstoresupabase") return "Supabase Vectors";
    if (stem === "vectorstorepinecone") return "Pinecone";
    if (stem === "vectorstoreqdrant") return "Qdrant";
    if (stem === "embeddingsopenai") return "OpenAI Embeddings";
    return PRETTY_MAP[stem] || basePretty(stem);
  }

  return PRETTY_MAP[lower] || basePretty(lower);
}

export function appColorClasses(rawApp: string): { dot: string; chip: string; ring: string } {
  let h = 0;
  for (let i = 0; i < rawApp.length; i++) h = (h * 31 + rawApp.charCodeAt(i)) >>> 0;
  const variants = [
    { dot: "bg-amber-300", chip: "border-amber-300/20 bg-amber-300/[0.06] text-amber-200", ring: "ring-amber-300/30" },
    { dot: "bg-emerald-300", chip: "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200", ring: "ring-emerald-300/30" },
    { dot: "bg-sky-300", chip: "border-sky-300/20 bg-sky-300/[0.06] text-sky-200", ring: "ring-sky-300/30" },
    { dot: "bg-violet-300", chip: "border-violet-300/20 bg-violet-300/[0.06] text-violet-200", ring: "ring-violet-300/30" },
    { dot: "bg-rose-300", chip: "border-rose-300/20 bg-rose-300/[0.06] text-rose-200", ring: "ring-rose-300/30" },
    { dot: "bg-orange-300", chip: "border-orange-300/20 bg-orange-300/[0.06] text-orange-200", ring: "ring-orange-300/30" },
    { dot: "bg-cyan-300", chip: "border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200", ring: "ring-cyan-300/30" },
    { dot: "bg-fuchsia-300", chip: "border-fuchsia-300/20 bg-fuchsia-300/[0.06] text-fuchsia-200", ring: "ring-fuchsia-300/30" },
  ];
  return variants[h % variants.length];
}

export function appInitial(rawApp: string): string {
  const pretty = prettyAppLabel(rawApp);
  return pretty.charAt(0).toUpperCase();
}
