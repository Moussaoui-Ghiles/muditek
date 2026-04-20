"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  is_new: boolean;
  created_at: string;
}

const CATS = ["all", "skill", "playbook", "automation", "template"] as const;

export default function PortalContent({
  items,
  displayName,
  email,
  memberSince,
  stripeCustomerId,
}: {
  items: ContentItem[];
  displayName: string;
  email: string;
  memberSince: string;
  stripeCustomerId: string | null;
}) {
  const [cat, setCat] = useState<string>("all");
  const filtered = cat === "all" ? items : items.filter((i) => i.category === cat);
  const counts: Record<string, number> = {};
  for (const i of items) counts[i.category] = (counts[i.category] || 0) + 1;

  return (
    <div className="min-h-[100dvh] bg-[#0c0c0e] text-[#e8e8ec]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-[#232326]" style={{ background: "rgba(12,12,14,0.88)" }}>
        <div className="max-w-[900px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <span className="text-sm font-bold tracking-wide">MudiKit</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#636366] hidden sm:block">{email}</span>
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          </div>
        </div>
      </header>

      <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-1">{displayName}</h1>
          <p className="text-sm text-[#a0a0a6]">
            {items.length > 0
              ? `${items.length} items${items.filter((i) => i.is_new).length > 0 ? ` \u00b7 ${items.filter((i) => i.is_new).length} new` : ""}`
              : "Content is being prepared."}
          </p>
        </div>

        {/* Filter */}
        {items.length > 0 && (
          <div className="flex gap-1 mb-8 border-b border-[#232326] overflow-x-auto">
            {CATS.map((c) => {
              const n = c === "all" ? items.length : counts[c] || 0;
              const on = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
                    on ? "border-[#e8e8ec] text-[#e8e8ec]" : "border-transparent text-[#636366] hover:text-[#a0a0a6]"
                  }`}
                >
                  {c === "all" ? "All" : `${c}s`}
                  <span className="ml-1.5 text-xs">{n}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Items */}
        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-bold mb-2">Content is on the way</p>
            <p className="text-[#a0a0a6] max-w-sm mx-auto">Your subscription is active. You&apos;ll get an email when the first drop lands.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#a0a0a6]">No {cat}s yet.</p>
          </div>
        ) : (
          <div className="border-t border-[#232326]">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#232326] group">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold group-hover:underline">{item.title}</span>
                    {item.is_new && (
                      <span className="text-[9px] px-1.5 py-px rounded bg-[#e8e8ec] text-[#0c0c0e] font-black uppercase tracking-wider">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#636366] font-[family-name:var(--font-geist-mono)]">
                    <span className="capitalize">{item.category}</span>
                    <span>{item.file_type.toUpperCase()}</span>
                    <span>{new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <a
                  href={item.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-medium text-[#a0a0a6] hover:text-[#e8e8ec] transition-colors"
                >
                  Download &darr;
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-[#232326] flex items-center gap-6 text-sm text-[#636366]">
          {stripeCustomerId && (
            <Link href="/api/portal/billing" prefetch={false} className="hover:text-[#e8e8ec] transition-colors">
              Manage subscription
            </Link>
          )}
          <span className="ml-auto">Since {new Date(memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}
