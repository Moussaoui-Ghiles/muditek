"use client";

import { useState } from "react";
import { FileText, Loader2, Search, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackPortalUsage } from "@/components/portal/portal-usage-tracker";

type Notice = {
  message: string;
  setupRequired: boolean;
};

export function WebsiteTextContactExtractorWorkbench() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [fetchedUrl, setFetchedUrl] = useState("");

  async function run() {
    setLoading(true);
    setNotice(null);
    setText("");
    setPreview("");
    setEmails([]);
    setPhones([]);
    setFetchedUrl("");
    try {
      const response = await fetch("/api/portal/tools/website-text-contact-extractor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice({
          message: data.error || "Text scrape failed.",
          setupRequired: false,
        });
        return;
      }
      trackPortalUsage("tool_used", {
        resourceSlug: "website-text-contact-extractor",
        metadata: {
          source_url: data.sourceUrl,
          email_count: Array.isArray(data.contacts?.emails) ? data.contacts.emails.length : 0,
          phone_count: Array.isArray(data.contacts?.phones) ? data.contacts.phones.length : 0,
        },
      });
      setFetchedUrl(data.sourceUrl || url);
      setText(data.text || "");
      setPreview(data.preview || "");
      setEmails(data.contacts?.emails || []);
      setPhones(data.contacts?.phones || []);
    } catch (err) {
      setNotice({
        message: err instanceof Error ? err.message : "Text scrape failed.",
        setupRequired: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-[2px] border border-white/[0.08] bg-card/[0.36] p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
          <FileText className="size-3.5" />
          Contact extraction
        </div>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold text-foreground/70">Website URL</span>
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/about"
              className="mt-2"
            />
          </label>
          <Button
            type="button"
            onClick={run}
            disabled={loading || !url.trim()}
            className="w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Extract text and contacts
          </Button>
        </div>
      </section>

      <section className="min-h-[360px] rounded-[2px] border border-white/[0.08] bg-black/25 p-5">
        {notice && (
          <div className="rounded-[2px] border border-red-400/20 bg-red-500/10 p-4 text-[13px] leading-6 text-red-100">
            <p className="font-semibold">Scrape failed</p>
            <p className="mt-1 text-foreground/70">{notice.message}</p>
          </div>
        )}
        {!notice && !text && !loading && (
          <div className="flex h-full min-h-[300px] items-center justify-center text-center text-[13.5px] leading-6 text-foreground/55">
            Use this tool for fast contact hunting from landing pages and company web pages.
          </div>
        )}
        {text && (
          <div className="space-y-4">
            <div className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/80">Source</p>
              <p className="break-all font-mono text-[11px] text-foreground/60">{fetchedUrl}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/80">
                  <UserRoundSearch className="size-3.5" />
                  Emails
                </p>
                {emails.length === 0 ? (
                  <p className="text-[12px] text-foreground/55">No emails detected</p>
                ) : (
                  <ul className="space-y-1 text-[12px] text-foreground/70">
                    {emails.map((item) => (
                      <li key={item} className="truncate font-mono">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/80">Phones</p>
                {phones.length === 0 ? (
                  <p className="text-[12px] text-foreground/55">No phones detected</p>
                ) : (
                  <ul className="space-y-1 text-[12px] text-foreground/70">
                    {phones.map((item) => (
                      <li key={item} className="font-mono">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="rounded-[2px] border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/80">Text preview</p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words text-[12px] leading-6 text-foreground/70">
                {preview}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
