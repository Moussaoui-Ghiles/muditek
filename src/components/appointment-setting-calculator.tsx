"use client";

import { useMemo, useState, type FormEvent } from "react";
import { trackCalculatorCompletion, trackToolStart } from "@/components/acquisition-tracking";
import { calculateAppointmentSettingQuote, type AppointmentSettingQuoteInputs } from "@/lib/appointment-setting-calculator";
import { auditQuoteContract, QUOTE_AUDIT_ITEMS } from "@/lib/tools/later/diagnostics";

const EMPTY_INPUTS: AppointmentSettingQuoteInputs = {
  setupCost: "",
  monthlyFee: "",
  perQualifiedHeldMeetingFee: "",
  bookedMeetings: "",
  showRate: "",
  qualificationRate: "",
  closeRate: "",
  dealValue: "",
  grossMargin: "",
};

const CURRENCIES = {
  EUR: { symbol: "€", locale: "en-IE" },
  USD: { symbol: "$", locale: "en-US" },
  GBP: { symbol: "£", locale: "en-GB" },
} as const;

type Currency = keyof typeof CURRENCIES;
type FieldErrors = Partial<Record<keyof AppointmentSettingQuoteInputs, string>>;

const COST_FIELDS = new Set<keyof AppointmentSettingQuoteInputs>([
  "setupCost",
  "monthlyFee",
  "perQualifiedHeldMeetingFee",
]);

const RATE_FIELDS = new Set<keyof AppointmentSettingQuoteInputs>([
  "showRate",
  "qualificationRate",
  "closeRate",
  "grossMargin",
]);

const FIELD_LABELS: Record<keyof AppointmentSettingQuoteInputs, string> = {
  setupCost: "setup cost",
  monthlyFee: "monthly fee",
  perQualifiedHeldMeetingFee: "fee per qualified meeting held",
  bookedMeetings: "booked meetings",
  showRate: "show rate",
  qualificationRate: "qualification rate",
  closeRate: "close rate",
  dealValue: "deal value",
  grossMargin: "gross margin",
};

function validateInputs(inputs: AppointmentSettingQuoteInputs) {
  const errors: FieldErrors = {};

  (Object.keys(inputs) as Array<keyof AppointmentSettingQuoteInputs>).forEach((id) => {
    const rawValue = inputs[id].trim();
    const label = FIELD_LABELS[id];
    if (!rawValue) {
      errors[id] = `Enter the ${label}.`;
      return;
    }

    const value = Number(rawValue);
    if (!Number.isFinite(value)) {
      errors[id] = `Enter a valid ${label}.`;
      return;
    }

    if (COST_FIELDS.has(id) && value < 0) {
      errors[id] = `${label[0].toUpperCase()}${label.slice(1)} cannot be negative.`;
      return;
    }

    if (RATE_FIELDS.has(id) && (value <= 0 || value > 100)) {
      errors[id] = `${label[0].toUpperCase()}${label.slice(1)} must be above 0% and no more than 100%.`;
      return;
    }

    if (!COST_FIELDS.has(id) && !RATE_FIELDS.has(id) && value <= 0) {
      errors[id] = `${label[0].toUpperCase()}${label.slice(1)} must be above zero.`;
    }
  });

  return errors;
}

function Field({
  id,
  label,
  hint,
  value,
  unit,
  error,
  onChange,
}: {
  id: keyof AppointmentSettingQuoteInputs;
  label: string;
  hint: string;
  value: string;
  unit?: string;
  error?: string;
  onChange: (id: keyof AppointmentSettingQuoteInputs, value: string) => void;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 flex items-center justify-between gap-4 text-sm font-bold text-white">
        <span>{label}</span>
        {unit ? <span className="font-semibold text-foreground/60">{unit}</span> : null}
      </span>
      <input
        id={id}
        name={id}
        type="number"
        min={COST_FIELDS.has(id) ? "0" : "0.01"}
        max={unit === "%" ? "100" : undefined}
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
        placeholder="Enter your number"
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        aria-invalid={error ? true : undefined}
        className={`min-h-14 w-full rounded-[8px] border bg-[#050b10] px-4 text-base font-semibold text-white outline-none transition-colors placeholder:text-foreground/55 focus:ring-3 ${error ? "border-red-300/70 focus:border-red-300 focus:ring-red-300/20" : "border-white/18 focus:border-primary focus:ring-primary/25"}`}
      />
      <span id={hintId} className="mt-2 block text-sm leading-6 text-foreground/62">{hint}</span>
      {error ? <span id={errorId} className="mt-1 block text-sm font-semibold leading-6 text-red-200">{error}</span> : null}
    </label>
  );
}

export function AppointmentSettingCalculator() {
  const [inputs, setInputs] = useState<AppointmentSettingQuoteInputs>(EMPTY_INPUTS);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [results, setResults] = useState<ReturnType<typeof calculateAppointmentSettingQuote>>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const moneyFormatter = useMemo(
    () => new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency, maximumFractionDigits: 0 }),
    [currency],
  );

  function updateInput(id: keyof AppointmentSettingQuoteInputs, value: string) {
    setInputs((current) => ({ ...current, [id]: value }));
    setResults(null);
    setError("");
    setFieldErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackToolStart("appointment-setting-quote-calculator");
    const nextErrors = validateInputs(inputs);
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Correct the marked fields, then calculate again.");
      setResults(null);
      const firstInvalid = (Object.keys(inputs) as Array<keyof AppointmentSettingQuoteInputs>).find((id) => nextErrors[id]);
      if (firstInvalid) requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }

    const nextResults = calculateAppointmentSettingQuote(inputs);
    if (!nextResults) {
      setError("The quote could not be calculated from these values. Check the marked fields.");
      setResults(null);
      return;
    }
    setResults(nextResults);
    setError("");
    setFieldErrors({});
    trackCalculatorCompletion(currency);
  }

  return (<>
    <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
      <form onSubmit={submit} noValidate className="border-t border-white/18 pt-7">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.02em] text-white">Enter the quote</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/62">Every field stays blank until you enter the provider&apos;s numbers or your own measured rates.</p>
          </div>
          <label className="text-sm font-bold text-white">
            Currency
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="ml-3 min-h-11 rounded-[8px] border border-white/18 bg-[#050b10] px-3 text-white outline-none focus:border-primary focus:ring-3 focus:ring-primary/25"
            >
              {Object.keys(CURRENCIES).map((code) => <option key={code}>{code}</option>)}
            </select>
          </label>
        </div>

        <fieldset className="border-t border-white/12 py-8">
          <legend className="pr-5 text-lg font-bold text-white">Provider quote</legend>
          <div className="grid gap-x-6 gap-y-7 md:grid-cols-3">
            <Field id="setupCost" label="Setup cost" hint="One-time cost paid before launch. Enter 0 if none." value={inputs.setupCost} unit={CURRENCIES[currency].symbol} error={fieldErrors.setupCost} onChange={updateInput} />
            <Field id="monthlyFee" label="Monthly fee" hint="Fixed provider cost for the first month. Enter 0 if none." value={inputs.monthlyFee} unit={CURRENCIES[currency].symbol} error={fieldErrors.monthlyFee} onChange={updateInput} />
            <Field id="perQualifiedHeldMeetingFee" label="Fee per qualified meeting held" hint="Amount charged after each qualified meeting happens." value={inputs.perQualifiedHeldMeetingFee} unit={CURRENCIES[currency].symbol} error={fieldErrors.perQualifiedHeldMeetingFee} onChange={updateInput} />
          </div>
        </fieldset>

        <fieldset className="border-t border-white/12 py-8">
          <legend className="pr-5 text-lg font-bold text-white">Delivery assumptions</legend>
          <div className="grid gap-x-6 gap-y-7 md:grid-cols-3">
            <Field id="bookedMeetings" label="Booked meetings" hint="Use the provider's written monthly forecast." value={inputs.bookedMeetings} error={fieldErrors.bookedMeetings} onChange={updateInput} />
            <Field id="showRate" label="Show rate" hint="Use the provider's forecast or your measured rate." value={inputs.showRate} unit="%" error={fieldErrors.showRate} onChange={updateInput} />
            <Field id="qualificationRate" label="Qualification rate" hint="Share of held meetings that clear the written rule." value={inputs.qualificationRate} unit="%" error={fieldErrors.qualificationRate} onChange={updateInput} />
          </div>
        </fieldset>

        <fieldset className="border-y border-white/12 py-8">
          <legend className="pr-5 text-lg font-bold text-white">Your economics</legend>
          <div className="grid gap-x-6 gap-y-7 md:grid-cols-3">
            <Field id="closeRate" label="Close rate" hint="Share of qualified held meetings that become clients." value={inputs.closeRate} unit="%" error={fieldErrors.closeRate} onChange={updateInput} />
            <Field id="dealValue" label="Deal value" hint="Revenue from one new client for the period you are evaluating." value={inputs.dealValue} unit={CURRENCIES[currency].symbol} error={fieldErrors.dealValue} onChange={updateInput} />
            <Field id="grossMargin" label="Gross margin" hint="Gross profit as a share of the deal value." value={inputs.grossMargin} unit="%" error={fieldErrors.grossMargin} onChange={updateInput} />
          </div>
        </fieldset>

        {error ? <p role="alert" className="mt-6 border border-red-300/40 bg-red-400/8 p-4 text-sm font-semibold leading-6 text-red-200">{error}</p> : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-14 rounded-[2px] bg-primary px-7 text-sm font-extrabold text-background focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white">
            Calculate the quote
          </button>
          <button
            type="button"
            onClick={() => {
              setInputs(EMPTY_INPUTS);
              setResults(null);
              setError("");
              setFieldErrors({});
              requestAnimationFrame(() => document.getElementById("setupCost")?.focus());
            }}
            className="min-h-14 rounded-[2px] border border-white/22 px-7 text-sm font-bold text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary"
          >
            Clear all fields
          </button>
        </div>
      </form>

      <section aria-live="polite" className="border-t border-primary/55 bg-[#081721] px-6 py-8 md:px-8 xl:sticky xl:top-24">
        <h2 className="text-2xl font-black tracking-[-0.02em] text-white">Quote result</h2>
        {!results ? (
          <div className="flex min-h-[360px] flex-col justify-center py-10">
            <p className="max-w-[430px] text-3xl font-black leading-[1.12] tracking-[-0.025em] text-foreground/42">Your result appears after you enter all nine inputs.</p>
            <p className="mt-5 max-w-[440px] leading-7 text-foreground/62">No industry defaults or hidden benchmarks are used.</p>
          </div>
        ) : (
          <dl className="mt-7 border-t border-white/16">
            {[
              ["First-month cost", moneyFormatter.format(results.totalProviderCost)],
              ["Cost per qualified held meeting", moneyFormatter.format(results.costPerQualifiedHeldMeeting)],
              ["Break-even close rate", `${(results.breakEvenCloseRate * 100).toFixed(1)}%`],
              ["Expected gross profit after provider cost", moneyFormatter.format(results.expectedGrossProfit)],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-white/16 py-6">
                <dt className="text-sm leading-6 text-foreground/62">{label}</dt>
                <dd className="mt-2 break-words text-3xl font-black tracking-[-0.025em] text-white">{value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-6 border-b border-white/16 py-6">
              <div>
                <dt className="text-sm leading-6 text-foreground/62">Qualified held meetings</dt>
                <dd className="mt-2 text-xl font-bold text-white">{results.qualifiedHeldMeetings.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm leading-6 text-foreground/62">Expected clients</dt>
                <dd className="mt-2 text-xl font-bold text-white">{results.expectedClients.toFixed(2)}</dd>
              </div>
            </div>
            <p className="pt-6 text-sm leading-6 text-foreground/58">This is a calculation from your inputs. It is not a delivery forecast.</p>
          </dl>
        )}
      </section>
    </div>
    <QuoteContractAudit />
  </>);
}

function QuoteContractAudit() {
  const [checked, setChecked] = useState(() => QUOTE_AUDIT_ITEMS.map(() => false));
  const missing = auditQuoteContract(checked);
  return (
    <section className="mt-12 border-t border-white/18 pt-8" aria-labelledby="quote-contract-audit-title">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id="quote-contract-audit-title" className="text-2xl font-black tracking-[-0.02em] text-white">Quote and contract audit</h2>
          <p className="mt-3 max-w-[70ch] text-sm leading-6 text-foreground/62">Mark only terms that are written in the provider&apos;s quote or contract. The checklist does not infer missing terms.</p>
          <fieldset className="mt-6 grid gap-3">
            <legend className="sr-only">Written quote and contract terms</legend>
            {QUOTE_AUDIT_ITEMS.map((item, index) => (
              <label key={item} className="flex min-h-12 items-start gap-3 border border-white/12 p-3 text-sm leading-6 text-foreground/75">
                <input type="checkbox" className="mt-1" checked={checked[index]} onChange={(event) => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} />
                {item}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="border-t border-primary/55 bg-[#081721] p-6 md:p-8" aria-live="polite">
          <h3 className="text-xl font-black text-white">Terms still missing</h3>
          {missing.length === 0 ? <p className="mt-5 text-sm leading-6 text-emerald-200">All eight items are stated. Verify the wording and economics before signing.</p> : <><p className="mt-4 text-sm leading-6 text-foreground/62">{missing.length} of {QUOTE_AUDIT_ITEMS.length} items are not marked as written.</p><ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-foreground/72">{missing.map((item) => <li key={item}>{item}</li>)}</ul></>}
        </div>
      </div>
    </section>
  );
}
