/* Client-safe helpers and types (no Node APIs). */

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  cover?: string;
  coverCaption?: string;
  excerpt?: string;
  draft?: boolean;
  readingTime: string;
  /** "repo" = Markdown file in content/posts, "admin" = published from the admin dashboard */
  source?: "repo" | "admin";
}

/** Editable post fields used by the admin editor. */
export interface PostInput {
  slug: string;
  title: string;
  date: string;
  category: string;
  author: string;
  cover?: string;
  coverCaption?: string;
  excerpt?: string;
  draft?: boolean;
  body: string;
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
