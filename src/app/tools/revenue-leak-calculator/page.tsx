"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

interface LeakResult {
  name: string;
  yourValue: string;
  benchmark: string;
  gap: string;
  amount: number;
  formula: string;
  methodology: string;
}

const LEAK_CATEGORIES = [
  { num: "01", name: "Speed-to-Lead", desc: "Research shows conversion drops 80% when response exceeds 5 minutes (InsideSales.com / Harvard Business Review). We calculate the revenue impact of every minute of delay on your inbound pipeline." },
  { num: "02", name: "Pipeline Conversion", desc: "B2B SaaS demo-to-close benchmarks sit at 20-25% (OpenView SaaS Benchmarks). Every percentage point below benchmark, multiplied by your deal volume and ACV, becomes visible lost revenue." },
  { num: "03", name: "Revenue Churn", desc: "Best-in-class B2B SaaS maintains ~0.5% monthly churn (6% annual). Excess churn above this compounds against your entire MRR base, month after month." },
  { num: "04", name: "Lead Source ROI", desc: "Most B2B SaaS companies run 2-4 paid channels without attribution. If a channel costs more than it produces in pipeline, every euro spent there is money burned." },
  { num: "05", name: "Outbound Performance", desc: "Outbound meeting rates benchmark at 2% for well-targeted B2B campaigns. Below that, you're paying to send emails nobody responds to — and missing the meetings that would have closed." },
];

export default function RevenueLeakCalculatorPage() {
  const [mrr, setMrr] = useState("");
  const [leads, setLeads] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [closeRate, setCloseRate] = useState("");
  const [churnRate, setChurnRate] = useState("");
  const [acv, setAcv] = useState("");
  const [channelSpend, setChannelSpend] = useState("");
  const [channelRevenue, setChannelRevenue] = useState("");
  const [outboundEmails, setOutboundEmails] = useState("");
  const [outboundMeetingRate, setOutboundMeetingRate] = useState("");
  const [results, setResults] = useState<LeakResult[] | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const hasAnyInput = [mrr, leads, responseTime, closeRate, churnRate, acv, channelSpend, channelRevenue, outboundEmails, outboundMeetingRate].some(v => v !== "");
  const responseTimeWarning = parseFloat(responseTime) > 100;

  function calculate() {
    const mrrVal = parseFloat(mrr) || 0;
    const leadsVal = parseFloat(leads) || 0;
    const responseHrs = parseFloat(responseTime) || 0;
    const closeRateVal = (parseFloat(closeRate) || 0) / 100;
    const churnRateVal = (parseFloat(churnRate) || 0) / 100;
    const acvVal = parseFloat(acv) || 0;
    const channelSpendVal = parseFloat(channelSpend) || 0;
    const channelRevenueVal = parseFloat(channelRevenue) || 0;
    const outboundEmailsVal = parseFloat(outboundEmails) || 0;
    const outboundMeetingRateVal = (parseFloat(outboundMeetingRate) || 0) / 100;

    const leaks: LeakResult[] = [];

    // 1. Speed-to-lead leak
    if (responseHrs > 0.083) {
      const amount = leadsVal * acvVal * 0.8 * 0.1;
      leaks.push({
        name: "Speed-to-Lead",
        yourValue: `${responseHrs}h response time`,
        benchmark: "< 5 minutes",
        gap: `${(responseHrs * 60).toFixed(0)} min vs 5 min`,
        amount: Math.round(amount * 12),
        formula: `${leadsVal} leads/mo × €${acvVal.toLocaleString()} ACV × 80% conversion decay × 10% recovery rate × 12 months`,
        methodology: "Based on InsideSales.com research: responding after 5 minutes drops conversion rates by 80%. The 10% recovery rate is a conservative estimate of deals recoverable with faster response systems.",
      });
    }

    // 2. Pipeline conversion leak
    if (closeRateVal < 0.22 && closeRateVal > 0) {
      const annualOpportunities = leadsVal * 12;
      const amount = (0.22 - closeRateVal) * annualOpportunities * acvVal;
      leaks.push({
        name: "Pipeline Conversion",
        yourValue: `${(closeRateVal * 100).toFixed(1)}% close rate`,
        benchmark: "22% (B2B SaaS benchmark)",
        gap: `${((0.22 - closeRateVal) * 100).toFixed(1)} percentage points below benchmark`,
        amount: Math.round(amount),
        formula: `(22% − ${(closeRateVal * 100).toFixed(1)}%) × ${annualOpportunities.toLocaleString()} annual opportunities × €${acvVal.toLocaleString()} ACV`,
        methodology: "Benchmark: 20-25% demo-to-close rate for B2B SaaS (OpenView SaaS Benchmarks, HubSpot State of Sales). We use 22% as the midpoint. Each percentage point gap × your deal volume × deal size = quantifiable lost revenue.",
      });
    }

    // 3. Churn leak
    if (churnRateVal > 0.005) {
      const amount = (churnRateVal - 0.005) * mrrVal * 12;
      leaks.push({
        name: "Revenue Churn",
        yourValue: `${(churnRateVal * 100).toFixed(1)}% monthly churn`,
        benchmark: "0.5% monthly (6% annual)",
        gap: `${((churnRateVal - 0.005) * 100).toFixed(1)}% excess monthly churn`,
        amount: Math.round(amount),
        formula: `(${(churnRateVal * 100).toFixed(1)}% − 0.5%) × €${mrrVal.toLocaleString()} MRR × 12 months`,
        methodology: "Benchmark: best-in-class B2B SaaS maintains ~0.5% monthly churn (~6% annual). Sources: Bessemer Cloud Index, SaaS Capital annual survey. Excess churn above this baseline compounds against your entire MRR base.",
      });
    }

    // 4. Lead Source ROI leak
    if (channelSpendVal > 0 && channelRevenueVal >= 0 && channelSpendVal > channelRevenueVal) {
      const waste = (channelSpendVal - channelRevenueVal) * 12;
      leaks.push({
        name: "Lead Source ROI",
        yourValue: `€${channelSpendVal.toLocaleString()}/mo spend → €${channelRevenueVal.toLocaleString()}/mo pipeline`,
        benchmark: "Spend < pipeline generated",
        gap: `€${(channelSpendVal - channelRevenueVal).toLocaleString()}/mo wasted`,
        amount: Math.round(waste),
        formula: `(€${channelSpendVal.toLocaleString()} spend − €${channelRevenueVal.toLocaleString()} pipeline) × 12 months`,
        methodology: "If a paid channel costs more than the pipeline it produces, every euro of the gap is burned money. Most B2B SaaS companies run 2-4 channels without proper revenue attribution — the diagnostic traces every euro to its source.",
      });
    }

    // 5. Outbound performance leak
    if (outboundEmailsVal > 0 && outboundMeetingRateVal < 0.02 && outboundMeetingRateVal >= 0) {
      const currentMeetings = outboundEmailsVal * outboundMeetingRateVal;
      const benchmarkMeetings = outboundEmailsVal * 0.02;
      const missedMeetings = benchmarkMeetings - currentMeetings;
      const amount = missedMeetings * 0.2 * acvVal * 12;
      leaks.push({
        name: "Outbound Performance",
        yourValue: `${(outboundMeetingRateVal * 100).toFixed(1)}% meeting rate`,
        benchmark: "2% meeting rate",
        gap: `${Math.round(missedMeetings)} missed meetings/mo`,
        amount: Math.round(amount),
        formula: `${Math.round(missedMeetings)} missed meetings/mo × 20% close rate × €${acvVal.toLocaleString()} ACV × 12 months`,
        methodology: "Benchmark: 2% email-to-meeting rate for well-targeted B2B outbound. The gap between your rate and benchmark = missed meetings. Applied at your close rate (or 20% industry average) × ACV to estimate missed pipeline revenue.",
      });
    }

    setResults(leaks);
  }

  function recalculate() {
    setResults(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const totalLeak = results?.reduce((sum, r) => sum + r.amount, 0) ?? 0;

  const coreFields = [
    { label: "Monthly Recurring Revenue (MRR)", value: mrr, setter: setMrr, unit: "€", placeholder: "50000", hint: "Total monthly recurring revenue before churn" },
    { label: "Inbound Leads per Month", value: leads, setter: setLeads, unit: "", placeholder: "100", hint: "Inbound demos, trials, or qualified inquiries per month" },
    { label: "Avg. Response Time to Leads", value: responseTime, setter: setResponseTime, unit: "hours", placeholder: "8", hint: "Average time from form submission to first human reply" },
    { label: "Demo-to-Close Rate", value: closeRate, setter: setCloseRate, unit: "%", placeholder: "12", hint: "Percentage of demos or trials that become paying customers" },
    { label: "Monthly Revenue Churn Rate", value: churnRate, setter: setChurnRate, unit: "%", placeholder: "3", hint: "Percentage of MRR lost each month to cancellations" },
    { label: "Average Deal Size (ACV)", value: acv, setter: setAcv, unit: "€", placeholder: "8000", hint: "Average annual value of a closed deal" },
  ];

  const advancedFields = [
    { label: "Worst Channel: Monthly Spend", value: channelSpend, setter: setChannelSpend, unit: "€", placeholder: "2500", hint: "Monthly spend on your lowest-performing paid channel" },
    { label: "Worst Channel: Monthly Pipeline", value: channelRevenue, setter: setChannelRevenue, unit: "€", placeholder: "800", hint: "Monthly pipeline revenue attributed to that channel" },
    { label: "Outbound Emails per Month", value: outboundEmails, setter: setOutboundEmails, unit: "", placeholder: "2000", hint: "Total outbound prospecting emails sent per month" },
    { label: "Outbound Meeting Rate", value: outboundMeetingRate, setter: setOutboundMeetingRate, unit: "%", placeholder: "0.5", hint: "Percentage of outbound emails that result in a booked meeting" },
  ];

  function renderField(field: typeof coreFields[0]) {
    return (
      <div key={field.label}>
        <label className="block text-sm font-bold tracking-[0.1em] uppercase text-foreground/60 mb-2">
          {field.label}
        </label>
        <div className="relative">
          {field.unit === "€" && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 text-sm font-mono">€</span>
          )}
          <input
            type="number"
            min="0"
            step="any"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
            className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-[2px] py-3 text-sm font-mono text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/40 transition-colors ${field.unit === "€" ? "pl-9 pr-4" : field.unit ? "pl-4 pr-14" : "pl-4 pr-4"}`}
          />
          {field.unit && field.unit !== "€" && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 text-sm font-mono">{field.unit}</span>
          )}
        </div>
        <p className="text-sm text-foreground/50 mt-1.5">{field.hint}</p>
        {field.label.includes("Response") && responseTimeWarning && (
          <p className="text-sm text-amber-400/80 mt-1">That looks like minutes. This field is in hours.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-emerald-500/20 flex flex-col items-center">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[900px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-emerald-400 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-emerald-400/50" />
                Muditek / Free Tool
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-8 text-balance">
              Revenue Leak <span className="text-emerald-400 italic font-medium">Calculator</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl mb-4">
              Enter your numbers. See where your B2B SaaS pipeline is leaking revenue across 5 categories, each with the formula and methodology shown.
            </p>
            <p className="text-sm text-foreground/50 font-mono tracking-wider">
              No email required. Results shown instantly. Benchmarks sourced from OpenView, HubSpot, Bessemer, and InsideSales.com.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* What We Measure */}
      <section className="pb-16 w-full flex justify-center">
        <div className="max-w-[900px] w-full px-6 md:px-12">
          <ScrollReveal delay={200}>
            <h3 className="text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-6">5 Leak Categories We Measure</h3>
            <div className="space-y-3">
              {LEAK_CATEGORIES.map((cat) => (
                <div key={cat.num} className="border border-white/[0.05] bg-card/[0.2] p-5 rounded-[4px] flex gap-5 items-start">
                  <span className="text-lg font-black text-foreground/[0.1] shrink-0 font-mono">{cat.num}</span>
                  <div>
                    <h4 className="text-sm font-black tracking-[0.1em] uppercase text-emerald-400/80 mb-1">{cat.name}</h4>
                    <p className="text-sm text-foreground/60 font-light leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-32 w-full flex justify-center">
        <div className="max-w-[900px] w-full px-6 md:px-12">
          <div ref={formRef}>
            <ScrollReveal delay={240}>
              <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl p-8 md:p-12">
                {/* Core fields */}
                <h3 className="text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-8">Core Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {coreFields.map(renderField)}
                </div>

                {/* Advanced fields */}
                <div className="border-t border-white/[0.05] pt-8 mb-10">
                  <h3 className="text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-2">Channel Performance</h3>
                  <p className="text-sm text-foreground/50 mb-6">Optional. Leave blank to skip these leak categories.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {advancedFields.map(renderField)}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={!hasAnyInput}
                  className={`w-full py-4 font-black text-sm uppercase tracking-[0.2em] rounded-[2px] transition-all btn-press ${
                    hasAnyInput
                      ? "bg-emerald-500 text-background hover:scale-[1.01]"
                      : "bg-white/[0.05] text-foreground/30 cursor-not-allowed"
                  }`}
                >
                  Calculate Revenue Leakage
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Results */}
          {results !== null && (
            <div className="mt-8 border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl p-8 md:p-12">
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-black text-foreground mb-4">No leaks detected with these numbers</h3>
                  <p className="text-base text-foreground/60 font-light max-w-lg mx-auto mb-8">
                    Your metrics are at or above benchmark. If this doesn&apos;t match your intuition, the diagnostic uses your actual CRM and Stripe data for a deeper analysis.
                  </p>
                  <button onClick={recalculate} className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.15em]">
                    Adjust Numbers
                  </button>
                </div>
              ) : (
                <>
                  {/* Total */}
                  <div className="text-center mb-12 pb-10 border-b border-white/[0.05]">
                    <span className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400/80 block mb-3">Estimated Annual Revenue Leakage</span>
                    <span className="text-5xl md:text-7xl font-black text-foreground font-mono tracking-tight stat-glow">
                      €{totalLeak.toLocaleString()}
                    </span>
                    <span className="text-base text-foreground/50 font-light block mt-3">/year across {results.length} leak {results.length === 1 ? "category" : "categories"}</span>
                  </div>

                  {/* Per-category breakdown */}
                  <h4 className="text-sm font-black tracking-[0.25em] uppercase text-foreground/50 mb-6">Breakdown by Category</h4>
                  <div className="space-y-6">
                    {results.map((leak) => {
                      const pct = totalLeak > 0 ? (leak.amount / totalLeak) * 100 : 0;
                      return (
                        <div key={leak.name} className="border border-white/[0.05] bg-white/[0.01] p-6 md:p-8 rounded-[4px]">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h5 className="text-base font-black tracking-[0.1em] uppercase text-foreground">{leak.name}</h5>
                            <span className="text-xl font-black font-mono text-emerald-400 shrink-0">
                              €{leak.amount.toLocaleString()}/yr
                            </span>
                          </div>

                          {/* Contribution bar */}
                          <div className="mb-5">
                            <div className="flex justify-between text-sm text-foreground/50 mb-1.5">
                              <span>Share of total leakage</span>
                              <span className="font-mono font-bold text-emerald-400/70">{pct.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-foreground/50 block mb-1">Your number</span>
                              <span className="text-foreground/80 font-medium">{leak.yourValue}</span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block mb-1">Benchmark</span>
                              <span className="text-foreground/80 font-medium">{leak.benchmark}</span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block mb-1">Gap</span>
                              <span className="text-emerald-400/80 font-medium">{leak.gap}</span>
                            </div>
                          </div>

                          {/* Formula */}
                          <div className="bg-white/[0.02] border border-white/[0.04] rounded-[2px] p-4 mb-3">
                            <span className="text-sm text-foreground/50 font-mono block mb-1">Formula</span>
                            <code className="text-sm text-foreground/60 font-mono block">{leak.formula}</code>
                          </div>

                          {/* Methodology */}
                          <details className="group">
                            <summary className="text-sm text-foreground/50 cursor-pointer hover:text-foreground/60 transition-colors flex items-center gap-2">
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-open:rotate-90 transition-transform">
                                <path d="M3 1.5L7 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              How we calculated this
                            </summary>
                            <p className="text-sm text-foreground/50 font-light leading-relaxed mt-2 pl-5">{leak.methodology}</p>
                          </details>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recalculate */}
                  <div className="mt-8 text-center">
                    <button onClick={recalculate} className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.15em]">
                      Adjust Numbers
                    </button>
                  </div>
                </>
              )}

              {/* CTA */}
              <div className="mt-12 pt-10 border-t border-white/[0.05]">
                <p className="text-base text-foreground/60 font-light leading-relaxed mb-2">
                  This is an estimate based on published industry benchmarks. The full diagnostic uses your actual CRM and Stripe data to find every leak with exact euro amounts and formulas — including leaks this calculator can&apos;t detect.
                </p>
                <p className="text-sm text-foreground/50 font-mono tracking-wider mb-8">
                  If we can&apos;t find €50K in annual leakage, you pay nothing.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-10 py-5 bg-emerald-500 text-background font-black text-sm uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform btn-press"
                  >
                    Book Your Diagnostic
                  </a>
                  <a
                    href="https://muditek.beehiiv.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-5 border border-white/[0.1] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press"
                  >
                    Subscribe to B2B Agents
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
