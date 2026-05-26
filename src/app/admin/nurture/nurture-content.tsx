"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NurtureData {
  enabled: boolean;
  enrolled: number;
  stepInfo: Array<{
    step: number;
    subject: string;
    delayDays: number;
    sent: number;
    pctOfEnrolled: number;
  }>;
  upcoming: Array<{
    email: string;
    name: string;
    enrolled_at: string;
    last_step: number | null;
    nextStep: number | null;
    nextDue: string | null;
    overdue?: boolean;
  }>;
  recent: Array<{
    email: string;
    step: number;
    sent_at: string;
  }>;
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NurtureContent() {
  const [data, setData] = useState<NurtureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/nurture")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">Failed to load nurture data.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border/60 bg-card/45 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Automation status</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Read-only view of sequence history. Manual sends are intentionally disabled.
            </p>
          </div>
          <Badge variant={data.enabled ? "default" : "secondary"}>
            {data.enabled ? "Enabled" : "Paused"}
          </Badge>
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-5">
          <Cell label="Enrolled" value={data.enrolled} />
          {data.stepInfo.slice(0, 4).map((step) => (
            <Cell key={step.step} label={`Step ${step.step} sent`} value={step.sent} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Sequence steps">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Delay</TableHead>
                <TableHead className="text-right">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.stepInfo.map((step) => (
                <TableRow key={step.step}>
                  <TableCell className="font-mono">{step.step}</TableCell>
                  <TableCell>{step.subject}</TableCell>
                  <TableCell className="text-right font-mono">+{step.delayDays}d</TableCell>
                  <TableCell className="text-right font-mono">{step.sent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Recent sends">
          {data.recent.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              No sequence sends recorded.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Step</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recent.map((send) => (
                  <TableRow key={`${send.email}-${send.step}-${send.sent_at}`}>
                    <TableCell className="font-mono text-xs">{send.email}</TableCell>
                    <TableCell className="text-right font-mono">{send.step}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatDate(send.sent_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Panel>
      </section>

      <Panel title="Scheduled by data">
        {data.upcoming.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            No pending sequence recipients.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Last step</TableHead>
                <TableHead className="text-right">Next step</TableHead>
                <TableHead className="text-right">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.upcoming.map((lead) => (
                <TableRow key={lead.email}>
                  <TableCell>
                    <p className="font-medium">{lead.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{lead.email}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDate(lead.enrolled_at)}
                  </TableCell>
                  <TableCell className="text-right font-mono">{lead.last_step ?? "-"}</TableCell>
                  <TableCell className="text-right font-mono">{lead.nextStep ?? "done"}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatDate(lead.nextDue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background/70 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border/60 bg-card/45 p-5">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}
