"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function SerpAutocompleteWorkbench() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setSuggestions([]);
    try {
      const response = await fetch("/api/portal/tools/serp-autocomplete-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Autocomplete failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "serp-autocomplete-suggestions",
        metadata: { query, result_count: Array.isArray(data.suggestions) ? data.suggestions.length : 0 },
      });
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Autocomplete failed.",
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
          <Search className="size-3.5" />
          Autocomplete
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Type query</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="fintech sales in"
              className="mt-2"
            />
          </label>
          <Button type="button" onClick={run} disabled={loading || !query.trim()} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Get suggestions
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
            <p className="font-semibold">{notice.setupRequired ? "Setup required" : "Lookup failed"}</p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && suggestions.length === 0 && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            Start typing a partial query to get instant autocomplete suggestions from SerpAPI.
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <article
                key={suggestion}
                className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3 text-[13px] text-foreground/70"
              >
                {suggestion}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

