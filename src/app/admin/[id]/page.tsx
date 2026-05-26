"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  post_url: string | null;
  resource_url: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  last_processed_at: string | null;
}

type CampaignPayload = {
  campaign: Campaign;
  submissions: Submission[];
  commenterCount: number;
  subscribedCount: number;
};

function formatTime(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "mx-auto block size-2 rounded-full",
        active ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" : "bg-muted-foreground/30",
      ].join(" ")}
    />
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-border/55 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{value.toLocaleString()}</p>
    </div>
  );
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CampaignPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`);
      if (!res.ok) {
        setData(null);
        return;
      }
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!data?.campaign) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Legacy campaigns
        </Link>
        <p className="text-sm text-muted-foreground">Campaign not found.</p>
      </div>
    );
  }

  const { campaign, submissions, commenterCount, subscribedCount } = data;
  const verifiedCount = submissions.filter((submission) => submission.verified).length;
  const deliveredCount = submissions.filter((submission) => submission.delivered).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Legacy campaigns
      </Link>

      <header className="rounded-xl border border-border/60 bg-card/45 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <Archive className="size-3.5" /> Archived workflow
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{campaign.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Historical LinkedIn keyword/comment capture record. The current funnel uses portal resource links instead.
            </p>
          </div>
          <Badge variant={campaign.is_active ? "outline" : "secondary"}>
            {campaign.is_active ? "Still marked active" : "Archived"}
          </Badge>
        </div>
      </header>

      <Card className="grid overflow-hidden border-border/60 bg-card/40 sm:grid-cols-5">
        <Stat label="Commenters" value={commenterCount} />
        <Stat label="Submissions" value={submissions.length} />
        <Stat label="Verified" value={verifiedCount} />
        <Stat label="Delivered" value={deliveredCount} />
        <Stat label="Paid customers" value={subscribedCount} />
      </Card>

      <Card className="space-y-3 border-border/60 bg-card/40 p-4 text-sm">
        <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
          <span className="text-muted-foreground">Keyword</span>
          <span className="font-mono">{campaign.keyword}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
          <span className="text-muted-foreground">Post</span>
          <span className="truncate font-mono text-muted-foreground">{campaign.post_url ?? "-"}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
          <span className="text-muted-foreground">Resource</span>
          <span className="truncate font-mono text-muted-foreground">{campaign.resource_url}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
          <span className="text-muted-foreground">Last processed</span>
          <span className="font-mono text-muted-foreground">{formatTime(campaign.last_processed_at)}</span>
        </div>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Submissions</h2>
          <span className="font-mono text-xs text-muted-foreground">{submissions.length} total</span>
        </div>

        {submissions.length === 0 ? (
          <Card className="border-border/60 bg-card/35 p-10 text-center text-sm text-muted-foreground">
            No historical submissions.
          </Card>
        ) : (
          <Card className="overflow-hidden border-border/60 bg-card/35">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Note</TableHead>
                  <TableHead className="w-24 text-center">Verified</TableHead>
                  <TableHead className="w-24 text-center">Sent</TableHead>
                  <TableHead className="w-32 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {submission.email}
                    </TableCell>
                    <TableCell className="hidden max-w-[220px] truncate text-xs md:table-cell">
                      {submission.comment || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusDot active={submission.verified} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusDot active={submission.delivered} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {formatTime(submission.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
    </div>
  );
}
