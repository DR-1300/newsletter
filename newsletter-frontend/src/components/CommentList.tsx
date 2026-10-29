import { getComments } from "@/lib/api";
import type { Comment } from "@/lib/types";

export default async function CommentList({ articleId }: { articleId: string }) {
    let comments: Comment[] = [];

    try {
        comments = await getComments(articleId);
    } catch {
        return <p className="mt-6 text-xs text-muted">No comments yet lol</p>
    }

    return (
        <ul className="mt-6 space-y-6">
            {comments.map((c) => (
                <li key = {c.id}>
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                        {c.author_name ?? "Ananas"} ·{" "}
                        {new Date(c.created_at).toLocaleDateString("en-GB", {
                            day:"numeric",
                            month:"short",
                            year:"numeric",
                        })}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed">
                        {c.content}
                    </p>
                </li>
            ))}
        </ul>
    )
}