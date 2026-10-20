export type Article = {
    id: string;
    slug: string;
    title: string;
    description: string;
    contents: unknown;
    cover_image: string | null;
    published_at: string | null;
    tags: string[];
    category_id: string | null;
    status: "draft" | "published" | "archived";
    type: string;
    estimated_read_time: number;
     created_at: string;
}