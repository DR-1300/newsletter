"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  initialContent?: JSONContent;
  onChange: (json: JSONContent) => void;
};

function ToolbarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 text-[10px] uppercase tracking-widest transition ${
        active ? "bg-highlight text-ink" : "text-muted hover:text-paper"
      }`}
    >
      {label}
    </button>
  );
}

export default function TiptapEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: { class: "min-h-[240px] outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  if (!editor) return null;

  return (
    <div className="border border-muted/40">
      <div className="flex gap-1 border-b border-muted/40 p-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      </div>

      <div className="article-body p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}