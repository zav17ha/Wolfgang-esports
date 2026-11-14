import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { type PostInput, type PostMeta, readingTime } from "./format";
import { listStoredPosts } from "./post-store";

export type { PostMeta } from "./format";
export { formatDate } from "./format";

/**
 * Blog posts come from two places:
 *  1. Markdown files in /content/posts/<slug>.md (ship with the site)
 *  2. Posts published from the admin dashboard (/admin), saved in Vercel Blob
 * A dashboard post with the same slug overrides the Markdown file.
 */

export interface Post extends PostMeta {
  html: string;
  body: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function toPost(input: PostInput, source: "repo" | "admin"): Post {
  return {
    slug: input.slug,
    title: input.title || input.slug,
    date: input.date,
    category: input.category || "News",
    author: input.author || "Wolfgang e-Sports",
    cover: input.cover || undefined,
    coverCaption: input.coverCaption || undefined,
    excerpt: input.excerpt || undefined,
    draft: Boolean(input.draft),
    readingTime: readingTime(input.body),
    source,
    body: input.body,
    html: marked.parse(input.body, { async: false, gfm: true }) as string,
  };
}

function readRepoPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
      return toPost(
        {
          slug: file.replace(/\.md$/, ""),
          title: String(data.title ?? ""),
          date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
          category: String(data.category ?? "News"),
          author: String(data.author ?? "Wolfgang e-Sports"),
          cover: data.cover ? String(data.cover) : undefined,
          coverCaption: data.coverCaption ? String(data.coverCaption) : undefined,
          excerpt: data.excerpt ? String(data.excerpt) : undefined,
          draft: Boolean(data.draft),
          body: content,
        },
        "repo",
      );
    });
}

/** Every post, newest first. Drafts are excluded unless `includeDrafts` is set (admin only). */
export async function getAllPosts({ includeDrafts = false } = {}): Promise<Post[]> {
  const bySlug = new Map<string, Post>();
  for (const p of readRepoPosts()) bySlug.set(p.slug, p);
  let stored: Awaited<ReturnType<typeof listStoredPosts>> = [];
  try {
    stored = await listStoredPosts();
  } catch (err) {
    console.error("Could not load posts from Blob storage", err);
  }
  for (const s of stored) {
    if (s.hidden) bySlug.delete(s.slug);
    else bySlug.set(s.slug, toPost(s, "admin"));
  }
  return [...bySlug.values()]
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostMetas(): Promise<PostMeta[]> {
  return (await getAllPosts()).map((p) => {
    const meta: PostMeta & Partial<Pick<Post, "html" | "body">> = { ...p };
    delete meta.html;
    delete meta.body;
    return meta;
  });
}

export async function getPost(slug: string, { includeDrafts = false } = {}): Promise<Post | undefined> {
  return (await getAllPosts({ includeDrafts })).find((p) => p.slug === slug);
}
