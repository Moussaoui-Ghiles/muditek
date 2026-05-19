import { isContentTopic } from "@/lib/content-item";

export const CONTENT_CATEGORIES = ["skill", "playbook", "guide", "tool", "automation", "template"] as const;
export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export const FILE_TYPES = ["zip", "pdf", "md", "html", "url"] as const;
export type FileType = (typeof FILE_TYPES)[number];

export interface NormalizedContentPayload {
  title: string;
  slug: string;
  description: string | null;
  category: ContentCategory;
  topic: string | null;
  downloadUrl: string;
  fileType: FileType;
  thumbnailUrl: string | null;
  isFree: boolean;
  isNew: boolean;
}

export interface ExistingContentRecord {
  title: string;
  slug: string;
  category: string;
  topic?: string | null;
  description?: string | null;
  download_url?: string | null;
  file_type?: string | null;
  thumbnail_url?: string | null;
  is_free?: boolean;
  is_new?: boolean;
}

function coerceCategory(value: unknown): ContentCategory | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return (CONTENT_CATEGORIES as readonly string[]).includes(normalized)
    ? (normalized as ContentCategory)
    : null;
}

function coerceFileType(value: unknown): FileType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return (FILE_TYPES as readonly string[]).includes(normalized)
    ? (normalized as FileType)
    : null;
}

function coerceString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function coerceTopic(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return "__invalid__" as const;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  return isContentTopic(normalized) ? normalized : "__invalid__" as const;
}

function coerceBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();

  if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "off"].includes(normalized)) return false;

  return null;
}

function autoSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeDownload(fileType: FileType, downloadUrl: string | null, slug: string): string {
  if (fileType === "html") {
    return downloadUrl || `/portal/playbooks/${slug}`;
  }
  return downloadUrl || "";
}

export function normalizeCreatePayload(body: unknown): { ok: true; payload: NormalizedContentPayload } | { ok: false; error: string } {
  if (body == null || typeof body !== "object") {
    return { ok: false, error: "Invalid payload." };
  }

  const input = body as Record<string, unknown>;

  const title = coerceString(input.title);
  if (!title) {
    return { ok: false, error: "Title is required." };
  }

  const slug = coerceString(input.slug) || autoSlug(title);
  if (!slug) {
    return { ok: false, error: "Slug is required." };
  }

  const category = coerceCategory(input.category);
  if (!category) {
    return { ok: false, error: "Invalid category." };
  }

  const topicValue = coerceTopic(input.topic);
  if (topicValue === "__invalid__") {
    return { ok: false, error: "Invalid topic." };
  }

  const fileType = coerceFileType(input.fileType) || "zip";
  const downloadUrlInput = coerceString(input.downloadUrl);
  const downloadUrl = normalizeDownload(fileType, downloadUrlInput, slug);
  if (fileType !== "html" && !downloadUrl) {
    return { ok: false, error: `downloadUrl is required for ${fileType} files.` };
  }

  const isFree = coerceBoolean(input.isFree);
  const isNew = coerceBoolean(input.isNew);
  const thumbnailUrl = coerceString(input.thumbnailUrl);

  return {
    ok: true,
    payload: {
      title,
      slug,
      description: coerceString(input.description),
      category,
      topic: topicValue === undefined ? null : (topicValue as string | null),
      downloadUrl,
      fileType,
      thumbnailUrl,
      isFree: isFree ?? true,
      isNew: isNew ?? true,
    },
  };
}

export function normalizeUpdatePayload(
  body: unknown,
  existing: ExistingContentRecord,
): { ok: true; payload: NormalizedContentPayload } | { ok: false; error: string } {
  if (body == null || typeof body !== "object") {
    return { ok: false, error: "Invalid payload." };
  }

  const input = body as Record<string, unknown>;

  const title = coerceString(input.title) || existing.title;
  const slug = coerceString(input.slug) || existing.slug;
  if (!slug) {
    return { ok: false, error: "Slug is required." };
  }

  const category =
    input.category === undefined
      ? (coerceCategory(existing.category) || (existing.category as ContentCategory))
      : coerceCategory(input.category);
  if (!category) {
    return { ok: false, error: "Invalid category." };
  }

  const rawTopic = input.topic === undefined ? existing.topic ?? null : input.topic;
  const topicValue =
    input.topic === undefined && !isContentTopic(existing.topic)
      ? null
      : coerceTopic(rawTopic);
  if (topicValue === "__invalid__") {
    return { ok: false, error: "Invalid topic." };
  }

  const fileType = coerceFileType(input.fileType) || coerceFileType(existing.file_type) || "zip";
  const incomingDownload = typeof input.downloadUrl === "string" ? coerceString(input.downloadUrl) : undefined;
  const resolvedDownload =
    incomingDownload !== undefined
      ? incomingDownload
      : coerceString(existing.download_url) || "";

  const downloadUrl = normalizeDownload(fileType, resolvedDownload, slug);
  if (fileType !== "html" && !downloadUrl) {
    return { ok: false, error: `downloadUrl is required for ${fileType} files.` };
  }

  const isFree =
    input.isFree === undefined ? existing.is_free ?? true : coerceBoolean(input.isFree);
  if (isFree === null || isFree === undefined) {
    return { ok: false, error: "isFree must be a boolean." };
  }

  const isNew =
    input.isNew === undefined ? existing.is_new ?? true : coerceBoolean(input.isNew);
  if (isNew === null || isNew === undefined) {
    return { ok: false, error: "isNew must be a boolean." };
  }

  const thumbnailUrl =
    input.thumbnailUrl === undefined
      ? (existing.thumbnail_url ?? null)
      : coerceString(input.thumbnailUrl) ?? null;

  return {
    ok: true,
    payload: {
      title,
      slug,
      description:
        input.description === undefined
          ? existing.description ?? null
          : coerceString(input.description),
      category,
      topic: topicValue === null || topicValue === undefined ? null : topicValue,
      downloadUrl,
      fileType,
      thumbnailUrl,
      isFree,
      isNew,
    },
  };
}
