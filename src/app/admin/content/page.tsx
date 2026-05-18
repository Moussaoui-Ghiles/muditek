"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import TestSendDialog from "@/components/admin/test-send-dialog";
import { resourceDetailHref } from "@/lib/content-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  thumbnail_url: string | null;
  is_new: boolean;
  is_free: boolean;
  created_at: string;
  updated_at?: string | null;
}

interface Draft {
  title: string;
  slug: string;
  description: string;
  category: string;
  downloadUrl: string;
  fileType: string;
  thumbnailUrl: string;
  isFree: boolean;
  isNew: boolean;
}

const CATEGORIES = [
  { value: "skill", label: "Skill" },
  { value: "playbook", label: "Playbook" },
  { value: "guide", label: "Guide" },
  { value: "tool", label: "Scorecard" },
  { value: "automation", label: "Automation" },
  { value: "template", label: "Template" },
];
const FILE_TYPES = ["zip", "pdf", "md", "html", "url"];
const EMPTY_DRAFT: Draft = {
  title: "",
  slug: "",
  description: "",
  category: "playbook",
  downloadUrl: "",
  fileType: "url",
  thumbnailUrl: "",
  isFree: true,
  isNew: true,
};

function autoSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function portalHref(item: Pick<ContentItem, "slug" | "category">) {
  return resourceDetailHref(item);
}

function unlockHref(item: Pick<ContentItem, "slug">) {
  return `/r/${item.slug}`;
}

function itemToDraft(item: ContentItem): Draft {
  return {
    title: item.title,
    slug: item.slug,
    description: item.description ?? "",
    category: item.category,
    downloadUrl: item.download_url,
    fileType: item.file_type || "url",
    thumbnailUrl: item.thumbnail_url ?? "",
    isFree: item.is_free,
    isNew: item.is_new,
  };
}

function isFileBackedSkill(item: Pick<ContentItem, "id">) {
  return item.id.startsWith("local-skill-");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Never";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function categoryLabel(value: string) {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value;
}

function VisibilityBadge({ item }: { item: ContentItem }) {
  return (
    <Badge
      variant={item.is_free ? "secondary" : "default"}
      className={
        item.is_free
          ? "rounded-md bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/15"
          : "rounded-md bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30 hover:bg-sky-500/20"
      }
    >
      {item.is_free ? "Portal" : "MudiKit"}
    </Badge>
  );
}

function MissingThumbBadge() {
  return (
    <Badge
      variant="outline"
      className="rounded-md border-amber-500/40 bg-amber-500/10 text-amber-200"
    >
      <AlertTriangle className="size-3" />
      No thumbnail
    </Badge>
  );
}

function Thumbnail({ item, large = false }: { item: Pick<ContentItem, "thumbnail_url" | "category">; large?: boolean }) {
  const className = large ? "h-40 w-full rounded-lg" : "size-16 rounded-md";

  if (item.thumbnail_url) {
    return (
      <div className={`${className} overflow-hidden border border-white/[0.08] bg-white/[0.03]`}>
        <img src={item.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`${className} flex items-end border border-white/[0.08] bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.14),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))] p-3`}
    >
      <div>
        <ImageIcon className="mb-1 size-4 text-muted-foreground" />
        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {item.category}
        </p>
      </div>
    </div>
  );
}

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://muditek.com";
    const fullValue = value.startsWith("/") ? `${origin}${value}` : value;
    await navigator.clipboard.writeText(fullValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"all" | "free" | "paid">("all");
  const [message, setMessage] = useState("");
  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState("");
  const [testOpen, setTestOpen] = useState(false);
  const [deleteArmedId, setDeleteArmedId] = useState<string | null>(null);

  const editingItem = editingId ? items.find((item) => item.id === editingId) ?? null : null;
  const editingFileBackedSkill = editingItem ? isFileBackedSkill(editingItem) : false;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesVisibility =
        visibility === "all" ||
        (visibility === "free" && item.is_free) ||
        (visibility === "paid" && !item.is_free);
      const haystack = [item.title, item.slug, item.description, item.category, item.file_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesVisibility && (!needle || haystack.includes(needle));
    });
  }, [items, query, visibility]);

  const paidCount = items.filter((item) => !item.is_free).length;
  const freeCount = items.filter((item) => item.is_free).length;
  const missingThumbCount = items.filter((item) => !item.thumbnail_url).length;
  const newPaidCount = items.filter((item) => !item.is_free && item.is_new).length;

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setMessage("");
  }

  function startEdit(item: ContentItem) {
    setDraft(itemToDraft(item));
    setEditingId(item.id);
    setMessage("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const slug = draft.slug || autoSlug(draft.title);
    const downloadUrl =
      draft.fileType === "html" && !draft.downloadUrl.trim()
        ? `/portal/playbooks/${slug}`
        : draft.downloadUrl;
    const payload = {
      ...draft,
      slug,
      description: draft.description || null,
      downloadUrl,
      thumbnailUrl: draft.thumbnailUrl || "",
    };

    try {
      const res = await fetch(editingId ? `/api/admin/content/${editingId}` : "/api/admin/content", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setMessage(
        editingId
          ? editingId.startsWith("local-skill-")
            ? "Skill imported into the CMS."
            : "Resource updated."
          : "Resource created."
      );
      if (!editingId) resetDraft();
      await fetchData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleThumbnailUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("purpose", "content-thumbnail");
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      updateDraft("thumbnailUrl", data.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: ContentItem) {
    if (deleteArmedId !== item.id) {
      setDeleteArmedId(item.id);
      window.setTimeout(() => {
        setDeleteArmedId((current) => (current === item.id ? null : current));
      }, 4000);
      return;
    }
    setDeleteArmedId(null);
    await fetch(`/api/admin/content/${item.id}`, { method: "DELETE" });
    if (editingId === item.id) resetDraft();
    await fetchData();
  }

  async function handleNotify() {
    setNotifying(true);
    setNotifyResult("");
    try {
      const res = await fetch("/api/admin/content/notify", { method: "POST" });
      const data = await res.json();
      setNotifyResult(
        data.sent > 0
          ? `Notified ${data.sent} subscribers about ${data.newItems} new items`
          : data.message || "No new paid items to notify about"
      );
      fetchData();
    } catch {
      setNotifyResult("Failed to send notification.");
    } finally {
      setNotifying(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <section className="min-w-0">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.07] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Portal CMS
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Content library</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage the resources that appear in the portal, MudiKit, and tracked unlock links.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setTestOpen(true)}>
              Preview notification
            </Button>
            <Button type="button" onClick={handleNotify} disabled={notifying}>
              {notifying ? "Sending..." : "Notify paid"}
            </Button>
          </div>
        </div>

        <div className="mb-6 grid border-y border-white/[0.07] md:grid-cols-4 md:divide-x md:divide-white/[0.07]">
          <ShelfStat label="Portal" value={freeCount} />
          <ShelfStat label="MudiKit" value={paidCount} />
          <ShelfStat label="New paid" value={newPaidCount} />
          <ShelfStat label="No thumbnail" value={missingThumbCount} />
        </div>

        {(message || notifyResult) && (
          <div className="mb-5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-muted-foreground">
            {message || notifyResult}
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "free", "paid"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={visibility === value ? "default" : "outline"}
                onClick={() => setVisibility(value)}
              >
                {value === "all" ? "All" : value === "free" ? "Portal" : "MudiKit"}
              </Button>
            ))}
          </div>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources"
            className="h-9 sm:max-w-xs"
          />
        </div>

        <TestSendDialog
          open={testOpen}
          onOpenChange={setTestOpen}
          mode="drop"
          contentTitle={editingItem?.title || "MudiKit drop preview"}
        />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-28 w-full" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="p-10">
            <p className="text-sm font-medium">No content items found.</p>
            <p className="mt-1 text-sm text-muted-foreground">Create or adjust the filter to see items.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden border-l-4 bg-white/[0.025] p-0 ${
                  item.is_free
                    ? "border-l-emerald-500/60 border-y-white/[0.08] border-r-white/[0.08]"
                    : "border-l-sky-500/60 border-y-white/[0.08] border-r-white/[0.08]"
                } ${editingId === item.id ? "ring-1 ring-white/[0.18]" : ""}`}
              >
                <div className="grid gap-4 p-4 md:grid-cols-[64px_1fr_auto] md:items-start">
                  <Thumbnail item={item} />
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="min-w-0 truncate text-sm font-medium">{item.title}</h2>
                      <VisibilityBadge item={item} />
                      {item.is_new && <Badge className="rounded-md">New</Badge>}
                      <Badge variant="outline" className="rounded-md">
                        {categoryLabel(item.category)}
                      </Badge>
                      {isFileBackedSkill(item) && (
                        <Badge variant="outline" className="rounded-md border-violet-400/30 text-violet-200">
                          File skill
                        </Badge>
                      )}
                      {!item.thumbnail_url && <MissingThumbBadge />}
                    </div>
                    {item.description && (
                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    )}
                    <p className="mt-2 truncate font-mono text-xs text-muted-foreground">
                      {item.slug} · {item.file_type} · updated {formatDate(item.updated_at || item.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(item)}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      render={<Link href={portalHref(item)} target="_blank" />}
                      nativeButton={false}
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="size-3.5" />
                      Portal
                    </Button>
                    {item.is_free && <CopyButton value={unlockHref(item)} label="Unlock link" />}
                    {!isFileBackedSkill(item) && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant={deleteArmedId === item.id ? "destructive" : "ghost"}
                        onClick={() => handleDelete(item)}
                        className={
                          deleteArmedId === item.id
                            ? ""
                            : "text-muted-foreground hover:text-destructive"
                        }
                        aria-label={deleteArmedId === item.id ? "Confirm delete" : "Delete content item"}
                        title={deleteArmedId === item.id ? "Click again to confirm" : "Delete"}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Card className="border-white/[0.08] bg-white/[0.025] p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{editingId ? "Edit resource" : "Add resource"}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This feeds the signed-in portal and tracked unlock links.
              </p>
            </div>
            {editingId ? (
              <Button type="button" size="icon-sm" variant="ghost" onClick={resetDraft} aria-label="Cancel edit">
                <X className="size-4" />
              </Button>
            ) : (
              <span className="flex size-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
                <Plus className="size-4" />
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={draft.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setDraft((current) => ({
                    ...current,
                    title,
                    slug: current.slug && editingId ? current.slug : autoSlug(title),
                  }));
                }}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                required
                value={draft.slug}
                onChange={(event) => updateDraft("slug", autoSlug(event.target.value))}
                disabled={editingFileBackedSkill}
                className="font-mono"
              />
              {editingFileBackedSkill && (
                <p className="text-xs leading-5 text-muted-foreground">
                  File-backed skill slugs stay locked so folder download and markdown copy keep working.
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="downloadUrl">Asset URL</Label>
              <Input
                id="downloadUrl"
                required={draft.fileType !== "html"}
                value={draft.downloadUrl}
                onChange={(event) => updateDraft("downloadUrl", event.target.value)}
                placeholder={draft.fileType === "html" ? "Optional for HTML reader" : "https://... or /playbooks/file.pdf"}
              />
              {draft.fileType === "html" && (
                <p className="text-xs leading-5 text-muted-foreground">
                  HTML resources open in the portal. Leave this blank when the HTML file lives in <span className="font-mono">content/playbooks/{draft.slug || "slug"}.html</span>.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Select value={draft.category} onValueChange={(value) => updateDraft("category", value ?? "playbook")}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="fileType">File type</Label>
                <Select value={draft.fileType} onValueChange={(value) => updateDraft("fileType", value ?? "url")}>
                  <SelectTrigger id="fileType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="thumbnailUrl">Thumbnail</Label>
                <label className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-white/[0.08] px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Upload className="size-3.5" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(event) => handleThumbnailUpload(event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <Thumbnail
                item={{ thumbnail_url: draft.thumbnailUrl || null, category: draft.category }}
                large
              />
              <Input
                id="thumbnailUrl"
                value={draft.thumbnailUrl}
                onChange={(event) => updateDraft("thumbnailUrl", event.target.value)}
                placeholder="https://image-url"
              />
            </div>

            <div className="grid gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="block font-medium">Portal item</span>
                  <span className="block text-xs text-muted-foreground">Portal items get tracked `/r/slug` unlock links.</span>
                </span>
                <input
                  type="checkbox"
                  checked={draft.isFree}
                  onChange={(event) => updateDraft("isFree", event.target.checked)}
                  className="size-4 accent-foreground"
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="block font-medium">New drop</span>
                  <span className="block text-xs text-muted-foreground">Used by paid notification emails.</span>
                </span>
                <input
                  type="checkbox"
                  checked={draft.isNew}
                  onChange={(event) => updateDraft("isNew", event.target.checked)}
                  className="size-4 accent-foreground"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? <RefreshCw className="size-4 animate-spin" /> : null}
                {editingId ? "Save changes" : "Create resource"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetDraft}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </aside>
    </div>
  );
}

function ShelfStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
