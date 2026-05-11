"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LeakResult = {
  name: string;
  yourValue: string;
  benchmark: string;
  gap: string;
  amount: number;
  formula: string;
  methodology: string;
};

type FieldConfig = {
  key: string;
  label: string;
  unit: "€" | "%" | "hours" | "";
  placeholder: string;
  hint: string;
};

const CORE_FIELDS: FieldConfig[] = [
  { key: "mrr", label: "Monthly Recurring Revenue", unit: "€", placeholder: "50000", hint: "Total MRR before churn." },
  { key: "leads", label: "Inbound Leads / Month", unit: "", placeholder: "100", hint: "Demos, trials, or qualified inquiries per month." },
  { key: "responseTime", label: "Avg. Response Time", unit: "hours", placeholder: "8", hint: "Time from form submission to first human reply." },
  { key: "closeRate", label: "Demo-to-Close Rate", unit: "%", placeholder: "12", hint: "Percent of demos/trials that become paying customers." },
  { key: "churnRate", label: "Monthly Revenue Churn", unit: "%", placeholder: "3", hint: "Percent of MRR lost each month to cancellations." },
  { key: "acv", label: "Average Deal Size (ACV)", unit: "€", placeholder: "8000", hint: "Average annual value of a closed deal." },
];

const ADVANCED_FIELDS: FieldConfig[] = [
  { key: "channelSpend", label: "Worst Channel: Monthly Spend", unit: "€", placeholder: "2500", hint: "Monthly spend on your lowest-performing paid channel." },
  { key: "channelRevenue", label: "Worst Channel: Monthly Pipeline", unit: "€", placeholder: "800", hint: "Pipeline revenue attributed to that channel per month." },
  { key: "outboundEmails", label: "Outbound Emails / Month", unit: "", placeholder: "2000", hint: "Total outbound prospecting emails sent per month." },
  { key: "outboundMeetingRate", label: "Outbound Meeting Rate", unit: "%", placeholder: "0.5", hint: "Percent of outbound emails that result in a booked meeting." },
];

type Values = Record<string, string>;

const INITIAL: Values = {
  mrr: "",
  leads: "",
  responseTime: "",
  closeRate: "",
  churnRate: "",
  acv: "",
  channelSpend: "",
  channelRevenue: "",
  outboundEmails: "",
  outboundMeetingRate: "",
};

function num(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function computeLeaks(values: Values): LeakResult[] {
  const mrr = num(values.mrr);
  const leads = num(values.leads);
  const responseHrs = num(values.responseTime);
  const closeRate = num(values.closeRate) / 100;
  const churnRate = num(values.churnRate) / 100;
  const acv = num(values.acv);
  const channelSpend = num(values.channelSpend);
  const channelRevenue = num(values.channelRevenue);
  const outboundEmails = num(values.outboundEmails);
  const outboundMeetingRate = num(values.outboundMeetingRate) / 100;

  const leaks: LeakResult[] = [];

  if (responseHrs > 0.083 && leads > 0 && acv > 0) {
    const amount = leads * acv * 0.8 * 0.1 * 12;
    leaks.push({
      name: "Speed-to-Lead",
      yourValue: `${responseHrs}h response time`,
      benchmark: "< 5 minutes",
      gap: `${(responseHrs * 60).toFixed(0)} min vs 5 min`,
      amount: Math.round(amount),
      formula: `${leads} leads/mo × €${acv.toLocaleString()} ACV × 80% conversion decay × 10% recovery × 12 months`,
      methodology:
        "InsideSales.com / Harvard Business Review: responding after 5 minutes drops conversion ~80%. 10% recovery rate is a conservative estimate of deals recoverable with faster response systems.",
    });
  }

  if (closeRate > 0 && closeRate < 0.22 && leads > 0 && acv > 0) {
    const annualOpportunities = leads * 12;
    const amount = (0.22 - closeRate) * annualOpportunities * acv;
    leaks.push({
      name: "Pipeline Conversion",
      yourValue: `${(closeRate * 100).toFixed(1)}% close rate`,
      benchmark: "22% (B2B SaaS benchmark)",
      gap: `${((0.22 - closeRate) * 100).toFixed(1)} pp below benchmark`,
      amount: Math.round(amount),
      formula: `(22% − ${(closeRate * 100).toFixed(1)}%) × ${annualOpportunities.toLocaleString()} annual opps × €${acv.toLocaleString()} ACV`,
      methodology:
        "OpenView SaaS Benchmarks, HubSpot State of Sales — 20-25% demo-to-close range, midpoint 22%. Each pp gap × deal volume × deal size = quantifiable lost revenue.",
    });
  }

  if (churnRate > 0.005 && mrr > 0) {
    const amount = (churnRate - 0.005) * mrr * 12;
    leaks.push({
      name: "Revenue Churn",
      yourValue: `${(churnRate * 100).toFixed(1)}% monthly churn`,
      benchmark: "0.5% monthly (6% annual)",
      gap: `${((churnRate - 0.005) * 100).toFixed(1)}% excess monthly churn`,
      amount: Math.round(amount),
      formula: `(${(churnRate * 100).toFixed(1)}% − 0.5%) × €${mrr.toLocaleString()} MRR × 12 months`,
      methodology:
        "Bessemer Cloud Index / SaaS Capital — best-in-class B2B SaaS holds ~0.5% monthly churn. Excess churn compounds against the whole MRR base.",
    });
  }

  if (channelSpend > 0 && channelRevenue >= 0 && channelSpend > channelRevenue) {
    const waste = (channelSpend - channelRevenue) * 12;
    leaks.push({
      name: "Lead Source ROI",
      yourValue: `€${channelSpend.toLocaleString()}/mo spend → €${channelRevenue.toLocaleString()}/mo pipeline`,
      benchmark: "Spend < pipeline generated",
      gap: `€${(channelSpend - channelRevenue).toLocaleString()}/mo wasted`,
      amount: Math.round(waste),
      formula: `(€${channelSpend.toLocaleString()} spend − €${channelRevenue.toLocaleString()} pipeline) × 12 months`,
      methodology:
        "If a paid channel costs more than the pipeline it produces, every euro of the gap is burned. The full diagnostic traces every euro to its source.",
    });
  }

  if (outboundEmails > 0 && outboundMeetingRate >= 0 && outboundMeetingRate < 0.02 && acv > 0) {
    const currentMeetings = outboundEmails * outboundMeetingRate;
    const benchmarkMeetings = outboundEmails * 0.02;
    const missed = benchmarkMeetings - currentMeetings;
    const amount = missed * 0.2 * acv * 12;
    leaks.push({
      name: "Outbound Performance",
      yourValue: `${(outboundMeetingRate * 100).toFixed(2)}% meeting rate`,
      benchmark: "2% meeting rate",
      gap: `${Math.round(missed)} missed meetings/mo`,
      amount: Math.round(amount),
      formula: `${Math.round(missed)} missed meetings/mo × 20% close rate × €${acv.toLocaleString()} ACV × 12 months`,
      methodology:
        "2% email-to-meeting rate is the benchmark for well-targeted B2B outbound. Gap × 20% close × ACV approximates missed pipeline revenue.",
    });
  }

  return leaks;
}

export function RevenueLeakWorkbench() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const hasAnyInput = useMemo(
    () => Object.values(values).some((v) => v !== ""),
    [values]
  );
  const results = useMemo(() => (submitted ? computeLeaks(values) : null), [submitted, values]);
  const totalLeak = results?.reduce((sum, r) => sum + r.amount, 0) ?? 0;
  const responseTimeWarning = parseFloat(values.responseTime) > 100;

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (submitted) setSubmitted(false);
  }

  function reset() {
    setValues(INITIAL);
    setSubmitted(false);
  }

  function renderField(field: FieldConfig) {
    const value = values[field.key] ?? "";
    return (
      <div key={field.key} className="space-y-1.5">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {field.label}
        </label>
        <div className="relative">
          {field.unit === "€" && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">€</span>
          )}
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={value}
            onChange={(e) => setField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={
              field.unit === "€"
                ? "h-9 border-white/[0.08] bg-white/[0.02] pl-7 pr-3 font-mono text-sm"
                : field.unit
                  ? "h-9 border-white/[0.08] bg-white/[0.02] pl-3 pr-10 font-mono text-sm"
                  : "h-9 border-white/[0.08] bg-white/[0.02] px-3 font-mono text-sm"
            }
          />
          {field.unit && field.unit !== "€" && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
        <p className="text-[11px] leading-4 text-muted-foreground">{field.hint}</p>
        {field.key === "responseTime" && responseTimeWarning && (
          <p className="text-[11px] text-amber-400/80">That looks like minutes. This field is in hours.</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Inputs</h2>
          {hasAnyInput && (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Core metrics</p>
            <div className="grid gap-4 sm:grid-cols-2">{CORE_FIELDS.map(renderField)}</div>
          </div>

          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Channel performance · optional
            </p>
            <div className="grid gap-4 sm:grid-cols-2">{ADVANCED_FIELDS.map(renderField)}</div>
          </div>

          <Button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!hasAnyInput}
            className="w-full"
          >
            Run calculation
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Output</h2>
          {results !== null && results.length > 0 && (
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400">
              €{totalLeak.toLocaleString()}/yr
            </span>
          )}
        </div>

        {results === null ? (
          <div className="flex h-full min-h-[260px] flex-col items-start justify-center rounded-md border border-dashed border-white/[0.08] bg-white/[0.01] p-5">
            <p className="text-sm font-medium text-foreground">No calculation run yet.</p>
            <p className="mt-1 max-w-sm text-[13px] leading-5 text-muted-foreground">
              Enter at least one metric on the left, then run the calculation. Output stays empty until inputs exist.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-md border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-sm font-medium text-foreground">No leaks detected with these numbers.</p>
            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
              Your inputs are at or above the benchmarks. Adjust the values to test different scenarios.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                Estimated annual leakage
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
                €{totalLeak.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Across {results.length} leak {results.length === 1 ? "category" : "categories"}.
              </p>
            </div>

            <div className="space-y-2">
              {results.map((leak) => {
                const pct = totalLeak > 0 ? (leak.amount / totalLeak) * 100 : 0;
                return (
                  <details
                    key={leak.name}
                    className="group rounded-md border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.035]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                      <span className="flex min-w-0 items-center gap-3">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-muted-foreground transition-transform group-open:rotate-90">
                          <path d="M3 1.5L7 5L3 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="truncate text-[13px] font-medium text-foreground">{leak.name}</span>
                      </span>
                      <span className="font-mono text-[13px] font-semibold text-emerald-400">
                        €{leak.amount.toLocaleString()}/yr
                      </span>
                    </summary>
                    <div className="border-t border-white/[0.06] px-4 py-4">
                      <div className="mb-3">
                        <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                          <span>Share of total</span>
                          <span className="font-mono text-emerald-400/80">{pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
                          <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <dl className="mb-3 grid grid-cols-1 gap-3 text-[12px] sm:grid-cols-3">
                        <div>
                          <dt className="mb-0.5 text-muted-foreground">Your value</dt>
                          <dd className="font-medium text-foreground">{leak.yourValue}</dd>
                        </div>
                        <div>
                          <dt className="mb-0.5 text-muted-foreground">Benchmark</dt>
                          <dd className="font-medium text-foreground">{leak.benchmark}</dd>
                        </div>
                        <div>
                          <dt className="mb-0.5 text-muted-foreground">Gap</dt>
                          <dd className="font-medium text-emerald-400/90">{leak.gap}</dd>
                        </div>
                      </dl>

                      <div className="mb-3 rounded-sm border border-white/[0.06] bg-black/20 px-3 py-2">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Formula</p>
                        <code className="block font-mono text-[12px] leading-5 text-foreground/80">{leak.formula}</code>
                      </div>

                      <p className="text-[12px] leading-5 text-muted-foreground">{leak.methodology}</p>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
