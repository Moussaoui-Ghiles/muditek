"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "lead-magnet" | "nurture-step" | "drop" | "welcome";
  campaignId?: string;
  step?: number;
  contentTitle?: string;
  title?: string;
  defaultEmail?: string;
}

export default function TestSendDialog({
  open,
  onOpenChange,
  mode,
  campaignId,
  step,
  contentTitle,
  title,
  defaultEmail,
}: Props) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSend() {
    if (!email) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode,
          to: email,
          campaignId,
          step,
          contentTitle,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, msg: `Sent to ${email}.${data.resendId ? ` id: ${data.resendId}` : ""}` });
      } else {
        setResult({ ok: false, msg: data.error || "Failed to send" });
      }
    } catch (err) {
      setResult({ ok: false, msg: String(err) });
    } finally {
      setSending(false);
    }
  }

  const defaultTitle =
    mode === "lead-magnet" ? "Send test lead-magnet email"
    : mode === "nurture-step" ? `Preview nurture step ${step}`
    : mode === "drop" ? "Preview drop notification"
    : "Preview welcome email";

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setResult(null); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || defaultTitle}</DialogTitle>
          <DialogDescription>
            The email will be sent from{" "}
            <span className="font-mono">resources@mail.ghiless.com</span> to the address below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="to">Send to</Label>
          <Input
            id="to"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {result && (
          <p className={`text-sm ${result.ok ? "text-muted-foreground" : "text-destructive"}`}>
            {result.msg}
          </p>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleSend} disabled={!email || sending}>
            {sending ? "Sending..." : "Send test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
