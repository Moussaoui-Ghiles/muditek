"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type LinkedInResult = {
  title: string;
  link: string;
  snippet: string;
};

type WorkbenchNotice = {
  message: string;
  setupRequired: boolean;
};

export function LinkedInSerperLeadWorkbench() {
  const [role, setRole] = useState("");
  const [market, setMarket] = useState("");
  const [company, setCompany] = useState("");
  const [max, setMax] = useState(10);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<WorkbenchNotice | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LinkedInResult[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    setQuery("");
    try {
      const res = await fetch("/api/portal/tools/linkedin-serper-leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role, market, company, max }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          message: data.error || "LinkedIn search failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "linkedin-serper-lead-finder",
        metadata: { role, market, company, result_count: Array.isArray(data.results) ? data.results.length : 0 },
      });
      setQuery(data.query || "");
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "LinkedIn search failed.",
        setupRequired: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-[2px] border border-white/[0.08] bg-card/[0.36] p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
          <Users className="size-3.5" />
          LinkedIn search
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Role</span>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Head of Sales, Founder, RevOps..."
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Market</span>
            <Input
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="B2B SaaS Germany, agencies US..."
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Company keyword</span>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Optional company or niche keyword"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Max results</span>
            <Input
              type="number"
              min={1}
              max={20}
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="mt-2"
            />
          </label>
          <Button
            type="button"
            onClick={run}
            disabled={loading || (!role.trim() && !market.trim() && !company.trim())}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Search LinkedIn
          </Button>
        </div>
      </section>

      <section className="min-h-[360px] rounded-[2px] border border-white/[0.08] bg-black/25 p-5">
        {notice && (
          <div
            className={
              "rounded-[2px] border p-4 text-[13px] leading-6 " +
              (notice.setupRequired
                ? "border-primary/25 bg-primary/10 text-primary"
                : "border-red-400/20 bg-red-500/10 text-red-100")
            }
          >
            <p className="font-semibold">
              {notice.setupRequired ? "Setup required" : "Search failed"}
            </p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && results.length === 0 && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            Add a role, market, or company keyword to pull live LinkedIn profile results from Google.
          </div>
        )}
        {query && (
          <div className="mb-4 rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3 font-mono text-[11.5px] text-foreground/55">
            {query}
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((lead) => (
              <article key={lead.link} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[15px] font-black leading-snug text-foreground">{lead.title}</h3>
                  <a href={lead.link} target="_blank" rel="noreferrer" className="text-primary">
                    <ExternalLink className="size-4" />
                  </a>
                </div>
                {lead.snippet && (
                  <p className="mt-2 text-[12.5px] leading-6 text-foreground/60">{lead.snippet}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
