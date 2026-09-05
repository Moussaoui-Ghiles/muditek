"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { calendlyUrl } from "@/lib/booking";
import {
  BOOKING_BUDGETS,
  BOOKING_DEAL_VALUES,
  BOOKING_DECISIONS,
  BOOKING_OFFERS,
  BOOKING_ROLES,
  BOOKING_SOURCES,
  BOOKING_TEAM_SIZES,
  BOOKING_TIMINGS,
} from "@/lib/booking-requests";
import { trackEvent } from "@/lib/client-analytics";

const OUTBOUND = new Set<string>(["outbound-done-for-you", "outbound-coaching", "ma-origination"]);

type Status = "idle" | "sending" | "done" | "error";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-bold text-foreground mb-2">
        {label}
        {hint ? <span className="block mt-0.5 text-sm font-normal text-foreground/65">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-bold text-primary" role="alert">{error}</p>
      ) : null}
    </div>
  );
}

function Select({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Choose one",
  required = true,
}: {
  id: string;
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <select
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field field-select"
    >
      <option value="" disabled={required}>{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function BookForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [role, setRole] = useState("");
  const [offer, setOffer] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [problem, setProblem] = useState("");
  const [closer, setCloser] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [timing, setTiming] = useState("");
  const [decision, setDecision] = useState("");
  const [budget, setBudget] = useState("");
  const [foundVia, setFoundVia] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [page, setPage] = useState<string | null>(null);

  const doneRef = useRef<HTMLDivElement>(null);
  const outbound = OUTBOUND.has(offer);

  useEffect(() => {
    try {
      const from = new URLSearchParams(window.location.search).get("from");
      if (from) {
        setPage(from.slice(0, 200));
        return;
      }
      if (document.referrer) {
        const ref = new URL(document.referrer);
        if (ref.origin === window.location.origin) setPage(ref.pathname.slice(0, 200));
      }
    } catch {
      /* no referrer, nothing to record */
    }
  }, []);

  useEffect(() => {
    if (status === "done") doneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setFormError("");
    setFieldErrors({});

    const honeypot = (e.currentTarget.elements.namedItem("company_fax") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, website, role, offer, teamSize, problem,
          closer: outbound ? closer : null,
          dealValue: outbound ? dealValue : null,
          timing, decision, budget,
          foundVia: foundVia || null,
          newsletter, page, company_fax: honeypot,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
      if (!res.ok) {
        if (data.field) {
          setFieldErrors({ [data.field]: data.error ?? "Check this answer." });
          document.getElementById(data.field)?.focus();
        } else {
          setFormError(data.error ?? "Could not send. Try again.");
        }
        setStatus("error");
        return;
      }
      trackEvent("book_request", { offer, timing, decision });
      setStatus("done");
    } catch {
      setFormError("No connection. Try again, or email biz@ghiless.com.");
      setStatus("error");
    }
  }

  if (status === "done") {
    const firstName = name.trim().split(/\s+/)[0] || "";
    const embed = calendlyUrl({ name, email, embed: true });
    const tab = calendlyUrl({ name, email });
    return (
      <div ref={doneRef} className="scroll-mt-32">
        <div className="panel mb-6">
          <div className="panel-bar"><span>answers saved</span><span className="panel-amber">step 2 of 2</span></div>
          <div className="panel-body font-sans">
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] leading-[1] text-foreground mb-3">
              {firstName ? `Done, ${firstName}. ` : "Done. "}Pick a time.
            </h2>
            <p className="text-base text-foreground/80 leading-relaxed max-w-[52ch]">
              Your answers are in the inbox and get read before the call. The calendar below is prefilled with your name and email.
            </p>
          </div>
        </div>
        <iframe
          src={embed}
          title="Pick a time for the call"
          className="w-full h-[760px] rounded-[4px] border border-white/[0.08] bg-card"
          loading="eager"
        />
        <p className="mt-4 text-sm text-foreground/65">
          Calendar not loading?{" "}
          <a href={tab} target="_blank" rel="noopener noreferrer" className="text-foreground font-bold underline underline-offset-4 decoration-primary/60 hover:text-primary">Open it in a new tab</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="space-y-12">
      <input type="text" name="company_fax" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset className="space-y-6">
        <legend className="text-2xl font-black tracking-[-0.02em] text-foreground mb-6">You</legend>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field id="name" label="Name" error={fieldErrors.name}>
            <input id="name" name="name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="First and last" />
          </Field>
          <Field id="email" label="Work email" error={fieldErrors.email}>
            <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@company.com" />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field id="website" label="Company website" error={fieldErrors.website}>
            <input id="website" name="website" type="text" inputMode="url" required autoComplete="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="field" placeholder="company.com" />
          </Field>
          <Field id="role" label="Your role" error={fieldErrors.role}>
            <Select id="role" name="role" options={BOOKING_ROLES} value={role} onChange={setRole} />
          </Field>
        </div>
        <Field id="teamSize" label="People in the company" error={fieldErrors.teamSize}>
          <Select id="teamSize" name="teamSize" options={BOOKING_TEAM_SIZES} value={teamSize} onChange={setTeamSize} />
        </Field>
      </fieldset>

      <fieldset className="space-y-6 border-t border-white/[0.08] pt-10">
        <legend className="sr-only">What you need</legend>
        <p className="text-2xl font-black tracking-[-0.02em] text-foreground">What the call is about</p>
        <div role="radiogroup" aria-labelledby="offer-label" className="grid gap-2">
          <span id="offer-label" className="sr-only">Pick one</span>
          {BOOKING_OFFERS.map((o) => (
            <label key={o.value} className="choice">
              <input type="radio" name="offer" value={o.value} required checked={offer === o.value} onChange={() => setOffer(o.value)} />
              <span className="choice-mark" aria-hidden />
              <span className="min-w-0">
                <span className="block text-base font-bold text-foreground">{o.label}</span>
                <span className="block text-sm text-foreground/70">{o.note}</span>
              </span>
            </label>
          ))}
          {fieldErrors.offer ? <p className="text-sm font-bold text-primary" role="alert">{fieldErrors.offer}</p> : null}
        </div>

        {outbound ? (
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <Field id="closer" label="Who takes the meetings?" hint="Name and title of the person who will sit in them." error={fieldErrors.closer}>
              <input id="closer" name="closer" type="text" required value={closer} onChange={(e) => setCloser(e.target.value)} className="field" placeholder="Jane Doe, Head of Sales" />
            </Field>
            <Field id="dealValue" label="What is one new client worth to you?" hint="First-year value, in your currency." error={fieldErrors.dealValue}>
              <Select id="dealValue" name="dealValue" options={BOOKING_DEAL_VALUES} value={dealValue} onChange={setDealValue} />
            </Field>
          </div>
        ) : null}

        <Field
          id="problem"
          label={outbound ? "Who do you sell to, and what does a good meeting look like?" : "What is broken today?"}
          hint={outbound ? "Industry, company size, geography, the title you want in the room." : "The work that piles up, who does it, which tools it lives in."}
          error={fieldErrors.problem}
        >
          <textarea id="problem" name="problem" required minLength={20} rows={5} value={problem} onChange={(e) => setProblem(e.target.value)} className="field resize-y min-h-[140px]" placeholder="Two or three sentences is plenty." />
        </Field>
      </fieldset>

      <fieldset className="space-y-6 border-t border-white/[0.08] pt-10">
        <legend className="sr-only">Fit</legend>
        <p className="text-2xl font-black tracking-[-0.02em] text-foreground">Timing and budget</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field id="timing" label="When do you want to start?" error={fieldErrors.timing}>
            <Select id="timing" name="timing" options={BOOKING_TIMINGS} value={timing} onChange={setTiming} />
          </Field>
          <Field id="decision" label="Who signs off?" error={fieldErrors.decision}>
            <Select id="decision" name="decision" options={BOOKING_DECISIONS} value={decision} onChange={setDecision} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field id="budget" label="Is there a budget for this?" error={fieldErrors.budget}>
            <Select id="budget" name="budget" options={BOOKING_BUDGETS} value={budget} onChange={setBudget} />
          </Field>
          <Field id="foundVia" label="Where did you find Muditek?" hint="Optional.">
            <Select id="foundVia" name="foundVia" options={BOOKING_SOURCES} value={foundVia} onChange={setFoundVia} placeholder="Pick one, or skip" required={false} />
          </Field>
        </div>

        <label className="check">
          <input type="checkbox" name="newsletter" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
          <span className="check-mark" aria-hidden />
          <span className="text-sm text-foreground/80 leading-relaxed">Also send me the newsletter. One working system per issue, unsubscribe in one click.</span>
        </label>
      </fieldset>

      <div className="border-t border-white/[0.08] pt-8">
        {formError ? <p className="mb-4 text-sm font-bold text-primary" role="alert">{formError}</p> : null}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:opacity-60 disabled:cursor-wait">
            {status === "sending" ? "Saving your answers" : "Continue to pick a time"}
            <svg className="btn-icon" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p className="text-sm text-foreground/60 max-w-[36ch]">The calendar opens on the next step. Nothing here is shared or sold.</p>
        </div>
      </div>
    </form>
  );
}
