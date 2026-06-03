"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Clock,
  FileImage,
  FolderInput,
  KeyRound,
  ListChecks,
  Loader2,
  RadioTower,
  RefreshCw,
  Send,
  ShieldCheck,
  TerminalSquare,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Account = {
  id: number;
  handle: string;
  displayName: string | null;
  avatarUrl: string | null;
  openId: string;
  accessExpires: string | null;
  refreshExpires: string | null;
  scope: string | null;
  updatedAt: string | null;
};

type Attempt = {
  id: string;
  accountId: number | null;
  accountHandle: string | null;
  sourceLabel: string | null;
  title: string | null;
  caption: string | null;
  imageCount: number;
  blobUrls: string[];
  publishId: string | null;
  status: string;
  failReason: string | null;
  errorMessage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type EnvState = {
  clientKey: boolean;
  clientSecret: boolean;
  redirectUri: string;
  posterApiKey: boolean;
  blob: boolean;
};

type Props = {
  accounts: Account[];
  attempts: Attempt[];
  env: EnvState;
  baseUrl: string;
  databaseError: string | null;
  notice: {
    connected: string | null;
    error: string | null;
  };
};

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function shortId(value: string | null | undefined) {
  if (!value) return "-";
  return value.length > 14 ? `${value.slice(0, 8)}...${value.slice(-4)}` : value;
}

function tokenState(account: Account) {
  if (!account.accessExpires) return { label: "Unknown", tone: "muted" as const };
  const diff = new Date(account.accessExpires).getTime() - Date.now();
  if (diff <= 0) return { label: "Expired", tone: "bad" as const };
  if (diff < 2 * 60 * 60 * 1000) return { label: "Refresh soon", tone: "warn" as const };
  return { label: "Connected", tone: "good" as const };
}

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value === "send_to_user_inbox" || value === "publish_complete") return "good";
  if (value === "failed") return "bad";
  if (value.includes("processing") || value === "uploading" || value === "created") return "warn";
  return "muted";
}

function readableError(value: string) {
  return decodeURIComponent(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function requiredAction(accounts: Account[], env: EnvState) {
  if (!env.clientKey || !env.clientSecret) return "TikTok app credentials are not set.";
  if (!env.blob) return "Image hosting is not configured.";
  if (accounts.length === 0) return "Connect the TikTok account once.";
  if (!env.posterApiKey) return "Browser uploads work. Folder automation needs the poster key.";
  return "Ready to send drafts.";
}

function successfulAttempts(attempts: Attempt[]) {
  return attempts.filter((attempt) => {
    const value = attempt.status.toLowerCase();
    return value === "send_to_user_inbox" || value === "publish_complete";
  }).length;
}

function StatusBadge({ value }: { value: string }) {
  const tone = statusTone(value);
  const label =
    value === "SEND_TO_USER_INBOX"
      ? "Draft ready"
      : value === "PUBLISH_COMPLETE"
        ? "Published from app"
        : value.replace(/_/g, " ").toLowerCase();
  return (
    <Badge
      variant={tone === "muted" ? "outline" : "secondary"}
      className={
        tone === "good"
          ? "rounded-md bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/25"
          : tone === "bad"
            ? "rounded-md bg-red-500/10 text-red-300 ring-1 ring-red-500/25"
            : tone === "warn"
              ? "rounded-md bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/25"
              : "rounded-md"
      }
    >
      {label}
    </Badge>
  );
}

function HealthDot({ tone }: { tone: "good" | "bad" | "warn" | "muted" }) {
  const color =
    tone === "good"
      ? "bg-emerald-400"
      : tone === "bad"
        ? "bg-red-400"
        : tone === "warn"
          ? "bg-amber-300"
          : "bg-muted-foreground";
  return <span className={`size-2 rounded-full ${color}`} />;
}

function EnvItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 py-2 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
        {ok ? <CheckCircle2 className="size-3.5 text-emerald-300" /> : <AlertTriangle className="size-3.5 text-amber-300" />}
        {ok ? "Ready" : "Needs setup"}
      </span>
    </div>
  );
}

export default function TikTokContent({
  accounts,
  attempts,
  env,
  baseUrl,
  databaseError,
  notice,
}: Props) {
  const [handle, setHandle] = useState(accounts[0]?.handle || "muditek.ai");
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id ? String(accounts[0].id) : "",
  );
  const [copied, setCopied] = useState(false);
  const [manualFiles, setManualFiles] = useState<File[]>([]);
  const [manualCaption, setManualCaption] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualSource, setManualSource] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const connectHref = `/api/admin/tiktok/connect?handle=${encodeURIComponent(handle.replace(/^@/, ""))}`;
  const selectedAccount = accounts.find((account) => String(account.id) === selectedAccountId) ?? accounts[0] ?? null;
  const readyToSend = Boolean(accounts.length > 0 && env.posterApiKey && env.blob);
  const browserReady = Boolean(accounts.length > 0 && env.blob);
  const setupReady = Boolean(env.clientKey && env.clientSecret && env.blob && accounts.length > 0);
  const lastAttempt = attempts[0] ?? null;
  const command = useMemo(() => {
    const accountArg = selectedAccount
      ? ` --account-id ${selectedAccount.id}`
      : " --account muditek.ai";
    return `TIKTOK_POSTER_API_KEY=... npx tsx marketing/tiktok/scripts/post-to-admin-tiktok.mts marketing/tiktok/niches/ai-tools/content/YYYY-MM-DD/post-folder${accountArg} --base-url ${baseUrl}`;
  }, [baseUrl, selectedAccount]);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function sendManualDraft() {
    if (manualFiles.length === 0 || !selectedAccountId) return;
    setSending(true);
    setSendResult(null);
    const form = new FormData();
    form.set("accountId", selectedAccountId);
    form.set("title", manualTitle);
    form.set("caption", manualCaption);
    form.set("sourceLabel", manualSource || "manual-admin-upload");
    manualFiles.forEach((file) => form.append("slides", file));

    try {
      const response = await fetch("/api/admin/tiktok/post", {
        method: "POST",
        body: form,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSendResult(payload.error || "Draft send failed.");
      } else {
        setSendResult(`Draft sent. Status: ${payload.status?.status || "submitted"}.`);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-6 space-y-6 pb-24">
      {databaseError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {databaseError}
        </div>
      )}

      {notice.connected && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>TikTok account connected. You can send a browser draft now.</span>
        </div>
      )}

      {notice.error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{readableError(notice.error)}</span>
        </div>
      )}

      <section className="grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 md:grid-cols-4">
        <ReadinessCell
          icon={RadioTower}
          label="TikTok account"
          value={accounts.length > 0 ? `${accounts.length} connected` : "Connect once"}
          ok={accounts.length > 0}
        />
        <ReadinessCell
          icon={FileImage}
          label="Browser upload"
          value={browserReady ? "Ready" : "Needs account"}
          ok={browserReady}
        />
        <ReadinessCell
          icon={FolderInput}
          label="Folder sender"
          value={readyToSend ? "Ready" : "Optional setup"}
          ok={readyToSend}
        />
        <ReadinessCell
          icon={Clock}
          label="Last draft"
          value={lastAttempt ? formatDate(lastAttempt.createdAt) : "None yet"}
          ok={successfulAttempts(attempts) > 0}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card className="bg-card/45 p-0">
          <div className="border-b border-border/60 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Main action
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
                  Send a TikTok draft from this browser
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Upload PNG/JPEG slides, choose the connected account, and TikTok receives a draft. You still publish manually inside TikTok.
                </p>
              </div>
              <Badge
                variant="outline"
                className={browserReady ? "rounded-md border-emerald-500/25 text-emerald-200" : "rounded-md"}
              >
                {browserReady ? "Ready" : requiredAction(accounts, env)}
              </Badge>
            </div>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4 rounded-xl border border-border/60 bg-background/30 p-4">
              <div>
                <Label htmlFor="manual-account">Post as</Label>
                <select
                  id="manual-account"
                  value={selectedAccountId}
                  onChange={(event) => setSelectedAccountId(event.target.value)}
                  className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  disabled={accounts.length === 0}
                >
                  {accounts.length === 0 ? (
                    <option value="">Connect account first</option>
                  ) : (
                    accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        @{account.handle}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <Label htmlFor="manual-slides">Slides</Label>
                <Input
                  id="manual-slides"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg"
                  onChange={(event) => setManualFiles(Array.from(event.target.files ?? []))}
                  className="mt-2"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {manualFiles.length > 0
                    ? `${manualFiles.length} slide${manualFiles.length === 1 ? "" : "s"} selected`
                    : "PNG or JPEG, up to 35 slides."}
                </p>
              </div>

              <Button
                onClick={sendManualDraft}
                disabled={sending || manualFiles.length === 0 || !selectedAccountId || !env.blob}
                className="w-full"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {sending ? "Sending draft..." : "Send to TikTok drafts"}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="manual-title">TikTok title</Label>
                  <Input
                    id="manual-title"
                    value={manualTitle}
                    onChange={(event) => setManualTitle(event.target.value)}
                    placeholder="Optional"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="manual-source">Internal label</Label>
                  <Input
                    id="manual-source"
                    value={manualSource}
                    onChange={(event) => setManualSource(event.target.value)}
                    placeholder="post-folder"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="manual-caption">Caption</Label>
                <textarea
                  id="manual-caption"
                  value={manualCaption}
                  onChange={(event) => setManualCaption(event.target.value)}
                  rows={7}
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="Paste the caption here"
                />
              </div>
              {sendResult && (
                <p className="rounded-lg border border-border/60 bg-background/35 p-3 text-sm text-muted-foreground">
                  {sendResult}
                </p>
              )}
            </div>
          </div>
        </Card>

        <aside className="space-y-6">
          <Card className="bg-card/45 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <h2 className="text-base font-semibold">Connection</h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {setupReady ? "TikTok is connected for draft uploads." : requiredAction(accounts, env)}
                </p>
              </div>
              <HealthDot tone={setupReady ? "good" : "warn"} />
            </div>

            <div className="mt-4 space-y-3">
              {accounts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 bg-background/35 p-4 text-sm text-muted-foreground">
                  No TikTok account connected yet.
                </div>
              ) : (
                accounts.map((account) => {
                  const state = tokenState(account);
                  return (
                    <div key={account.id} className="rounded-xl border border-border/60 bg-background/35 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">@{account.handle}</p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {account.displayName || "TikTok account"}
                          </p>
                        </div>
                        <StatusBadge value={state.label} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>Access: {formatDate(account.accessExpires)}</span>
                        <span>Refresh: {formatDate(account.refreshExpires)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-5 space-y-3 rounded-xl border border-border/60 bg-background/30 p-4">
              <div>
                <Label htmlFor="tiktok-handle">Account label for new connection</Label>
                <Input
                  id="tiktok-handle"
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                  className="mt-2"
                  placeholder="muditek.ai"
                />
              </div>
              <Button nativeButton={false} variant="outline" className="w-full" render={<a href={connectHref} />}>
                {accounts.length > 0 ? <RefreshCw className="size-4" /> : <UserPlus className="size-4" />}
                {accounts.length > 0 ? "Add or refresh account" : "Connect TikTok account"}
              </Button>
            </div>
          </Card>

          <Card className="bg-card/45 p-5">
            <div className="flex items-center gap-2">
              <ListChecks className="size-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">What happens</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <WorkflowStep index="1" text="Slides upload to private Vercel Blob URLs." />
              <WorkflowStep index="2" text="TikTok imports those images into your drafts." />
              <WorkflowStep index="3" text="You open TikTok, add sound/native edits, then publish." />
            </div>
          </Card>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="bg-card/45 p-0">
          <div className="flex flex-col gap-2 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Draft history
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">Recent attempts</h2>
            </div>
            <Badge variant="outline" className="rounded-md">
              {successfulAttempts(attempts)} ready
            </Badge>
          </div>

          {attempts.length === 0 ? (
            <div className="p-5">
              <div className="rounded-xl border border-dashed border-border/70 bg-background/35 p-5 text-sm text-muted-foreground">
                No drafts sent yet. The first successful upload will appear here.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Draft</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Slides</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>TikTok ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="min-w-[260px] whitespace-normal">
                        <p className="font-medium text-foreground">
                          {attempt.title || attempt.sourceLabel || "Untitled draft"}
                        </p>
                        {(attempt.failReason || attempt.errorMessage) && (
                          <p className="mt-1 text-xs text-red-300">
                            {attempt.failReason || attempt.errorMessage}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>@{attempt.accountHandle || "unknown"}</TableCell>
                      <TableCell className="font-mono">{attempt.imageCount}</TableCell>
                      <TableCell><StatusBadge value={attempt.status} /></TableCell>
                      <TableCell>{formatDate(attempt.createdAt)}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {shortId(attempt.publishId)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        <Card className="bg-card/45 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">System status</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Only red/yellow rows need action.
              </p>
            </div>
            <HealthDot tone={setupReady && env.posterApiKey ? "good" : "warn"} />
          </div>
          <div className="mt-4">
            <EnvItem label="TikTok client key" ok={env.clientKey} />
            <EnvItem label="TikTok client secret" ok={env.clientSecret} />
            <EnvItem label="Image hosting" ok={env.blob} />
            <EnvItem label="Folder sender key" ok={env.posterApiKey} />
          </div>
          <p className="mt-4 break-all rounded-lg border border-border/50 bg-background/35 p-3 text-xs leading-5 text-muted-foreground">
            Callback URL: {env.redirectUri}
          </p>

          <details className="mt-4 rounded-xl border border-border/60 bg-background/30 p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
              <span className="flex items-center gap-2">
                <TerminalSquare className="size-4 text-muted-foreground" />
                Folder automation for agents
              </span>
              <Badge variant="outline" className="rounded-md">
                Optional
              </Badge>
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This is only for local scripts that send a finished slide folder without using the browser form.
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {readyToSend
                  ? `Targets ${selectedAccount ? `@${selectedAccount.handle}` : "the selected account"}.`
                  : "Needs connected account, Blob, and folder sender key."}
              </span>
              <Button size="sm" variant="outline" onClick={copyCommand}>
                {copied ? <CheckCircle2 className="size-4" /> : <Clipboard className="size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="mt-3 max-h-40 overflow-auto rounded-lg border border-border/50 bg-background/60 p-3 text-xs leading-5 text-muted-foreground">
              {command}
            </pre>
          </details>
        </Card>
      </section>
    </div>
  );
}

function ReadinessCell({
  icon: Icon,
  label,
  value,
  ok,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="bg-card/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
        </div>
        {ok ? (
          <CheckCircle2 className="size-4 text-emerald-300" />
        ) : (
          <AlertTriangle className="size-4 text-amber-300" />
        )}
      </div>
      <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">{value}</p>
    </div>
  );
}

function WorkflowStep({ index, text }: { index: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-xs font-semibold text-foreground">
        {index}
      </span>
      <span className="leading-6">{text}</span>
    </div>
  );
}
