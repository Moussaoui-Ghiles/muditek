"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Archive, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Campaign {
  id: string;
  title: string;
  post_url: string | null;
  resource_url: string;
  keyword: string;
  is_active: boolean;
  ttl_days: number;
  created_at: string;
  expires_at: string;
  submission_count: number;
  verified_count: number;
  delivered_count: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns");
      setCampaigns(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  function daysLeft(expiresAt: string) {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : "Expired";
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (showActiveOnly && !c.is_active) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.keyword.toLowerCase().includes(q) ||
        (c.post_url?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [campaigns, search, showActiveOnly]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Archive
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Legacy campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Old LinkedIn keyword/comment capture pages. The current funnel is resource links into the portal.
          </p>
        </div>
      </header>

      <Card className="border-border/60 bg-secondary/25 p-4">
        <div className="flex items-start gap-3">
          <Archive className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Archived workflow</p>
            <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
              Do not create new campaigns here. Share `/portal/playbooks/...`, `/portal/skills/...`, or `/r/...` resource links instead.
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search title, keyword, post..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showActiveOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowActiveOnly((v) => !v)}
        >
          Still marked active
        </Button>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {filtered.length} of {campaigns.length}
        </span>
      </div>

      {/* Campaign list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-sm">
            {campaigns.length === 0 ? "No legacy campaigns in the archive" : "No matches"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {campaigns.length === 0
              ? "New resource links now belong in the portal, not this workflow."
              : "Try a different search or show all archived records."}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const rate =
              c.submission_count > 0
                ? Math.round((c.delivered_count / c.submission_count) * 100)
                : 0;
            return (
              <Link key={c.id} href={`/admin/${c.id}`} className="block">
                <Card className="p-5 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className="font-medium text-[15px]">{c.title}</span>
                    <Badge variant={c.is_active ? "outline" : "secondary"}>
                      {c.is_active ? "Still marked active" : "Archived"}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {c.keyword}
                    </Badge>
                    {c.expires_at && (
                      <span className="text-muted-foreground text-xs font-mono ml-auto">
                        {daysLeft(c.expires_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap">
                    <span>
                      <span className="font-mono font-medium text-foreground">
                        {c.submission_count}
                      </span>{" "}
                      submissions
                    </span>
                    <span>
                      <span className="font-mono font-medium text-foreground">
                        {c.verified_count}
                      </span>{" "}
                      verified
                    </span>
                    <span>
                      <span className="font-mono font-medium text-foreground">
                        {c.delivered_count}
                      </span>{" "}
                      delivered
                    </span>
                    <span className="ml-auto">
                      <span className="font-mono font-medium text-foreground">{rate}%</span>{" "}
                      delivery rate
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
