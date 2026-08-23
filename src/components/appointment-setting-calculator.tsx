"use client";

import { useMemo, useState, type FormEvent } from "react";
import { trackCalculatorCompletion } from "@/components/acquisition-tracking";
import { calculateAppointmentSettingQuote, type AppointmentSettingQuoteInputs } from "@/lib/appointment-setting-calculator";

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

function Field({
  id,
  label,
  hint,
  value,
  suffix,
  onChange,
}: {
  id: keyof AppointmentSettingQuoteInputs;
  label: string;
  hint: string;
  value: string;
  suffix?: string;
  onChange: (id: keyof AppointmentSettingQuoteInputs, value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 flex items-end justify-between gap-4">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-foreground/80">{label}</span>
        {suffix ? <span className="font-mono text-sm text-primary/70">{suffix}</span> : null}
      </span>
      <span className="relative block">
        <input
          id={id}
          name={id}
          type="number"
          min="0"
          max={suffix === "%" ? "100" : undefined}
          step="any"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          placeholder="Enter your number"
          required
          className="w-full rounded-[3px] border border-white/[0.1] bg-background/70 px-4 py-4 font-mono text-base text-foreground outline-none transition-colors placeholder:text-foreground/25 focus:border-primary/70"
        />
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-foreground/45">{hint}</span>
    </label>
  );
}

export function AppointmentSettingCalculator() {
  const [inputs, setInputs] = useState<AppointmentSettingQuoteInputs>(EMPTY_INPUTS);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [results, setResults] = useState<ReturnType<typeof calculateAppointmentSettingQuote>>(null);
  const [error, setError] = useState("");

  const moneyFormatter = useMemo(
    () => new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency, maximumFractionDigits: 0 }),
    [currency],
  );

  function updateInput(id: keyof AppointmentSettingQuoteInputs, value: string) {
    setInputs((current) => ({ ...current, [id]: value }));
    setResults(null);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextResults = calculateAppointmentSettingQuote(inputs);
    if (!nextResults) {
      setError("Enter valid numbers. Setup, monthly, and held-meeting fees may be 0. Meetings and rates must be above 0. Rates cannot exceed 100.");
      setResults(null);
      return;
    }

    setResults(nextResults);
    setError("");
    trackCalculatorCompletion(currency);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <form onSubmit={submit} className="border border-white/[0.08] bg-card/40 p-6 md:p-9">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-primary">Buyer inputs only</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.02em]">Enter one month of the quote</h2>
          </div>
          <label className="text-sm font-bold uppercase tracking-[0.12em] text-foreground/55">
            Currency
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="ml-3 rounded-[3px] border border-white/[0.1] bg-background px-3 py-2 font-mono text-foreground outline-none focus:border-primary/70"
            >
              {Object.keys(CURRENCIES).map((code) => <option key={code}>{code}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
          <Field id="setupCost" label="Setup cost" hint="One-time amount paid before launch. Enter 0 if there is none." value={inputs.setupCost} suffix={CURRENCIES[currency].symbol} onChange={updateInput} />
          <Field id="monthlyFee" label="Monthly fee" hint="Fixed provider fee for the month. Enter 0 if there is none." value={inputs.monthlyFee} suffix={CURRENCIES[currency].symbol} onChange={updateInput} />
          <Field id="perQualifiedHeldMeetingFee" label="Fee per qualified meeting held" hint="Amount billed after each qualified meeting happens. Enter 0 if there is none." value={inputs.perQualifiedHeldMeetingFee} suffix={CURRENCIES[currency].symbol} onChange={updateInput} />
          <Field id="bookedMeetings" label="Booked meetings" hint="Use the provider's written monthly forecast. Do not guess." value={inputs.bookedMeetings} onChange={updateInput} />
          <Field id="showRate" label="Show rate" hint="Use the provider's forecast or your own measured rate." value={inputs.showRate} suffix="%" onChange={updateInput} />
          <Field id="qualificationRate" label="Qualification rate" hint="Use the provider's written definition and forecast." value={inputs.qualificationRate} suffix="%" onChange={updateInput} />
          <Field id="closeRate" label="Close rate" hint="Share of qualified held meetings that become clients." value={inputs.closeRate} suffix="%" onChange={updateInput} />
          <Field id="dealValue" label="Deal value" hint="Revenue from one new client for the period you evaluate." value={inputs.dealValue} suffix={CURRENCIES[currency].symbol} onChange={updateInput} />
          <Field id="grossMargin" label="Gross margin" hint="Gross profit as a share of deal value." value={inputs.grossMargin} suffix="%" onChange={updateInput} />
        </div>

        {error ? <p role="alert" className="mt-6 text-sm font-semibold text-red-300">{error}</p> : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-press bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-background">
            Calculate the quote
          </button>
          <button
            type="button"
            onClick={() => { setInputs(EMPTY_INPUTS); setResults(null); setError(""); }}
            className="btn-press border border-white/[0.1] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-foreground/65"
          >
            Reset
          </button>
        </div>
      </form>

      <section aria-live="polite" className="lg:sticky lg:top-28">
        <div className="border border-primary/20 bg-primary/[0.035] p-6 md:p-9">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-primary">Quote economics</p>
          {!results ? (
            <div className="flex min-h-[420px] flex-col justify-center py-10">
              <p className="max-w-md text-3xl font-black tracking-[-0.03em] text-foreground/25">No result until you enter your own numbers.</p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/45">There are no industry defaults, assumed close rates, or hidden benchmarks in this calculator.</p>
            </div>
          ) : (
            <div className="mt-7 space-y-3">
              {[
                ["Total provider cost for the month", moneyFormatter.format(results.totalProviderCost)],
                ["Provider cost per qualified meeting held", moneyFormatter.format(results.costPerQualifiedHeldMeeting)],
                ["Provider cost per expected client", moneyFormatter.format(results.expectedCac)],
                ["Break-even close rate", `${(results.breakEvenCloseRate * 100).toFixed(1)}%`],
                ["Estimated contribution after provider cost", moneyFormatter.format(results.expectedGrossProfit)],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/[0.07] bg-background/50 p-5">
                  <p className="text-sm leading-relaxed text-foreground/50">{label}</p>
                  <p className="mt-2 break-words font-mono text-2xl font-black text-foreground tnum">{value}</p>
                </div>
              ))}

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
                <div>
                  <p className="text-sm text-foreground/45">Qualified held meetings</p>
                  <p className="mt-1 font-mono text-lg font-bold tnum">{results.qualifiedHeldMeetings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/45">Expected clients</p>
                  <p className="mt-1 font-mono text-lg font-bold tnum">{results.expectedClients.toFixed(2)}</p>
                </div>
              </div>
              <p className="border-t border-white/[0.07] pt-5 text-sm leading-relaxed text-foreground/42">These estimates use only the numbers you entered. They are not a delivery forecast.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
