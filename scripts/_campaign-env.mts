// Shared: load .env.local into process.env before any @/ module is imported.
// Reactivation campaign scripts only. Run with: npx tsx scripts/<name>.mts
import { readFileSync } from "fs";

export function loadEnv(path = ".env.local") {
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trim().replace(/^["']|["']$/g, "");
  }
}

export const BASE_URL = "https://muditek.com";
export const PORTAL_URL = "https://muditek.com/portal";
export const SEGMENT = "HOT" as const;

// Hidden preheader: clients show this as the inbox preview, then padding pushes
// body text out of the snippet.
export function preheader(text: string): string {
  const pad = "&zwnj;&nbsp;".repeat(60);
  return `<span style="display:none!important;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${text}${pad}</span>`;
}
