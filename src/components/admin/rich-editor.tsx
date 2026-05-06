"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect } from "react";
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
} from "lucide-react";

interface Props {
  initialHtml: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  focusMode?: boolean;
}

export function RichEditor({ initialHtml, onChange, readOnly = false, focusMode = false }: Props) {
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
        placeholder: "Start writing the issue. Lead with the one thing that matters most.",
      }),
      Typography,
    ],
    content: initialHtml,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none max-w-[68ch] mx-auto",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== initialHtml && initialHtml) {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
  }, [initialHtml, editor]);

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

      {/* Sticky compact rail (hides in focus mode) */}
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
