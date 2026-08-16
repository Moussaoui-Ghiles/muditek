import { loadEnv } from "./_load-env.mts";
loadEnv();
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' ORDER BY ordinal_position`;
console.log(cols.map((c:any)=>c.column_name).join(", "));
