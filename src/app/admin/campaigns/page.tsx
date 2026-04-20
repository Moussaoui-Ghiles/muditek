"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [ttlDays, setTtlDays] = useState(7);
  const [creating, setCreating] = useState(false);

  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUrl, keyword, title, resourceUrl, ttlDays }),
      });
      if (res.ok) {
        const data = await res.json();
        setPostUrl("");
        setKeyword("");
        setTitle("");
        setResourceUrl("");
        setTtlDays(7);
        setJustCreatedId(data.id);
        setCopied(false);
        setDialogOpen(false);
        fetchCampaigns();
      }
    } finally {
      setCreating(false);
    }
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            LinkedIn lead-magnet capture pages. Each campaign has its own shareable URL.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          New campaign
        </Button>
      </header>

      {/* Post-creation banner */}
      {justCreatedId && (
        <Card className="p-5 border-primary/20 bg-primary/5">
          <p className="text-sm font-medium mb-3">
            Campaign created — add this link to your LinkedIn post:
          </p>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 px-4 py-2.5 bg-background border border-border rounded-md font-mono text-sm truncate">
              {typeof window !== "undefined"
                ? `${window.location.origin}/${justCreatedId}`
                : `/${justCreatedId}`}
            </div>
            <Button onClick={() => copyLink(justCreatedId)} size="sm">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/${justCreatedId}`}
              className="text-sm font-medium underline hover:no-underline"
            >
              Open campaign →
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setJustCreatedId(null)}
              className="ml-auto text-xs text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

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
          Active only
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
            {campaigns.length === 0 ? "No campaigns yet" : "No matches"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {campaigns.length === 0
              ? "Click + New campaign to get started"
              : "Try a different search or toggle off Active only"}
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
                    <Badge variant={c.is_active ? "default" : "secondary"}>
                      {c.is_active ? "Active" : "Paused"}
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

      {/* New campaign dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New campaign</DialogTitle>
            <DialogDescription>
              Creates a capture URL for a specific LinkedIn post + keyword.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="postUrl">LinkedIn post URL</Label>
              <Input
                id="postUrl"
                required
                placeholder="https://www.linkedin.com/posts/..."
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  required
                  placeholder="e.g. SDR"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="title">Resource title</Label>
                <Input
                  id="title"
                  required
                  placeholder="Cold Outreach Playbook"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="resourceUrl">Resource URL</Label>
              <Input
                id="resourceUrl"
                required
                placeholder="Google Drive / Notion / Dropbox link"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Label
                htmlFor="ttl"
                className="text-muted-foreground whitespace-nowrap"
              >
                Duration
              </Label>
              <Input
                id="ttl"
                type="number"
                min={1}
                max={90}
                value={ttlDays}
                onChange={(e) => setTtlDays(Number(e.target.value))}
                className="w-24 font-mono"
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create campaign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
