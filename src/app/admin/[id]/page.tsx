"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEmbedUrl } from "@/lib/linkedin";
import TestSendDialog from "@/components/admin/test-send-dialog";
import LeadDetailSheet from "@/components/admin/lead-detail-sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Submission {
  id: string;
  name: string;
  email: string;
  comment: string | null;
  verified: boolean;
  delivered: boolean;
  created_at: string;
}

interface Campaign {
  id: string;
  title: string;
  keyword: string;
  post_url: string;
  post_activity_id: string | null;
  resource_url: string;
  is_active: boolean;
  expires_at: string;
  last_processed_at: string | null;
}

function formatTime(ts: string | null) {
  if (!ts) return "Never";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [commenterCount, setCommenterCount] = useState(0);
  const [subscribedCount, setSubscribedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [scraping, setScraping] = useState(false);
  const [sending, setSending] = useState(false);
  const [actionResult, setActionResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editKeyword, setEditKeyword] = useState("");
  const [editResourceUrl, setEditResourceUrl] = useState("");
  const [editPostUrl, setEditPostUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`);
      const data = await res.json();
      setCampaign(data.campaign);
      setSubmissions(data.submissions);
      setCommenterCount(data.commenterCount ?? 0);
      setSubscribedCount(data.subscribedCount ?? 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function startEditing() {
    if (!campaign) return;
    setEditTitle(campaign.title);
    setEditKeyword(campaign.keyword);
    setEditResourceUrl(campaign.resource_url);
    setEditPostUrl(campaign.post_url);
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          keyword: editKeyword,
          resourceUrl: editResourceUrl,
          postUrl: editPostUrl,
        }),
      });
      setEditing(false);
      fetchData();
    } finally {
      setSaving(false);
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleScrape() {
    setScraping(true);
    setActionResult("");
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/scrape`, { method: "POST" });
      const data = await res.json();
      setActionResult(
        `Scraped ${data.scraped} commenters · verified ${data.verified} submissions`,
      );
      fetchData();
    } catch {
      setActionResult("Scrape failed");
    } finally {
      setScraping(false);
    }
  }

  async function handleSend() {
    setSending(true);
    setActionResult("");
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/send`, { method: "POST" });
      const data = await res.json();
      if (data.failed) {
        setActionResult(`Sent ${data.sent} of ${data.pending} — ${data.failed} failed`);
      } else if (data.sent === 0 && data.pending === 0) {
        setActionResult("No pending emails to send");
      } else {
        setActionResult(`Sent ${data.sent} of ${data.pending} emails`);
      }
      fetchData();
    } catch {
      setActionResult("Send failed");
    } finally {
      setSending(false);
    }
  }

  async function handleExport() {
    const res = await fetch(`/api/admin/export/${id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mudikit-export-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function toggleActive() {
    if (!campaign) return;
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !campaign.is_active }),
    });
    fetchData();
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Campaigns
        </Link>
        <p className="text-muted-foreground">Campaign not found.</p>
      </div>
    );
  }

  const verifiedCount = submissions.filter((s) => s.verified).length;
  const deliveredCount = submissions.filter((s) => s.delivered).length;
  const embedUrl = campaign.post_activity_id ? getEmbedUrl(campaign.post_activity_id) : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Campaigns
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h1 className="text-2xl font-semibold tracking-tight">{campaign.title}</h1>
            <Badge variant={campaign.is_active ? "default" : "secondary"}>
              {campaign.is_active ? "Active" : "Paused"}
            </Badge>
            <Badge variant="outline" className="font-mono">
              {campaign.keyword}
            </Badge>
          </div>
          <a
            href={campaign.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground truncate block"
          >
            {campaign.post_url}
          </a>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={startEditing}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={toggleActive}>
            {campaign.is_active ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <Card className="p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Edit campaign</h3>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit-keyword">Keyword</Label>
                <Input
                  id="edit-keyword"
                  value={editKeyword}
                  onChange={(e) => setEditKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-resource">Resource URL</Label>
              <Input
                id="edit-resource"
                value={editResourceUrl}
                onChange={(e) => setEditResourceUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-post">Post URL</Label>
              <Input
                id="edit-post"
                value={editPostUrl}
                onChange={(e) => setEditPostUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Share link */}
      <Card className="p-4 flex items-center gap-3">
        <span className="text-xs text-muted-foreground shrink-0">Share link</span>
        <span className="flex-1 text-sm font-mono text-muted-foreground truncate">
          {typeof window !== "undefined"
            ? `${window.location.origin}/${id}`
            : `/${id}`}
        </span>
        <Button size="sm" onClick={copyLink}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Card>

      {/* Resource + action bar */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground shrink-0">Resource</span>
          <a
            href={campaign.resource_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-muted-foreground hover:text-foreground truncate"
          >
            {campaign.resource_url}
          </a>
        </div>
        <Separator />
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleScrape} disabled={scraping}>
            {scraping ? "Scraping..." : "Scrape commenters"}
          </Button>
          <Button variant="outline" onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send emails"}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => setTestOpen(true)}>
            Send me a test
          </Button>
        </div>
        <div className="flex items-center gap-3 min-h-[20px] text-xs text-muted-foreground">
          {actionResult && <span>{actionResult}</span>}
          <span className="ml-auto font-mono">
            Last processed: {formatTime(campaign.last_processed_at)}
          </span>
        </div>
      </Card>

      <TestSendDialog
        open={testOpen}
        onOpenChange={setTestOpen}
        mode="lead-magnet"
        campaignId={id}
      />

      {/* Pipeline stats */}
      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
          <PipelineStat label="Commenters" value={commenterCount} />
          <PipelineStat label="Submissions" value={submissions.length} />
          <PipelineStat label="Verified" value={verifiedCount} />
          <PipelineStat label="Delivered" value={deliveredCount} />
          <PipelineStat label="Subscribed" value={subscribedCount} accent />
        </div>
      </Card>

      {/* Embed */}
      {embedUrl && (
        <Card className="p-0 overflow-hidden bg-white">
          <iframe
            src={embedUrl}
            height="350"
            width="100%"
            frameBorder="0"
            allowFullScreen
            title="LinkedIn Post"
            className="w-full"
          />
        </Card>
      )}

      <Separator />

      {/* Submissions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">Submissions</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {submissions.length} total · click a row to open
          </span>
        </div>

        {submissions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-sm">No submissions yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Share the campaign link to start collecting leads
            </p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Note</TableHead>
                  <TableHead className="w-24 text-center">Verified</TableHead>
                  <TableHead className="w-24 text-center">Sent</TableHead>
                  <TableHead className="w-24 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedSubmissionId(s.id)}
                  >
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.email}
                    </TableCell>
                    <TableCell className="text-xs hidden md:table-cell max-w-[200px] truncate">
                      {s.comment || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusDot active={s.verified} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusDot active={s.delivered} />
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-mono">
                      {formatDate(s.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <LeadDetailSheet
        selectedId={selectedSubmissionId}
        onOpenChange={(open) => !open && setSelectedSubmissionId(null)}
        onRefresh={fetchData}
      />
    </div>
  );
}

function PipelineStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="p-5 relative">
      <p
        className={`text-2xl font-semibold font-mono tracking-tight ${
          accent ? "text-emerald-500" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        active ? "bg-emerald-500" : "bg-muted-foreground/30"
      }`}
    />
  );
}
