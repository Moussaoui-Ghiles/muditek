"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmailEntry {
  email: string;
  type: string;
  subject: string | null;
  resend_email_id: string | null;
  sent_at: string;
}

const TABS = [
  { value: "all", label: "All" },
  { value: "deliveries", label: "Lead magnet" },
  { value: "nurture", label: "Nurture" },
  { value: "welcome", label: "Welcome" },
  { value: "drop", label: "Drops" },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function typeBadge(type: string) {
  if (type === "lead-magnet") return <Badge variant="default">Lead magnet</Badge>;
  if (type.startsWith("nurture")) return <Badge variant="secondary">{type}</Badge>;
  if (type === "welcome") return <Badge>Welcome</Badge>;
  if (type === "drop") return <Badge variant="secondary">Drop</Badge>;
  return <Badge variant="outline">{type}</Badge>;
}

export default function EmailsContent() {
  const [tab, setTab] = useState<string>("all");
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loadedTab, setLoadedTab] = useState<string | null>(null);
  const loading = loadedTab !== tab;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/emails?type=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setEmails(data.emails);
        setLoadedTab(tab);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : emails.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No emails sent in this category yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-32">Resend ID</TableHead>
                <TableHead className="w-40 text-right">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((e, i) => (
                <TableRow key={`${e.email}-${e.sent_at}-${i}`}>
                  <TableCell className="font-mono text-xs">{e.email}</TableCell>
                  <TableCell>{typeBadge(e.type)}</TableCell>
                  <TableCell className="text-sm truncate max-w-xs">{e.subject || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                    {e.resend_email_id ? (
                      <a
                        href={`https://resend.com/emails/${e.resend_email_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground underline decoration-dotted underline-offset-2"
                        title={e.resend_email_id}
                      >
                        {e.resend_email_id.slice(0, 12)}…
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-mono">
                    {formatDateTime(e.sent_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
