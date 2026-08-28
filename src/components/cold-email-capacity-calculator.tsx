"use client";

import { useRef, useState, type FormEvent } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { trackEvent } from "@/lib/client-analytics";
import {
  calculateColdEmailCapacity,
  type ColdEmailCapacityInputs,
  type ColdEmailCapacityResult,
} from "@/lib/cold-email-capacity-calculator";

type InputKey = keyof ColdEmailCapacityInputs;
type FormValues = Record<InputKey, string>;

const EMPTY_VALUES: FormValues = {
  dailySends: "",
  sendingDays: "",
  sendsPerMailbox: "",
  mailboxesPerDomain: "",
  dailySequenceStarts: "",
  averageMessagesPerContact: "",
  positiveReplyRate: "",
  bookingRate: "",
  showRate: "",
  qualificationRate: "",
  closeRate: "",
  mailboxMonthlyCost: "",
  domainAnnualCost: "",
  sequencerMonthlyCost: "",
  dataMonthlyCost: "",
  otherMonthlyCost: "",
};

const WORKED_EXAMPLE: FormValues = {
  dailySends: "10000",
  sendingDays: "22",
  sendsPerMailbox: "20",
  mailboxesPerDomain: "3",
  dailySequenceStarts: "4000",
  averageMessagesPerContact: "2.5",
  positiveReplyRate: "0.1",
  bookingRate: "25",
  showRate: "70",
  qualificationRate: "80",
  closeRate: "20",
  mailboxMonthlyCost: "",
  domainAnnualCost: "",
  sequencerMonthlyCost: "",
  dataMonthlyCost: "",
  otherMonthlyCost: "",
};

const FIELD_CLASS = "mt-2 min-h-12 w-full rounded-[10px] border border-white/[0.12] bg-black/20 px-3 py-2.5 font-mono text-sm text-foreground outline-none placeholder:text-foreground/35 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

const CAPACITY_FIELDS: Array<{ key: InputKey; label: string; help: string; min?: string; max?: string; step?: string }> = [
  { key: "dailySends", label: "Total sends per day", help: "Initial emails and follow-ups combined", min: "1" },
  { key: "sendingDays", label: "Sending days per month", help: "Use your actual campaign calendar", min: "1", max: "31" },
  { key: "sendsPerMailbox", label: "Sends per mailbox per day", help: "Your chosen operating limit", min: "1" },
  { key: "mailboxesPerDomain", label: "Mailboxes per domain", help: "Your chosen domain allocation", min: "1" },
  { key: "dailySequenceStarts", label: "New contacts started per day", help: "Total sends ÷ average messages sent per contact", min: "0" },
  { key: "averageMessagesPerContact", label: "Average messages per contact", help: "Initial email plus follow-ups actually sent", min: "1", step: "0.01" },
];

const FUNNEL_FIELDS: Array<{ key: InputKey; label: string; help: string }> = [
  { key: "positiveReplyRate", label: "Positive reply rate", help: "Positive replies ÷ total sends" },
  { key: "bookingRate", label: "Reply-to-booking rate", help: "Meetings booked ÷ positive replies" },
  { key: "showRate", label: "Show rate", help: "Meetings held ÷ meetings booked" },
  { key: "qualificationRate", label: "Qualification rate", help: "Qualified meetings ÷ meetings held" },
  { key: "closeRate", label: "Close rate", help: "Deals ÷ qualified meetings" },
];

const COST_FIELDS: Array<{ key: InputKey; label: string; help: string }> = [
  { key: "mailboxMonthlyCost", label: "Monthly cost per mailbox", help: "Leave empty when unknown" },
  { key: "domainAnnualCost", label: "Annual cost per domain", help: "The calculator divides this by 12" },
  { key: "sequencerMonthlyCost", label: "Monthly sequencer cost", help: "Your written plan price" },
  { key: "dataMonthlyCost", label: "Monthly data and enrichment", help: "Use your own budget" },
  { key: "otherMonthlyCost", label: "Other monthly costs", help: "Monitoring, automation, or labor inside your boundary" },
];

function number(value: string): number {
  return value.trim() === "" ? 0 : Number(value);
}

function buildInputs(values: FormValues): ColdEmailCapacityInputs {
  return {
    dailySends: number(values.dailySends),
    sendingDays: number(values.sendingDays),
    sendsPerMailbox: number(values.sendsPerMailbox),
    mailboxesPerDomain: number(values.mailboxesPerDomain),
    dailySequenceStarts: number(values.dailySequenceStarts),
    averageMessagesPerContact: number(values.averageMessagesPerContact),
    positiveReplyRate: number(values.positiveReplyRate) / 100,
    bookingRate: number(values.bookingRate) / 100,
    showRate: number(values.showRate) / 100,
    qualificationRate: number(values.qualificationRate) / 100,
    closeRate: number(values.closeRate) / 100,
    mailboxMonthlyCost: number(values.mailboxMonthlyCost),
    domainAnnualCost: number(values.domainAnnualCost),
    sequencerMonthlyCost: number(values.sequencerMonthlyCost),
    dataMonthlyCost: number(values.dataMonthlyCost),
    otherMonthlyCost: number(values.otherMonthlyCost),
  };
}

function formatCount(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("en", { maximumFractionDigits }).format(value);
}

function formatMoney(value: number | null): string {
  if (value == null) return "Unavailable";
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
}

function ResultMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-l border-primary/45 pl-4">
      <dt className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/50">{label}</dt>
      <dd className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em] text-foreground md:text-4xl">{value}</dd>
      <p className="mt-2 text-xs leading-5 text-foreground/55">{note}</p>
    </div>
  );
}

export function ColdEmailCapacityCalculator() {
  const resultRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [result, setResult] = useState<ColdEmailCapacityResult | null>(null);
  const [costsEntered, setCostsEntered] = useState(false);
  const [error, setError] = useState("");

  function update(key: InputKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = calculateColdEmailCapacity(buildInputs(values));
    if (!next) {
      setResult(null);
      setError("Enter valid capacity values, rates from 0% to 100%, and non-negative costs. Daily starts multiplied by average messages cannot exceed the daily send cap.");
      return;
    }

    setCostsEntered(COST_FIELDS.some((field) => values[field.key].trim() !== ""));
    setResult(next);
    setError("");
    trackEvent("tool_completed", {
      asset_slug: "cold-email-capacity-calculator",
      lane: "outbound",
      placement: "tool-result",
      path: window.location.pathname,
    });
    window.requestAnimationFrame(() => {
      const output = resultRef.current;
      if (!output) return;
      output.focus({ preventScroll: true });
      output.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function loadWorkedExample() {
    setValues(WORKED_EXAMPLE);
    setResult(null);
    setError("");
  }

  function clear() {
    setValues(EMPTY_VALUES);
    setResult(null);
    setError("");
    setCostsEntered(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#090f16] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
      <div className="grid border-b border-white/[0.08] bg-[linear-gradient(115deg,rgba(63,136,197,0.12),transparent_55%)] px-5 py-6 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Capacity model</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-foreground md:text-3xl">Put your operating assumptions on one page.</h2>
          <p className="mt-3 max-w-[68ch] text-sm leading-6 text-foreground/60">The tool performs arithmetic only. Every rate, limit, and cost comes from you.</p>
        </div>
        <button type="button" onClick={loadWorkedExample} className="mt-5 min-h-11 border border-primary/35 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.13em] text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:mt-0">
          Load worked example
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <form onSubmit={calculate} className="border-b border-white/[0.08] p-5 md:p-8 lg:border-b-0 lg:border-r">
          <fieldset>
            <legend className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">01 · Capacity</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {CAPACITY_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="text-[13px] font-bold text-foreground/80">{field.label}</span>
                  <input className={FIELD_CLASS} name={field.key} type="number" min={field.min} max={field.max} step={field.step ?? "1"} required value={values[field.key]} onChange={(event) => update(field.key, event.target.value)} />
                  <span className="mt-1.5 block text-xs leading-5 text-foreground/50">{field.help}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9 border-t border-white/[0.08] pt-8">
            <legend className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">02 · Funnel assumptions</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {FUNNEL_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="text-[13px] font-bold text-foreground/80">{field.label}</span>
                  <div className="relative">
                    <input className={`${FIELD_CLASS} pr-9`} name={field.key} type="number" min="0" max="100" step="0.01" required value={values[field.key]} onChange={(event) => update(field.key, event.target.value)} />
                    <span className="pointer-events-none absolute right-3 top-[18px] font-mono text-xs text-foreground/45">%</span>
                  </div>
                  <span className="mt-1.5 block text-xs leading-5 text-foreground/50">{field.help}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9 border-t border-white/[0.08] pt-8">
            <legend className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">03 · Optional costs</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {COST_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="text-[13px] font-bold text-foreground/80">{field.label}</span>
                  <input className={FIELD_CLASS} name={field.key} type="number" min="0" step="0.01" value={values[field.key]} onChange={(event) => update(field.key, event.target.value)} />
                  <span className="mt-1.5 block text-xs leading-5 text-foreground/50">{field.help}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className="btn-press inline-flex min-h-12 items-center gap-2 bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
              <Calculator className="size-4" /> Calculate system
            </button>
            <button type="button" onClick={clear} className="inline-flex min-h-12 items-center gap-2 border border-white/[0.14] px-5 py-3 text-sm font-bold text-foreground/70 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <RotateCcw className="size-4" /> Clear
            </button>
          </div>
          {error ? <p role="alert" className="mt-4 text-sm leading-6 text-red-300">{error}</p> : null}
        </form>

        <section ref={resultRef} tabIndex={-1} aria-live="polite" aria-atomic="true" className="scroll-mt-24 bg-[radial-gradient(circle_at_top_right,rgba(63,136,197,0.1),transparent_42%)] p-5 focus:outline-none md:p-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">System output</p>
          {!result ? (
            <div className="mt-7 border-y border-white/[0.08] py-9">
              <p className="max-w-[32ch] text-2xl font-black leading-tight tracking-[-0.025em] text-foreground">No infrastructure number exists until you choose the limits.</p>
              <p className="mt-4 max-w-[46ch] text-sm leading-6 text-foreground/55">Enter the values from your providers and funnel. The result stays on this device.</p>
            </div>
          ) : (
            <>
              <dl className="mt-7 grid gap-7 sm:grid-cols-2">
                <ResultMetric label="Mailboxes" value={formatCount(result.requiredMailboxes)} note="Rounded up to cover the daily send cap" />
                <ResultMetric label="Domains" value={formatCount(result.requiredDomains)} note="Rounded up from your mailbox allocation" />
                <ResultMetric label="Monthly sends" value={formatCount(result.monthlySends)} note="Total messages, including follow-ups" />
                <ResultMetric label="Max daily starts" value={formatCount(result.maxDailySequenceStarts)} note="Daily send cap ÷ average messages per contact" />
                <ResultMetric label="New contacts" value={formatCount(result.monthlyNewContacts)} note="Minimum fresh records needed at this start rate" />
              </dl>

              {result.sequenceCapacityUtilization >= 0.95 ? (
                <div className="mt-8 border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-100">
                  This plan uses {formatCount(result.sequenceCapacityUtilization * 100, 1)}% of the daily send cap. Keep a buffer if retries or sequence behavior can increase the load.
                </div>
              ) : null}

              <div className="mt-8 border-t border-white/[0.08] pt-7">
                <h3 className="text-sm font-black uppercase tracking-[0.14em] text-foreground">Projection from your rates</h3>
                <dl className="mt-4 divide-y divide-white/[0.07]">
                  {[
                    ["Positive replies", result.projectedPositiveReplies],
                    ["Meetings booked", result.projectedMeetingsBooked],
                    ["Meetings held", result.projectedMeetingsHeld],
                    ["Qualified meetings", result.projectedQualifiedMeetings],
                    ["Deals", result.projectedDeals],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-sm text-foreground/60">{label}</dt>
                      <dd className="font-mono text-sm font-bold text-foreground">{formatCount(value as number, 2)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-5 text-foreground/45">These are projections, not promised results.</p>
              </div>

              <div className="mt-8 border-t border-white/[0.08] pt-7">
                <h3 className="text-sm font-black uppercase tracking-[0.14em] text-foreground">Cost boundary</h3>
                {costsEntered ? (
                  <dl className="mt-4 divide-y divide-white/[0.07]">
                    {[
                      ["Monthly mailbox cost", result.mailboxMonthlyCost],
                      ["Monthly domain cost", result.domainMonthlyCost],
                      ["Total monthly cost entered", result.totalMonthlyCost],
                      ["Cost per projected qualified meeting", result.costPerQualifiedMeeting],
                      ["Cost per projected deal", result.costPerProjectedDeal],
                    ].map(([label, value]) => (
                      <div key={label as string} className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-sm text-foreground/60">{label}</dt>
                        <dd className="font-mono text-sm font-bold text-foreground">{formatMoney(value as number | null)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-foreground/55">No costs were entered. The calculator will not invent them.</p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
