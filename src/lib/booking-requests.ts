import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from "@/lib/newsletter";

type Sql = ReturnType<typeof getDb>;

export const BOOKING_OFFERS = [
  { value: "ai-transformation", label: "AI transformation", note: "Audit, systems built for you, coaching for the team" },
  { value: "outbound-done-for-you", label: "Outbound, built and run for you", note: "Signal-based cold email and LinkedIn, paid per meeting held" },
  { value: "outbound-coaching", label: "Outbound coaching for our team", note: "Same system, installed into the people you already have" },
  { value: "ma-origination", label: "M&A origination", note: "Owner meetings for advisors, brokers, and buyers" },
  { value: "not-sure", label: "Not sure yet", note: "You describe the problem, we say which one fits, or neither" },
] as const;

export const BOOKING_ROLES = [
  { value: "founder", label: "Founder or CEO" },
  { value: "revenue", label: "Sales or revenue lead" },
  { value: "operations", label: "COO or operations lead" },
  { value: "advisor", label: "M&A advisor, broker, or investor" },
  { value: "other", label: "Something else" },
] as const;

export const BOOKING_TEAM_SIZES = [
  { value: "solo", label: "Just me" },
  { value: "2-10", label: "2 to 10 people" },
  { value: "11-50", label: "11 to 50 people" },
  { value: "51-200", label: "51 to 200 people" },
  { value: "200+", label: "More than 200 people" },
] as const;

export const BOOKING_DEAL_VALUES = [
  { value: "under-5k", label: "Under 5k" },
  { value: "5k-25k", label: "5k to 25k" },
  { value: "25k-100k", label: "25k to 100k" },
  { value: "100k+", label: "More than 100k" },
] as const;

export const BOOKING_TIMINGS = [
  { value: "this-month", label: "This month" },
  { value: "this-quarter", label: "This quarter" },
  { value: "later", label: "Later this year" },
  { value: "exploring", label: "No date. Exploring." },
] as const;

export const BOOKING_DECISIONS = [
  { value: "yes", label: "Yes, I sign off on this" },
  { value: "shared", label: "I decide with a partner or a board" },
  { value: "no", label: "No, I am researching for someone else" },
] as const;

export const BOOKING_BUDGETS = [
  { value: "approved", label: "Yes, approved" },
  { value: "if-clear", label: "Yes, if the case is clear" },
  { value: "none", label: "Not yet" },
] as const;

export const BOOKING_SOURCES = [
  { value: "newsletter", label: "The newsletter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "search", label: "Search" },
  { value: "referral", label: "Someone sent me" },
  { value: "meetingsheld", label: "meetingsheld.com" },
  { value: "other", label: "Somewhere else" },
] as const;

type OptionValue<T extends readonly { value: string }[]> = T[number]["value"];

export interface BookingRequestInput {
  name: string;
  email: string;
  website: string;
  role: OptionValue<typeof BOOKING_ROLES>;
  offer: OptionValue<typeof BOOKING_OFFERS>;
  teamSize: OptionValue<typeof BOOKING_TEAM_SIZES>;
  problem: string;
  closer: string | null;
  dealValue: OptionValue<typeof BOOKING_DEAL_VALUES> | null;
  timing: OptionValue<typeof BOOKING_TIMINGS>;
  decision: OptionValue<typeof BOOKING_DECISIONS>;
  budget: OptionValue<typeof BOOKING_BUDGETS>;
  foundVia: OptionValue<typeof BOOKING_SOURCES> | null;
  newsletter: boolean;
  page: string | null;
}

export type BookingFit = "strong" | "possible" | "weak";

const OUTBOUND_OFFERS = new Set<string>(["outbound-done-for-you", "outbound-coaching", "ma-origination"]);

/**
 * Same checklist the go/no-go decision uses: a real company, a decision maker,
 * a date, a budget, and on outbound a deal size that makes a paid meeting
 * obviously worth it. The score sorts the inbox; it never blocks the booking.
 */
export function scoreBookingFit(input: BookingRequestInput): BookingFit {
  let points = 0;
  if (input.decision === "yes") points += 2;
  else if (input.decision === "shared") points += 1;
  if (input.timing === "this-month" || input.timing === "this-quarter") points += 2;
  else if (input.timing === "later") points += 1;
  if (input.budget === "approved") points += 2;
  else if (input.budget === "if-clear") points += 1;

  const solo = input.teamSize === "solo";
  const outbound = OUTBOUND_OFFERS.has(input.offer);
  if (outbound) {
    if (input.dealValue === "under-5k") return "weak";
    if (input.dealValue === "25k-100k" || input.dealValue === "100k+") points += 1;
    if (input.closer && input.closer.trim().length > 1) points += 1;
  } else if (solo && input.offer === "ai-transformation") {
    return "weak";
  }

  if (input.decision === "no" && input.timing === "exploring") return "weak";
  if (points >= 6) return "strong";
  if (points >= 3) return "possible";
  return "weak";
}

function isOption<T extends readonly { value: string }[]>(list: T, value: unknown): value is OptionValue<T> {
  return typeof value === "string" && list.some((o) => o.value === value);
}

function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function cleanBlock(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, max) : "";
}

export function normalizeWebsite(raw: string): string | null {
  let value = raw.trim().toLowerCase();
  if (!value) return null;
  if (!/^https?:\/\//.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    if (!url.hostname.includes(".")) return null;
    return `${url.protocol}//${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return null;
  }
}

export type ParseResult = { ok: true; input: BookingRequestInput } | { ok: false; error: string; field: string };

export function parseBookingRequest(body: Record<string, unknown>): ParseResult {
  const name = cleanText(body.name, 120);
  if (name.length < 2) return { ok: false, error: "Your name, so the call has one.", field: "name" };

  const email = cleanText(body.email, 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "A working email address.", field: "email" };

  const website = normalizeWebsite(cleanText(body.website, 200));
  if (!website) return { ok: false, error: "The company website, like company.com.", field: "website" };

  if (!isOption(BOOKING_ROLES, body.role)) return { ok: false, error: "Pick the role closest to yours.", field: "role" };
  if (!isOption(BOOKING_OFFERS, body.offer)) return { ok: false, error: "Pick what the call is about.", field: "offer" };
  if (!isOption(BOOKING_TEAM_SIZES, body.teamSize)) return { ok: false, error: "Pick a team size.", field: "teamSize" };

  const problem = cleanBlock(body.problem, 3000);
  if (problem.length < 20) return { ok: false, error: "Two or three sentences on what is broken today.", field: "problem" };

  const outbound = OUTBOUND_OFFERS.has(body.offer);
  let closer: string | null = null;
  let dealValue: BookingRequestInput["dealValue"] = null;
  if (outbound) {
    closer = cleanText(body.closer, 200) || null;
    if (!closer) return { ok: false, error: "Who takes the meetings once they are booked.", field: "closer" };
    if (!isOption(BOOKING_DEAL_VALUES, body.dealValue)) return { ok: false, error: "Pick the closest band.", field: "dealValue" };
    dealValue = body.dealValue;
  }

  if (!isOption(BOOKING_TIMINGS, body.timing)) return { ok: false, error: "Pick when you want to start.", field: "timing" };
  if (!isOption(BOOKING_DECISIONS, body.decision)) return { ok: false, error: "Say who signs off.", field: "decision" };
  if (!isOption(BOOKING_BUDGETS, body.budget)) return { ok: false, error: "Say where the budget stands.", field: "budget" };

  const foundVia = isOption(BOOKING_SOURCES, body.foundVia) ? body.foundVia : null;
  const newsletter = body.newsletter === true || body.newsletter === "true" || body.newsletter === "on";
  const page = cleanText(body.page, 200) || null;

  return {
    ok: true,
    input: { name, email, website, role: body.role, offer: body.offer, teamSize: body.teamSize, problem, closer, dealValue, timing: body.timing, decision: body.decision, budget: body.budget, foundVia, newsletter, page },
  };
}

export async function ensureBookingRequestSchema(sql: Sql = getDb()) {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`
    CREATE TABLE IF NOT EXISTS booking_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT NOT NULL,
      role TEXT NOT NULL,
      offer TEXT NOT NULL,
      team_size TEXT NOT NULL,
      problem TEXT NOT NULL,
      closer TEXT,
      deal_value TEXT,
      timing TEXT NOT NULL,
      decision TEXT NOT NULL,
      budget TEXT NOT NULL,
      found_via TEXT,
      newsletter BOOLEAN NOT NULL DEFAULT FALSE,
      page TEXT,
      fit TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS booking_requests_created_at_idx ON booking_requests (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS booking_requests_email_idx ON booking_requests (email)`;
}

export interface BookingRequestRow extends BookingRequestInput {
  id: string;
  fit: BookingFit;
  createdAt: string;
}

export async function saveBookingRequest(input: BookingRequestInput): Promise<{ id: string; fit: BookingFit }> {
  const sql = getDb();
  await ensureBookingRequestSchema(sql);
  const fit = scoreBookingFit(input);
  const rows = await sql`
    INSERT INTO booking_requests
      (name, email, website, role, offer, team_size, problem, closer, deal_value, timing, decision, budget, found_via, newsletter, page, fit)
    VALUES
      (${input.name}, ${input.email}, ${input.website}, ${input.role}, ${input.offer}, ${input.teamSize}, ${input.problem}, ${input.closer}, ${input.dealValue}, ${input.timing}, ${input.decision}, ${input.budget}, ${input.foundVia}, ${input.newsletter}, ${input.page}, ${fit})
    RETURNING id
  `;
  return { id: String(rows[0].id), fit };
}

export async function listBookingRequests(limit = 200): Promise<BookingRequestRow[]> {
  const sql = getDb();
  await ensureBookingRequestSchema(sql);
  const rows = await sql`
    SELECT id, name, email, website, role, offer, team_size, problem, closer, deal_value, timing, decision, budget, found_via, newsletter, page, fit, created_at
    FROM booking_requests
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    website: String(r.website),
    role: r.role as BookingRequestInput["role"],
    offer: r.offer as BookingRequestInput["offer"],
    teamSize: r.team_size as BookingRequestInput["teamSize"],
    problem: String(r.problem),
    closer: r.closer ? String(r.closer) : null,
    dealValue: (r.deal_value as BookingRequestInput["dealValue"]) ?? null,
    timing: r.timing as BookingRequestInput["timing"],
    decision: r.decision as BookingRequestInput["decision"],
    budget: r.budget as BookingRequestInput["budget"],
    foundVia: (r.found_via as BookingRequestInput["foundVia"]) ?? null,
    newsletter: Boolean(r.newsletter),
    page: r.page ? String(r.page) : null,
    fit: r.fit as BookingFit,
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

function label<T extends readonly { value: string; label: string }[]>(list: T, value: string | null): string {
  if (!value) return "-";
  return list.find((o) => o.value === value)?.label ?? value;
}

export function bookingRequestSummary(input: BookingRequestInput, fit: BookingFit): { subject: string; text: string } {
  const host = input.website.replace(/^https?:\/\//, "");
  const lines = [
    `Fit: ${fit}`,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Website: ${input.website}`,
    `Role: ${label(BOOKING_ROLES, input.role)}`,
    `Team size: ${label(BOOKING_TEAM_SIZES, input.teamSize)}`,
    "",
    `Wants: ${label(BOOKING_OFFERS, input.offer)}`,
    input.closer ? `Closer: ${input.closer}` : null,
    input.dealValue ? `New client worth: ${label(BOOKING_DEAL_VALUES, input.dealValue)}` : null,
    "",
    "What is broken:",
    input.problem,
    "",
    `Start: ${label(BOOKING_TIMINGS, input.timing)}`,
    `Signs off: ${label(BOOKING_DECISIONS, input.decision)}`,
    `Budget: ${label(BOOKING_BUDGETS, input.budget)}`,
    `Found via: ${label(BOOKING_SOURCES, input.foundVia)}`,
    `Newsletter: ${input.newsletter ? "yes" : "no"}`,
    input.page ? `From page: ${input.page}` : null,
  ].filter((l): l is string => l !== null);
  return { subject: `Call request, ${fit}: ${input.name} at ${host}`, text: lines.join("\n") };
}

export async function notifyBookingRequest(input: BookingRequestInput, fit: BookingFit): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const { subject, text } = bookingRequestSummary(input, fit);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: NEWSLETTER_FROM,
    to: NEWSLETTER_REPLY_TO,
    replyTo: input.email,
    subject,
    text,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
