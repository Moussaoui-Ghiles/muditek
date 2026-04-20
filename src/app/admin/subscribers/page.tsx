"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ExternalLink, Search } from "lucide-react";
import TestSendDialog from "@/components/admin/test-send-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  current_period_end: string | null;
  created_at: string;
  cancelled_at: string | null;
  stripe_customer_id: string | null;
}

interface Stats {
  total: number;
  active: number;
  cancelled: number;
  mrr: number;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [testOpen, setTestOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      setSubscribers(data.subscribers);
      setStats(data.stats);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.email.toLowerCase().includes(q) ||
        (s.name?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [subscribers, search, statusFilter]);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-7">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
            Stripe · $47/mo
          </p>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] leading-tight">
            Paying customers
          </h1>
          <p className="text-[13px] text-muted-foreground max-w-prose">
            People who checked out through <span className="font-mono text-foreground/80">/buy</span>. Not to be confused with newsletter subscribers — see <a href="/admin/newsletter" className="underline underline-offset-2 text-foreground">Newsletter</a>.
          </p>
        </div>
        <Button variant="outline" onClick={() => setTestOpen(true)}>
          Preview welcome email
        </Button>
      </div>

      <TestSendDialog open={testOpen} onOpenChange={setTestOpen} mode="welcome" />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Total" value={stats.total} />
          <Stat label="Active" value={stats.active} accent />
          <Stat label="Cancelled" value={stats.cancelled} />
          <Stat label="MRR" value={`$${stats.mrr.toLocaleString()}`} />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {filtered.length} of {subscribers.length}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-col items-start gap-3 border border-dashed border-border/60 bg-secondary/20 px-7 py-10 text-left">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div>
              <p className="text-[14px] font-medium">
                {subscribers.length === 0 ? "No paying customers yet." : "No matches for that filter."}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground max-w-md">
                {subscribers.length === 0
                  ? "When someone checks out through /buy, the Stripe webhook inserts them here."
                  : "Clear search or switch status filter to see all rows."}
              </p>
            </div>
            {subscribers.length === 0 && (
              <a
                href="/buy"
                className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-3 py-1.5 text-[11px] font-medium hover:bg-secondary/60"
              >
                Open /buy page
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Name</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-32">Renews</TableHead>
                <TableHead className="w-28 text-right">Joined</TableHead>
                <TableHead className="w-12 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const renewsOrEnded =
                  s.status === "cancelled" ? s.cancelled_at : s.current_period_end;
                const renewsLabel =
                  s.status === "cancelled" ? "Cancelled" : "Renews";
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.name || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={s.status === "active" ? "default" : "secondary"}
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {renewsLabel}
                      </div>
                      {formatDate(renewsOrEnded)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-mono">
                      {formatDate(s.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {s.stripe_customer_id ? (
                        <a
                          href={`https://dashboard.stripe.com/customers/${s.stripe_customer_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground inline-flex"
                          title="Open in Stripe"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <p
        className={`text-2xl font-semibold font-mono tracking-tight ${
          accent ? "text-emerald-500" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Card>
  );
}
