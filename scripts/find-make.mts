import { loadEnv } from "./_load-env.mts";
loadEnv();
const { neon } = await import("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL!);
const m = await sql`SELECT slug, format, node_count FROM workflows WHERE format='make' ORDER BY node_count DESC LIMIT 3`;
console.log(m);
