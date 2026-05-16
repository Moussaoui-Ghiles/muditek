"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LeadDetailSheet from "@/components/admin/lead-detail-sheet";

type LeadSource = "campaign" | "resource";

interface Lead {
  id: string;
  source_type: LeadSource;
  name: string | null;
  email: string;
  comment: string | null;
  verified: boolean;
  delivered: boolean;
  created_at: string;
  campaign_id: string | null;
  campaign_title: string | null;
  campaign_keyword: string | null;
  campaign_active: boolean | null;
  resource_slug: string | null;
  resource_title: string | null;
  source_label: string | null;
  nurture_step: number | null;
  is_subscriber: boolean;
}

interface Campaign {
  id: string;
  title: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function displayName(lead: Lead): string {
  return lead.name?.trim() || lead.email.split("@")[0] || "Lead";
}

function sourceTitle(lead: Lead): string {
  if (lead.source_type === "resource") {
    return lead.resource_title || lead.resource_slug || "Resource unlock";
  }
  return lead.campaign_title || "Campaign";
}

function sourceMeta(lead: Lead): string {
  if (lead.source_type === "resource") {
    return lead.resource_slug ? `/r/${lead.resource_slug}` : "Portal resource";
  }
  return lead.campaign_keyword || "Lead magnet campaign";
}

export default function LeadsTable() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(Array.isArray(data.leads) ? data.leads : []);
      setCampaigns(Array.isArray(data.campaigns) ? data.campaigns : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const counts = useMemo(
    () => ({
      total: leads.length,
      resources: leads.filter((lead) => lead.source_type === "resource").length,
      campaigns: leads.filter((lead) => lead.source_type === "campaign").length,
      paying: leads.filter((lead) => lead.is_subscriber).length,
      nurture: leads.filter((lead) => !lead.is_subscriber && (lead.nurture_step ?? 1) < 5).length,
    }),
    [leads]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (sourceFilter === "resource" && lead.source_type !== "resource") return false;
      if (sourceFilter === "campaigns" && lead.source_type !== "campaign") return false;
      if (sourceFilter.startsWith("campaign:")) {
        const id = sourceFilter.replace("campaign:", "");
        if (lead.campaign_id !== id) return false;
      }

      if (statusFilter === "unverified" && lead.verified) return false;
      if (statusFilter === "verified" && !lead.verified) return false;
      if (statusFilter === "delivered" && !lead.delivered) return false;
      if (statusFilter === "undelivered" && (!lead.verified || lead.delivered)) return false;
      if (statusFilter === "subscriber" && !lead.is_subscriber) return false;
      if (statusFilter === "nurture" && (lead.is_subscriber || (lead.nurture_step ?? 1) >= 5)) return false;

      if (!q) return true;
      const haystack = [
        lead.email,
        lead.name,
        lead.campaign_title,
        lead.campaign_keyword,
        lead.resource_title,
        lead.resource_slug,
        lead.source_label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, search, sourceFilter, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04] sm:grid-cols-4">
        <Stat label="Total leads" value={counts.total} />
        <Stat label="Resource unlocks" value={counts.resources} />
        <Stat label="Campaign leads" value={counts.campaigns} />
        <Stat label="Needs nurture" value={counts.nurture} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search email, resource, campaign..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v ?? "all")}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="resource">Resource unlocks</SelectItem>
            <SelectItem value="campaigns">All campaigns</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={`campaign:${campaign.id}`}>
                {campaign.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="nurture">Needs nurture</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="undelivered">Verified · undelivered</SelectItem>
            <SelectItem value="subscriber">Paying</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {filtered.length} of {leads.length}
        </span>
      </div>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No leads match.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Resource / campaign</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-20">Step</TableHead>
                <TableHead className="w-20">Paid</TableHead>
                <TableHead className="w-24 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => {
                const clickable = lead.source_type === "campaign";
                return (
                  <TableRow
                    key={`${lead.source_type}-${lead.id}`}
                    className={clickable ? "cursor-pointer" : ""}
                    onClick={() => {
                      if (clickable) setSelectedId(lead.id);
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">{displayName(lead)}</div>
                      <div className="font-mono text-xs text-muted-foreground">{lead.email}</div>
                    </TableCell>
                    <TableCell>
                      {lead.source_type === "resource" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20">
                          Resource
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Campaign</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[340px] truncate text-sm">{sourceTitle(lead)}</div>
                      <div className="max-w-[340px] truncate font-mono text-xs text-muted-foreground">
                        {sourceMeta(lead)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.source_type === "resource" ? (
                        <Badge variant="outline">Portal signup</Badge>
                      ) : lead.delivered ? (
                        <Badge>Delivered</Badge>
                      ) : lead.verified ? (
                        <Badge variant="secondary">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono">{lead.nurture_step ?? "—"}</TableCell>
                    <TableCell>
                      {lead.is_subscriber ? (
                        <Badge>Yes</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {formatDate(lead.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <LeadDetailSheet
        selectedId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onRefresh={fetchLeads}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background px-4 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
