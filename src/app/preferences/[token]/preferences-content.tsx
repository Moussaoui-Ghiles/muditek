"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo/logo";

const TOPICS = [
  { value: "ai-agents", label: "AI agents for enterprise" },
  { value: "gtm-systems", label: "Go-to-market systems" },
  { value: "solo-operator", label: "Solo operator playbooks" },
];

interface Props {
  token: string;
  unsubscribed: boolean;
}

export default function PreferencesContent({ token, unsubscribed }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("active");
  const [topics, setTopics] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [unsubbing, setUnsubbing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/newsletter/preferences/${token}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setEmail(data.email);
          setStatus(data.status);
          setTopics(data.topics ?? []);
          setLoaded(true);
        }
      });
  }, [token]);

  function toggle(v: string) {
    setTopics((prev) => (prev.includes(v) ? prev.filter((t) => t !== v) : [...prev, v]));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/newsletter/preferences/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics }),
      });
      if (res.ok) setMsg("Saved");
      else {
        const d = await res.json();
        setMsg(d.error ?? "Failed");
      }
    } finally {
      setSaving(false);
    }
  }

  async function unsub() {
    setUnsubbing(true);
    try {
      const res = await fetch(`/api/newsletter/preferences/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unsub" }),
      });
      if (res.ok) {
        setStatus("unsub");
        setMsg("Unsubscribed. You won't receive more emails.");
      }
    } finally {
      setUnsubbing(false);
    }
  }

  if (notFound) {
    return (
      <main className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex items-center justify-center px-6">
        <div className="absolute top-8 left-8">
          <Link href="/" aria-label="Muditek home">
            <Logo variant="mark+text" size={24} />
          </Link>
        </div>
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Preferences not found</h1>
          <p className="text-[#a0a0a6]">This link may be invalid or expired.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0c] text-[#e8e8ec] flex items-center justify-center px-6 py-16">
      <div className="absolute top-8 left-8">
        <Link href="/" aria-label="Muditek home">
          <Logo variant="mark+text" size={24} />
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Email preferences</h1>
          {email && <p className="text-sm text-[#a0a0a6] mt-2">{email}</p>}
        </div>

        {unsubscribed && (
          <div className="mb-6 p-4 bg-[#151517] border border-white/[0.06] rounded-lg text-sm">
            You&apos;ve been unsubscribed. You can re-subscribe below anytime.
          </div>
        )}

        {!loaded ? (
          <p className="text-sm text-[#a0a0a6]">Loading…</p>
        ) : status === "unsub" ? (
          <div className="p-6 bg-[#151517] border border-white/[0.06] rounded-lg">
            <p className="text-sm mb-4">You are currently unsubscribed.</p>
            <button
              onClick={async () => {
                const res = await fetch(`/api/newsletter/subscribe`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, topics: TOPICS.map((t) => t.value) }),
                });
                if (res.ok) { setStatus("active"); setMsg("Resubscribed"); setTopics(TOPICS.map((t) => t.value)); }
              }}
              className="px-5 py-2.5 bg-[#e8e8ec] text-[#0a0a0c] font-medium rounded-lg hover:bg-white text-sm"
            >
              Resubscribe
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Topics</label>
              <div className="space-y-2">
                {TOPICS.map((t) => (
                  <label
                    key={t.value}
                    className="flex items-center gap-3 p-3 bg-[#151517] border border-white/[0.06] rounded-lg cursor-pointer hover:border-[#3a3a3e]"
                  >
                    <input
                      type="checkbox"
                      checked={topics.includes(t.value)}
                      onChange={() => toggle(t.value)}
                      className="size-4 accent-[#e8e8ec]"
                    />
                    <span className="text-sm">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {msg && <p className="text-sm text-[#a0a0a6]">{msg}</p>}

            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving || topics.length === 0}
                className="flex-1 px-5 py-2.5 bg-[#e8e8ec] text-[#0a0a0c] font-medium rounded-lg hover:bg-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={unsub}
                disabled={unsubbing}
                className="px-5 py-2.5 border border-white/[0.06] text-[#a0a0a6] font-medium rounded-lg hover:border-[#3a3a3e] hover:text-[#e8e8ec] text-sm"
              >
                {unsubbing ? "…" : "Unsubscribe"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
