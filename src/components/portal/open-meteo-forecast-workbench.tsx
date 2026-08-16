"use client";

import { useState } from "react";
import { Cloud, CloudSun, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type ForecastDay = {
  date: string;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
};

type WeatherCurrent = {
  time: string;
  temp: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
};

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function OpenMeteoForecastWorkbench() {
  const [location, setLocation] = useState("");
  const [units, setUnits] = useState<"celsius" | "fahrenheit">("celsius");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [current, setCurrent] = useState<WeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [resolvedLocation, setResolvedLocation] = useState("");

  async function run() {
    setLoading(true);
    setNotice(null);
    setCurrent(null);
    setForecast([]);
    setResolvedLocation("");
    try {
      const response = await fetch("/api/portal/tools/open-meteo-forecast", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ location, units }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Forecast lookup failed.",
          setupRequired: Boolean(data.setupRequired),
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "open-meteo-forecast",
        metadata: { location, unit: units },
      });
      setResolvedLocation(data.location?.name || location);
      setCurrent(data.current || null);
      setForecast(Array.isArray(data.forecast) ? data.forecast : []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Forecast lookup failed.",
        setupRequired: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const unitSymbol = units === "fahrenheit" ? "°F" : "°C";

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-[2px] border border-white/[0.08] bg-card/[0.36] p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
          <Cloud className="size-3.5" />
          Weather forecast
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">City or location</span>
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Berlin, New York, Singapore"
              className="mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Units</span>
            <select
              value={units}
              onChange={(event) => setUnits(event.target.value as "celsius" | "fahrenheit")}
              className="mt-2 h-10 w-full rounded-[2px] border border-white/[0.12] bg-transparent px-3 py-2 text-[13px] text-foreground outline-none"
            >
              <option value="celsius">Celsius</option>
              <option value="fahrenheit">Fahrenheit</option>
            </select>
          </label>
          <Button
            type="button"
            onClick={run}
            disabled={loading || !location.trim()}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Get forecast
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
            <p className="font-semibold">{notice.setupRequired ? "Setup required" : "Forecast failed"}</p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && !current && resultsEmpty(forecast) && !loading && (
          <div className="flex h-full min-h-[300px] flex-col gap-3 items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            <CloudSun className="size-6 opacity-70" />
            <p>Enter a location and pull a free forecast with daily min/max and precipitation.</p>
          </div>
        )}
        {current ? (
          <div>
            <div className="mb-5 rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/80">Current</p>
              <p className="mt-2 text-[21px] font-black text-foreground">
                {current.temp.toFixed(1)}
                {unitSymbol} · {resolvedLocation || location}
              </p>
              <div className="mt-2 grid gap-2 text-[12px] text-foreground/70 sm:grid-cols-3">
                <span>Wind {current.windSpeed} km/h</span>
                <span>Direction {current.windDirection}°</span>
                <span>Code {current.weatherCode}</span>
              </div>
              <p className="mt-2 text-[11px] text-foreground/55">Last update: {current.time}</p>
            </div>
            <div className="space-y-2">
              {forecast.map((day) => (
                <article
                  key={day.date}
                  className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3 text-[12.5px] text-foreground/70"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-black text-foreground">{day.date}</span>
                    <span>
                      {day.minTemp.toFixed(1)}
                      {unitSymbol} / {day.maxTemp.toFixed(1)}
                      {unitSymbol}
                    </span>
                  </div>
                  <span className="text-[11px]">Precipitation {day.precipitation} mm</span>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function resultsEmpty(forecast: ForecastDay[]): boolean {
  return forecast.length === 0;
}

