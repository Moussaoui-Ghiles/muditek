"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BOOKING_BUDGETS,
  BOOKING_DEAL_VALUES,
  BOOKING_DECISIONS,
  BOOKING_OFFERS,
  BOOKING_ROLES,
  BOOKING_SOURCES,
  BOOKING_TEAM_SIZES,
  BOOKING_TIMINGS,
  type BookingRequestRow,
} from "@/lib/booking-requests";

function label(list: readonly { value: string; label: string }[], value: string | null): string {
  if (!value) return "-";
  return list.find((o) => o.value === value)?.label ?? value;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const FIT_STYLE: Record<string, string> = {
  strong: "bg-primary/20 text-primary hover:bg-primary/25",
  possible: "bg-foreground/10 text-foreground hover:bg-foreground/15",
  weak: "bg-muted text-muted-foreground hover:bg-muted",
};

export default function BookingRequestsTable() {
  const [rows, setRows] = useState<BookingRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fitFilter, setFitFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/booking-requests");
        const data = await res.json();
        if (!cancelled) setRows(Array.isArray(data.requests) ? data.requests : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => fitFilter === "all" || r.fit === fitFilter),
    [rows, fitFilter],
  );

  const counts = useMemo(
    () => ({
      strong: rows.filter((r) => r.fit === "strong").length,
      possible: rows.filter((r) => r.fit === "possible").length,
      weak: rows.filter((r) => r.fit === "weak").length,
    }),
    [rows],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={fitFilter} onValueChange={(v) => setFitFilter(v ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All fits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fits ({rows.length})</SelectItem>
            <SelectItem value="strong">Strong ({counts.strong})</SelectItem>
            <SelectItem value="possible">Possible ({counts.possible})</SelectItem>
            <SelectItem value="weak">Weak ({counts.weak})</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {filtered.length} of {rows.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/45">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No call requests yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Who</TableHead>
                <TableHead>Wants</TableHead>
                <TableHead>Fit</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Signs off</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="text-right">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const open = openId === r.id;
                const host = r.website.replace(/^https?:\/\//, "");
                return (
                  <TableRow key={r.id} className="cursor-pointer align-top" onClick={() => setOpenId(open ? null : r.id)}>
                    <TableCell>
                      <div className="font-medium">{r.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{r.email}</div>
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        {host}
                      </a>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {label(BOOKING_ROLES, r.role)} · {label(BOOKING_TEAM_SIZES, r.teamSize)}
                      </div>
                      {open ? (
                        <div className="mt-3 max-w-[60ch] space-y-2 text-sm">
                          <p className="whitespace-pre-wrap text-foreground/90">{r.problem}</p>
                          {r.closer ? <p className="text-xs text-muted-foreground">Closer: {r.closer}</p> : null}
                          {r.dealValue ? <p className="text-xs text-muted-foreground">New client worth: {label(BOOKING_DEAL_VALUES, r.dealValue)}</p> : null}
                          <p className="text-xs text-muted-foreground">
                            Found via {label(BOOKING_SOURCES, r.foundVia)}
                            {r.page ? ` · from ${r.page}` : ""}
                            {r.newsletter ? " · newsletter yes" : " · newsletter no"}
                          </p>
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-sm">{label(BOOKING_OFFERS, r.offer)}</TableCell>
                    <TableCell>
                      <Badge className={FIT_STYLE[r.fit] ?? ""}>{r.fit}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{label(BOOKING_TIMINGS, r.timing)}</TableCell>
                    <TableCell className="text-sm">{label(BOOKING_DECISIONS, r.decision)}</TableCell>
                    <TableCell className="text-sm">{label(BOOKING_BUDGETS, r.budget)}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
