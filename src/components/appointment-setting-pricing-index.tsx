"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ExternalLink, X } from "lucide-react";
import type { AppointmentSettingProvider } from "@/lib/appointment-setting-providers";

export const MAX_COMPARISON_PROVIDERS = 4;

export type ProviderSort = "name" | "public-price" | "stated-contract";

function hasStatedContract(provider: AppointmentSettingProvider) {
  const contract = provider.contractTerm.toLowerCase();
  return !contract.startsWith("not publicly stated") && !contract.startsWith("no contract stated");
}

export function getVisibleProviders(
  providers: AppointmentSettingProvider[],
  query: string,
  pricedOnly: boolean,
  sort: ProviderSort,
) {
  const normalized = query.trim().toLowerCase();
  const visible = providers.filter((provider) => {
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

  return visible.sort((a, b) => {
    if (sort === "public-price" && a.hasPublicPrice !== b.hasPublicPrice) {
      return a.hasPublicPrice ? -1 : 1;
    }

    if (sort === "stated-contract") {
      const aHasStatedContract = hasStatedContract(a);
      const bHasStatedContract = hasStatedContract(b);
      if (aHasStatedContract !== bHasStatedContract) return aHasStatedContract ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

export function updateProviderSelection(selectedNames: string[], providerName: string) {
  if (selectedNames.includes(providerName)) {
    return selectedNames.filter((name) => name !== providerName);
  }

  if (selectedNames.length >= MAX_COMPARISON_PROVIDERS) return selectedNames;
  return [...selectedNames, providerName];
}

function SourceLink({ provider, compact = false }: { provider: AppointmentSettingProvider; compact?: boolean }) {
  return (
    <a
      href={provider.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the checked source for ${provider.name} in a new tab`}
      className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs font-bold text-primary underline decoration-primary/35 underline-offset-4 hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {compact ? "Source" : "Open source"}
      <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
    </a>
  );
}

function ComparisonTable({ providers }: { providers: AppointmentSettingProvider[] }) {
  const rows = [
    ["Public price", (provider: AppointmentSettingProvider) => provider.price],
    ["Billing model", (provider: AppointmentSettingProvider) => provider.model],
    ["Contract", (provider: AppointmentSettingProvider) => provider.contractTerm],
    ["Channels", (provider: AppointmentSettingProvider) => provider.channels.join(", ")],
    ["Qualification", (provider: AppointmentSettingProvider) => provider.qualification],
  ] as const;

  return (
    <>
      <p className="mb-3 flex items-center justify-between gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/70">
        <span>Compare the same field across providers</span>
        <span aria-hidden="true" className="shrink-0 text-primary">Scroll right →</span>
      </p>
      <div
        className="overflow-x-auto border border-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        role="region"
        aria-label="Selected provider comparison. Scroll horizontally to see every provider."
        tabIndex={0}
      >
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-card/80">
            <tr className="border-b border-white/[0.1]">
              <th className="sticky left-0 z-10 w-40 bg-card px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-foreground/75 sm:w-48 sm:px-5">
                Check
              </th>
              {providers.map((provider) => (
                <th key={provider.name} scope="col" className="min-w-60 px-4 py-4 text-sm font-black text-foreground sm:px-5">
                  {provider.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, getValue]) => (
              <tr key={label} className="border-b border-white/[0.07] align-top last:border-b-0">
                <th scope="row" className="sticky left-0 z-10 bg-background px-4 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/70 sm:px-5">
                  {label}
                </th>
                {providers.map((provider) => (
                  <td key={provider.name} className="min-w-60 px-4 py-4 text-sm leading-relaxed text-foreground/75 sm:px-5">
                    {getValue(provider)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="align-top">
              <th scope="row" className="sticky left-0 z-10 bg-background px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/70 sm:px-5">
                Evidence
              </th>
              {providers.map((provider) => (
                <td key={provider.name} className="min-w-60 px-4 py-3 sm:px-5">
                  <SourceLink provider={provider} />
                  <span className="block font-mono text-[11px] text-foreground/65">Checked {provider.lastChecked}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AppointmentSettingPricingIndex({ providers }: { providers: AppointmentSettingProvider[] }) {
  const [query, setQuery] = useState("");
  const [pricedOnly, setPricedOnly] = useState(false);
  const [sort, setSort] = useState<ProviderSort>("name");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const visibleProviders = useMemo(
    () => getVisibleProviders(providers, query, pricedOnly, sort),
    [pricedOnly, providers, query, sort],
  );

  const selectedProviders = useMemo(
    () => selectedNames
      .map((name) => providers.find((provider) => provider.name === name))
      .filter((provider): provider is AppointmentSettingProvider => Boolean(provider)),
    [providers, selectedNames],
  );

  function toggleProvider(providerName: string) {
    setSelectedNames((current) => updateProviderSelection(current, providerName));
  }

  function clearFilters() {
    setQuery("");
    setPricedOnly(false);
    setSort("name");
  }

  return (
    <div>
      <section aria-labelledby="directory-controls-title" className="border border-white/[0.1] bg-card/35 p-4 md:p-6">
        <div className="mb-5 flex flex-col gap-2 border-b border-white/[0.08] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Provider directory</p>
            <h2 id="directory-controls-title" className="mt-2 text-2xl font-black tracking-[-0.025em]">Find the terms worth comparing.</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-foreground/70">Search the source data, select up to four providers, then compare the same fields side by side.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.34fr)_auto] lg:items-end">
          <div>
            <label htmlFor="provider-search" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/75">Search the index</label>
            <input
              id="provider-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Provider, model, channel, or qualification rule"
              className="min-h-12 w-full rounded-[8px] border border-white/[0.16] bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/55 focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="provider-sort" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/75">Sort</label>
            <select
              id="provider-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as ProviderSort)}
              className="min-h-12 w-full rounded-[8px] border border-white/[0.16] bg-background/80 px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
            >
              <option value="name">Provider name, A to Z</option>
              <option value="public-price">Public price first</option>
              <option value="stated-contract">Stated contract terms first</option>
            </select>
          </div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[8px] border border-white/[0.12] px-4 text-sm font-bold text-foreground/75 hover:border-white/[0.2]">
            <input
              type="checkbox"
              checked={pricedOnly}
              onChange={(event) => setPricedOnly(event.target.checked)}
              className="h-5 w-5 accent-primary"
            />
            Public price only
          </label>
        </div>
      </section>

      <div className="my-5 flex min-h-8 flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-sm text-foreground/70" aria-live="polite">
          {visibleProviders.length} of {providers.length} providers shown
        </p>
        {(query || pricedOnly || sort !== "name") ? (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-11 px-2 text-sm font-bold text-primary underline decoration-primary/35 underline-offset-4 hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reset search and sort
          </button>
        ) : null}
      </div>

      <section id="provider-comparison" aria-labelledby="provider-comparison-title" className="mb-8 scroll-mt-28 border border-primary/25 bg-primary/[0.04] p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b border-primary/15 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Your comparison</p>
              <span className="font-mono text-[11px] text-foreground/65">{selectedProviders.length}/{MAX_COMPARISON_PROVIDERS}</span>
            </div>
            <h2 id="provider-comparison-title" className="mt-2 text-2xl font-black tracking-[-0.025em]">
              {selectedProviders.length > 0 ? "Check the trade-offs side by side." : "Select providers from the directory."}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/70">
              {selectedProviders.length > 0
                ? "The comparison uses the same source-linked facts shown in the full index."
                : "Add up to four providers. Start with billing model, contract, and qualification rules."}
            </p>
          </div>
          {selectedProviders.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedNames([])}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start px-2 text-sm font-bold text-primary underline decoration-primary/35 underline-offset-4 hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X aria-hidden="true" className="h-4 w-4" /> Clear comparison
            </button>
          ) : null}
        </div>

        {selectedProviders.length > 0 ? (
          <div className="mt-5">
            <div className="mb-5 flex flex-wrap gap-2" aria-label="Selected providers">
              {selectedProviders.map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => toggleProvider(provider.name)}
                  aria-label={`Remove ${provider.name} from comparison`}
                  className="inline-flex min-h-11 items-center gap-2 border border-primary/25 bg-background/70 px-3 text-sm font-bold text-foreground hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {provider.name} <X aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                </button>
              ))}
            </div>
            <ComparisonTable providers={selectedProviders} />
          </div>
        ) : null}
      </section>

      {selectedProviders.length > 0 ? (
        <div className="sticky top-20 z-20 mb-5 flex items-center justify-between gap-3 border border-primary/30 bg-background/95 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur md:px-5" aria-live="polite">
          <p className="text-sm font-bold text-foreground">
            {selectedProviders.length} {selectedProviders.length === 1 ? "provider" : "providers"} selected
          </p>
          <a href="#provider-comparison" className="inline-flex min-h-11 items-center px-2 text-sm font-black text-primary underline decoration-primary/35 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            View comparison
          </a>
        </div>
      ) : null}

      <div className="hidden overflow-x-auto border border-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:block" role="region" aria-label="Full provider pricing index" tabIndex={0}>
        <p className="sticky left-0 border-b border-white/[0.08] bg-card/60 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/70">
          Full index <span aria-hidden="true" className="ml-3 text-primary">Scroll right →</span>
        </p>
        <table className="w-full min-w-[1560px] border-collapse text-left">
          <thead className="bg-card/70">
            <tr className="border-b border-white/[0.08]">
              {[
                ["Provider", "w-[15%]"],
                ["Public price", "w-[18%]"],
                ["Model", "w-[14%]"],
                ["Contract", "w-[12%]"],
                ["Channels", "w-[13%]"],
                ["Qualification", "w-[21%]"],
                ["Source", "w-[7%]"],
              ].map(([label, width]) => (
                <th key={label} scope="col" className={`${width} px-5 py-4 text-xs font-black uppercase tracking-[0.12em] text-foreground/75`}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleProviders.map((provider) => {
              const isSelected = selectedNames.includes(provider.name);
              const comparisonFull = selectedNames.length >= MAX_COMPARISON_PROVIDERS && !isSelected;

              return (
                <tr key={provider.name} className="border-b border-white/[0.055] align-top last:border-b-0 hover:bg-white/[0.02]">
                  <th scope="row" className="px-5 py-5 text-left">
                    <span className="block font-bold text-foreground">{provider.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleProvider(provider.name)}
                      disabled={comparisonFull}
                      aria-pressed={isSelected}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 border border-white/[0.14] px-3 text-xs font-black text-primary hover:border-primary/45 disabled:cursor-not-allowed disabled:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {isSelected ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                      {isSelected ? "Selected" : comparisonFull ? "Limit reached" : "Add to compare"}
                    </button>
                  </th>
                  <td className="px-5 py-5 text-sm leading-relaxed text-foreground/75">
                    <span className={provider.hasPublicPrice ? "text-foreground" : "text-foreground/65"}>{provider.price}</span>
                  </td>
                  <td className="px-5 py-5 text-sm leading-relaxed text-foreground/70">{provider.model}</td>
                  <td className="px-5 py-5 text-sm leading-relaxed text-foreground/70">{provider.contractTerm}</td>
                  <td className="px-5 py-5 text-sm leading-relaxed text-foreground/70">{provider.channels.join(", ")}</td>
                  <td className="px-5 py-5 text-sm leading-relaxed text-foreground/70">{provider.qualification}</td>
                  <td className="px-5 py-5">
                    <SourceLink provider={provider} compact />
                    <span className="block font-mono text-[11px] text-foreground/65">{provider.lastChecked}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/[0.08] border-y border-white/[0.1] xl:hidden">
        {visibleProviders.map((provider) => {
          const isSelected = selectedNames.includes(provider.name);
          const comparisonFull = selectedNames.length >= MAX_COMPARISON_PROVIDERS && !isSelected;

          return (
            <article key={provider.name} className="bg-card/20 px-4 py-5 sm:px-5 md:px-7">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div>
                  <h2 className="text-xl font-black tracking-[-0.02em]">{provider.name}</h2>
                  <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${provider.hasPublicPrice ? "text-primary" : "text-foreground/70"}`}>{provider.price}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => toggleProvider(provider.name)}
                    disabled={comparisonFull}
                    aria-pressed={isSelected}
                    className="inline-flex min-h-11 items-center gap-2 border border-white/[0.14] px-3 text-xs font-black text-primary hover:border-primary/45 disabled:cursor-not-allowed disabled:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {isSelected ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                    {isSelected ? "Selected" : comparisonFull ? "Limit reached" : "Add to compare"}
                  </button>
                  <SourceLink provider={provider} compact />
                </div>
              </div>

              <details className="group mt-5 border-t border-white/[0.08] pt-2">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm font-black text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Review model, contract, and qualification
                  <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <dl className="grid gap-5 pb-2 pt-3 md:grid-cols-2">
                  {[
                    ["Billing model", provider.model],
                    ["Contract", provider.contractTerm],
                    ["Channels", provider.channels.join(", ")],
                    ["Qualification", provider.qualification],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/70">{label}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-foreground/75">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="border-t border-white/[0.08] pt-4 font-mono text-[11px] text-foreground/65">Checked {provider.lastChecked}. {provider.sourceLabel}.</p>
              </details>
            </article>
          );
        })}
      </div>

      {visibleProviders.length === 0 ? (
        <div className="border-x border-b border-white/[0.1] px-6 py-20 text-center">
          <p className="font-black text-foreground">No provider matches this search.</p>
          <button type="button" onClick={clearFilters} className="mt-4 min-h-11 px-2 text-sm font-bold text-primary underline decoration-primary/35 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Reset search and sort
          </button>
        </div>
      ) : null}
    </div>
  );
}
