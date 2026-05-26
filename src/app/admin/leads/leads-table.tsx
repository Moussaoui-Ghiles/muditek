"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import LeadDetailSheet from "@/components/admin/lead-detail-sheet";

type LeadSource = "resource" | "portal";

interface Lead {
  id: string;
  source_type: LeadSource;
  name: string | null;
  email: string;
  created_at: string;
  last_seen_at: string | null;
  resource_slug: string | null;
  resource_title: string | null;
  resource_category: string | null;
  source_label: string | null;
  newsletter_status: string | null;
  newsletter_segment: string | null;
  has_portal_account: boolean;
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function displayName(lead: Lead): string {
  return lead.name?.trim() || lead.email.split("@")[0] || "Lead";
}

function sourceTitle(lead: Lead): string {
  if (lead.source_type === "portal") return "Portal signup";
  return lead.resource_title || lead.resource_slug || "Resource";
}

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(Array.isArray(data.leads) ? data.leads : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchLeads();
  }, []);

  const counts = useMemo(
    () => ({
      total: leads.length,
      resources: leads.filter((lead) => lead.source_type === "resource").length,
      portal: leads.filter((lead) => lead.source_type === "portal").length,
      accounts: leads.filter((lead) => lead.has_portal_account).length,
    }),
    [leads],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (sourceFilter === "resource" && lead.source_type !== "resource") return false;
      if (sourceFilter === "portal" && lead.source_type !== "portal") return false;
      if (sourceFilter === "account" && !lead.has_portal_account) return false;

      if (!q) return true;
      const haystack = [
        lead.email,
        lead.name,
        lead.resource_title,
        lead.resource_slug,
        lead.source_label,
        lead.newsletter_segment,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, search, sourceFilter]);

  return (
    <div className="space-y-5">
      <div className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-4">
        <Stat label="Active leads" value={counts.total} />
        <Stat label="Resource signups" value={counts.resources} />
        <Stat label="Portal signups" value={counts.portal} />
        <Stat label="Have portal account" value={counts.accounts} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search email, resource, segment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value ?? "all")}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="resource">Resource signups</SelectItem>
            <SelectItem value="portal">Portal signups</SelectItem>
            <SelectItem value="account">Have portal account</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {filtered.length} of {leads.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/45">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No active leads match.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Newsletter</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead className="text-right">First seen</TableHead>
                <TableHead className="text-right">Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow
                  key={`${lead.source_type}-${lead.id}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(lead.id)}
                >
                  <TableCell>
                    <div className="font-medium">{displayName(lead)}</div>
                    <div className="font-mono text-xs text-muted-foreground">{lead.email}</div>
                  </TableCell>
                  <TableCell>
                    {lead.source_type === "portal" ? (
                      <Badge className="bg-sky-500/15 text-sky-200 hover:bg-sky-500/20">
                        Portal
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20">
                        Resource
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[340px] truncate text-sm">{sourceTitle(lead)}</div>
                    <div className="max-w-[340px] truncate font-mono text-xs text-muted-foreground">
                      {lead.resource_slug ? `/r/${lead.resource_slug}` : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lead.newsletter_status ?? "no newsletter row"}
                      {lead.newsletter_segment ? ` · ${lead.newsletter_segment}` : ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.has_portal_account ? <Badge>Account</Badge> : <Badge variant="secondary">No account</Badge>}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {formatDate(lead.last_seen_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <LeadDetailSheet
        selectedId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background/70 px-4 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
