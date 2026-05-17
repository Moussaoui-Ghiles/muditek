"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
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
        "OpenView SaaS Benchmarks, HubSpot State of Sales: 20-25% demo-to-close range, midpoint 22%. Each pp gap × deal volume × deal size = quantifiable lost revenue.",
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
        "Bessemer Cloud Index / SaaS Capital: best-in-class B2B SaaS holds ~0.5% monthly churn. Excess churn compounds against the whole MRR base.",
    });
  }

  if (channelSpend > 0 && channelRevenue >= 0 && channelSpend > channelRevenue) {
    const waste = (channelSpend - channelRevenue) * 12;
    leaks.push({
      name: "Lead Source ROI",
      yourValue: `€${channelSpend.toLocaleString()}/mo spend to €${channelRevenue.toLocaleString()}/mo pipeline`,
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

function LeakLedgerRow({ leak, total, index }: { leak: LeakResult; total: number; index: number }) {
  const [open, setOpen] = useState(false);
  const pct = total > 0 ? (leak.amount / total) * 100 : 0;

  return (
    <div
      className="group relative isolate overflow-hidden rounded-lg border border-white/[0.06] bg-[#0e0e10]/80 transition-colors hover:border-white/[0.12]"
      style={{ animation: `wbReveal 380ms ease-out ${index * 60}ms both` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left"
      >
        <span
          aria-hidden
          className="h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-emerald-300/80 via-emerald-400/70 to-emerald-500/40"
          style={{ opacity: Math.max(0.35, pct / 100) }}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="truncate text-[14px] font-medium tracking-tight text-foreground">
              {leak.name}
            </span>
          </span>
          <span className="mt-1.5 flex items-center gap-2">
            <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.04]">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-300/70"
                style={{ width: `${pct}%`, transition: "width 600ms ease-out" }}
              />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
              {pct.toFixed(0)}%
            </span>
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block font-[var(--font-serif-display)] text-[22px] leading-none tracking-tight text-foreground">
            €{leak.amount.toLocaleString()}
          </span>
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            /year
          </span>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/[0.05] px-4 py-4">
            <dl className="mb-3 grid grid-cols-1 gap-x-6 gap-y-3 text-[12.5px] sm:grid-cols-3">
              <div>
                <dt className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Your value
                </dt>
                <dd className="font-medium text-foreground">{leak.yourValue}</dd>
              </div>
              <div>
                <dt className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Benchmark
                </dt>
                <dd className="font-medium text-foreground">{leak.benchmark}</dd>
              </div>
              <div>
                <dt className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Gap
                </dt>
                <dd className="font-medium text-emerald-300">{leak.gap}</dd>
              </div>
            </dl>

            <div className="mb-3 rounded-md border border-white/[0.06] bg-black/40 px-3 py-2.5">
              <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
                Formula
              </p>
              <code className="block font-mono text-[12px] leading-5 text-foreground/85">
                {leak.formula}
              </code>
            </div>

            <p className="text-[12.5px] italic leading-6 text-muted-foreground">
              {leak.methodology}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RevenueLeakWorkbench() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasAnyInput = useMemo(
    () => Object.values(values).some((v) => v !== ""),
    [values]
  );
  const results = useMemo(() => (submitted ? computeLeaks(values) : null), [submitted, values]);
  const totalLeak = results?.reduce((sum, r) => sum + r.amount, 0) ?? 0;
  const responseTimeWarning = parseFloat(values.responseTime) > 100;
  const filledCount = useMemo(
    () => Object.values(values).filter((v) => v !== "").length,
    [values]
  );

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (submitted) setSubmitted(false);
  }

  function reset() {
    setValues(INITIAL);
    setSubmitted(false);
    setShowAdvanced(false);
  }

  function renderField(field: FieldConfig) {
    const value = values[field.key] ?? "";
    const filled = value !== "";
    return (
      <div key={field.key} className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {field.label}
          </label>
          {filled && (
            <span aria-hidden className="size-1 rounded-full bg-emerald-400" />
          )}
        </div>
        <div className="relative">
          {field.unit === "€" && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[13px] text-muted-foreground/80">
              €
            </span>
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
                ? "h-10 border-white/[0.08] bg-black/30 pl-8 pr-3 font-mono text-[14px] tabular-nums tracking-tight transition-colors focus-visible:border-emerald-400/40 focus-visible:bg-black/50"
                : field.unit
                  ? "h-10 border-white/[0.08] bg-black/30 pl-3 pr-12 font-mono text-[14px] tabular-nums tracking-tight transition-colors focus-visible:border-emerald-400/40 focus-visible:bg-black/50"
                  : "h-10 border-white/[0.08] bg-black/30 px-3 font-mono text-[14px] tabular-nums tracking-tight transition-colors focus-visible:border-emerald-400/40 focus-visible:bg-black/50"
            }
          />
          {field.unit && field.unit !== "€" && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
        <p className="text-[11.5px] leading-5 text-muted-foreground/80">{field.hint}</p>
        {field.key === "responseTime" && responseTimeWarning && (
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-amber-300/90">
            Looks like minutes. This field reads hours.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes wbReveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes wbTotal {
          from { opacity: 0; transform: translateY(12px) scale(0.985); letter-spacing: -0.02em; }
          to { opacity: 1; transform: none; letter-spacing: -0.03em; }
        }
      `}</style>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* INPUT RAIL */}
        <section className="relative isolate overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e0e10] p-6 md:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(80% 60% at 100% 0%, rgba(255,255,255,0.04), transparent 60%)",
            }}
          />

          <div className="mb-7 flex items-end justify-between gap-3 border-b border-white/[0.06] pb-5">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <span aria-hidden className="h-px w-6 bg-primary/50" />
                01 · Inputs
              </p>
              <h3 className="mt-3 text-[26px] font-black leading-[1] tracking-[-0.02em] text-foreground md:text-[30px]">
                Your <span className="text-primary italic font-medium">numbers.</span>
              </h3>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
                Filled
              </div>
              <div className="font-mono text-[14px] tabular-nums text-foreground">
                {filledCount}
                <span className="text-muted-foreground/70">
                  /{CORE_FIELDS.length + ADVANCED_FIELDS.length}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">{CORE_FIELDS.map(renderField)}</div>

            <div className="border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-between gap-2 text-left"
                aria-expanded={showAdvanced}
              >
                <div>
                  <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/55">
                    <span aria-hidden className="h-px w-6 bg-white/15" />
                    02 · Channels · optional
                  </p>
                  <div className="mt-2 text-[12.5px] text-foreground/65">
                    Add channel + outbound numbers for two extra leak categories.
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[10.5px] font-black uppercase tracking-[0.22em] transition-colors ${
                    showAdvanced ? "text-emerald-300" : "text-foreground/55"
                  }`}
                >
                  {showAdvanced ? "Hide" : "Add"}
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ${
                  showAdvanced ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-5 sm:grid-cols-2">{ADVANCED_FIELDS.map(renderField)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={reset}
                disabled={!hasAnyInput && !submitted}
                className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.22em] text-foreground/55 transition-colors hover:text-foreground disabled:opacity-40"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={!hasAnyInput}
                className="group/run btn-press relative inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-foreground px-8 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-background disabled:cursor-not-allowed disabled:bg-white/[0.04] disabled:text-foreground/40"
              >
                <span className="relative z-10 inline-flex items-center gap-3">
                  Run calculation
                  <ArrowRight className="size-3.5 transition-transform group-hover/run:translate-x-0.5" />
                </span>
                <span className="absolute inset-0 z-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover/run:w-full" />
              </button>
            </div>
          </div>
        </section>

        {/* OUTPUT */}
        <section className="relative isolate overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0c] p-6 md:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
            style={{
              background:
                results && results.length > 0
                  ? "radial-gradient(70% 50% at 80% 0%, rgba(16,185,129,0.16), transparent 60%), radial-gradient(50% 40% at 0% 100%, rgba(16,185,129,0.06), transparent 60%)"
                  : "radial-gradient(60% 50% at 80% 0%, rgba(255,255,255,0.03), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
          />

          <div className="mb-7 flex items-end justify-between gap-3 border-b border-white/[0.06] pb-5">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
                <span aria-hidden className="h-px w-6 bg-emerald-400/50" />
                03 · Output
              </p>
              <h3 className="mt-3 text-[26px] font-black leading-[1] tracking-[-0.02em] text-foreground md:text-[30px]">
                The <span className="text-emerald-300 italic font-medium">diagnosis.</span>
              </h3>
            </div>
            {results !== null && results.length > 0 && (
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                {results.length} leak{results.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {results === null ? (
            <div className="flex min-h-[360px] flex-col">
              <div className="flex flex-1 flex-col justify-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/70">
                  Waiting for input
                </div>
                <p className="mt-3 max-w-[28ch] font-[var(--font-serif-display)] text-[28px] italic leading-[1.15] text-foreground/95 md:text-[32px]">
                  Enter your numbers. The numbers will answer.
                </p>
                <p className="mt-4 max-w-[42ch] text-[12.5px] leading-6 text-muted-foreground">
                  Output stays empty until you run the calculation. Nothing is faked. Every euro you
                  see is derived from your real inputs and the cited benchmark.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-1.5 opacity-60">
                {[14, 22, 18, 26, 12].map((h, i) => (
                  <div key={i} className="relative h-16 overflow-hidden rounded-md bg-white/[0.025]">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-md bg-white/[0.06]"
                      style={{ height: `${h * 3}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/70">
                <span>Speed</span>
                <span>Pipe</span>
                <span>Churn</span>
                <span>Spend</span>
                <span>Out.</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="flex min-h-[360px] flex-col justify-center">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/80">
                <Sparkles className="size-3" />
                No leaks
              </div>
              <p className="mt-3 max-w-[34ch] font-[var(--font-serif-display)] text-[28px] italic leading-[1.15] text-foreground/95">
                Clean.
              </p>
              <p className="mt-4 max-w-[44ch] text-[12.5px] leading-6 text-muted-foreground">
                Your inputs are at or above every benchmark this calculator checks. If your intuition
                disagrees, the full diagnostic looks at signals this tool can&apos;t see.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6 border-b border-white/[0.06] pb-6">
                <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  <span aria-hidden className="h-px w-6 bg-primary/50" />
                  Estimated annual leakage
                </p>
                <div
                  key={totalLeak}
                  className="mt-3 flex items-baseline gap-1 drop-shadow-[0_0_40px_rgba(245,158,11,0.16)]"
                  style={{ animation: "wbTotal 600ms ease-out both" }}
                >
                  <span className="font-[family-name:var(--font-serif-display)] text-[48px] italic leading-none tracking-tight text-primary md:text-[64px]">
                    €
                  </span>
                  <span className="font-mono text-[48px] font-black leading-none tabular-nums tracking-[-0.03em] text-foreground md:text-[64px]">
                    {totalLeak.toLocaleString()}
                  </span>
                  <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/55">
                    /yr
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] text-foreground/65">
                  Across {results.length} leak {results.length === 1 ? "category" : "categories"} ·
                  Based on your real inputs.
                </p>
              </div>

              <div className="space-y-2.5">
                {results.map((leak, i) => (
                  <LeakLedgerRow key={leak.name} leak={leak} total={totalLeak} index={i} />
                ))}
              </div>

              <p className="mt-6 text-[11.5px] leading-5 text-muted-foreground/80">
                These are euro estimates from published benchmarks. The full diagnostic uses your
                actual CRM and Stripe data to find leaks this calculator can&apos;t detect.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
