"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Undo2,
  Redo2,
  Strikethrough,
  Minus,
  Image as ImageIcon,
  Code2,
} from "lucide-react";

interface Props {
  initialHtml: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  focusMode?: boolean;
}

marked.setOptions({ gfm: true, breaks: true });

function isLikelyMarkdown(text: string): boolean {
  if (!text || text.length > 200_000) return false;
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/.test(text) ||
    /\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|^---$/m.test(text);
}

function isLikelyHtml(text: string): boolean {
  return /<[a-z][^>]*>/i.test(text) && /<\/[a-z]+>|\/>/i.test(text);
}

export function RichEditor({ initialHtml, onChange, readOnly = false, focusMode = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [htmlOpen, setHtmlOpen] = useState(false);
  const [htmlBuffer, setHtmlBuffer] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({
        placeholder: "Start writing the email. Lead with the one thing that matters most.",
      }),
      Typography,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
    ],
    content: initialHtml,
    editable: !readOnly,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none max-w-[68ch] mx-auto",
      },
      handlePaste(view, event) {
        const cb = event.clipboardData;
        if (!cb) return false;

        // 1) Image paste
        const items = Array.from(cb.items || []);
        const imgItem = items.find((it) => it.type.startsWith("image/"));
        if (imgItem) {
          const file = imgItem.getAsFile();
          if (file) {
            event.preventDefault();
            void uploadAndInsert(file);
            return true;
          }
        }

        // 2) HTML paste (preserve)
        const html = cb.getData("text/html");
        const text = cb.getData("text/plain");

        if (html && html.trim()) {
          // Tiptap handles HTML natively
          return false;
        }

        // 3) Markdown detection on plain-text paste
        if (text && isLikelyMarkdown(text)) {
          event.preventDefault();
          const rendered = marked.parse(text, { async: false }) as string;
          editor?.commands.insertContent(rendered);
          return true;
        }

        // 4) Raw HTML in plain text
        if (text && isLikelyHtml(text)) {
          event.preventDefault();
          editor?.commands.insertContent(text);
          return true;
        }
        return false;
      },
      handleDrop(_view, event) {
        const dt = (event as DragEvent).dataTransfer;
        const file = dt?.files?.[0];
        if (file && file.type.startsWith("image/")) {
          event.preventDefault();
          void uploadAndInsert(file);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== initialHtml && initialHtml) {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
  }, [initialHtml, editor]);

  async function uploadAndInsert(file: File) {
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        // Fallback: inline data URL so the user still sees the image immediately
        if (res.status === 501) {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            editor?.chain().focus().setImage({ src: dataUrl }).run();
            setUploadError(
              "Saved inline (Vercel Blob not configured). For production sends, replace with a hosted URL.",
            );
          };
          reader.readAsDataURL(file);
          return;
        }
        throw new Error(data.error || "Upload failed");
      }
      editor?.chain().focus().setImage({ src: data.url }).run();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertImageFromUrl() {
    if (!editor) return;
    const url = window.prompt("Image URL (must be a public https URL for emails)", "https://");
    if (!url || url === "https://") return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  function insertHtmlBuffer() {
    if (!editor || !htmlBuffer.trim()) {
      setHtmlOpen(false);
      return;
    }
    editor.chain().focus().insertContent(htmlBuffer).run();
    setHtmlBuffer("");
    setHtmlOpen(false);
  }

  if (!editor) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#151517] min-h-[600px] animate-pulse" />
    );
  }

  const railBtn =
    "h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 spring disabled:opacity-30 disabled:pointer-events-none";
  const railBtnActive = "bg-white/[0.08] text-zinc-100";

  const bubbleBtn =
    "h-8 px-2 inline-flex items-center justify-center rounded-md text-zinc-300 hover:bg-white/[0.08] hover:text-white spring";
  const bubbleBtnActive = "bg-white/[0.10] text-white";

  return (
    <div className="relative">
      {/* Selection bubble menu */}
      <BubbleMenu editor={editor} className="bubble-menu">
        <button
          type="button"
          aria-label="Bold"
          className={`${bubbleBtn} ${editor.isActive("bold") ? bubbleBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label="Italic"
          className={`${bubbleBtn} ${editor.isActive("italic") ? bubbleBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          aria-label="Strike"
          className={`${bubbleBtn} ${editor.isActive("strike") ? bubbleBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-3.5" strokeWidth={2.2} />
        </button>
        <span className="mx-0.5 h-4 w-px bg-white/10" />
        <button
          type="button"
          aria-label="H2"
          className={`${bubbleBtn} ${editor.isActive("heading", { level: 2 }) ? bubbleBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-[11px] font-semibold tracking-wide">H2</span>
        </button>
        <button
          type="button"
          aria-label="H3"
          className={`${bubbleBtn} ${editor.isActive("heading", { level: 3 }) ? bubbleBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="text-[11px] font-semibold tracking-wide">H3</span>
        </button>
        <button
          type="button"
          aria-label="Quote"
          className={`${bubbleBtn} ${editor.isActive("blockquote") ? bubbleBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-3.5" strokeWidth={2} />
        </button>
        <span className="mx-0.5 h-4 w-px bg-white/10" />
        <button
          type="button"
          aria-label="Link"
          className={`${bubbleBtn} ${editor.isActive("link") ? bubbleBtnActive : ""}`}
          onClick={setLink}
        >
          <LinkIcon className="size-3.5" strokeWidth={2} />
        </button>
      </BubbleMenu>

      {/* Sticky compact rail */}
      {!readOnly && !focusMode && (
        <div className="sticky top-[64px] z-20 mb-3 flex items-center justify-between gap-2 rounded-full border border-white/[0.06] bg-[#151517]/90 px-2 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Heading 1"
              className={`${railBtn} ${editor.isActive("heading", { level: 1 }) ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Heading 2"
              className={`${railBtn} ${editor.isActive("heading", { level: 2 }) ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Heading 3"
              className={`${railBtn} ${editor.isActive("heading", { level: 3 }) ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="size-4" strokeWidth={1.8} />
            </button>
            <span className="mx-1 h-4 w-px bg-white/10" />
            <button
              type="button"
              aria-label="Bullet list"
              className={`${railBtn} ${editor.isActive("bulletList") ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Ordered list"
              className={`${railBtn} ${editor.isActive("orderedList") ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Quote"
              className={`${railBtn} ${editor.isActive("blockquote") ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Code"
              className={`${railBtn} ${editor.isActive("code") ? railBtnActive : ""}`}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Divider"
              className={railBtn}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus className="size-4" strokeWidth={1.8} />
            </button>
            <span className="mx-1 h-4 w-px bg-white/10" />
            <button
              type="button"
              aria-label="Link"
              className={`${railBtn} ${editor.isActive("link") ? railBtnActive : ""}`}
              onClick={setLink}
            >
              <LinkIcon className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Insert image"
              className={railBtn}
              onClick={() => fileInputRef.current?.click()}
              title="Upload image"
            >
              <ImageIcon className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Image from URL"
              className={`${railBtn} text-[10px] font-mono tracking-wide`}
              onClick={insertImageFromUrl}
              title="Image from URL"
            >
              URL
            </button>
            <button
              type="button"
              aria-label="Insert HTML"
              className={railBtn}
              onClick={() => setHtmlOpen(true)}
              title="Insert HTML / embed"
            >
              <Code2 className="size-4" strokeWidth={1.8} />
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Undo"
              className={railBtn}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo2 className="size-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Redo"
              className={railBtn}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo2 className="size-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadAndInsert(file);
          e.target.value = "";
        }}
      />

      {uploadError && (
        <div className="mb-2 rounded-md border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-200">
          {uploadError}
        </div>
      )}

      {/* HTML insert sheet */}
      {htmlOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setHtmlOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/[0.06] bg-[#151517] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-zinc-100 mb-1">Insert HTML</h3>
            <p className="text-xs text-zinc-500 mb-3">
              Paste a snippet, embed, or table. It&apos;ll be inserted at the cursor.
            </p>
            <textarea
              autoFocus
              value={htmlBuffer}
              onChange={(e) => setHtmlBuffer(e.target.value)}
              spellCheck={false}
              placeholder='<div style="...">...</div>'
              className="w-full h-48 rounded-md border border-white/[0.06] bg-[#0c0c0e] text-zinc-100 text-sm font-mono p-3 outline-none focus:border-white/[0.12] resize-none"
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setHtmlOpen(false)}
                className="h-8 px-3 rounded-md text-sm text-zinc-300 hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertHtmlBuffer}
                className="h-8 px-4 rounded-md bg-zinc-100 text-zinc-950 text-sm font-semibold hover:bg-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paper canvas */}
      <div
        className={`editor-paper rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden spring ${
          focusMode ? "min-h-[80dvh]" : "min-h-[640px]"
        }`}
      >
        <div className={`${focusMode ? "py-24 md:py-32 px-6 md:px-12" : "py-16 md:py-20 px-6 md:px-10"}`}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
