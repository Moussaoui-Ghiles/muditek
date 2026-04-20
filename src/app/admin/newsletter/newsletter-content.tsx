"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import IssueEditor from "./issue-editor";

interface Issue {
  id: string;
  subject: string;
  slug: string;
  status: "draft" | "scheduled" | "sent";
  audience_filter: string | null;
  sent_at: string | null;
  stats: { sent?: number; failed?: number; opens?: number; clicks?: number } | null;
  created_at: string;
}

interface AudienceBreakdown {
  segment: string | null;
  status: string;
  count: number;
}

export default function NewsletterContent() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [breakdown, setBreakdown] = useState<AudienceBreakdown[] | null>(null);
  const [totals, setTotals] = useState<{ status: string; count: number }[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newAudience, setNewAudience] = useState<string>("all");
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/admin/newsletter/issues").then((r) => r.json()),
      fetch("/api/admin/newsletter/audience").then((r) => r.json()),
    ]).then(([issuesRes, audRes]) => {
      if (cancelled) return;
      setIssues(issuesRes.issues ?? []);
      setBreakdown(audRes.breakdown ?? []);
      setTotals(audRes.totals ?? []);
    });
    return () => { cancelled = true; };
  }, [reloadKey]);

  async function createIssue() {
    if (!newSubject.trim()) return;
    setCreatingLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newSubject.trim(),
          markdown_src: "",
          audience_filter: newAudience === "all" ? null : newAudience,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreating(false);
        setNewSubject("");
        setNewAudience("all");
        setEditingId(data.id);
      }
    } finally {
      setCreatingLoading(false);
    }
  }

  const activeByStatus = (totals ?? []).reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + t.count;
    return acc;
  }, {});
  const segmentCounts = (breakdown ?? [])
    .filter((b) => b.status === "active")
    .reduce<Record<string, number>>((acc, b) => {
      const k = b.segment ?? "unsegmented";
      acc[k] = (acc[k] ?? 0) + b.count;
      return acc;
    }, {});

  if (editingId) {
    return (
      <IssueEditor
        issueId={editingId}
        onClose={() => { setEditingId(null); setReloadKey((k) => k + 1); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Audience summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Active</div>
          <div className="text-2xl font-semibold mt-1">{activeByStatus.active ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">HOT</div>
          <div className="text-2xl font-semibold mt-1">{segmentCounts.HOT ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">WARM</div>
          <div className="text-2xl font-semibold mt-1">{segmentCounts.WARM ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">COLD</div>
          <div className="text-2xl font-semibold mt-1">{segmentCounts.COLD ?? 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Unsubscribed</div>
          <div className="text-2xl font-semibold mt-1">{activeByStatus.unsub ?? 0}</div>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Issues</h2>
        <Button onClick={() => setCreating(true)}>New issue</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {issues === null ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No issues yet. Click &quot;New issue&quot; to draft your first.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24">Audience</TableHead>
                <TableHead className="w-24 text-right">Sent</TableHead>
                <TableHead className="w-40 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((i) => (
                <TableRow
                  key={i.id}
                  className="cursor-pointer"
                  onClick={() => setEditingId(i.id)}
                >
                  <TableCell className="font-medium">{i.subject}</TableCell>
                  <TableCell>
                    {i.status === "sent" ? (
                      <Badge>Sent</Badge>
                    ) : i.status === "scheduled" ? (
                      <Badge variant="secondary">Scheduled</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {i.audience_filter ?? "All active"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {i.stats?.sent ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-mono">
                    {i.sent_at ? new Date(i.sent_at).toLocaleDateString() : new Date(i.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New issue</DialogTitle>
            <DialogDescription>
              Start a draft. You can edit body, audience, and send later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Weekly #1 — what I'm shipping"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Audience</Label>
              <Select value={newAudience} onValueChange={(v) => setNewAudience(v ?? "all")}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All active</SelectItem>
                  <SelectItem value="HOT">HOT only</SelectItem>
                  <SelectItem value="WARM">WARM only</SelectItem>
                  <SelectItem value="COLD">COLD only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={createIssue} disabled={creatingLoading || !newSubject.trim()}>
              {creatingLoading ? "Creating…" : "Create draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
