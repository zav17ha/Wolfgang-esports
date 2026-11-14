import fs from "node:fs/promises";
import path from "node:path";
import { del, list, put } from "@vercel/blob";
import type { PostInput } from "./format";

/**
 * Where posts written from the admin dashboard are saved.
 *
 * - "blob":  Vercel Blob (used on Vercel's read-only filesystem). Connecting a Blob store to the project
 *            gives the site one of: BLOB_READ_WRITE_TOKEN, a token under a custom prefix
 *            (e.g. MYSTORE_READ_WRITE_TOKEN), or BLOB_STORE_ID (Vercel's newer OIDC sign-in). All work.
 * - "local": when running on your own computer, posts are written straight into content/posts/*.md
 *            and images into public/uploads/, so you can commit them to Git.
 * - "none":  deployed without a Blob store; publishing is disabled with a clear message.
 */
export type StorageMode = "blob" | "local" | "none";

export interface StoredPost extends PostInput {
  updatedAt: string;
  /** Hides a Markdown post that ships with the site (blob mode only). */
  hidden?: boolean;
}

/** A Blob read-write token, wherever Vercel put it (default name, or a custom prefix chosen on connect). */
function blobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const [k, v] of Object.entries(process.env)) {
    if (k.endsWith("_READ_WRITE_TOKEN") && v?.startsWith("vercel_blob_rw_")) return v;
  }
  return undefined;
}

/** Credentials passed to every Blob call. With BLOB_STORE_ID only, the SDK signs in via Vercel OIDC by itself. */
function blobAuth(): { token?: string } {
  const token = blobToken();
  return token && !process.env.BLOB_READ_WRITE_TOKEN ? { token } : {};
}

export function storageMode(): StorageMode {
  if (blobToken() || process.env.BLOB_STORE_ID) return "blob";
  if (!process.env.VERCEL) return "local";
  return "none";
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_PREFIX = "posts/";

export class StorageError extends Error {}

function assertWritable() {
  if (storageMode() === "none") {
    throw new StorageError(
      "Publishing isn't set up yet. In Vercel, open your project → Storage → Create a Blob store and connect it, then redeploy.",
    );
  }
}

/* ---------------- Front matter helpers (local mode) ---------------- */

const q = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export function toMarkdown(p: PostInput) {
  const fm = [
    "---",
    `title: ${q(p.title)}`,
    `date: ${q(p.date)}`,
    `category: ${q(p.category || "News")}`,
    `author: ${q(p.author || "Wolfgang e-Sports")}`,
    p.cover && `cover: ${q(p.cover)}`,
    p.coverCaption && `coverCaption: ${q(p.coverCaption)}`,
    p.excerpt && `excerpt: ${q(p.excerpt)}`,
    `draft: ${Boolean(p.draft)}`,
    "---",
  ].filter(Boolean);
  return `${fm.join("\n")}\n\n${p.body.trim()}\n`;
}

/* ---------------- Blob mode ---------------- */

async function blobEntries() {
  const out: { url: string; pathname: string; slug: string }[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000, ...blobAuth() });
    for (const b of res.blobs) {
      // pathname looks like posts/<slug>__-<random>.json (random suffix keeps drafts unguessable)
      const m = b.pathname.match(/^posts\/(.+?)__/);
      if (m) out.push({ url: b.url, pathname: b.pathname, slug: m[1] });
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return out;
}

/** All posts saved from the admin dashboard (blob mode). Empty in local mode. */
export async function listStoredPosts(): Promise<StoredPost[]> {
  if (storageMode() !== "blob") return [];
  const entries = await blobEntries();
  const posts = await Promise.all(
    entries.map(async (e) => {
      try {
        const r = await fetch(e.url, { cache: "no-store" });
        if (!r.ok) return null;
        return (await r.json()) as StoredPost;
      } catch {
        return null;
      }
    }),
  );
  return posts.filter((p): p is StoredPost => Boolean(p && p.slug));
}

export async function savePost(post: PostInput, previousSlug?: string): Promise<void> {
  assertWritable();
  const stored: StoredPost = { ...post, updatedAt: new Date().toISOString() };

  if (storageMode() === "local") {
    await fs.mkdir(POSTS_DIR, { recursive: true });
    await fs.writeFile(path.join(POSTS_DIR, `${post.slug}.md`), toMarkdown(post), "utf8");
    if (previousSlug && previousSlug !== post.slug) {
      await fs.rm(path.join(POSTS_DIR, `${previousSlug}.md`), { force: true });
    }
    return;
  }

  const entries = await blobEntries();
  const stale = entries.filter((e) => e.slug === post.slug || (previousSlug && e.slug === previousSlug));
  await put(`${BLOB_PREFIX}${post.slug}__.json`, JSON.stringify(stored), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    ...blobAuth(),
  });
  if (stale.length) await del(stale.map((e) => e.url), blobAuth());
  if (previousSlug && previousSlug !== post.slug) await hideRepoPost(previousSlug);
}

/** Hide a Markdown post that ships with the site (blob mode) by saving a hidden marker. */
async function hideRepoPost(slug: string) {
  const exists = await fs.stat(path.join(POSTS_DIR, `${slug}.md`)).then(() => true).catch(() => false);
  if (!exists) return;
  const marker: StoredPost = { slug, title: "", date: "", category: "", author: "", body: "", hidden: true, updatedAt: new Date().toISOString() };
  await put(`${BLOB_PREFIX}${slug}__.json`, JSON.stringify(marker), { access: "public", addRandomSuffix: true, contentType: "application/json", ...blobAuth() });
}

export async function deletePost(slug: string): Promise<void> {
  assertWritable();
  if (storageMode() === "local") {
    await fs.rm(path.join(POSTS_DIR, `${slug}.md`), { force: true });
    return;
  }
  const entries = await blobEntries();
  const mine = entries.filter((e) => e.slug === slug);
  if (mine.length) await del(mine.map((e) => e.url), blobAuth());
  await hideRepoPost(slug);
}

/* ---------------- Images ---------------- */

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit

export async function uploadImage(file: File): Promise<string> {
  assertWritable();
  if (!ALLOWED.includes(file.type)) throw new StorageError("Please upload a JPG, PNG, WebP, AVIF or GIF image.");
  if (file.size > MAX_UPLOAD_BYTES) throw new StorageError("Images must be 4 MB or smaller.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";

  if (storageMode() === "local") {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const name = `${Date.now()}-${base}.${ext}`;
    await fs.writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
    return `/uploads/${name}`;
  }
  const blob = await put(`images/${base}.${ext}`, file, { access: "public", addRandomSuffix: true, contentType: file.type, ...blobAuth() });
  return blob.url;
}
