import {
  Anthropic,
  Claude,
  Cohere,
  ElevenLabs,
  Fireworks,
  Gemini,
  Github,
  Google,
  Kling,
  LangChain,
  Luma,
  Make,
  Midjourney,
  Mistral,
  N8n,
  Notion,
  Ollama,
  OpenAI,
  Perplexity,
  Replicate,
  Runway,
} from "@lobehub/icons";
import type { ComponentType } from "react";

type IconCmp = ComponentType<{ size: number }>;

// Map normalized app slug → lobehub icon component (Avatar variant — colored brand chip).
const LOBE_ICON_MAP: Record<string, IconCmp> = {
  // AI providers
  openai: OpenAI.Avatar,
  anthropic: Anthropic.Avatar,
  claude: Claude.Avatar,
  perplexity: Perplexity.Avatar,
  cohere: Cohere.Avatar,
  mistral: Mistral.Avatar,
  gemini: Gemini.Avatar,
  google: Google.Avatar,
  googlegemini: Gemini.Avatar,
  ollama: Ollama.Avatar,
  fireworks: Fireworks.Avatar,
  replicate: Replicate.Avatar,
  elevenlabs: ElevenLabs.Avatar,
  midjourney: Midjourney.Avatar,
  kling: Kling.Avatar,
  luma: Luma.Avatar,
  lumalabs: Luma.Avatar,
  runway: Runway.Avatar,
  // Langchain ecosystem
  langchain: LangChain.Avatar,
  "langchain.agent": LangChain.Avatar,
  "langchain.lmchatopenai": OpenAI.Avatar,
  "langchain.lmchatanthropic": Anthropic.Avatar,
  "langchain.lmchatgooglegemini": Gemini.Avatar,
  "langchain.lmchatgooglepalm": Google.Avatar,
  "langchain.lmchatmistral": Mistral.Avatar,
  "langchain.lmchatollama": Ollama.Avatar,
  "langchain.lmchatcohere": Cohere.Avatar,
  "langchain.embeddingsopenai": OpenAI.Avatar,
  "langchain.embeddingscohere": Cohere.Avatar,
  "langchain.memorybufferwindow": LangChain.Avatar,
  "langchain.chainllm": LangChain.Avatar,
  "langchain.chattrigger": LangChain.Avatar,
  // Workflow platforms
  n8n: N8n.Avatar,
  make: Make.Avatar,
  // SaaS that lobehub covers
  notion: Notion.Avatar,
  github: Github.Avatar,
};

const PRETTY_OVERRIDE: Record<string, string> = {
  openai: "OpenAI",
  openaiapi: "OpenAI",
  anthropic: "Anthropic",
  claude: "Claude",
  perplexity: "Perplexity",
  cohere: "Cohere",
  mistral: "Mistral",
  gemini: "Gemini",
  google: "Google",
  googlegemini: "Gemini",
  googlesheets: "Google Sheets",
  googledrive: "Google Drive",
  googledocs: "Google Docs",
  googlecalendar: "Google Calendar",
  googleslides: "Google Slides",
  googlemybusiness: "Google Business",
  googlemaps: "Google Maps",
  gmail: "Gmail",
  ollama: "Ollama",
  fireworks: "Fireworks",
  replicate: "Replicate",
  elevenlabs: "ElevenLabs",
  midjourney: "Midjourney",
  kling: "Kling",
  luma: "Luma",
  lumalabs: "Luma Labs",
  runway: "Runway",
  langchain: "LangChain",
  "langchain.agent": "AI Agent",
  "langchain.lmchatopenai": "OpenAI",
  "langchain.lmchatanthropic": "Anthropic",
  "langchain.lmchatgooglegemini": "Gemini",
  "langchain.lmchatgooglepalm": "Google PaLM",
  "langchain.lmchatmistral": "Mistral",
  "langchain.lmchatollama": "Ollama",
  "langchain.lmchatcohere": "Cohere",
  "langchain.lmchatgroq": "Groq",
  "langchain.lmchatazureopenai": "Azure OpenAI",
  "langchain.embeddingsopenai": "OpenAI Embeddings",
  "langchain.embeddingscohere": "Cohere Embeddings",
  "langchain.memorybufferwindow": "Memory",
  "langchain.memorypostgreschat": "Postgres Memory",
  "langchain.chainllm": "LLM Chain",
  "langchain.chattrigger": "Chat Trigger",
  "langchain.vectorstoresupabase": "Supabase Vectors",
  "langchain.vectorstorepinecone": "Pinecone",
  "langchain.vectorstoreqdrant": "Qdrant",
  "langchain.outputparserstructured": "Output Parser",
  n8n: "n8n",
  make: "Make.com",
  notion: "Notion",
  notiondatabase: "Notion DB",
  github: "GitHub",
  gitlab: "GitLab",
  airtable: "Airtable",
  slack: "Slack",
  discord: "Discord",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  whatsappbusiness: "WhatsApp Business",
  twilio: "Twilio",
  vapi: "Vapi",
  stripe: "Stripe",
  paypal: "PayPal",
  shopify: "Shopify",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  pipedrive: "Pipedrive",
  zoho: "Zoho",
  zohocrm: "Zoho CRM",
  mailchimp: "Mailchimp",
  klaviyo: "Klaviyo",
  beehiiv: "beehiiv",
  mailgun: "Mailgun",
  mailerlite: "MailerLite",
  brevo: "Brevo",
  sendgrid: "SendGrid",
  resend: "Resend",
  postgres: "Postgres",
  mysql: "MySQL",
  mongodb: "MongoDB",
  supabase: "Supabase",
  pinecone: "Pinecone",
  qdrant: "Qdrant",
  apify: "Apify",
  serper: "Serper",
  phantombuster: "PhantomBuster",
  apollo: "Apollo",
  brightdata: "Bright Data",
  smartlead: "Smartlead",
  instantly: "Instantly",
  lemlist: "Lemlist",
  clay: "Clay",
  hunter: "Hunter",
  scrapingbee: "ScrapingBee",
  rocketreach: "RocketReach",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  instagram: "Instagram",
  twitter: "Twitter",
  x: "X / Twitter",
  facebook: "Facebook",
  threads: "Threads",
  pinterest: "Pinterest",
  reddit: "Reddit",
  blotato: "Blotato",
  buffer: "Buffer",
  hootsuite: "Hootsuite",
  metricool: "Metricool",
  publer: "Publer",
  webflow: "Webflow",
  wordpress: "WordPress",
  framer: "Framer",
  ghost: "Ghost",
  medium: "Medium",
  dropbox: "Dropbox",
  s3: "AWS S3",
  awss3: "AWS S3",
  onedrive: "OneDrive",
  zoom: "Zoom",
  googlemeet: "Google Meet",
  calendly: "Calendly",
  asana: "Asana",
  trello: "Trello",
  clickup: "ClickUp",
  monday: "Monday",
  jira: "Jira",
  zendesk: "Zendesk",
  intercom: "Intercom",
  voiceflow: "Voiceflow",
  retell: "Retell",
  synthflow: "Synthflow",
  woocommerce: "WooCommerce",
  bigcommerce: "BigCommerce",
  magento: "Magento",
};

function basePretty(slug: string): string {
  return slug
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function prettyAppName(rawApp: string): string {
  if (!rawApp) return "";
  const lower = rawApp.toLowerCase().trim();
  if (PRETTY_OVERRIDE[lower]) return PRETTY_OVERRIDE[lower];
  return basePretty(lower);
}

export function appHasBrandIcon(rawApp: string): boolean {
  return !!LOBE_ICON_MAP[(rawApp || "").toLowerCase().trim()];
}

export function AppBrandIcon({ app, size = 16 }: { app: string; size?: number }) {
  const Icon = LOBE_ICON_MAP[(app || "").toLowerCase().trim()];
  if (!Icon) return null;
  return <Icon size={size} />;
}



// Stable color from string for letter avatars (fallback when no brand icon).
export function stableAppColors(slug: string): { bg: string; fg: string; ring: string } {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const palettes = [
    { bg: "bg-amber-300/10", fg: "text-amber-200", ring: "ring-amber-300/20" },
    { bg: "bg-emerald-300/10", fg: "text-emerald-200", ring: "ring-emerald-300/20" },
    { bg: "bg-sky-300/10", fg: "text-sky-200", ring: "ring-sky-300/20" },
    { bg: "bg-violet-300/10", fg: "text-violet-200", ring: "ring-violet-300/20" },
    { bg: "bg-rose-300/10", fg: "text-rose-200", ring: "ring-rose-300/20" },
    { bg: "bg-orange-300/10", fg: "text-orange-200", ring: "ring-orange-300/20" },
    { bg: "bg-cyan-300/10", fg: "text-cyan-200", ring: "ring-cyan-300/20" },
    { bg: "bg-fuchsia-300/10", fg: "text-fuchsia-200", ring: "ring-fuchsia-300/20" },
  ];
  return palettes[h % palettes.length];
}

export function letterFor(slug: string): string {
  const pretty = prettyAppName(slug);
  return (pretty.charAt(0) || "?").toUpperCase();
}
