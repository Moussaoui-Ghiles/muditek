"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, Maximize2, Minimize2, Trash2 } from "lucide-react";
import { RichEditor } from "@/components/admin/rich-editor";
import { wrapIssueHtml } from "@/lib/newsletter-html";

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

const AUDIENCE_OPTIONS: Array<{ value: string; label: string; dotClass: string }> = [
  { value: "all", label: "All active", dotClass: "bg-zinc-400" },
  { value: "HOT", label: "HOT", dotClass: "bg-[var(--color-warn,#f5a524)]" },
  { value: "WARM", label: "WARM", dotClass: "bg-[var(--color-live,#32d583)]" },
  { value: "COLD", label: "COLD", dotClass: "bg-[var(--color-cool,#70b7ff)]" },
];

export default function IssueEditor({ issueId, onClose }: Props) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [audience, setAudience] = useState<string>("all");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dirtyRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const sendInnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    fetch(`/api/admin/newsletter/issues/${issueId}`)
      .then((r) => r.json())
      .then((data: Issue) => {
        setIssue(data);
        setSubject(data.subject ?? "");
        setHtml(data.html ?? "");
        setAudience(data.audience_filter ?? "all");
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
      }
    } finally {
      setSaving(false);
    }
  }, [issueId, subject, html, audience, issue]);

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

  // Magnetic Send CTA — vanilla pointer math, no framer
  useEffect(() => {
    const btn = sendBtnRef.current;
    const inner = sendInnerRef.current;
    if (!btn || !inner) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    function onMove(e: PointerEvent) {
      if (!btn || !inner) return;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      const strength = 0.18;
      btn.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      inner.style.transform = `translate3d(${x * strength * 1.5}px, ${y * strength * 1.5}px, 0)`;
    }
    function onLeave() {
      if (!btn || !inner) return;
      btn.style.transform = "";
      inner.style.transform = "";
    }
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, [issue?.status]);

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
      if (res.ok) setTestMsg(`Sent to ${testTo}.`);
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
        setSendResult(`Sent ${data.sent} · Failed ${data.failed}`);
        const refreshed = await fetch(`/api/admin/newsletter/issues/${issueId}`).then(
          (r) => r.json(),
        );
        setIssue(refreshed);
      } else {
        setSendResult(`Error: ${data.error}`);
      }
    } finally {
      setSending(false);
    }
  }

  async function deleteIssue() {
    const res = await fetch(`/api/admin/newsletter/issues/${issueId}`, {
      method: "DELETE",
    });
    if (res.ok) onClose();
  }

  if (!issue) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-48 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-16 w-2/3 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-[640px] rounded-2xl bg-white/[0.04] animate-pulse" />
      </div>
    );
  }

  const isSent = issue.status === "sent";
  const readOnly = isSent;
  const audienceOpt = AUDIENCE_OPTIONS.find((o) => o.value === audience) ?? AUDIENCE_OPTIONS[0];
  const finalPreviewHtml = html.trim()
    ? wrapIssueHtml(html, { prefsUrl: "#preferences", unsubUrl: "#unsubscribe" })
    : "<p style='padding:40px;color:#999;font-family:system-ui'>Start writing to see the rendered email preview.</p>";

  return (
    <div className="relative">
      {/* Sticky meta bar */}
      <div className="sticky top-0 z-30 -mx-6 md:-mx-8 px-6 md:px-8 py-3 backdrop-blur-md bg-[#0c0c0e]/85 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="h-8 px-2 inline-flex items-center gap-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] spring -ml-2 text-sm"
            >
              <ArrowLeft className="size-4" strokeWidth={1.8} />
              Issues
            </button>
            <span className="h-4 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              {isSent ? (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-zinc-500" />
                  Sent
                </>
              ) : saving ? (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-zinc-400 animate-pulse" />
                  Saving
                </>
              ) : savedAt ? (
                <>
                  <span className="breath-dot" aria-hidden />
                  Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </>
              ) : (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-zinc-600" />
                  Draft
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFocusMode((v) => !v)}
              aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] spring"
            >
              {focusMode ? (
                <Minimize2 className="size-4" strokeWidth={1.8} />
              ) : (
                <Maximize2 className="size-4" strokeWidth={1.8} />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              aria-label={showPreview ? "Hide preview" : "Show preview"}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] spring"
            >
              {showPreview ? (
                <EyeOff className="size-4" strokeWidth={1.8} />
              ) : (
                <Eye className="size-4" strokeWidth={1.8} />
              )}
            </button>

            {!readOnly && (
              <>
                <span className="mx-1 h-4 w-px bg-white/[0.08]" />
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Delete draft"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06] spring"
                >
                  <Trash2 className="size-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => setTestOpen(true)}
                  className="h-8 px-3 inline-flex items-center text-xs font-medium rounded-md text-zinc-300 hover:text-white hover:bg-white/[0.05] spring"
                >
                  Send test
                </button>
                <button
                  ref={sendBtnRef}
                  type="button"
                  onClick={() => setConfirmSend(true)}
                  className="magnetic-cta group h-9 pl-4 pr-1.5 inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-950 text-xs font-semibold tracking-wide hover:bg-white shadow-[0_8px_24px_-8px_rgba(255,255,255,0.18)]"
                >
                  Send to audience
                  <span
                    ref={sendInnerRef}
                    className="size-6 inline-flex items-center justify-center rounded-full bg-zinc-950/90 text-zinc-100 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] spring"
                  >
                    <ArrowUpRight className="size-3.5" strokeWidth={2} />
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Document area */}
      <div className={`mx-auto ${focusMode ? "max-w-3xl" : "max-w-5xl"} pt-8 pb-24 spring`}>
        {/* Subject */}
        <input
          type="text"
          value={subject}
          readOnly={readOnly}
          onChange={(e) => {
            setSubject(e.target.value);
            markDirty();
          }}
          placeholder="Subject"
          className="mb-6 w-full bg-transparent border-0 outline-none text-3xl md:text-5xl font-bold tracking-[-0.025em] text-zinc-50 placeholder:text-zinc-700 px-0 py-1 leading-[1.05]"
        />

        {/* Audience pills */}
        {!focusMode && (
          <div className="mb-10 flex items-center gap-2 flex-wrap">
            {AUDIENCE_OPTIONS.map((opt) => {
              const active = audience === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    setAudience(opt.value);
                    markDirty();
                  }}
                  className={`h-7 px-3 inline-flex items-center gap-1.5 rounded-full text-[12px] font-medium spring ${
                    active
                      ? "bg-white/[0.08] text-zinc-50 ring-1 ring-white/[0.10]"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                  } ${readOnly ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <span className={`size-1.5 rounded-full ${opt.dotClass}`} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Editor + preview */}
        <div className={showPreview ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : ""}>
          <div>
            <RichEditor
              initialHtml={html}
              onChange={(next) => {
                setHtml(next);
                markDirty();
              }}
              readOnly={readOnly}
              focusMode={focusMode}
            />
          </div>

          {showPreview && (
            <div className="rounded-2xl border border-white/[0.06] bg-[#151517] overflow-hidden">
              <div
                className="bg-white text-black overflow-auto max-h-[800px]"
                dangerouslySetInnerHTML={{
                  __html: finalPreviewHtml,
                }}
              />
            </div>
          )}
        </div>

        {/* Sent stats */}
        {issue.stats && isSent && (
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center gap-6 text-sm text-zinc-500">
            <span>Sent <span className="text-zinc-200 font-medium">{issue.stats.sent ?? "—"}</span></span>
            <span>Failed <span className="text-zinc-200 font-medium">{issue.stats.failed ?? "—"}</span></span>
            {issue.sent_at && <span>{new Date(issue.sent_at).toLocaleString()}</span>}
          </div>
        )}
      </div>

      {/* Test send */}
      <Dialog open={testOpen} onOpenChange={setTestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a test</DialogTitle>
            <DialogDescription>
              Goes to one address. If it&apos;s a real subscriber the footer links work; otherwise they&apos;ll show the test token.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="you@muditek.com"
              autoFocus
            />
            {testMsg && <p className="text-sm text-zinc-300">{testMsg}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTestOpen(false)}>
              Close
            </Button>
            <Button onClick={testSend} disabled={testSending || !testTo}>
              {testSending ? "Sending…" : "Send test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm send */}
      <Dialog open={confirmSend} onOpenChange={setConfirmSend}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to {audienceOpt.label}?</DialogTitle>
            <DialogDescription>
              This goes out now. Cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {sendResult && <p className="text-sm py-2 text-zinc-300">{sendResult}</p>}
          <DialogFooter>
            <Button
              variant="ghost"
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

      {/* Confirm delete */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this draft?</DialogTitle>
            <DialogDescription>
              The draft and its content will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                void deleteIssue();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
