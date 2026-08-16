"use client";

import { useState } from "react";
import { ExternalLink, Hotel, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type HotelResult = {
  name: string;
  address: string;
  price: number | null;
  currency: string;
  rating: number | null;
  reviews: number | null;
  link: string;
  image: string;
};

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function SerpHotelSearchWorkbench() {
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [results, setResults] = useState<HotelResult[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    try {
      const response = await fetch("/api/portal/tools/serp-hotel-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          location,
          checkInDate,
          checkOutDate,
          adults,
          currency,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Hotel search failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "serp-hotel-search",
        metadata: {
          location,
          checkInDate,
          checkOutDate,
          result_count: Array.isArray(data.results) ? data.results.length : 0,
          currency: data.search?.currency || currency,
        },
      });
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Hotel search failed.",
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
          <Hotel className="size-3.5" />
          Hotel search
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Destination or city</span>
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Berlin, New York, Madrid"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Check-in date</span>
            <Input
              type="date"
              value={checkInDate}
              onChange={(event) => setCheckInDate(event.target.value)}
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Check-out date</span>
            <Input
              type="date"
              value={checkOutDate}
              onChange={(event) => setCheckOutDate(event.target.value)}
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Adults</span>
            <Input
              type="number"
              min={1}
              max={6}
              value={adults}
              onChange={(event) => setAdults(Number(event.target.value))}
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Currency</span>
            <Input
              value={currency}
              onChange={(event) => setCurrency(event.target.value.toUpperCase())}
              placeholder="EUR"
              className="mt-2"
            />
          </label>
          <Button
            type="button"
            onClick={run}
            disabled={loading || !location.trim() || !checkInDate || !checkOutDate}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Search hotels
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
            <p className="font-semibold">{notice.setupRequired ? "Setup required" : "Search failed"}</p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && results.length === 0 && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            Set a destination and stay dates to get live hotel options.
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((item, index) => (
              <article key={`${item.name}-${index}`} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">{item.name || "Unnamed property"}</h3>
                    <p className="mt-1 text-[12.5px] text-foreground/60">{item.address || "Address unavailable"}</p>
                  </div>
                  <span className="text-[12px] text-primary">
                    {typeof item.price === "number"
                      ? `${item.price} ${item.currency || "EUR"} / night`
                      : "Price pending"}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-[12px] text-foreground/65 sm:grid-cols-2">
                  <span>{typeof item.rating === "number" ? `Rating ${item.rating}` : "Rating not returned"}</span>
                  <span>{typeof item.reviews === "number" ? `${item.reviews} reviews` : "No review count"}</span>
                </div>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 pt-3 text-primary">
                    Open booking page <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

