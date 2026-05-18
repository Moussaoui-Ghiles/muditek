"use client";

import { useState } from "react";
import { Search, Loader2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Place = {
  name: string;
  website: string;
  phone: string;
  address: string;
  category: string;
  rating: number | null;
  reviews: number | null;
  emails: string[];
};

type WorkbenchNotice = {
  message: string;
  setupRequired: boolean;
};

export function GoogleMapsLeadWorkbench() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [max, setMax] = useState(10);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<WorkbenchNotice | null>(null);
  const [results, setResults] = useState<Place[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    try {
      const res = await fetch("/api/portal/tools/google-maps-leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ keyword, location, max }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          message: data.error || "Lead search failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Lead search failed.",
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
          <MapPin className="size-3.5" />
          Google Maps
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Business type</span>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Dentists, med spas, accountants..."
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Location</span>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Austin, Berlin, Dubai..."
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Max results</span>
            <Input
              type="number"
              min={1}
              max={25}
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="mt-2"
            />
          </label>
          <Button type="button" onClick={run} disabled={loading || !keyword.trim() || !location.trim()} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Find leads
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
            Add a business type and location to pull live Google Maps leads. Results stay empty
            until the connected API returns real data.
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((lead, index) => (
              <article key={`${lead.name}-${index}`} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">{lead.name}</h3>
                    <p className="mt-1 text-[12.5px] text-foreground/55">{lead.category || lead.address}</p>
                  </div>
                  {lead.website && (
                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
                <div className="mt-3 grid gap-2 text-[12px] text-foreground/65 sm:grid-cols-2">
                  <span>{lead.phone || "No phone returned"}</span>
                  <span>{lead.rating ? `${lead.rating} rating` : "No rating returned"}</span>
                  <span>{lead.reviews ? `${lead.reviews} reviews` : "No review count returned"}</span>
                  <span>{lead.emails.length ? lead.emails.join(", ") : "No email returned"}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
