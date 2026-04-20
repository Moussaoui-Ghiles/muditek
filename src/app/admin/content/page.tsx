"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import TestSendDialog from "@/components/admin/test-send-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const CATEGORIES = ["skill", "playbook", "automation", "template"];
const FILE_TYPES = ["zip", "pdf", "md"];

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("skill");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileType, setFileType] = useState("zip");
  const [creating, setCreating] = useState(false);

  const [notifying, setNotifying] = useState(false);
  const [notifyResult, setNotifyResult] = useState("");
  const [testOpen, setTestOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      setItems(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || autoSlug(title),
          description: description || null,
          category,
          downloadUrl,
          fileType,
        }),
      });
      if (res.ok) {
        setTitle("");
        setSlug("");
        setDescription("");
        setDownloadUrl("");
        setFileType("zip");
        fetchData();
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    fetchData();
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
          : data.message || "No new content to notify about"
      );
      fetchData();
    } catch {
      setNotifyResult("Failed");
    } finally {
      setNotifying(false);
    }
  }

  const grouped: Record<string, ContentItem[]> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Skills, playbooks, automations, and templates delivered to active subscribers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setTestOpen(true)}>
            Preview notification
          </Button>
          <Button onClick={handleNotify} disabled={notifying}>
            {notifying ? "Sending..." : "Notify subscribers"}
          </Button>
        </div>
      </div>

      {notifyResult && (
        <p className="text-sm text-muted-foreground">{notifyResult}</p>
      )}

      <TestSendDialog
        open={testOpen}
        onOpenChange={setTestOpen}
        mode="drop"
        contentTitle="Sample drop preview"
      />

      {/* Create form */}
      <Card className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Add content item</h2>
        <form onSubmit={handleCreate} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                placeholder="Outreach SDR Skill"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(autoSlug(e.target.value));
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="auto-generated"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="One-line summary shown in the portal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="downloadUrl">Download URL</Label>
            <Input
              id="downloadUrl"
              required
              placeholder="https://..."
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="grid gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "skill")}>
                <SelectTrigger id="category" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="fileType">File type</Label>
              <Select value={fileType} onValueChange={(v) => setFileType(v ?? "zip")}>
                <SelectTrigger id="fileType" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={creating} className="ml-auto self-end">
              {creating ? "Adding..." : "Add item"}
            </Button>
          </div>
        </form>
      </Card>

      <Separator />

      {/* List grouped by category */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-sm">No content items yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first item above.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <section key={cat}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {cat}s <span className="font-mono">· {catItems.length}</span>
              </h3>
              <div className="space-y-1.5">
                {catItems.map((item) => (
                  <Card key={item.id} className="p-4 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.title}</span>
                        {item.is_new && <Badge>New</Badge>}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {item.slug} · {item.file_type}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
