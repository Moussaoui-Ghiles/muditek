"use client";

import { useEditor, EditorContent } from "@tiptap/react";
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
}

export function RichEditor({ initialHtml, onChange, readOnly = false }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "underline text-primary" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your issue...",
      }),
      Typography,
    ],
    content: initialHtml,
    editable: !readOnly,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[500px] focus:outline-none px-6 py-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-[15px] [&_p]:leading-[1.7] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono [&_hr]:my-6 [&_hr]:border-border [&_strong]:font-semibold [&_em]:italic",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== initialHtml && initialHtml) {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
  }, [initialHtml, editor]);

  if (!editor) return <div className="min-h-[500px] bg-card animate-pulse rounded-md" />;

  function setLink() {
    const url = window.prompt("URL", editor!.getAttributes("link").href || "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn =
    "size-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none";
  const btnActive = "bg-secondary text-foreground";

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      {!readOnly && (
        <div className="flex items-center gap-0.5 flex-wrap border-b border-border px-2 py-1.5 bg-card sticky top-0 z-10">
          <button
            type="button"
            className={`${btn} ${editor.isActive("heading", { level: 1 }) ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("heading", { level: 2 }) ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("heading", { level: 3 }) ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 className="size-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            className={`${btn} ${editor.isActive("bold") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("italic") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("strike") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="size-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            className={`${btn} ${editor.isActive("bulletList") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("orderedList") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered list"
          >
            <ListOrdered className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("blockquote") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote className="size-4" />
          </button>
          <button
            type="button"
            className={`${btn} ${editor.isActive("code") ? btnActive : ""}`}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline code"
          >
            <Code className="size-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="size-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            className={`${btn} ${editor.isActive("link") ? btnActive : ""}`}
            onClick={setLink}
            title="Link"
          >
            <LinkIcon className="size-4" />
          </button>

          <span className="ml-auto" />

          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo2 className="size-4" />
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
