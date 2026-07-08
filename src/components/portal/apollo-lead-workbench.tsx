"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Search, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type ApolloLead = {
  name: string;
  jobTitle: string;
  emailAddress: string;
  phone: string;
  location: string;
  companyName: string;
  websiteURL: string;
  linkedInURL: string;
};

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function ApolloLeadWorkbench() {
  const [url, setUrl] = useState("");
  const [maxRecords, setMaxRecords] = useState(10);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [results, setResults] = useState<ApolloLead[]>([]);
  const [queryUsed, setQueryUsed] = useState("");

  async function run() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    setQueryUsed("");
    try {
      const response = await fetch("/api/portal/tools/apollo-lead-finder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, maxRecords }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Lead enrichment failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "apollo-lead-finder",
        metadata: {
          max_records: maxRecords,
          result_count: Array.isArray(data.results) ? data.results.length : 0,
        },
      });
      setQueryUsed(data.inputUrl || url);
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Lead enrichment failed.",
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
          Apollo enrichment
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">LinkedIn profile / company URL</span>
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://linkedin.com/in/name or https://companysite.com"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Maximum records</span>
            <Input
              type="number"
              min={1}
              max={100}
              value={maxRecords}
              onChange={(event) => setMaxRecords(Number(event.target.value))}
              className="mt-2"
            />
          </label>
          <Button
            type="button"
            onClick={run}
            disabled={loading || !url.trim()}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Enrich lead
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
              {notice.setupRequired ? "Setup required" : "Lookup failed"}
            </p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && results.length === 0 && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            Add a profile or company URL to run Apollo enrichment.
          </div>
        )}
        {queryUsed && <p className="mb-4 rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3 text-[11px] font-mono text-foreground/65">{queryUsed}</p>}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((lead, index) => (
              <article key={`${lead.emailAddress || lead.name || "lead"}-${index}`} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="text-[15px] font-black text-foreground">
                    {lead.name || "Untitled profile"}
                  </h3>
                  {lead.linkedInURL ? (
                    <a href={lead.linkedInURL} target="_blank" rel="noreferrer" className="text-primary">
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                </div>
                <div className="grid gap-2 text-[12px] text-foreground/70 sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="size-3.5 text-foreground/45" />
                    {lead.jobTitle || "Role unavailable"}
                  </span>
                  <span>{lead.phone || "No phone returned"}</span>
                  <span>{lead.companyName || "Company unavailable"}</span>
                  <span>{lead.location || "Location unavailable"}</span>
                  <span>{lead.emailAddress || "No email returned"}</span>
                  {lead.websiteURL ? (
                    <a href={lead.websiteURL} target="_blank" rel="noreferrer" className="text-primary">
                      {lead.websiteURL}
                    </a>
                  ) : (
                    <span>Website unavailable</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
