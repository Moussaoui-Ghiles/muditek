"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft } from "lucide-react";

interface Issue {
  id: string;
  subject: string;
  slug: string;
  markdown_src: string | null;
  html: string | null;
  status: "draft" | "scheduled" | "sent";
  audience_filter: string | null;
  sent_at: string | null;
  stats: any;
}

interface Props {
  issueId: string;
  onClose: () => void;
}

export default function IssueEditor({ issueId, onClose }: Props) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [subject, setSubject] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [audience, setAudience] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  useEffect(() => {
    fetch(`/api/admin/newsletter/issues/${issueId}`)
      .then((r) => r.json())
      .then((data) => {
        setIssue(data);
        setSubject(data.subject ?? "");
        setMarkdown(data.markdown_src ?? "");
        setAudience(data.audience_filter ?? "all");
        setPreviewHtml(data.html ?? "");
      });
  }, [issueId]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/newsletter/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          markdown_src: markdown,
          audience_filter: audience === "all" ? null : audience,
        }),
      });
      if (res.ok) {
        setDirty(false);
        const refreshed = await fetch(`/api/admin/newsletter/issues/${issueId}`).then((r) => r.json());
        setPreviewHtml(refreshed.html ?? "");
        setIssue(refreshed);
      }
    } finally {
      setSaving(false);
    }
  }

  async function testSend() {
    setTestSending(true);
    setTestMsg(null);
    try {
      const res = await fetch(`/api/admin/newsletter/issues/${issueId}/test-send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testTo }),
      });
      const data = await res.json();
      if (res.ok) setTestMsg(`Sent to ${testTo}`);
      else setTestMsg(`Error: ${data.error}`);
    } finally {
      setTestSending(false);
    }
  }

  async function doSend() {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`/api/admin/newsletter/issues/${issueId}/send`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSendResult(`Sent: ${data.sent}, Failed: ${data.failed}`);
        const refreshed = await fetch(`/api/admin/newsletter/issues/${issueId}`).then((r) => r.json());
        setIssue(refreshed);
      } else {
        setSendResult(`Error: ${data.error}`);
      }
    } finally {
      setSending(false);
      setConfirmSend(false);
    }
  }

  async function deleteIssue() {
    if (!confirm("Delete this draft?")) return;
    const res = await fetch(`/api/admin/newsletter/issues/${issueId}`, { method: "DELETE" });
    if (res.ok) onClose();
  }

  if (!issue) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  const isSent = issue.status === "sent";
  const readOnly = isSent;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          {isSent ? <Badge>Sent</Badge> : <Badge variant="outline">Draft</Badge>}
          {!readOnly && (
            <>
              <Button variant="outline" onClick={() => setTestOpen(true)}>Send test</Button>
              <Button variant="outline" onClick={save} disabled={saving || !dirty}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button onClick={() => setConfirmSend(true)} disabled={!!dirty}>
                Send to audience
              </Button>
              <Button variant="ghost" onClick={deleteIssue} className="text-destructive">Delete</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div>
            <Label htmlFor="subj">Subject</Label>
            <Input
              id="subj"
              value={subject}
              readOnly={readOnly}
              onChange={(e) => { setSubject(e.target.value); setDirty(true); }}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Audience</Label>
            <Select
              value={audience}
              onValueChange={(v) => { setAudience(v ?? "all"); setDirty(true); }}
              disabled={readOnly}
            >
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
          <div>
            <Label htmlFor="body">Body (markdown)</Label>
            <textarea
              id="body"
              value={markdown}
              readOnly={readOnly}
              onChange={(e) => { setMarkdown(e.target.value); setDirty(true); }}
              className="mt-1 w-full h-[500px] rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="# Big idea this week&#10;&#10;One paragraph context.&#10;&#10;## What I'm shipping&#10;- thing 1&#10;- thing 2&#10;&#10;[CTA](https://ghiless.com)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports: # ## ### headings, **bold**, _italic_, [link](url), - list. Save to re-render preview.
            </p>
          </div>
          {issue.stats && isSent && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Sent: {issue.stats.sent ?? "—"} · Failed: {issue.stats.failed ?? "—"}
              {issue.sent_at && ` · ${new Date(issue.sent_at).toLocaleString()}`}
            </div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-2 border-b text-xs text-muted-foreground font-medium">
            Preview
          </div>
          <div
            className="bg-white text-black overflow-auto max-h-[700px]"
            dangerouslySetInnerHTML={{ __html: previewHtml || "<p style='padding:40px;color:#999'>Save to see preview</p>" }}
          />
        </Card>
      </div>

      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send test</DialogTitle>
            <DialogDescription>Send this draft to one address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@example.com"
            />
            {testMsg && <p className="text-sm">{testMsg}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestOpen(false)}>Close</Button>
            <Button onClick={testSend} disabled={testSending || !testTo}>
              {testSending ? "Sending…" : "Send test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmSend} onOpenChange={setConfirmSend}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to audience</DialogTitle>
            <DialogDescription>
              This will send to <strong>{issue.audience_filter ?? "all active subscribers"}</strong>. Can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          {sendResult && <p className="text-sm py-2">{sendResult}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSend(false)} disabled={sending}>Cancel</Button>
            <Button onClick={doSend} disabled={sending}>
              {sending ? "Sending…" : "Confirm send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
