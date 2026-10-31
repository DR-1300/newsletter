"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DeleteButton({
    id,
    title,
}: {
    id:string,
    title:string,
}) {
    const router = useRouter();
    const [ loading , setLoading ] = useState(false)
    async function handleDelete() {
        if (!window.confirm(`Delete "${title}"? even comments will go cro`)){
            return;
        }
        setLoading(true);
    try {
        const res = await fetch(`${API_URL}/articles/${id}`, {method: "DELETE"});
        if (res.ok) {
            router.refresh();
            return;
        }
        window.alert("try again, couldnt delete sorr")
    } catch {
        window.alert("for the last time what is wrong w backend")
    } finally {
        setLoading(false)
    }
    }
          return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="ml-4 text-alert/80 transition hover:text-alert disabled:opacity-50"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}