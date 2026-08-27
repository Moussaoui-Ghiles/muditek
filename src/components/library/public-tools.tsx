"use client";

import { useRef, useState, type FormEvent } from "react";
import { trackToolCompletion } from "@/components/acquisition-tracking";
import { calculateOutboundFunnel, type OutboundFunnelInputs, type OutboundFunnelResult } from "@/lib/outbound-funnel-calculator";
import { auditCsvList, type CsvListQualityAudit } from "@/lib/csv-list-quality";
import { buildOutboundBrief, type OutboundBriefExport, type OutboundBriefInputs } from "@/lib/outbound-brief";

const FIELD_CLASS = "mt-2 min-h-11 w-full rounded-[10px] border border-white/[0.12] bg-white/[0.035] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/35";
const LABEL_CLASS = "text-[13px] font-bold uppercase tracking-[0.12em] text-foreground/80";
const HELP_CLASS = "mt-1.5 block text-[13px] font-normal normal-case leading-5 tracking-normal text-foreground/65";

const FUNNEL_FIELDS: Array<{ key: keyof OutboundFunnelInputs; label: string; help: string; step: string }> = [
  { key: "entries", label: "Unique prospects emailed", help: "Original cohort entries", step: "1" },
  { key: "accepted", label: "Technically accepted prospects", help: "Mail-server acceptance, not inbox placement", step: "1" },
  { key: "positiveEngagements", label: "Relevant positive replies", help: "Unique prospects", step: "1" },
  { key: "qualifiedConversations", label: "Qualified conversations", help: "Your fixed qualification definition", step: "1" },
  { key: "meetingsBooked", label: "Meetings booked", help: "Unique prospects", step: "1" },
  { key: "meetingsHeld", label: "Meetings held", help: "Not booking clicks", step: "1" },
  { key: "qualifiedOpportunities", label: "Qualified opportunities", help: "Under one definition", step: "1" },
  { key: "customers", label: "Customers", help: "Attributed customers in the cohort", step: "1" },
  { key: "acquisitionCost", label: "Complete acquisition cost", help: "Include data, tools, labor, and management", step: "0.01" },
  { key: "grossProfitPerCustomer", label: "Gross profit per customer", help: "Same currency and stated horizon", step: "0.01" },
];

const INITIAL_FUNNEL: Record<keyof OutboundFunnelInputs, string> = {
  entries: "",
  accepted: "",
  positiveEngagements: "",
  qualifiedConversations: "",
  meetingsBooked: "",
  meetingsHeld: "",
  qualifiedOpportunities: "",
  customers: "",
  acquisitionCost: "",
  grossProfitPerCustomer: "",
};

const RATE_LABELS: Array<[keyof OutboundFunnelResult["rates"], string]> = [
  ["acceptedMessage", "Accepted-message rate"],
  ["positiveReply", "Positive-reply rate"],
  ["qualifiedConversation", "Qualified-conversation rate"],
  ["conversationToBooking", "Conversation-to-booking rate"],
  ["attendance", "Attendance rate"],
  ["opportunity", "Opportunity rate"],
  ["win", "Win rate"],
  ["customer", "Customer rate"],
];

const ECONOMIC_LABELS: Array<[keyof OutboundFunnelResult["economics"], string]> = [
  ["costPerHeldMeeting", "Cost per held meeting"],
  ["costPerQualifiedOpportunity", "Cost per qualified opportunity"],
  ["customerAcquisitionCost", "Customer acquisition cost"],
  ["realizedGrossProfit", "Realized gross profit"],
  ["grossContributionAfterAcquisition", "Gross contribution after acquisition"],
  ["breakEvenCustomers", "Customers needed to recover acquisition cost"],
];

function formatRate(value: number | null): string {
  return value == null ? "Unavailable" : `${(value * 100).toFixed(2)}%`;
}

function formatNumber(value: number | null): string {
  return value == null ? "Unavailable" : new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
}

export function OutboundFunnelCalculator() {
  const [values, setValues] = useState(INITIAL_FUNNEL);
  const [result, setResult] = useState<OutboundFunnelResult | null>(null);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputs = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)])) as unknown as OutboundFunnelInputs;
    const next = calculateOutboundFunnel(inputs);
    if (!next) {
      setResult(null);
      setError("Use non-negative whole stage counts in descending order. Cost can include decimals. Gross profit per customer must be above zero.");
      return;
    }
    setError("");
    setResult(next);
    trackToolCompletion("outbound-funnel-economics-calculator");
  }

  function updateValue(key: keyof OutboundFunnelInputs, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError("");
  }

  function reset() {
    setValues(INITIAL_FUNNEL);
    setResult(null);
    setError("");
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <form onSubmit={submit} className="min-w-0 rounded-xl border border-white/[0.08] bg-card/55 p-5 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {FUNNEL_FIELDS.map((field) => (
            <div key={field.key}>
              <label htmlFor={`funnel-${field.key}`} className={LABEL_CLASS}>{field.label}</label>
              <input
                id={`funnel-${field.key}`}
                name={field.key}
                className={FIELD_CLASS}
                type="number"
                min="0"
                step={field.step}
                inputMode="decimal"
                autoComplete="off"
                required
                value={values[field.key]}
                onChange={(event) => updateValue(field.key, event.target.value)}
              />
              <span className={HELP_CLASS}>{field.help}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="submit" className="min-h-12 bg-primary px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">Calculate cohort</button>
          <button type="button" onClick={reset} className="min-h-12 border border-white/[0.14] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/75 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear</button>
        </div>
        {error ? <p role="alert" className="mt-4 text-sm leading-6 text-red-300">{error}</p> : null}
      </form>

      <section aria-live="polite" aria-atomic="true" className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-8">
        <h2 className="text-2xl font-black tracking-[-0.02em]">Cohort result</h2>
        {!result ? <p className="mt-4 text-sm leading-6 text-foreground/60">Enter one fixed cold-email cohort. Unknowns remain empty until the relevant denominator exists.</p> : (
          <>
            <h3 className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-primary">Funnel rates</h3>
            <dl className="mt-3 divide-y divide-white/[0.06]">
              {RATE_LABELS.map(([key, label]) => <div key={key} className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-foreground/65">{label}</dt><dd className="font-mono text-sm font-bold text-foreground">{formatRate(result.rates[key])}</dd></div>)}
            </dl>
            <h3 className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-primary">Economics</h3>
            <dl className="mt-3 divide-y divide-white/[0.06]">
              {ECONOMIC_LABELS.map(([key, label]) => <div key={key} className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-foreground/65">{label}</dt><dd className="font-mono text-sm font-bold text-foreground">{formatNumber(result.economics[key])}</dd></div>)}
            </dl>
          </>
        )}
      </section>
    </div>
  );
}

function isCsvAudit(value: ReturnType<typeof auditCsvList>): value is CsvListQualityAudit {
  return "rowCount" in value;
}

export function CsvListQualityAuditor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<CsvListQualityAudit | null>(null);
  const [error, setError] = useState("");

  async function selectFile(file: File | undefined) {
    setResult(null);
    setError("");
    setFileName(file?.name ?? "");
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Use a CSV smaller than 10 MB so the browser can review it safely.");
      return;
    }

    const audit = auditCsvList(await file.text());
    if (!isCsvAudit(audit)) {
      setError(audit.error);
      return;
    }
    setResult(audit);
    trackToolCompletion("csv-list-quality-auditor");
  }

  const metrics = result ? [
    ["Rows", result.rowCount],
    ["Duplicate emails", result.duplicateRows],
    ["Missing titles", result.missingTitles],
    ["Invalid domains", result.invalidDomains],
    ["Unverified rows", result.unverifiedRows],
    ["Missing ICP checks", result.missingIcpChecks],
    ["Rejected by ICP", result.rejectedByIcp],
  ] as const : [];

  function reset() {
    setFileName("");
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <section className="min-w-0 rounded-xl border border-white/[0.08] bg-card/55 p-6 md:p-8">
        <h2 className="text-2xl font-black tracking-[-0.02em]">Choose a CSV</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/65">Required columns: email, title, domain, verification, and ICP. Common header aliases are accepted.</p>
        <label className="mt-7 block rounded-xl border border-dashed border-white/[0.18] bg-white/[0.025] p-7 text-center focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/35">
          <span className="block text-sm font-black uppercase tracking-[0.14em] text-foreground">Select CSV file</span>
          <span className="mt-2 block text-[13px] text-foreground/65">The browser reads it locally. Maximum 10 MB.</span>
          <input ref={fileInputRef} id="csv-list-file" name="csv-list-file" type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => void selectFile(event.target.files?.[0])} />
        </label>
        {fileName ? <p className="mt-4 break-all font-mono text-xs text-foreground/55">{fileName}</p> : null}
        {error ? <p role="alert" className="mt-4 text-sm leading-6 text-red-300">{error}</p> : null}
        {fileName || result || error ? <button type="button" onClick={reset} className="mt-5 min-h-11 border border-white/[0.14] px-5 text-sm font-bold text-foreground/75 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear file</button> : null}
      </section>

      <section aria-live="polite" className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-6 md:p-8">
        <h2 className="text-2xl font-black tracking-[-0.02em]">Quality checks</h2>
        {!result ? <p className="mt-4 text-sm leading-6 text-foreground/60">No CSV has been reviewed on this device.</p> : (
          <>
            <p className={`mt-4 text-sm font-bold ${result.passed ? "text-emerald-300" : "text-amber-300"}`}>{result.passed ? "All five checks passed." : "Review the flagged rows before sending."}</p>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
              {metrics.map(([label, value]) => <div key={label} className="bg-[#0b1117] p-4"><dt className="text-xs text-foreground/55">{label}</dt><dd className="mt-1 font-mono text-2xl font-bold text-foreground">{value}</dd></div>)}
            </dl>
            {result.issues.length > 0 ? <p className="mt-5 text-xs leading-5 text-foreground/55">Flagged row numbers: {Array.from(new Set(result.issues.map((issue) => issue.rowNumber))).join(", ")}. No row content was stored or sent.</p> : null}
          </>
        )}
      </section>
    </div>
  );
}

const BRIEF_FIELDS: Array<{ key: keyof OutboundBriefInputs; label: string; multiline?: boolean; required?: boolean; help: string }> = [
  { key: "name", label: "Brief name (optional)", help: "A stable name for this motion" },
  { key: "decision", label: "Decision this brief must inform", multiline: true, required: true, help: "The specific test or commercial decision" },
  { key: "offer", label: "Offer", multiline: true, required: true, help: "Result, method, terms, and first commitment" },
  { key: "companyFit", label: "Company fit", multiline: true, required: true, help: "Positive fit and operating context" },
  { key: "buyerRoles", label: "Buyer roles", multiline: true, help: "One per line or comma-separated" },
  { key: "geography", label: "Geography", multiline: true, help: "One per line or comma-separated" },
  { key: "signals", label: "Buyer signals", multiline: true, help: "Observable facts, not inferred problems" },
  { key: "exclusions", label: "Exclusions", multiline: true, help: "Current clients, competitors, and hard disqualifiers" },
  { key: "qualification", label: "Qualification", multiline: true, help: "Authority, problem, timing, and other fixed rules" },
  { key: "proof", label: "Approved proof", multiline: true, help: "Only claims supported by the claim ledger" },
  { key: "channels", label: "Channels", multiline: true, help: "One per line or comma-separated" },
  { key: "constraints", label: "Constraints", multiline: true, help: "Consent, volume, timing, or operational limits" },
];

const INITIAL_BRIEF = Object.fromEntries(BRIEF_FIELDS.map((field) => [field.key, ""])) as unknown as OutboundBriefInputs;

function downloadExport(fileName: string, value: string, type: string) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function OutboundBriefBuilder() {
  const [values, setValues] = useState(INITIAL_BRIEF);
  const [result, setResult] = useState<OutboundBriefExport | null>(null);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = buildOutboundBrief(values);
    if (!next) {
      setError("Decision, offer, and company fit are required.");
      setResult(null);
      return;
    }
    setError("");
    setResult(next);
    trackToolCompletion("outbound-brief-builder");
  }

  function updateValue(key: keyof OutboundBriefInputs, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError("");
  }

  function reset() {
    setValues(INITIAL_BRIEF);
    setResult(null);
    setError("");
  }

  return (
    <div className="grid min-w-0 max-w-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <form onSubmit={submit} className="min-w-0 max-w-full rounded-xl border border-white/[0.08] bg-card/55 p-5 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {BRIEF_FIELDS.map((field) => (
            <div key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
              <label htmlFor={`brief-${field.key}`} className={LABEL_CLASS}>{field.label}</label>
              {field.multiline ? (
                <textarea id={`brief-${field.key}`} name={field.key} autoComplete="off" className={`${FIELD_CLASS} min-h-28 resize-y`} required={field.required} value={values[field.key]} onChange={(event) => updateValue(field.key, event.target.value)} />
              ) : (
                <input id={`brief-${field.key}`} name={field.key} autoComplete="off" className={FIELD_CLASS} required={field.required} value={values[field.key]} onChange={(event) => updateValue(field.key, event.target.value)} />
              )}
              <span className={HELP_CLASS}>{field.help}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="submit" className="min-h-12 bg-primary px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background">Build brief</button>
          <button type="button" onClick={reset} className="min-h-12 border border-white/[0.14] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/75 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear</button>
        </div>
        {error ? <p role="alert" className="mt-4 text-sm text-red-300">{error}</p> : null}
      </form>

      <section aria-live="polite" className="min-w-0 max-w-full rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-8">
        <h2 className="text-2xl font-black tracking-[-0.02em]">Portable inputs</h2>
        {!result ? <p className="mt-4 text-sm leading-6 text-foreground/60">Build once, then download the same normalized inputs as Markdown or JSON.</p> : (
          <>
            <p className="mt-4 text-sm leading-6 text-foreground/65">The brief is ready. Its content remains in this browser until you download it.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button type="button" onClick={() => downloadExport("outbound-brief.md", result.markdown, "text/markdown;charset=utf-8")} className="min-h-11 border border-white/[0.14] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-foreground hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">Download Markdown</button>
              <button type="button" onClick={() => downloadExport("outbound-brief.json", result.json, "application/json;charset=utf-8")} className="min-h-11 border border-white/[0.14] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-foreground hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">Download JSON</button>
            </div>
            <pre className="mt-6 max-h-[520px] w-full max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-white/[0.08] bg-[#080c11] p-4 text-xs leading-6 text-foreground/75"><code>{result.markdown}</code></pre>
          </>
        )}
      </section>
    </div>
  );
}
