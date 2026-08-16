"use client";

import { useState } from "react";
import { BookOpenText, ExternalLink, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type TavilyResult = {
  title: string;
  url: string;
  snippet: string;
  score: number | null;
  publishedDate: string;
};

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function TavilyWebResearchWorkbench() {
  const [query, setQuery] = useState("");
  const [maxResults, setMaxResults] = useState(5);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<TavilyResult[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setAnswer("");
    setResults([]);
    try {
      const response = await fetch("/api/portal/tools/tavily-web-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, maxResults }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Web research failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "tavily-web-research",
        metadata: {
          query,
          result_count: Array.isArray(data.results) ? data.results.length : 0,
          max_results: maxResults,
        },
      });
      setAnswer(data.answer || "");
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Web research failed.",
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
          <BookOpenText className="size-3.5" />
          Web research
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Research topic</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What are current trends in enterprise sales enablement?"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Max results</span>
            <Input
              type="number"
              min={1}
              max={10}
              value={maxResults}
              onChange={(event) => setMaxResults(Number(event.target.value))}
              className="mt-2"
            />
          </label>
          <Button
            type="button"
            onClick={run}
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Run web research
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
            <p className="font-semibold">{notice.setupRequired ? "Setup required" : "Research failed"}</p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && !answer && results.length === 0 && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            Run a web query to get an answer summary with source links.
          </div>
        )}
        {answer ? (
          <div className="mb-4 rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/80">Answer</p>
            <p className="mt-2 text-[13px] leading-6 text-foreground/70">{answer}</p>
          </div>
        ) : null}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((item, index) => (
              <article key={`${item.url}-${index}`} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">{item.title || "Result"}</h3>
                    <p className="mt-1 text-[12px] text-foreground/60">
                      {item.publishedDate || "Date unavailable"}
                      {item.score === null ? "" : ` · ${item.score}`}
                    </p>
                  </div>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-primary">
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                </div>
                {item.snippet ? <p className="mt-3 text-[12.5px] leading-6 text-foreground/70">{item.snippet}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

