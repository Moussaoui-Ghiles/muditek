import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";
const sql = getDb();
const rows = await sql`SELECT subject, markdown_src FROM newsletter_issues WHERE id = '4634edd2-0ce7-47d4-aefa-9ba3b747024e'`;
console.log("SUBJECT:", rows[0].subject);
console.log("\n---BODY---\n");
console.log(rows[0].markdown_src);
process.exit(0);
