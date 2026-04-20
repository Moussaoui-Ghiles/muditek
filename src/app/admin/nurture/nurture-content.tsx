"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import TestSendDialog from "@/components/admin/test-send-dialog";

interface NurtureData {
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NurtureContent() {
  const [data, setData] = useState<NurtureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingFor, setSendingFor] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<string>("");

  const [testOpen, setTestOpen] = useState(false);
  const [testStep, setTestStep] = useState<number>(2);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/nurture");
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function sendNextStep(email: string) {
    setSendingFor(email);
    setSendResult("");
    try {
      const res = await fetch("/api/admin/nurture/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSendResult(`${email} · ${json.error || "failed"}`);
      } else {
        setSendResult(`Sent step ${json.step} to ${email}`);
        refresh();
      }
    } catch (err) {
      setSendResult(String(err));
    } finally {
      setSendingFor(null);
    }
  }

  function previewStep(step: number) {
    setTestStep(step);
    setTestOpen(true);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">Failed to load nurture data.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Per-step funnel */}
      <Card className="p-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium">Sequence performance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-mono font-medium text-foreground">{data.enrolled}</span>{" "}
              leads enrolled (non-subscribers). Conversion is % of enrolled that reached
              each step.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.stepInfo.map((s) => (
            <div key={s.step} className="border border-border rounded-lg p-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-muted-foreground">Step {s.step}</span>
                <span className="text-xs text-muted-foreground font-mono">
                  +{s.delayDays}d
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold font-mono">{s.sent}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {s.pctOfEnrolled}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5 mb-3" title={s.subject}>
                {s.subject}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewStep(s.step)}
                className="w-full"
              >
                Preview
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming sends */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 pb-4 flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-medium">Upcoming sends</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Next step scheduled per lead. Overdue entries can be sent immediately.
            </p>
          </div>
          {sendResult && (
            <p className="text-xs text-muted-foreground font-mono">{sendResult}</p>
          )}
        </div>
        {data.upcoming.length === 0 ? (
          <div className="p-6 pt-0 text-sm text-muted-foreground">
            No pending nurture sends.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="w-20">Last</TableHead>
                <TableHead className="w-20">Next</TableHead>
                <TableHead className="w-28">Due</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-32 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.upcoming.map((lead) => (
                <TableRow key={lead.email}>
                  <TableCell>
                    <div className="font-medium text-sm">{lead.name}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {lead.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatDate(lead.enrolled_at)}
                  </TableCell>
                  <TableCell className="font-mono">{lead.last_step ?? "—"}</TableCell>
                  <TableCell className="font-mono">{lead.nextStep ?? "done"}</TableCell>
                  <TableCell className="text-xs font-mono">
                    {lead.nextDue ? formatDate(lead.nextDue) : "—"}
                  </TableCell>
                  <TableCell>
                    {lead.overdue ? (
                      <Badge>Due now</Badge>
                    ) : lead.nextDue ? (
                      <Badge variant="secondary">Scheduled</Badge>
                    ) : (
                      <Badge variant="secondary">Complete</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {lead.nextStep ? (
                      <Button
                        variant={lead.overdue ? "default" : "outline"}
                        size="sm"
                        disabled={sendingFor === lead.email}
                        onClick={() => sendNextStep(lead.email)}
                      >
                        {sendingFor === lead.email
                          ? "Sending..."
                          : `Send step ${lead.nextStep}`}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <TestSendDialog
        open={testOpen}
        onOpenChange={setTestOpen}
        mode="nurture-step"
        step={testStep}
        title={`Preview nurture step ${testStep}`}
      />
    </div>
  );
}
