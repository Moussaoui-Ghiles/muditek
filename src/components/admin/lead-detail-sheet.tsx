"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadDetail {
  submission: {
    source_type: "campaign" | "resource" | "portal";
    id: string;
    name: string;
    email: string;
    comment: string | null;
    verified: boolean;
    delivered: boolean;
    created_at: string;
    campaign_title: string | null;
    campaign_keyword: string | null;
    campaign_post_url: string | null;
    campaign_resource_url: string | null;
    resource_slug: string | null;
    resource_title: string | null;
    resource_category: string | null;
    resource_source: string | null;
    last_seen_at: string | null;
  };
  deliveries: Array<{ id: string; sent_at: string; resend_email_id: string | null }>;
  sequenceSends: Array<{ step: number; sent_at: string }>;
  subscriber: {
    id: string;
    status: string;
    stripe_customer_id: string | null;
    created_at: string;
  } | null;
}

interface Props {
  selectedId: string | null;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function sourceBadge(sourceType: LeadDetail["submission"]["source_type"]): string {
  if (sourceType === "portal") return "Portal signup";
  if (sourceType === "resource") return "Resource unlock";
  return "Campaign lead";
}

function portalResourceHref(category: string | null, slug: string): string {
  if (category === "skill") return `/portal/skills/${encodeURIComponent(slug)}`;
  if (category === "tool") return `/portal/tools/${encodeURIComponent(slug)}`;
  return `/portal/playbooks/${encodeURIComponent(slug)}`;
}

export default function LeadDetailSheet({ selectedId, onOpenChange, onRefresh }: Props) {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [delivering, setDelivering] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/leads/${selectedId}`)
      .then((r) => r.json())
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [selectedId]);

  async function refreshDetail() {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedId}`);
      setDetail(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function forceDeliver() {
    if (!detail) return;
    if (detail.submission.source_type !== "campaign") return;
    if (!confirm("Force-send the lead magnet to this submission?")) return;
    setDelivering(true);
    try {
      const res = await fetch(
        `/api/admin/submissions/${detail.submission.id}/force-deliver`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }
      await refreshDetail();
      onRefresh?.();
    } finally {
      setDelivering(false);
    }
  }

  return (
    <Sheet open={!!selectedId} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{detail?.submission.name || "Lead"}</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {detail?.submission.email}
          </SheetDescription>
        </SheetHeader>
        {loading || !detail ? (
          <div className="px-6 pb-6 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {sourceBadge(detail.submission.source_type)}
              </Badge>
              <Badge variant={detail.submission.verified ? "default" : "secondary"}>
                {detail.submission.verified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant={detail.submission.delivered ? "default" : "secondary"}>
                {detail.submission.delivered ? "Delivered" : "Undelivered"}
              </Badge>
              {detail.subscriber && (
                <Badge>Subscriber · {detail.subscriber.status}</Badge>
              )}
            </div>

            {detail.submission.source_type === "portal" ? (
              <Section title="Portal">
                <Row label="Source" value={detail.submission.resource_source || "portal"} mono />
                <Row label="Signed up" value={formatDateTime(detail.submission.created_at)} />
              </Section>
            ) : detail.submission.source_type === "resource" ? (
              <Section title="Resource">
                <Row label="Title" value={detail.submission.resource_title || detail.submission.resource_slug || "-"} />
                <Row label="Slug" value={detail.submission.resource_slug || "-"} mono />
                <Row label="Category" value={detail.submission.resource_category || "-"} />
                <Row label="Source" value={detail.submission.resource_source || "-"} mono />
                <Row label="First opened" value={formatDateTime(detail.submission.created_at)} />
                {detail.submission.last_seen_at && (
                  <Row label="Last seen" value={formatDateTime(detail.submission.last_seen_at)} />
                )}
                {detail.submission.resource_slug && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={<Link href={`/r/${encodeURIComponent(detail.submission.resource_slug)}`} />}
                    >
                      Open share page
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={
                        <Link
                          href={portalResourceHref(
                            detail.submission.resource_category,
                            detail.submission.resource_slug,
                          )}
                        />
                      }
                    >
                      Open in portal
                    </Button>
                  </div>
                )}
              </Section>
            ) : (
              <Section title="Campaign">
                <Row label="Title" value={detail.submission.campaign_title || "-"} />
                <Row
                  label="Keyword"
                  value={detail.submission.campaign_keyword || "-"}
                  mono
                />
                <Row
                  label="Submitted"
                  value={formatDateTime(detail.submission.created_at)}
                />
                {detail.submission.comment && (
                  <Row label="Comment" value={detail.submission.comment} />
                )}
              </Section>
            )}

            <Section title={`Deliveries (${detail.deliveries.length})`}>
              {detail.submission.source_type === "portal" ? (
                <p className="text-sm text-muted-foreground">
                  Direct portal signups do not need a lead magnet delivery email.
                </p>
              ) : detail.submission.source_type === "resource" ? (
                <p className="text-sm text-muted-foreground">
                  Resource unlocks open directly in the portal. No separate delivery email is required.
                </p>
              ) : detail.deliveries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deliveries yet.</p>
              ) : (
                detail.deliveries.map((d) => (
                  <Row
                    key={d.id}
                    label={formatDateTime(d.sent_at)}
                    value={d.resend_email_id || "—"}
                    mono
                  />
                ))
              )}
            </Section>

            <Section title={`Nurture steps sent (${detail.sequenceSends.length})`}>
              {detail.sequenceSends.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No nurture emails sent yet.
                </p>
              ) : (
                detail.sequenceSends.map((s) => (
                  <Row
                    key={s.step}
                    label={`Step ${s.step}`}
                    value={formatDateTime(s.sent_at)}
                  />
                ))
              )}
            </Section>

            {detail.subscriber?.stripe_customer_id && (
              <Section title="Stripe">
                <a
                  href={`https://dashboard.stripe.com/customers/${detail.subscriber.stripe_customer_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono underline hover:no-underline"
                >
                  {detail.subscriber.stripe_customer_id}
                </a>
              </Section>
            )}

            {detail.submission.source_type === "campaign" && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  onClick={forceDeliver}
                  disabled={delivering || detail.submission.delivered}
                  className="flex-1"
                >
                  {delivering
                    ? "Sending..."
                    : detail.submission.delivered
                      ? "Already delivered"
                      : "Force deliver"}
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
