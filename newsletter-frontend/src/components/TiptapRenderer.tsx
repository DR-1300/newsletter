"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapRenderer({ content }: { content: unknown }){
    const editor = useEditor({
        extensions: [StarterKit],
        content: content as JSONContent,
        editable: false,
        immediatelyRender: false,
    })
    return (
    <div className="article-body">
        <EditorContent editor={editor} />
    </div> )
}

