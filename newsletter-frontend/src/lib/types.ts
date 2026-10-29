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

export type Category = {
    id: string;
    name: string;
    slug: string | null;
}

export type Comment = {
    id: string;
    article_id: string;
    author_name: string | null;
    content: string;
    created_at: string;
}

export type Subscriber = {
    id: string;
    email: string;
    subscribed_at: string;
    is_verified: boolean;
    unsubscribe_token: string | null;
}