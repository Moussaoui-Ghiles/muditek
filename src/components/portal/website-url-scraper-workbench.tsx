"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Link as LinkIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type ScrapedLink = {
  url: string;
  title: string;
};

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function WebsiteUrlScraperWorkbench() {
  const [url, setUrl] = useState("");
  const [maxUrls, setMaxUrls] = useState(100);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [results, setResults] = useState<ScrapedLink[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    setEmails([]);
    setSourceUrl("");
    try {
      const response = await fetch("/api/portal/tools/website-url-scraper", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, maxUrls }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "URL extraction failed.",
          setupRequired: false,
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "website-url-scraper",
        metadata: {
          source_url: data.sourceUrl,
          result_count: Array.isArray(data.results) ? data.results.length : 0,
          email_count: Array.isArray(data.emails) ? data.emails.length : 0,
        },
      });
      setSourceUrl(data.sourceUrl || url);
      setEmails((data.emails || []).slice(0, 50));
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "URL extraction failed.",
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
          <LinkIcon className="size-3.5" />
          URL extractor
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Website URL</span>
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Maximum links</span>
            <Input
              type="number"
              min={1}
              max={500}
              value={maxUrls}
              onChange={(event) => setMaxUrls(Number(event.target.value))}
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
            Extract links
          </Button>
        </div>
      </section>

      <section className="min-h-[360px] rounded-[2px] border border-white/[0.08] bg-black/25 p-5">
        {notice && (
          <div className="rounded-[2px] border border-red-400/20 bg-red-500/10 p-4 text-[13px] leading-6 text-red-100">
            <p className="font-semibold">Lookup failed</p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && results.length === 0 && !loading && (
          <div className="flex h-full min-h-[300px] flex-col gap-3 justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            <p>Paste a website URL to extract deduplicated links and embedded email hints.</p>
            {sourceUrl ? <p className="text-[12px] text-foreground/45">Last source: {sourceUrl}</p> : null}
          </div>
        )}

        {emails.length > 0 && (
          <div className="mb-4 rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3 text-[12px] text-foreground/65">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/80">Emails found</p>
            <p className="font-mono">{emails.join(", ")}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((item) => (
              <article key={item.url} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-black text-foreground">{item.title || "Untitled link"}</p>
                    <p className="mt-1 truncate text-[11px] font-mono text-foreground/60">{item.url}</p>
                  </div>
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-primary">
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
