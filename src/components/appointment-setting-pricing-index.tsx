"use client";

import { useMemo, useState } from "react";
import { trackFunnelEvent } from "@/components/acquisition-tracking";
import type { AppointmentSettingProvider } from "@/lib/appointment-setting-providers";

const NOT_STATED = "Not publicly stated on the checked source";

function billingUnit(provider: AppointmentSettingProvider) {
  if (provider.billingUnit) return provider.billingUnit;
  if (!provider.hasPublicPrice) return NOT_STATED;
  const value = provider.price.toLowerCase();
  if (value.includes("per month") || value.includes("/month")) return "Month";
  if (value.includes("per 4 weeks")) return "Four weeks";
  if (value.includes("per qualified meeting")) return "Qualified meeting";
  return NOT_STATED;
}

function noShowPolicy(provider: AppointmentSettingProvider) {
  return provider.noShowPolicy || NOT_STATED;
}

export function AppointmentSettingPricingIndex({ providers }: { providers: AppointmentSettingProvider[] }) {
  const [query, setQuery] = useState("");
  const [pricedOnly, setPricedOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const visibleProviders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return providers.filter((provider) => {
      if (pricedOnly && !provider.hasPublicPrice) return false;
      if (!normalized) return true;
      return [provider.name, provider.price, provider.model, billingUnit(provider), noShowPolicy(provider), provider.contractTerm, provider.channels.join(" "), provider.qualification]
        .some((value) => value.toLowerCase().includes(normalized));
    });
  }, [pricedOnly, providers, query]);

  const compared = selected.map((name) => providers.find((provider) => provider.name === name)).filter(Boolean) as AppointmentSettingProvider[];

  function toggleProvider(name: string) {
    setSelected((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (current.length === 3) return current;
      trackFunnelEvent("provider_compared", { asset: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), lane: "outbound", placement: "pricing-index" });
      return [...current, name];
    });
  }

  function trackSource(provider: AppointmentSettingProvider) {
    trackFunnelEvent("source_link_clicked", { asset: provider.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), lane: "outbound", placement: "pricing-index-source" });
  }

  function toggleDetails(name: string) {
    setExpanded((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }

  return (
    <div>
      <div className="grid gap-4 border-y border-white/16 py-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <label htmlFor="provider-search" className="mb-2 block text-sm font-bold text-white">Search the index</label>
          <input
            id="provider-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Provider, model, channel, or qualification rule"
            className="min-h-12 w-full rounded-[8px] border border-white/18 bg-[#050b10] px-4 text-sm text-white outline-none placeholder:text-foreground/48 focus:border-primary focus:ring-3 focus:ring-primary/25"
          />
        </div>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 self-end px-1 text-sm font-bold text-foreground/74">
          <input type="checkbox" checked={pricedOnly} onChange={(event) => setPricedOnly(event.target.checked)} className="h-5 w-5 accent-primary" />
          Show providers with a public price
        </label>
      </div>

      <div className="flex min-h-14 flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/62">{visibleProviders.length} of {providers.length} providers. Select up to three to compare.</p>
        {(query || pricedOnly || selected.length) ? (
          <button type="button" onClick={() => { setQuery(""); setPricedOnly(false); setSelected([]); }} className="min-h-11 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
            Clear search and comparison
          </button>
        ) : null}
      </div>

      {compared.length > 0 ? (
        <section aria-labelledby="comparison-heading" className="mb-10 border-t border-primary/55 bg-[#081721] px-5 py-7 md:px-7">
          <div className="flex items-center justify-between gap-4">
            <h2 id="comparison-heading" className="text-2xl font-black tracking-[-0.02em] text-white">Selected comparison</h2>
            <button type="button" onClick={() => setSelected([])} className="min-h-11 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">Clear</button>
          </div>
          <div className="mt-6 hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-48 border-b border-white/18 py-4 pr-5 text-sm font-bold text-foreground/62">Field</th>
                  {compared.map((provider) => <th key={provider.name} className="border-b border-white/18 px-4 py-4 text-base font-bold text-white">{provider.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Public price", (provider: AppointmentSettingProvider) => provider.price],
                  ["Billing unit", billingUnit],
                  ["No-show policy", noShowPolicy],
                  ["Contract term", (provider: AppointmentSettingProvider) => provider.contractTerm],
                  ["Channels", (provider: AppointmentSettingProvider) => provider.channels.join(", ")],
                  ["Qualification", (provider: AppointmentSettingProvider) => provider.qualification],
                  ["Last checked", (provider: AppointmentSettingProvider) => provider.lastChecked],
                ].map(([label, read]) => (
                  <tr key={label as string} className="align-top">
                    <th className="border-b border-white/12 py-4 pr-5 text-sm font-bold text-foreground/62">{label as string}</th>
                    {compared.map((provider) => <td key={provider.name} className="border-b border-white/12 px-4 py-4 text-sm leading-6 text-foreground/74">{(read as (provider: AppointmentSettingProvider) => string)(provider)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 border-t border-white/16 lg:hidden">
            {compared.map((provider) => (
              <section key={provider.name} className="border-b border-white/16 py-6" aria-label={`${provider.name} comparison`}>
                <h3 className="text-lg font-bold text-white">{provider.name}</h3>
                <dl className="mt-4">
                  {[
                    ["Public price", provider.price],
                    ["Billing unit", billingUnit(provider)],
                    ["No-show policy", noShowPolicy(provider)],
                    ["Contract term", provider.contractTerm],
                    ["Channels", provider.channels.join(", ")],
                    ["Qualification", provider.qualification],
                    ["Last checked", provider.lastChecked],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-1 border-t border-white/10 py-3">
                      <dt className="text-sm font-bold text-white">{label}</dt>
                      <dd className="text-sm leading-6 text-foreground/72">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      <div className="hidden border-t border-white/16 xl:block">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[80px]" />
            <col className="w-[190px]" />
            <col />
            <col className="w-[250px]" />
            <col className="w-[130px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/16 bg-[#071017]">
              {[
                "Compare", "Provider", "Public price", "Pricing model", "More",
              ].map((label) => <th key={label} className="px-4 py-4 text-sm font-bold text-foreground/64">{label}</th>)}
            </tr>
          </thead>
          {visibleProviders.map((provider) => {
            const isSelected = selected.includes(provider.name);
            const selectionDisabled = selected.length === 3 && !isSelected;
            const isExpanded = expanded.includes(provider.name);
            const detailsId = `provider-details-${provider.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <tbody key={provider.name}>
                <tr key={provider.name} className="border-b border-white/10 align-top hover:bg-white/[0.02]">
                  <td className="px-4 py-5">
                    <label className="flex h-11 w-11 items-center justify-center text-sm text-foreground/70">
                      <input type="checkbox" checked={isSelected} disabled={selectionDisabled} onChange={() => toggleProvider(provider.name)} aria-label={`Compare ${provider.name}`} className="h-5 w-5 accent-primary disabled:opacity-35" />
                    </label>
                  </td>
                  <td className="px-4 py-5 font-bold text-white">{provider.name}</td>
                  <td className="px-4 py-5 text-sm leading-6 text-foreground/74">{provider.price}</td>
                  <td className="px-4 py-5 text-sm leading-6 text-foreground/68">{provider.model}</td>
                  <td className="px-4 py-5">
                    <button type="button" onClick={() => toggleDetails(provider.name)} aria-expanded={isExpanded} aria-controls={detailsId} className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                      {isExpanded ? "Close" : "Details"}
                    </button>
                  </td>
                </tr>
                {isExpanded ? (
                  <tr id={detailsId} className="border-b border-white/16 bg-[#071017]">
                    <td colSpan={5} className="px-6 py-6">
                      <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
                        {[
                          ["Billing unit", billingUnit(provider)],
                          ["No-show policy", noShowPolicy(provider)],
                          ["Contract term", provider.contractTerm],
                          ["Channels", provider.channels.join(", ")],
                          ["Qualification", provider.qualification],
                          ["Last checked", provider.lastChecked],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-sm font-bold text-white">{label}</dt>
                            <dd className="mt-1 text-sm leading-6 text-foreground/70">{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <a href={provider.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackSource(provider)} className="mt-5 inline-flex min-h-11 items-center font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">Open source</a>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            );
          })}
        </table>
      </div>

      <div className="border-t border-white/16 xl:hidden">
        {visibleProviders.map((provider) => {
          const isSelected = selected.includes(provider.name);
          const selectionDisabled = selected.length === 3 && !isSelected;
          return (
            <article key={provider.name} className="border-b border-white/16 py-5">
              <div className="mb-3 flex min-h-11 items-center justify-between gap-4">
                <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-foreground/72">
                  <input type="checkbox" checked={isSelected} disabled={selectionDisabled} onChange={() => toggleProvider(provider.name)} className="h-5 w-5 accent-primary disabled:opacity-35" />
                  Compare
                </label>
                <a href={provider.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackSource(provider)} className="inline-flex min-h-11 items-center text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">Open source</a>
              </div>
              <details className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                  <span>
                    <strong className="block text-lg text-white">{provider.name}</strong>
                    <span className="mt-1 block text-sm leading-6 text-foreground/65">{provider.price}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-primary group-open:hidden">Details</span>
                  <span className="hidden shrink-0 text-sm font-bold text-primary group-open:inline">Close</span>
                </summary>
                <dl className="mt-5 border-t border-white/12">
                  {[
                    ["Billing unit", billingUnit(provider)], ["No-show policy", noShowPolicy(provider)], ["Contract term", provider.contractTerm],
                    ["Channels", provider.channels.join(", ")], ["Qualification", provider.qualification], ["Source", provider.sourceLabel], ["Last checked", provider.lastChecked],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-1 border-b border-white/10 py-4 sm:grid-cols-[150px_1fr]">
                      <dt className="text-sm font-bold text-white">{label}</dt>
                      <dd className="text-sm leading-6 text-foreground/68">{value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </article>
          );
        })}
      </div>

      {visibleProviders.length === 0 ? <div className="border-y border-white/16 py-16 text-center text-foreground/62">No provider matches these filters.</div> : null}
    </div>
  );
}
