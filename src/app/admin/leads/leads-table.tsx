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

interface Lead {
  id: string;
  name: string;
  email: string;
  comment: string | null;
  verified: boolean;
  delivered: boolean;
  created_at: string;
  campaign_id: string;
  campaign_title: string | null;
  campaign_keyword: string | null;
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

export default function LeadsTable() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(data.leads);
      setCampaigns(data.campaigns);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (campaignFilter !== "all" && l.campaign_id !== campaignFilter) return false;
      if (statusFilter === "unverified" && l.verified) return false;
      if (statusFilter === "verified" && !l.verified) return false;
      if (statusFilter === "delivered" && !l.delivered) return false;
      if (statusFilter === "undelivered" && (!l.verified || l.delivered)) return false;
      if (statusFilter === "subscriber" && !l.is_subscriber) return false;
      if (!q) return true;
      return (
        l.email.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        (l.campaign_title?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [leads, search, campaignFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          placeholder="Search name, email, campaign..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={campaignFilter} onValueChange={(v) => setCampaignFilter(v ?? "all")}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All campaigns</SelectItem>
            {campaigns.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="undelivered">Verified · undelivered</SelectItem>
            <SelectItem value="subscriber">Subscribers</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {filtered.length} of {leads.length}
        </span>
      </div>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No leads match.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="w-20">Verified</TableHead>
                <TableHead className="w-20">Delivered</TableHead>
                <TableHead className="w-20">Step</TableHead>
                <TableHead className="w-20">Sub?</TableHead>
                <TableHead className="w-24 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow
                  key={l.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedId(l.id)}
                >
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {l.email}
                  </TableCell>
                  <TableCell className="text-xs">{l.campaign_title || "—"}</TableCell>
                  <TableCell>
                    {l.verified ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {l.delivered ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono">{l.nurture_step ?? "—"}</TableCell>
                  <TableCell>
                    {l.is_subscriber ? (
                      <Badge>Paying</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {formatDate(l.created_at)}
                  </TableCell>
                </TableRow>
              ))}
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
