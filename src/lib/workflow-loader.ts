import { getDb } from "@/lib/db";
import { ensureWorkflowsSchema } from "@/lib/workflows-schema";
import type { WorkflowFormat } from "@/lib/workflow-parse";

export type WorkflowRow = {
  id: string;
  content_item_id: string | null;
  slug: string;
  format: WorkflowFormat;
  raw_json: unknown;
  node_count: number;
  apps: string[];
  source_path: string | null;
  drive_file_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type WorkflowListItem = {
  slug: string;
  title: string;
  description: string | null;
  category: string;
  format: WorkflowFormat;
  node_count: number;
  apps: string[];
  download_url: string;
  thumbnail_url: string | null;
  is_new: boolean;
  is_free: boolean;
  has_named_title: boolean;
  created_at: Date | string;
};

export type WorkflowFacets = {
  total: number;
  n8n_count: number;
  make_count: number;
  named_count: number;
  top_apps: Array<{ app: string; count: number }>;
};

export type WorkflowQuery = {
  limit?: number;
  offset?: number;
  format?: WorkflowFormat | "all";
  app?: string | null;
  search?: string | null;
  sort?: "newest" | "nodes" | "alpha";
  named_only?: boolean;
};

const TITLE_LOOKS_GENERIC = /^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\s*\d*$|unnamed)/i;

export async function loadWorkflowBySlug(slug: string): Promise<{
  workflow: WorkflowRow;
  item: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    download_url: string;
    file_type: string;
    thumbnail_url: string | null;
    is_free: boolean;
    is_new: boolean;
    created_at: Date | string;
    updated_at: Date | string | null;
  };
} | null> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);

  const rows = (await sql`
    SELECT w.id, w.content_item_id, w.slug, w.format, w.raw_json, w.node_count, w.apps, w.source_path, w.drive_file_id, w.created_at, w.updated_at,
           c.id AS c_id, c.title, c.description, c.category, c.download_url, c.file_type, c.thumbnail_url, c.is_free, c.is_new, c.created_at AS c_created_at, c.updated_at AS c_updated_at
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE w.slug = ${slug}
    LIMIT 1
  `) as Array<Record<string, unknown>>;

  if (!rows.length) return null;
  const r = rows[0];
  return {
    workflow: {
      id: r.id as string,
      content_item_id: (r.content_item_id as string) ?? null,
      slug: r.slug as string,
      format: r.format as WorkflowFormat,
      raw_json: r.raw_json,
      node_count: Number(r.node_count ?? 0),
      apps: (r.apps as string[]) ?? [],
      source_path: (r.source_path as string) ?? null,
      drive_file_id: (r.drive_file_id as string) ?? null,
      created_at: r.created_at as string,
      updated_at: r.updated_at as string,
    },
    item: {
      id: (r.c_id as string) ?? (r.id as string),
      title: (r.title as string) ?? r.slug as string,
      slug: r.slug as string,
      description: (r.description as string) ?? null,
      category: (r.category as string) ?? "workflow",
      download_url: (r.download_url as string) ?? "",
      file_type: (r.file_type as string) ?? "json",
      thumbnail_url: (r.thumbnail_url as string) ?? null,
      is_free: Boolean(r.is_free ?? true),
      is_new: Boolean(r.is_new ?? false),
      created_at: (r.c_created_at as string) ?? (r.created_at as string),
      updated_at: (r.c_updated_at as string) ?? (r.updated_at as string),
    },
  };
}

function isNamedTitle(title: string): boolean {
  if (!title) return false;
  if (TITLE_LOOKS_GENERIC.test(title.trim())) return false;
  return true;
}

export async function listWorkflows(query: WorkflowQuery = {}): Promise<WorkflowListItem[]> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);

  const limit = Math.max(1, Math.min(200, query.limit ?? 60));
  const offset = Math.max(0, query.offset ?? 0);
  const format = query.format && query.format !== "all" ? query.format : null;
  const app = query.app?.trim() || null;
  const search = query.search?.trim() ? `%${query.search.trim()}%` : null;
  const sort = query.sort ?? "newest";
  const namedOnly = !!query.named_only;

  let rows: Array<Record<string, unknown>>;
  if (sort === "nodes") {
    rows = (await sql`
      SELECT w.slug, w.format, w.node_count, w.apps,
             c.title, c.description, c.category, c.download_url, c.thumbnail_url, c.is_new, c.is_free, c.created_at
      FROM workflows w
      LEFT JOIN content_items c ON c.id = w.content_item_id
      WHERE (${format}::text IS NULL OR w.format = ${format})
        AND (${app}::text IS NULL OR ${app} = ANY(w.apps))
        AND (${search}::text IS NULL OR c.title ILIKE ${search} OR c.description ILIKE ${search} OR ${app}::text = ANY(w.apps))
        AND (${namedOnly} = false OR (c.title IS NOT NULL AND c.title !~* '^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\\s*\\d*$|unnamed)'))
      ORDER BY w.node_count DESC, c.created_at DESC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `) as Array<Record<string, unknown>>;
  } else if (sort === "alpha") {
    rows = (await sql`
      SELECT w.slug, w.format, w.node_count, w.apps,
             c.title, c.description, c.category, c.download_url, c.thumbnail_url, c.is_new, c.is_free, c.created_at
      FROM workflows w
      LEFT JOIN content_items c ON c.id = w.content_item_id
      WHERE (${format}::text IS NULL OR w.format = ${format})
        AND (${app}::text IS NULL OR ${app} = ANY(w.apps))
        AND (${search}::text IS NULL OR c.title ILIKE ${search} OR c.description ILIKE ${search})
        AND (${namedOnly} = false OR (c.title IS NOT NULL AND c.title !~* '^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\\s*\\d*$|unnamed)'))
      ORDER BY c.title ASC NULLS LAST
      LIMIT ${limit} OFFSET ${offset}
    `) as Array<Record<string, unknown>>;
  } else {
    rows = (await sql`
      SELECT w.slug, w.format, w.node_count, w.apps,
             c.title, c.description, c.category, c.download_url, c.thumbnail_url, c.is_new, c.is_free, c.created_at
      FROM workflows w
      LEFT JOIN content_items c ON c.id = w.content_item_id
      WHERE (${format}::text IS NULL OR w.format = ${format})
        AND (${app}::text IS NULL OR ${app} = ANY(w.apps))
        AND (${search}::text IS NULL OR c.title ILIKE ${search} OR c.description ILIKE ${search})
        AND (${namedOnly} = false OR (c.title IS NOT NULL AND c.title !~* '^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\\s*\\d*$|unnamed)'))
      ORDER BY c.created_at DESC NULLS LAST, w.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `) as Array<Record<string, unknown>>;
  }

  return rows.map((r) => {
    const title = (r.title as string) ?? (r.slug as string);
    return {
      slug: r.slug as string,
      title,
      description: (r.description as string) ?? null,
      category: (r.category as string) ?? "workflow",
      format: r.format as WorkflowFormat,
      node_count: Number(r.node_count ?? 0),
      apps: (r.apps as string[]) ?? [],
      download_url: (r.download_url as string) ?? "",
      thumbnail_url: (r.thumbnail_url as string) ?? null,
      is_new: Boolean(r.is_new ?? false),
      is_free: Boolean(r.is_free ?? true),
      has_named_title: isNamedTitle(title),
      created_at: (r.created_at as string) ?? new Date().toISOString(),
    };
  });
}

const NOISE_APPS = new Set([
  "set", "code", "if", "merge", "switch", "wait", "manualtrigger", "splitinbatches",
  "function", "noop", "stickynote", "executeworkflow", "executiondata", "scheduletrigger",
  "filter", "itemlists", "splitout", "summarize", "aggregate", "limit", "comparedatasets",
  "renamekeys", "editimage", "sort", "removeduplicates", "respondtowebhook",
  "webhook", "stopanderror", "executecommand", "errortrigger", "interval",
  "n8ntrainingcustomerdatastore", "n8ntrainingcustomermessenger",
  "httprequest", "builtin", "gateway", "executeworkflowtrigger",
  "langchain.outputparserstructured", "langchain.outputparseritemlist",
]);

export async function getWorkflowFacets(query: Omit<WorkflowQuery, "limit" | "offset" | "sort"> = {}): Promise<WorkflowFacets> {
  const sql = getDb();
  await ensureWorkflowsSchema(sql);

  const format = query.format && query.format !== "all" ? query.format : null;
  const search = query.search?.trim() ? `%${query.search.trim()}%` : null;
  const namedOnly = !!query.named_only;

  const counts = (await sql`
    SELECT
      COUNT(*)::int AS total,
      SUM(CASE WHEN format='n8n' THEN 1 ELSE 0 END)::int AS n8n_count,
      SUM(CASE WHEN format='make' THEN 1 ELSE 0 END)::int AS make_count,
      SUM(CASE WHEN c.title IS NOT NULL AND c.title !~* '^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\\s*\\d*$|unnamed)' THEN 1 ELSE 0 END)::int AS named_count
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE (${format}::text IS NULL OR w.format = ${format})
      AND (${search}::text IS NULL OR c.title ILIKE ${search} OR c.description ILIKE ${search})
      AND (${namedOnly} = false OR (c.title IS NOT NULL AND c.title !~* '^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\\s*\\d*$|unnamed)'))
  `) as Array<{ total: number; n8n_count: number; make_count: number; named_count: number }>;

  const appsRaw = (await sql`
    SELECT lower(unnest(w.apps)) AS app, COUNT(*)::int AS count
    FROM workflows w
    LEFT JOIN content_items c ON c.id = w.content_item_id
    WHERE (${format}::text IS NULL OR w.format = ${format})
      AND (${search}::text IS NULL OR c.title ILIKE ${search} OR c.description ILIKE ${search})
      AND (${namedOnly} = false OR (c.title IS NOT NULL AND c.title !~* '^([0-9a-f]{8}-[0-9a-f]{4}-|my workflow|workflow\\s*\\d*$|unnamed)'))
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 80
  `) as Array<{ app: string; count: number }>;

  const { prettyAppLabel } = await import("@/lib/workflow-app-labels");
  // Group by display label so we don't show "OpenAI 994" + "OpenAI 401" duplicates.
  const merged = new Map<string, { app: string; count: number }>();
  for (const row of appsRaw) {
    if (NOISE_APPS.has(row.app)) continue;
    const label = prettyAppLabel(row.app);
    const existing = merged.get(label);
    if (!existing || row.count > existing.count) {
      merged.set(label, { app: existing ? existing.app : row.app, count: (existing?.count ?? 0) + row.count });
    } else {
      existing.count += row.count;
    }
  }
  const topApps = Array.from(merged.values()).sort((a, b) => b.count - a.count).slice(0, 18);

  return {
    total: counts[0]?.total ?? 0,
    n8n_count: counts[0]?.n8n_count ?? 0,
    make_count: counts[0]?.make_count ?? 0,
    named_count: counts[0]?.named_count ?? 0,
    top_apps: topApps,
  };
}
