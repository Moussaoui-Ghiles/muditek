import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { createHash } from "node:crypto";
import { loadEnv } from "./_load-env.mts";

loadEnv();

const ROOT_ARG = process.argv.find((a) => a.startsWith("--root="))?.slice("--root=".length);
const ROOT = resolve(process.cwd(), ROOT_ARG || ".workflows-import/raw/tree_full");
const APPLY = process.argv.includes("--apply");
const VERBOSE = process.argv.includes("--verbose");
const RESET = process.argv.includes("--reset");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Aborting.");
  process.exit(1);
}

const { neon } = await import("@neondatabase/serverless");
const wf = await import("../src/lib/workflow-parse.ts" as string);

const sql = neon(process.env.DATABASE_URL!);

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 70) || "workflow"
  );
}

function shortHash(s: string, n = 6): string {
  return createHash("sha1").update(s).digest("hex").slice(0, n);
}

function deriveTitle(parsed: any, fallback: string): string {
  const name = (parsed.name || "").trim();
  if (name && !/^my workflow/i.test(name)) return name;
  if (parsed.format === "n8n" && parsed.nodes?.length) {
    const firstNamed = parsed.nodes.find((n: any) => n.name && !/^(when|set|edit|merge|item)/i.test(n.name));
    if (firstNamed) return `${firstNamed.name} (${parsed.apps?.slice(0, 2).join(" + ")})`;
  }
  if (parsed.apps?.length) {
    return parsed.apps.slice(0, 3).map((a: string) => a.charAt(0).toUpperCase() + a.slice(1)).join(" + ") +
      " automation";
  }
  return fallback;
}

function deriveDescription(parsed: any): string {
  const verbs = new Set(["trigger", "webhook", "schedule", "set", "edit", "code", "function"]);
  const apps = (parsed.apps || []).filter((a: string) => !verbs.has(a)).slice(0, 5);
  const nodeWord = parsed.nodeCount === 1 ? "node" : "nodes";
  const parts = [
    `${parsed.format === "n8n" ? "n8n" : "Make.com"} workflow`,
    `${parsed.nodeCount} ${nodeWord}`,
  ];
  if (apps.length) parts.push(`uses ${apps.join(", ")}`);
  return parts.join(" · ");
}

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (st.isFile() && p.endsWith(".json")) yield p;
  }
}

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS workflows (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      format TEXT NOT NULL,
      raw_json JSONB NOT NULL,
      node_count INT NOT NULL DEFAULT 0,
      apps TEXT[] NOT NULL DEFAULT '{}',
      source_path TEXT,
      drive_file_id TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_workflows_format ON workflows(format)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_workflows_slug ON workflows(slug)`;
}

function downloadUrlFor(slug: string): string {
  return `/api/portal/workflows/${encodeURIComponent(slug)}/download`;
}

async function upsert(parsed: any, source: string, sourceRel: string, seenSlugs: Set<string>) {
  const seed = `${parsed.name || ""}|${parsed.nodeCount}|${(parsed.apps || []).join(",")}|${sourceRel}`;
  const baseSlug = slugify(parsed.name || basename(source).replace(/\.json$/i, ""));
  let slug = `${baseSlug}-${shortHash(seed)}`;
  if (seenSlugs.has(slug)) {
    slug = `${baseSlug}-${shortHash(seed + "|" + Math.random())}`;
  }
  seenSlugs.add(slug);
  const title = deriveTitle(parsed, baseSlug.replace(/-/g, " "));
  const description = deriveDescription(parsed);

  if (!APPLY) {
    console.log(`[dry] ${parsed.format}  ${title}  -> ${slug}`);
    return;
  }

  const downloadUrl = downloadUrlFor(slug);

  const itemRow = await sql`
    INSERT INTO content_items (title, slug, description, category, download_url, file_type, is_free, is_new, thumbnail_url)
    VALUES (${title}, ${slug}, ${description}, 'workflow', ${downloadUrl}, 'json', true, true, NULL)
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      download_url = EXCLUDED.download_url,
      updated_at = NOW()
    RETURNING id
  `;
  const contentItemId = (itemRow[0] as any).id as string;

  await sql`
    INSERT INTO workflows (content_item_id, slug, format, raw_json, node_count, apps, source_path)
    VALUES (
      ${contentItemId},
      ${slug},
      ${parsed.format},
      ${JSON.stringify(parsed.raw)}::jsonb,
      ${parsed.nodeCount},
      ${parsed.apps},
      ${sourceRel}
    )
    ON CONFLICT (slug) DO UPDATE SET
      content_item_id = EXCLUDED.content_item_id,
      format = EXCLUDED.format,
      raw_json = EXCLUDED.raw_json,
      node_count = EXCLUDED.node_count,
      apps = EXCLUDED.apps,
      source_path = EXCLUDED.source_path,
      updated_at = NOW()
  `;
}

async function main() {
  await ensureSchema();

  if (APPLY && RESET) {
    console.log("Reset: deleting existing workflows + content_items where category='workflow'");
    await sql`DELETE FROM workflows`;
    await sql`DELETE FROM content_items WHERE category = 'workflow'`;
  }

  const summary = { n8n: 0, make: 0, skipped: 0, errors: 0 };
  const seen = new Set<string>();
  const files: string[] = [];
  for (const f of walk(ROOT)) files.push(f);
  console.log(`Found ${files.length} JSON files under ${ROOT}`);

  let i = 0;
  const startedAt = Date.now();
  for (const file of files) {
    i += 1;
    const rel = relative(ROOT, file);
    let json: unknown;
    try {
      json = JSON.parse(readFileSync(file, "utf8"));
    } catch (e) {
      summary.errors += 1;
      continue;
    }
    const parsed = wf.parseWorkflow(json, basename(file).replace(/\.json$/i, ""));
    if (!parsed) {
      summary.skipped += 1;
      continue;
    }
    try {
      await upsert(parsed, file, rel, seen);
      summary[parsed.format] += 1;
    } catch (e) {
      console.error(`[err] ${rel}: ${(e as Error).message}`);
      summary.errors += 1;
    }
    if (i % 100 === 0) {
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      console.log(`  ${i}/${files.length}  n8n=${summary.n8n} make=${summary.make} skip=${summary.skipped} err=${summary.errors}  ${elapsed}s`);
    }
  }

  console.log("\nSummary:", summary);
  if (!APPLY) console.log("\nDry-run. Pass --apply to write to DB.");
}

await main();
