"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Plane, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type FlightLeg = {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  flight: string;
  airline: string;
};

type FlightResult = {
  title: string;
  price: number | null;
  currency: string;
  duration: string;
  totalStops: string;
  legs: FlightLeg[];
};

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function SerpFlightSearchWorkbench() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [outboundDate, setOutboundDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [results, setResults] = useState<FlightResult[]>([]);

  async function run() {
    setLoading(true);
    setNotice(null);
    setResults([]);
    try {
      const response = await fetch("/api/portal/tools/serp-flight-search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          outboundDate,
          returnDate,
          adults,
          currency,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Flight search failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "serp-flight-search",
        metadata: {
          origin,
          destination,
          outboundDate,
          returnDate,
          result_count: Array.isArray(data.results) ? data.results.length : 0,
        },
      });
      setResults(data.results || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Flight search failed.",
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
          <Plane className="size-3.5" />
          Flight search
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Origin</span>
            <Input
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              placeholder="LHR, FRA, BER"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Destination</span>
            <Input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="JFK, ORD, CDG"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Outbound date</span>
            <Input
              type="date"
              value={outboundDate}
              onChange={(event) => setOutboundDate(event.target.value)}
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Return date (optional)</span>
            <Input
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Adults</span>
            <Input
              type="number"
              min={1}
              max={8}
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
            disabled={loading || !origin.trim() || !destination.trim() || !outboundDate}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Search flights
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
            Enter route and date to get live flight candidates.
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-black text-foreground">{item.title || "Flight option"}</h3>
                    <p className="mt-1 text-[12px] text-foreground/60">{item.totalStops || "Stops unknown"}</p>
                  </div>
                  <span className="text-[12px] text-primary">
                    {typeof item.price === "number" ? `${item.price} ${item.currency || "EUR"}` : "Price pending"}
                  </span>
                </div>
                {item.duration ? <p className="mb-2 text-[12.5px] text-foreground/70">Duration: {item.duration}</p> : null}
                {item.legs.map((leg, legIndex) => (
                  <div key={`${leg.departureAirport}-${leg.arrivalAirport}-${legIndex}`} className="mb-2 rounded-[2px] border border-white/[0.05] bg-black/20 p-3">
                    <p className="text-[12px] font-black text-foreground/80">
                      {leg.departureAirport || "Origin"} → {leg.arrivalAirport || "Destination"}
                    </p>
                    <p className="mt-1 text-[11.5px] text-foreground/60">
                      {leg.departureTime || "TBD"} → {leg.arrivalTime || "TBD"} · {leg.duration || "TBD"}
                    </p>
                    <p className="mt-1 text-[11.5px] text-foreground/60">
                      {leg.flight || "Flight"}{leg.airline ? ` · ${leg.airline}` : ""}
                    </p>
                    {legIndex + 1 < item.legs.length ? <p className="mt-1 text-[11px] text-foreground/45">Layover</p> : null}
                  </div>
                ))}
                <a
                  href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`${origin} ${destination} ${outboundDate}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary"
                >
                  Open route in Google <ExternalLink className="size-3.5" />
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
