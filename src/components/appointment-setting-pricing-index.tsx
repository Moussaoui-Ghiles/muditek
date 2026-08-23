"use client";

import { useMemo, useState } from "react";
import type { AppointmentSettingProvider } from "@/lib/appointment-setting-providers";

export function AppointmentSettingPricingIndex({ providers }: { providers: AppointmentSettingProvider[] }) {
  const [query, setQuery] = useState("");
  const [pricedOnly, setPricedOnly] = useState(false);

  const visibleProviders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return providers.filter((provider) => {
      if (pricedOnly && !provider.hasPublicPrice) return false;
      if (!normalized) return true;
      return [
        provider.name,
        provider.price,
        provider.model,
        provider.contractTerm,
        provider.channels.join(" "),
        provider.qualification,
      ].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [pricedOnly, providers, query]);

  return (
    <div>
      <div className="mb-6 grid gap-3 border border-white/[0.08] bg-card/35 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <label htmlFor="provider-search" className="sr-only">Search providers</label>
        <input
          id="provider-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search provider, model, channel, or qualification rule"
          className="w-full rounded-[3px] border border-white/[0.1] bg-background/70 px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/30 focus:border-primary/70"
        />
        <label className="flex cursor-pointer items-center gap-3 px-1 text-sm font-bold text-foreground/65">
          <input
            type="checkbox"
            checked={pricedOnly}
            onChange={(event) => setPricedOnly(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Public price only
        </label>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-sm text-foreground/45">{visibleProviders.length} of {providers.length} providers</p>
        {(query || pricedOnly) ? (
          <button
            type="button"
            onClick={() => { setQuery(""); setPricedOnly(false); }}
            className="text-sm font-bold text-primary hover:text-primary/75"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto border border-white/[0.08] xl:block">
        <table className="w-full min-w-[1450px] border-collapse text-left">
          <thead className="bg-card/70">
            <tr className="border-b border-white/[0.08]">
              {[
                ["Provider", "w-[13%]"],
                ["Public price", "w-[18%]"],
                ["Model", "w-[14%]"],
                ["Contract", "w-[12%]"],
                ["Channels", "w-[13%]"],
                ["Qualification", "w-[23%]"],
                ["Source", "w-[7%]"],
              ].map(([label, width]) => (
                <th key={label} className={`${width} px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-foreground/55`}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleProviders.map((provider) => (
              <tr key={provider.name} className="border-b border-white/[0.055] align-top last:border-b-0 hover:bg-white/[0.015]">
                <td className="px-5 py-5 font-bold text-foreground">{provider.name}</td>
                <td className="px-5 py-5 text-sm leading-relaxed text-foreground/70">
                  <span className={provider.hasPublicPrice ? "text-foreground" : "text-foreground/42"}>{provider.price}</span>
                </td>
                <td className="px-5 py-5 text-sm leading-relaxed text-foreground/60">{provider.model}</td>
                <td className="px-5 py-5 text-sm leading-relaxed text-foreground/60">{provider.contractTerm}</td>
                <td className="px-5 py-5 text-sm leading-relaxed text-foreground/60">{provider.channels.join(", ")}</td>
                <td className="px-5 py-5 text-sm leading-relaxed text-foreground/60">{provider.qualification}</td>
                <td className="px-5 py-5">
                  <a href={provider.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-bold text-primary hover:text-primary/70">
                    Open ↗
                  </a>
                  <span className="mt-2 block font-mono text-[11px] text-foreground/35">{provider.lastChecked}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {visibleProviders.map((provider) => (
          <article key={provider.name} className="border border-white/[0.08] bg-card/30 p-5 md:p-7">
            <div className="flex flex-col gap-3 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.02em]">{provider.name}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${provider.hasPublicPrice ? "text-primary" : "text-foreground/45"}`}>{provider.price}</p>
              </div>
              <a href={provider.sourceUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 font-mono text-sm font-bold text-primary hover:text-primary/70">
                Source ↗
              </a>
            </div>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                ["Model", provider.model],
                ["Contract", provider.contractTerm],
                ["Channels", provider.channels.join(", ")],
                ["Qualification", provider.qualification],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/35">{label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-foreground/65">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-white/[0.06] pt-4 font-mono text-[11px] text-foreground/35">Last checked {provider.lastChecked} · {provider.sourceLabel}</p>
          </article>
        ))}
      </div>

      {visibleProviders.length === 0 ? (
        <div className="border border-white/[0.08] py-20 text-center text-foreground/50">No provider matches these filters.</div>
      ) : null}
    </div>
  );
}

