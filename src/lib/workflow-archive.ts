import { getDb } from "@/lib/db";
import { ensureWorkflowsSchema } from "@/lib/workflows-schema";

export type ArchiveFormat = "n8n" | "make";

export const USE_CASES = [
  { id: "ai", label: "AI / LLM" },
  { id: "lead-gen", label: "Lead Gen" },
  { id: "sales", label: "Sales / CRM" },
  { id: "marketing", label: "Marketing / Email" },
  { id: "content", label: "Content / Social" },
  { id: "comms", label: "Comms / Messaging" },
  { id: "data", label: "Data / Sheets" },
  { id: "storage", label: "Files / Storage" },
  { id: "ecommerce", label: "E-commerce" },
] as const;

export type UseCaseId = (typeof USE_CASES)[number]["id"];

export const USE_CASE_APPS: Record<UseCaseId, string[]> = {
  ai: [
    "openai", "openaiapi", "anthropic", "perplexity", "gemini", "googlegemini", "cohere", "mistral",
    "replicate", "fal", "elevenlabs", "huggingface", "ollama", "groq", "stabilityai",
    "langchain.agent", "langchain.lmchatopenai", "langchain.lmchatanthropic",
    "langchain.lmchatgooglepalm", "langchain.lmchatgooglegemini", "langchain.lmchatmistral",
    "langchain.lmchatollama", "langchain.lmchatgroq", "langchain.lmchatazureopenai",
    "langchain.lmchatcohere", "langchain.chainllm", "langchain.chattrigger",
    "langchain.memorybufferwindow", "langchain.memorypostgreschat", "langchain.memorymotorhead",
    "langchain.embeddingsopenai", "langchain.embeddingscohere",
    "langchain.vectorstoresupabase", "langchain.vectorstorepinecone", "langchain.vectorstoreqdrant",
    "langchain.outputparserstructured", "langchain.outputparseritemlist",
    "openrouter", "lmstudio",
  ],
  "lead-gen": [
    "apify", "serper", "phantombuster", "apollo", "hunter", "scrapingbee", "brightdata", "smartlead",
    "linkedin", "googlemaps", "googlemybusiness", "yellowpages", "instantly", "lemlist",
    "clay", "leadmagic", "snovio", "rocketreach",
  ],
  sales: [
    "salesforce", "hubspot", "pipedrive", "stripe", "paypal", "chargebee", "zoho", "zohocrm",
    "freshsales", "monday", "close", "copper", "activecampaign", "intercom",
  ],
  marketing: [
    "mailchimp", "klaviyo", "beehiiv", "mailgun", "mailerlite", "brevo", "sendgrid",
    "convertkit", "kit", "constantcontact", "activecampaign", "gohighlevel", "ghl",
    "amazonses", "postmark", "loops", "resend",
  ],
  content: [
    "tiktok", "youtube", "instagram", "twitter", "x", "facebook", "threads", "pinterest", "reddit",
    "blotato", "buffer", "hootsuite", "metricool", "publer", "rss", "rssfeed",
    "medium", "ghost", "wordpress", "webflow", "framer", "kling", "midjourney", "runway",
    "lumalabs", "seedance", "veo",
  ],
  comms: [
    "gmail", "outlook", "slack", "discord", "telegram", "whatsapp", "whatsappbusiness",
    "twilio", "vapi", "messagebird", "vonage", "voiceflow", "retell", "synthflow",
    "calendly", "zoom", "googlemeet", "msteams",
  ],
  data: [
    "googlesheets", "airtable", "postgres", "mysql", "mongodb", "notion", "notiondatabase",
    "supabase", "sqlserver", "redis", "snowflake", "bigquery", "clickhouse", "duckdb",
    "neon", "planetscale", "rowy", "noco", "nocodb", "baserow",
  ],
  storage: [
    "googledrive", "dropbox", "s3", "awss3", "awsS3", "googlecloudstorage", "gcs", "onedrive", "box",
    "pcloud", "wasabi", "backblaze", "ftp", "sftp",
  ],
  ecommerce: [
    "shopify", "woocommerce", "magento", "bigcommerce", "etsy", "amazonseller", "ebay",
    "klaviyo", "gorgias", "recharge",
  ],
};

const APP_TO_USE_CASES: Map<string, UseCaseId[]> = (() => {
  const m = new Map<string, UseCaseId[]>();
  for (const [uc, apps] of Object.entries(USE_CASE_APPS)) {
    for (const a of apps) {
      const k = a.toLowerCase();
      const prev = m.get(k) ?? [];
      prev.push(uc as UseCaseId);
      m.set(k, prev);
    }
  }
  return m;
})();

export function deriveUseCases(apps: string[]): UseCaseId[] {
  const out = new Set<UseCaseId>();
  for (const raw of apps || []) {
    const key = raw.toLowerCase();
    for (const uc of APP_TO_USE_CASES.get(key) || []) out.add(uc);
  }
  return Array.from(out);
}

export type ArchiveItem = {
  slug: string;
  title: string;
  description: string | null;
  trigger: string | null;
  format: ArchiveFormat;
  apps: string[];
  use_cases: UseCaseId[];
  node_count: number;
  folder: string | null;
  source_path: string | null;
};

export type ArchiveFolder = {
  folder: string;
  count: number;
};

export type ArchiveQuery = {
  format?: ArchiveFormat | "all";
  formats?: ArchiveFormat[];
  use_case?: UseCaseId | null;
  use_cases?: UseCaseId[];
  search?: string | null;
  limit?: number;
  offset?: number;
};

export type ArchiveFacets = {
  total: number;
  n8n_count: number;
  make_count: number;
  use_case_counts: Record<UseCaseId, number>;
  top_folders: ArchiveFolder[];
};

export async function countArchive(query: ArchiveQuery = {}): Promise<number> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);

  const formats = query.formats?.length ? query.formats : query.format && query.format !== "all" ? [query.format] : null;
  const useCases = query.use_cases?.length ? query.use_cases : query.use_case ? [query.use_case] : null;
  const search = query.search?.trim() ? `%${query.search.trim()}%` : null;
  const useCaseApps: string[] | null = useCases
    ? Array.from(new Set(useCases.flatMap((uc) => USE_CASE_APPS[uc] || []).map((s) => s.toLowerCase())))
    : null;

  const rows = (await sql`
    SELECT COUNT(*)::int AS c
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE w.is_canonical = TRUE
      AND (${formats}::text[] IS NULL OR w.format = ANY(${formats}))
      AND (${useCaseApps}::text[] IS NULL OR EXISTS (
        SELECT 1 FROM unnest(w.apps) a WHERE lower(a) = ANY(${useCaseApps})
      ))
      AND (${search}::text IS NULL OR coalesce(w.display_title, c.title) ILIKE ${search} OR w.auto_description ILIKE ${search} OR w.folder_path ILIKE ${search} OR w.source_path ILIKE ${search})
  `) as Array<{ c: number }>;
  return rows[0]?.c ?? 0;
}

export async function listArchive(query: ArchiveQuery = {}): Promise<ArchiveItem[]> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);

  const limit = Math.max(1, Math.min(500, query.limit ?? 200));
  const offset = Math.max(0, query.offset ?? 0);
  const formats = query.formats?.length ? query.formats : query.format && query.format !== "all" ? [query.format] : null;
  const useCases = query.use_cases?.length ? query.use_cases : query.use_case ? [query.use_case] : null;
  const search = query.search?.trim() ? `%${query.search.trim()}%` : null;

  const useCaseApps: string[] | null = useCases
    ? Array.from(new Set(useCases.flatMap((uc) => USE_CASE_APPS[uc] || []).map((s) => s.toLowerCase())))
    : null;

  const rows = (await sql`
    SELECT w.slug, w.format, w.apps, w.node_count, w.source_path, w.folder_path,
           coalesce(w.display_title, c.title) AS title,
           w.auto_description AS description,
           w.trigger_type AS trigger
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE w.is_canonical = TRUE
      AND (${formats}::text[] IS NULL OR w.format = ANY(${formats}))
      AND (${useCaseApps}::text[] IS NULL OR EXISTS (
        SELECT 1 FROM unnest(w.apps) a WHERE lower(a) = ANY(${useCaseApps})
      ))
      AND (${search}::text IS NULL OR coalesce(w.display_title, c.title) ILIKE ${search} OR w.auto_description ILIKE ${search} OR w.folder_path ILIKE ${search} OR w.source_path ILIKE ${search})
    ORDER BY c.created_at DESC NULLS LAST, w.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as Array<Record<string, unknown>>;

  return rows.map((r) => {
    const apps = (r.apps as string[]) ?? [];
    return {
      slug: r.slug as string,
      title: (r.title as string) || (r.slug as string),
      description: (r.description as string | null) ?? null,
      trigger: (r.trigger as string | null) ?? null,
      format: r.format as ArchiveFormat,
      apps,
      use_cases: deriveUseCases(apps),
      node_count: Number(r.node_count ?? 0),
      folder: (r.folder_path as string | null) ?? null,
      source_path: (r.source_path as string) ?? null,
    };
  });
}

export async function getArchiveFacets(query: ArchiveQuery = {}): Promise<ArchiveFacets> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);

  const search = query.search?.trim() ? `%${query.search.trim()}%` : null;

  const counts = (await sql`
    SELECT
      COUNT(*)::int AS total,
      SUM(CASE WHEN w.format='n8n' THEN 1 ELSE 0 END)::int AS n8n_count,
      SUM(CASE WHEN w.format='make' THEN 1 ELSE 0 END)::int AS make_count
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE w.is_canonical = TRUE
      AND (${search}::text IS NULL OR coalesce(w.display_title, c.title) ILIKE ${search} OR w.auto_description ILIKE ${search} OR w.folder_path ILIKE ${search} OR w.source_path ILIKE ${search})
  `) as Array<{ total: number; n8n_count: number; make_count: number }>;

  const ucCounts = {} as Record<UseCaseId, number>;
  for (const uc of USE_CASES) ucCounts[uc.id] = 0;
  for (const uc of USE_CASES) {
    const apps = USE_CASE_APPS[uc.id].map((a) => a.toLowerCase());
    const r = (await sql`
      SELECT COUNT(*)::int AS c
      FROM workflows w
      LEFT JOIN content_items c ON c.id = w.content_item_id
      WHERE w.is_canonical = TRUE
        AND EXISTS (SELECT 1 FROM unnest(w.apps) a WHERE lower(a) = ANY(${apps}))
        AND (${search}::text IS NULL OR coalesce(w.display_title, c.title) ILIKE ${search} OR w.auto_description ILIKE ${search} OR w.folder_path ILIKE ${search} OR w.source_path ILIKE ${search})
    `) as Array<{ c: number }>;
    ucCounts[uc.id] = r[0]?.c ?? 0;
  }

  const folderRows = (await sql`
    SELECT w.folder_path AS folder, COUNT(*)::int AS count
    FROM workflows w
    WHERE w.is_canonical = TRUE AND w.folder_path IS NOT NULL AND w.folder_path <> ''
    GROUP BY 1
    HAVING COUNT(*) >= 3
    ORDER BY count DESC
    LIMIT 40
  `) as Array<{ folder: string; count: number }>;

  return {
    total: counts[0]?.total ?? 0,
    n8n_count: counts[0]?.n8n_count ?? 0,
    make_count: counts[0]?.make_count ?? 0,
    use_case_counts: ucCounts,
    top_folders: folderRows.map((r) => ({ folder: r.folder, count: r.count })),
  };
}

export async function getWorkflowsInFolder(folder: string): Promise<Array<{ slug: string; title: string; raw_json: unknown }>> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);
  const rows = (await sql`
    SELECT w.slug, w.raw_json, coalesce(w.display_title, c.title) AS title
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE w.is_canonical = TRUE AND w.folder_path = ${folder}
    ORDER BY coalesce(w.display_title, c.title) NULLS LAST, w.slug
  `) as Array<{ slug: string; raw_json: unknown; title: string | null }>;
  return rows.map((r) => ({ slug: r.slug, title: r.title || r.slug, raw_json: r.raw_json }));
}

export async function getWorkflowJson(slug: string): Promise<unknown | null> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);
  const rows = (await sql`SELECT raw_json FROM workflows WHERE slug = ${slug} LIMIT 1`) as Array<{ raw_json: unknown }>;
  return rows[0]?.raw_json ?? null;
}
