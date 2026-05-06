"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { RichEditor } from "@/components/admin/rich-editor";

interface Issue {
  id: string;
  subject: string;
  slug: string;
  markdown_src: string | null;
  html: string | null;
  status: "draft" | "scheduled" | "sent";
  audience_filter: string | null;
  sent_at: string | null;
  stats: { sent?: number; failed?: number; opens?: number; clicks?: number } | null;
}

interface Props {
  issueId: string;
  onClose: () => void;
}

export default function IssueEditor({ issueId, onClose }: Props) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [audience, setAudience] = useState<string>("all");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  const dirtyRef = useRef(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  // Initial load
  useEffect(() => {
    fetch(`/api/admin/newsletter/issues/${issueId}`)
      .then((r) => r.json())
      .then((data: Issue) => {
        setIssue(data);
        setSubject(data.subject ?? "");
        setHtml(data.html ?? "");
        setAudience(data.audience_filter ?? "all");
        setPreviewHtml(data.html ?? "");
      });
  }, [issueId]);

  const save = useCallback(async () => {
    if (!issue) return;
    if (issue.status === "sent") return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/newsletter/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html,
          audience_filter: audience === "all" ? null : audience,
        }),
      });
      if (res.ok) {
        setSavedAt(new Date());
        dirtyRef.current = false;
        setPreviewHtml(html);
      }
    } finally {
      setSaving(false);
    }
  }, [issueId, subject, html, audience, issue]);

  // Autosave 1.5s debounce
  useEffect(() => {
    if (!issue) return;
    if (issue.status === "sent") return;
    if (!dirtyRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void save();
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [subject, html, audience, save, issue]);

  function markDirty() {
    dirtyRef.current = true;
  }

  async function testSend() {
    if (dirtyRef.current) await save();
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
    if (dirtyRef.current) await save();
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`/api/admin/newsletter/issues/${issueId}/send`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult(`Sent: ${data.sent}, Failed: ${data.failed}`);
        const refreshed = await fetch(`/api/admin/newsletter/issues/${issueId}`).then(
          (r) => r.json(),
        );
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
    const res = await fetch(`/api/admin/newsletter/issues/${issueId}`, {
      method: "DELETE",
    });
    if (res.ok) onClose();
  }

  if (!issue) {
    return <div className="text-sm text-muted-foreground p-6">Loading…</div>;
  }

  const isSent = issue.status === "sent";
  const readOnly = isSent;

  const audienceLabel =
    audience === "all" ? "All active" : `${audience} only`;

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-3 sticky top-0 z-20 bg-background pb-3 border-b border-border/50">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" onClick={onClose} className="gap-2 -ml-2">
            <ArrowLeft className="size-4" />
            Issues
          </Button>
          <span className="h-5 w-px bg-border" />
          {isSent ? <Badge>Sent</Badge> : <Badge variant="outline">Draft</Badge>}
          <span className="text-xs text-muted-foreground font-mono">
            {saving
              ? "Saving…"
              : savedAt
                ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : isSent
                  ? ""
                  : "Auto-saves on change"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview((v) => !v)} className="gap-2">
            {showPreview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {showPreview ? "Hide preview" : "Preview"}
          </Button>
          {!readOnly && (
            <>
              <Button variant="outline" size="sm" onClick={() => setTestOpen(true)}>
                Send test
              </Button>
              <Button size="sm" onClick={() => setConfirmSend(true)}>
                Send to audience
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteIssue}
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Inline meta */}
      <div className="space-y-3">
        <input
          type="text"
          value={subject}
          readOnly={readOnly}
          onChange={(e) => {
            setSubject(e.target.value);
            markDirty();
          }}
          placeholder="Untitled issue — write a subject"
          className="w-full bg-transparent border-0 outline-none text-3xl md:text-4xl font-bold tracking-tight placeholder:text-muted-foreground/50 px-0 py-2"
        />

        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
            Audience
          </span>
          <Select
            value={audience}
            onValueChange={(v) => {
              setAudience(v ?? "all");
              markDirty();
            }}
            disabled={readOnly}
          >
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All active</SelectItem>
              <SelectItem value="HOT">HOT only</SelectItem>
              <SelectItem value="WARM">WARM only</SelectItem>
              <SelectItem value="COLD">COLD only</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            Will send to <span className="text-foreground font-medium">{audienceLabel}</span>
          </span>
        </div>
      </div>

      {/* Editor + optional Preview */}
      <div className={showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : ""}>
        <div>
          <RichEditor
            initialHtml={html}
            onChange={(next) => {
              setHtml(next);
              markDirty();
            }}
            readOnly={readOnly}
          />
        </div>

        {showPreview && (
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Email preview
            </div>
            <div
              className="bg-white text-black overflow-auto max-h-[700px]"
              dangerouslySetInnerHTML={{
                __html:
                  previewHtml ||
                  "<p style='padding:40px;color:#999'>Save to see preview</p>",
              }}
            />
          </div>
        )}
      </div>

      {/* Sent stats */}
      {issue.stats && isSent && (
        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          Sent: {issue.stats.sent ?? "—"} · Failed: {issue.stats.failed ?? "—"}
          {issue.sent_at && ` · ${new Date(issue.sent_at).toLocaleString()}`}
        </div>
      )}

      {/* Test send dialog */}
      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send test</DialogTitle>
            <DialogDescription>Send this draft to one email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@example.com"
              autoFocus
            />
            {testMsg && <p className="text-sm">{testMsg}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestOpen(false)}>
              Close
            </Button>
            <Button onClick={testSend} disabled={testSending || !testTo}>
              {testSending ? "Sending…" : "Send test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm send dialog */}
      <Dialog open={confirmSend} onOpenChange={setConfirmSend}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to audience</DialogTitle>
            <DialogDescription>
              This will send to <strong>{audienceLabel}</strong>. Cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {sendResult && <p className="text-sm py-2">{sendResult}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmSend(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={doSend} disabled={sending}>
              {sending ? "Sending…" : "Confirm send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
