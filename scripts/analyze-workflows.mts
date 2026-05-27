import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";
import { ensureWorkflowsSchema } from "../src/lib/workflows-schema";
import { createHash } from "node:crypto";

const sql = getDb();

const NOISE_NODE_TYPES = new Set([
  "n8n-nodes-base.set",
  "n8n-nodes-base.code",
  "n8n-nodes-base.function",
  "n8n-nodes-base.functionitem",
  "n8n-nodes-base.if",
  "n8n-nodes-base.switch",
  "n8n-nodes-base.merge",
  "n8n-nodes-base.wait",
  "n8n-nodes-base.noop",
  "n8n-nodes-base.stickynote",
  "n8n-nodes-base.splitinbatches",
  "n8n-nodes-base.filter",
  "n8n-nodes-base.itemlists",
  "n8n-nodes-base.splitout",
  "n8n-nodes-base.summarize",
  "n8n-nodes-base.aggregate",
  "n8n-nodes-base.limit",
  "n8n-nodes-base.comparedatasets",
  "n8n-nodes-base.renamekeys",
  "n8n-nodes-base.sort",
  "n8n-nodes-base.removeduplicates",
  "n8n-nodes-base.respondtowebhook",
  "n8n-nodes-base.stopanderror",
  "n8n-nodes-base.executecommand",
  "n8n-nodes-base.errortrigger",
  "n8n-nodes-base.interval",
  "n8n-nodes-base.executeworkflow",
  "n8n-nodes-base.executeworkflowtrigger",
  "n8n-nodes-base.executiondata",
  "n8n-nodes-base.markdown",
  "n8n-nodes-base.html",
  "n8n-nodes-base.xml",
  "n8n-nodes-base.datetime",
  "n8n-nodes-base.crypto",
  "n8n-nodes-base.editimage",
  "n8n-nodes-base.formtrigger",
  "n8n-nodes-base.readbinaryfile",
  "n8n-nodes-base.writebinaryfile",
  "n8n-nodes-base.movebinarydata",
  "n8n-nodes-base.spreadsheetfile",
  "n8n-nodes-base.convertofile",
  "n8n-nodes-base.converttofile",
  "n8n-nodes-base.compression",
  "n8n-nodes-base.readwritefile",
  "n8n-nodes-base.cron",
]);

function isNoiseType(type: string): boolean {
  return NOISE_NODE_TYPES.has(type.toLowerCase());
}

const MAKE_NOISE_PREFIXES = ["builtin:", "placeholder:", "regexp:", "util:", "json:"];

function n8nLastSegment(type: string): string {
  const lastDot = type.lastIndexOf(".");
  return lastDot >= 0 ? type.slice(lastDot + 1) : type;
}

function prettyAppFromN8nType(type: string): string | null {
  if (type.startsWith("@n8n/n8n-nodes-langchain.")) {
    const t = type.slice("@n8n/n8n-nodes-langchain.".length);
    return `langchain.${t}`;
  }
  if (type.startsWith("n8n-nodes-base.")) {
    return type.slice("n8n-nodes-base.".length);
  }
  return null;
}

function isN8nTriggerType(type: string): boolean {
  const seg = n8nLastSegment(type);
  return /trigger$/i.test(seg) || seg === "webhook" || seg === "chatTrigger";
}

function n8nTriggerLabel(type: string, name?: string): string {
  const seg = n8nLastSegment(type);
  const map: Record<string, string> = {
    manualTrigger: "Manual",
    webhook: "Webhook",
    scheduleTrigger: "Schedule",
    cron: "Cron",
    formTrigger: "Form submission",
    errorTrigger: "Error event",
    executeWorkflowTrigger: "Sub-workflow call",
    chatTrigger: "Chat message",
    emailReadImap: "IMAP email",
  };
  if (map[seg]) return map[seg];
  const m = seg.match(/^(.+?)Trigger$/i);
  if (m) {
    const app = m[1];
    return `${app.charAt(0).toUpperCase()}${app.slice(1)} event`;
  }
  if (name) return name;
  return seg;
}

function humaniseAppSlug(slug: string): string {
  const overrides: Record<string, string> = {
    openai: "OpenAI",
    openaiapi: "OpenAI",
    googlesheets: "Google Sheets",
    googledrive: "Google Drive",
    googledocs: "Google Docs",
    googleslides: "Google Slides",
    gmail: "Gmail",
    googlecalendar: "Google Calendar",
    googlemaps: "Google Maps",
    googlemybusiness: "Google My Business",
    googlegemini: "Google Gemini",
    googleadwords: "Google Ads",
    googleanalytics: "Google Analytics",
    youtube: "YouTube",
    youtubedata: "YouTube",
    notion: "Notion",
    slack: "Slack",
    discord: "Discord",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    whatsappbusiness: "WhatsApp Business",
    twilio: "Twilio",
    stripe: "Stripe",
    paypal: "PayPal",
    hubspot: "HubSpot",
    pipedrive: "Pipedrive",
    salesforce: "Salesforce",
    activecampaign: "ActiveCampaign",
    monday: "Monday.com",
    mondaycom: "Monday.com",
    airtable: "Airtable",
    httprequest: "HTTP",
    "linkedin": "LinkedIn",
    "x": "X / Twitter",
    "twitter": "X / Twitter",
    "facebook": "Facebook",
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "threads": "Threads",
    "reddit": "Reddit",
    "rss": "RSS",
    "rssfeed": "RSS",
    "rssfeedread": "RSS",
    "mailchimp": "Mailchimp",
    "mailgun": "Mailgun",
    "sendgrid": "SendGrid",
    "klaviyo": "Klaviyo",
    "beehiiv": "beehiiv",
    "resend": "Resend",
    "convertkit": "Kit",
    "kit": "Kit",
    "shopify": "Shopify",
    "woocommerce": "WooCommerce",
    "supabase": "Supabase",
    "postgres": "Postgres",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "elevenlabs": "ElevenLabs",
    "anthropic": "Anthropic",
    "perplexity": "Perplexity",
    "apify": "Apify",
    "serper": "Serper",
    "phantombuster": "PhantomBuster",
    "apollo": "Apollo",
    "calendly": "Calendly",
    "zoom": "Zoom",
    "intercom": "Intercom",
    "clearbit": "Clearbit",
    "hunter": "Hunter",
    "ghl": "GoHighLevel",
    "gohighlevel": "GoHighLevel",
    "n8n": "n8n",
    "make": "Make.com",
    "dropbox": "Dropbox",
    "onedrive": "OneDrive",
    "s3": "AWS S3",
    "awss3": "AWS S3",
    "msteams": "Microsoft Teams",
    "outlook": "Outlook",
    "microsoftoutlook": "Outlook",
    "vapi": "Vapi",
    "voiceflow": "Voiceflow",
    "retell": "Retell",
    "wordpress": "WordPress",
    "webflow": "Webflow",
    "framer": "Framer",
    "instantly": "Instantly",
    "lemlist": "lemlist",
    "smartlead": "Smartlead",
    "clay": "Clay",
    "leadmagic": "LeadMagic",
    "snovio": "Snov.io",
    "rocketreach": "RocketReach",
    "wufoo": "Wufoo",
    "typeform": "Typeform",
    "jotform": "Jotform",
    "fillout": "Fillout",
    "tally": "Tally",
    "buffer": "Buffer",
    "hootsuite": "Hootsuite",
    "metricool": "Metricool",
    "publer": "Publer",
    "blotato": "Blotato",
    "cohere": "Cohere",
    "groq": "Groq",
    "replicate": "Replicate",
    "huggingface": "Hugging Face",
    "mistral": "Mistral",
    "stabilityai": "Stability AI",
    "midjourney": "Midjourney",
    "lumalabs": "Luma",
    "kling": "Kling",
    "runway": "Runway",
    "veo": "Veo",
    "seedance": "Seedance",
    "openrouter": "OpenRouter",
    "lmstudio": "LM Studio",
    "ollama": "Ollama",
  };
  const langChainMap: Record<string, string> = {
    "lmchatopenai": "OpenAI (LangChain)",
    "lmchatanthropic": "Anthropic (LangChain)",
    "lmchatgooglegemini": "Gemini (LangChain)",
    "lmchatgooglepalm": "Google PaLM (LangChain)",
    "lmchatmistral": "Mistral (LangChain)",
    "lmchatollama": "Ollama (LangChain)",
    "lmchatgroq": "Groq (LangChain)",
    "lmchatazureopenai": "Azure OpenAI (LangChain)",
    "lmchatcohere": "Cohere (LangChain)",
    "chainllm": "LLM Chain",
    "agent": "AI Agent",
    "chattrigger": "Chat",
    "memorybufferwindow": "Memory buffer",
    "memorypostgreschat": "Postgres memory",
    "memorymotorhead": "Motorhead memory",
    "embeddingsopenai": "OpenAI embeddings",
    "embeddingscohere": "Cohere embeddings",
    "vectorstoresupabase": "Supabase vector",
    "vectorstorepinecone": "Pinecone",
    "vectorstoreqdrant": "Qdrant",
    "outputparserstructured": "Output parser",
    "outputparseritemlist": "Output parser",
  };
  const lower = slug.toLowerCase();
  if (lower.startsWith("langchain.")) {
    const t = lower.slice("langchain.".length);
    if (langChainMap[t]) return langChainMap[t];
    const rest = slug.slice("langchain.".length);
    const spaced = rest.replace(/([a-z])([A-Z])/g, "$1 $2");
    return `LangChain ${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}`;
  }
  if (overrides[lower]) return overrides[lower];
  if (slug.length <= 3) return slug.toUpperCase();
  const spaced = slug
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveN8nDescription(j: any): { description: string; trigger: string; apps_ordered: string[] } {
  const nodes = Array.isArray(j?.nodes) ? j.nodes : [];
  const nonSticky = nodes.filter((n: any) => n.type !== "n8n-nodes-base.stickyNote");
  const trig = nonSticky.find((n: any) => isN8nTriggerType(n.type)) || nonSticky[0];
  const triggerLabel = trig ? n8nTriggerLabel(trig.type, trig.name) : "Manual";

  const order: string[] = [];
  const seen = new Set<string>();
  for (const n of nonSticky) {
    if (isNoiseType(n.type)) continue;
    if (isN8nTriggerType(n.type)) continue;
    const slug = prettyAppFromN8nType(n.type);
    if (!slug) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    order.push(slug);
  }

  // sticky-note explainer (must be substantial and prose-like)
  const stickies = nodes.filter((n: any) => n.type === "n8n-nodes-base.stickyNote");
  let stickyText: string | null = null;
  for (const s of stickies) {
    const raw = (s.parameters?.content || s.parameters?.text || "") as string;
    let cleaned = raw
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/^#+\s*/gm, "")
      .replace(/\*\*/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/^[\s\-*]*\d+[.)]\s*/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    if (cleaned.length < 80 || cleaned.length > 1500) continue;
    // prose check: ≥4 multi-letter words in first sentence
    const first = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
    const wordCount = first.split(/\s+/).filter((w) => /[a-zA-Z]{3,}/.test(w)).length;
    if (wordCount < 5) continue;
    stickyText = cleaned;
    break;
  }

  const appLabels = order.slice(0, 4).map(humaniseAppSlug);
  let desc: string;
  if (stickyText) {
    // first sentence, max 180 chars
    const firstSentence = stickyText.split(/(?<=[.!?])\s+/)[0] || stickyText;
    desc = firstSentence.length > 200 ? firstSentence.slice(0, 197) + "…" : firstSentence;
  } else if (appLabels.length === 0) {
    desc = `${triggerLabel} workflow with ${nonSticky.length} steps.`;
  } else if (appLabels.length === 1) {
    desc = `${triggerLabel} → ${appLabels[0]}.`;
  } else {
    const last = appLabels[appLabels.length - 1];
    const rest = appLabels.slice(0, -1).join(", ");
    desc = `${triggerLabel} → ${rest} → ${last}.`;
  }

  return { description: desc, trigger: triggerLabel, apps_ordered: order };
}

function deriveMakeDescription(j: any): { description: string; trigger: string; apps_ordered: string[] } {
  const flow = Array.isArray(j?.flow) ? j.flow : Array.isArray(j?.blueprint?.flow) ? j.blueprint.flow : [];
  const real = flow.filter((m: any) => {
    if (!m?.module) return false;
    return !MAKE_NOISE_PREFIXES.some((p) => m.module.startsWith(p));
  });
  const first = real[0];
  const triggerApp = first ? first.module.split(":")[0] : "manual";
  const triggerAction = first ? first.module.split(":")[1] : "";
  const triggerPretty = humaniseAppSlug(triggerApp.toLowerCase().replace(/-(gpt-?\d?|mistral|llama|claude)$/, ""));
  const triggerLabel = /watch|trigger|on|new/i.test(triggerAction) ? `${triggerPretty} event` : triggerPretty;

  const order: string[] = [];
  const seen = new Set<string>();
  for (const m of real) {
    const app = m.module.split(":")[0].toLowerCase().replace(/-(gpt-?\d?|mistral|llama|claude)$/, "");
    if (!app || seen.has(app)) continue;
    seen.add(app);
    order.push(app);
  }

  const appLabels = order.slice(0, 4).map(humaniseAppSlug);
  let desc: string;
  if (appLabels.length <= 1) {
    desc = `${triggerLabel} scenario with ${real.length} modules.`;
  } else {
    const tail = appLabels.slice(1, 4).join(", ");
    desc = `${triggerLabel} → ${tail}.`;
  }
  return { description: desc, trigger: triggerLabel, apps_ordered: order };
}

function parentFolderFromPath(path: string | null): string | null {
  if (!path) return null;
  const norm = path.replace(/\\/g, "/").replace(/\/+/g, "/").trim();
  const parts = norm.split("/").filter(Boolean);
  if (parts.length <= 1) return null;
  parts.pop(); // remove file
  // collapse oversized "newsletter week 5" container
  const cleaned = parts.map((p) =>
    p
      .replace(/^200\+\s*automations\s*n8n$/i, "200+ Automations")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
  return cleaned.join(" / ");
}

function deriveDisplayTitle(rawTitle: string | null | undefined, slug: string, j: any, format: string, apps_ordered: string[], fallback_apps: string[] = []): string {
  const t = (rawTitle || "").trim();
  const looksLikeFilename =
    /^[a-z0-9_]+$/i.test(t) && !t.includes(" ") && (t.match(/_/g)?.length ?? 0) >= 2;
  const endsWithNodesSuffix = /_(complex|simple)?_?\d+nodes?$/i.test(t);
  const looksMashedTogether = t.length > 16 && /^[A-Za-z][a-zA-Z0-9]*$/.test(t);
  const isBad = !t ||
    /^my workflow(\s*\d+)?$/i.test(t) ||
    /^unnamed/i.test(t) ||
    /^undefined$/i.test(t) ||
    /^workflow\s*\d*$/i.test(t) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t) ||
    looksLikeFilename ||
    endsWithNodesSuffix ||
    looksMashedTogether;

  if (!isBad) return t;

  // try j.name (raw_json name)
  const rawName = typeof j?.name === "string" ? j.name.trim() : "";
  const rawNameBad =
    !rawName ||
    /^(my workflow|unnamed|undefined|workflow ?\d*)$/i.test(rawName) ||
    (/^[a-z0-9_]+$/i.test(rawName) && (rawName.match(/_/g)?.length ?? 0) >= 2) ||
    (rawName.length > 16 && /^[A-Za-z][a-zA-Z0-9]*$/.test(rawName));
  if (rawName && !rawNameBad) return rawName;

  // fallback: build from apps + format
  const platform = format === "n8n" ? "n8n" : "Make.com";
  const noiseLower = new Set(
    Array.from(NOISE_NODE_TYPES).map((t) => t.split(".").pop() || "").concat(["manualtrigger", "stickynote", "webhook"])
  );
  const usable = apps_ordered.length
    ? apps_ordered
    : fallback_apps
        .filter((a) => a && !noiseLower.has(a.toLowerCase()))
        .filter((a, i, arr) => arr.indexOf(a) === i)
        .slice(0, 3);

  if (usable.length === 0) {
    return slug
      .replace(/-[0-9a-f]{6,}$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || `Untitled ${platform} workflow`;
  }
  const labels = usable.slice(0, 3).map(humaniseAppSlug);
  if (labels.length === 1) return `${labels[0]} automation (${platform})`;
  if (labels.length === 2) return `${labels[0]} → ${labels[1]} (${platform})`;
  return `${labels[0]} → ${labels[1]} → ${labels[2]} (${platform})`;
}

function structuralHash(j: any, format: string): string {
  let key: string;
  if (format === "n8n") {
    const nodes = Array.isArray(j?.nodes) ? j.nodes : [];
    const types = nodes
      .filter((n: any) => n.type !== "n8n-nodes-base.stickyNote")
      .map((n: any) => String(n.type || ""))
      .sort();
    // also incorporate connection count as light signal
    const connCount = j?.connections ? Object.keys(j.connections).length : 0;
    key = `n8n|${types.length}|${connCount}|${types.join(",")}`;
  } else {
    const flow = Array.isArray(j?.flow) ? j.flow : Array.isArray(j?.blueprint?.flow) ? j.blueprint.flow : [];
    const mods = flow.map((m: any) => String(m?.module || "")).sort();
    key = `make|${mods.length}|${mods.join(",")}`;
  }
  return createHash("sha256").update(key).digest("hex").slice(0, 24);
}

async function main() {
  await ensureWorkflowsSchema(sql);
  const apply = process.argv.includes("--apply");
  const sample = process.argv.includes("--sample");
  console.log(`mode=${apply ? "APPLY" : sample ? "SAMPLE" : "DRY-RUN"}`);

  if (sample) {
    const rows = (await sql`
      SELECT w.id, w.slug, w.format, w.source_path, w.raw_json, c.title AS current_title
      FROM workflows w LEFT JOIN content_items c ON c.id = w.content_item_id
      ORDER BY random() LIMIT 30
    `) as any[];
    for (const r of rows) {
      const d = r.format === "n8n" ? deriveN8nDescription(r.raw_json) : deriveMakeDescription(r.raw_json);
      const folder = parentFolderFromPath(r.source_path);
      const display = deriveDisplayTitle(r.current_title, r.slug, r.raw_json, r.format, d.apps_ordered);
      console.log(`\n[${r.format}] ${display}`);
      console.log(`  desc: ${d.description}`);
      console.log(`  trig: ${d.trigger}`);
      console.log(`  apps: ${d.apps_ordered.slice(0, 5).join(", ")}`);
      console.log(`  folder: ${folder}`);
    }
    process.exit(0);
  }

  const totalRows = (await sql`SELECT COUNT(*)::int AS n FROM workflows`) as Array<{ n: number }>;
  const total = totalRows[0].n;
  console.log(`workflows: ${total}`);

  const BATCH = 500;
  let processed = 0;
  let updated = 0;
  let duplicates = 0;

  // first pass: compute hash, description, trigger, folder, title — collect canonical map
  type Row = {
    id: string;
    slug: string;
    format: string;
    source_path: string | null;
    raw_json: any;
    current_title: string | null;
    apps: string[] | null;
  };

  const hashFirstSeen = new Map<string, string>(); // hash → id

  while (processed < total) {
    const batch = (await sql`
      SELECT w.id, w.slug, w.format, w.source_path, w.raw_json, w.apps, c.title AS current_title, w.created_at
      FROM workflows w LEFT JOIN content_items c ON c.id = w.content_item_id
      ORDER BY w.created_at ASC, w.id ASC
      LIMIT ${BATCH} OFFSET ${processed}
    `) as Row[];
    if (batch.length === 0) break;

    for (const r of batch) {
      const derived = r.format === "n8n" ? deriveN8nDescription(r.raw_json) : deriveMakeDescription(r.raw_json);
      const folder = parentFolderFromPath(r.source_path);
      const display = deriveDisplayTitle(r.current_title, r.slug, r.raw_json, r.format, derived.apps_ordered, r.apps || []);
      const hash = structuralHash(r.raw_json, r.format);
      const isCanonical = !hashFirstSeen.has(hash);
      if (isCanonical) hashFirstSeen.set(hash, r.id);
      else duplicates++;

      if (apply) {
        await sql`
          UPDATE workflows
          SET auto_description = ${derived.description},
              trigger_type = ${derived.trigger},
              content_hash = ${hash},
              is_canonical = ${isCanonical},
              folder_path = ${folder},
              display_title = ${display},
              updated_at = NOW()
          WHERE id = ${r.id}
        `;
        updated++;
      }
    }
    processed += batch.length;
    if (processed % 1000 < BATCH) console.log(`  ${processed}/${total} (dups so far ${duplicates})`);
  }

  console.log(`\n${apply ? "applied" : "would update"} ${apply ? updated : processed} workflows`);
  console.log(`canonical: ${hashFirstSeen.size}, duplicates: ${duplicates}`);
  process.exit(0);
}

await main();
