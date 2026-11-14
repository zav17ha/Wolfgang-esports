import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { slugify, type PostInput } from "@/lib/format";
import { StorageError, savePost } from "@/lib/post-store";

function clean(raw: Record<string, unknown>): PostInput | string {
  const s = (k: string, max: number) => String(raw[k] ?? "").trim().slice(0, max);
  const title = s("title", 200);
  const body = String(raw.body ?? "").slice(0, 100_000);
  const slug = slugify(s("slug", 120) || title);
  const date = s("date", 10);
  if (!title) return "Add a title.";
  if (!body.trim()) return "Write something in the post.";
  if (!slug) return "The URL slug is empty.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Pick a valid date.";
  return {
    slug,
    title,
    date,
    category: s("category", 60) || "News",
    author: s("author", 80) || "Wolfgang e-Sports",
    cover: s("cover", 500) || undefined,
    coverCaption: s("coverCaption", 200) || undefined,
    excerpt: s("excerpt", 300) || undefined,
    draft: Boolean(raw.draft),
    body,
  };
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const post = clean(raw as Record<string, unknown>);
  if (typeof post === "string") return NextResponse.json({ error: post }, { status: 422 });
  const previousSlug = typeof raw.previousSlug === "string" ? raw.previousSlug : undefined;

  try {
    await savePost(post, previousSlug);
  } catch (err) {
    const msg = err instanceof StorageError ? err.message : "Could not save the post.";
    if (!(err instanceof StorageError)) console.error(err);
    return NextResponse.json({ error: msg }, { status: err instanceof StorageError ? 503 : 500 });
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  if (previousSlug && previousSlug !== post.slug) revalidatePath(`/blog/${previousSlug}`);
  return NextResponse.json({ ok: true, slug: post.slug });
}
