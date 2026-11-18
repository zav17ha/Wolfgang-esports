import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FilePlus2, Pencil } from "lucide-react";

import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { storageMode } from "@/lib/post-store";
import { Button } from "@/components/ui/button";
import { DeleteButton, LogoutButton } from "@/components/admin/admin-actions";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

/** Shown only when something needs attention; nothing is shown when Blob storage is working. */
const MODE_NOTE = {
  blob: null,
  local: "Running locally: posts are saved as Markdown in content/posts/ and images in public/uploads/. Commit them to publish.",
  none: "Publishing is off: no Blob store reached this deployment. In Vercel → Storage, open your Blob store, connect it to this project with Production ticked, then redeploy.",
} as const;

export default async function AdminPage() {
  const posts = await getAllPosts({ includeDrafts: true });
  const mode = storageMode();

  return (
    <>
      <AdminNav />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="hud-label">{"// Blog admin"}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Posts</h1>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
          <Button asChild size="sm" className="h-9 px-4">
            <Link href="/admin/posts/new"><FilePlus2 /> New post</Link>
          </Button>
        </div>
      </div>

      {MODE_NOTE[mode] && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-zinc-400">
          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${mode === "none" ? "bg-zinc-500" : "anim-blink bg-white"}`} />
          <p>{MODE_NOTE[mode]}</p>
        </div>
      )}

      <ul className="mt-8 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08]">
        {posts.length === 0 && <li className="p-10 text-center text-zinc-500">No posts yet. Write your first one.</li>}
        {posts.map((p) => (
          <li key={p.slug} className="flex flex-col gap-4 bg-background px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase ${p.draft ? "border border-white/15 text-zinc-400" : "bg-white text-black"}`}>
                  {p.draft ? "Draft" : "Live"}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-600 uppercase">
                  {p.category} · {formatDate(p.date)} · {p.source === "admin" ? "Dashboard" : "Markdown file"}
                </span>
              </div>
              <p className="mt-1.5 truncate font-medium text-white">{p.title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!p.draft && (
                <Link href={`/blog/${p.slug}`} target="_blank" title="View" aria-label={`View ${p.title}`} className="grid size-9 place-items-center rounded-md border border-white/[0.08] text-zinc-500 transition-colors hover:border-white/30 hover:text-white">
                  <ExternalLink className="size-4" />
                </Link>
              )}
              <Link href={`/admin/posts/${p.slug}`} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.08] px-3 text-sm text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
                <Pencil className="size-3.5" /> Edit
              </Link>
              <DeleteButton slug={p.slug} title={p.title} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
