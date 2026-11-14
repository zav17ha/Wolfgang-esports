"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Eye, ImagePlus, Loader2, PenLine, Send, Save, X } from "lucide-react";

import { formatDate, readingTime, slugify, type PostInput } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = ["News", "PUBG Mobile", "Valorant", "Interviews", "From the archive", "Merch"];

export function PostEditor({ initial }: { initial?: PostInput }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [f, setF] = useState<PostInput>(
    initial ?? {
      slug: "",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      category: "News",
      author: "Wolfgang e-Sports",
      cover: "",
      coverCaption: "",
      excerpt: "",
      draft: false,
      body: "",
    },
  );
  const [slugTouched, setSlugTouched] = useState(editing);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState<"" | "save" | "upload">("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof PostInput>(k: K, v: PostInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const slug = slugTouched ? f.slug : slugify(f.title);
  const html = useMemo(() => (tab === "preview" ? (marked.parse(f.body || "", { async: false, gfm: true }) as string) : ""), [tab, f.body]);

  async function upload(file: File) {
    setBusy("upload");
    setMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) return setMsg(j.error || "Upload failed.");
    set("cover", j.url);
  }

  async function save(draft: boolean) {
    setBusy("save");
    setMsg("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, slug, draft, previousSlug: initial?.slug }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) return setMsg(j.error || "Could not save.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin" className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> All posts
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" disabled={!!busy} onClick={() => save(true)}>
            <Save /> Save draft
          </Button>
          <Button size="sm" className="h-9 px-4" disabled={!!busy} onClick={() => save(false)}>
            {busy === "save" ? <Loader2 className="animate-spin" /> : <Send />} {editing && !initial?.draft ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
      {msg && <p className="mt-4 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200" role="alert">{msg}</p>}

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-8">
          <input
            value={f.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Post title"
            aria-label="Title"
            className="w-full border-0 bg-transparent text-3xl font-semibold tracking-[-0.03em] text-white outline-none placeholder:text-zinc-700 sm:text-5xl"
          />
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span>/blog/</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              aria-label="URL slug"
              placeholder="url-slug"
              className="min-w-0 flex-1 border-0 border-b border-transparent bg-transparent text-zinc-300 outline-none focus:border-white/30"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-3 py-2">
              <div className="flex gap-1">
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm capitalize", tab === t ? "bg-white text-black" : "text-zinc-400 hover:text-white")}
                  >
                    {t === "write" ? <PenLine className="size-3.5" /> : <Eye className="size-3.5" />} {t}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-600 uppercase">Markdown · {readingTime(f.body)}</span>
            </div>
            {tab === "write" ? (
              <Textarea
                value={f.body}
                onChange={(e) => set("body", e.target.value)}
                rows={22}
                placeholder={"Write your story here.\n\n## Use ## for a heading\n**bold**, *italic*, - lists, > quotes, [link text](https://…)"}
                className="min-h-[28rem] rounded-none border-0 bg-transparent font-mono text-sm leading-relaxed focus-visible:ring-0"
              />
            ) : (
              <div className="prose-wolf min-h-[28rem] p-6 text-base" dangerouslySetInnerHTML={{ __html: html || "<p>Nothing to preview yet.</p>" }} />
            )}
          </div>
        </div>

        {/* Settings column */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="space-y-3 rounded-2xl border border-white/[0.08] p-5">
            <Label className="text-zinc-300">Cover image</Label>
            {f.cover ? (
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.cover} alt="" className="aspect-[16/10] w-full object-cover" />
                <button type="button" onClick={() => set("cover", "")} aria-label="Remove cover" className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/70 text-white hover:bg-black">
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="grid aspect-[16/10] w-full place-items-center rounded-xl border border-dashed border-white/15 text-sm text-zinc-500 transition-colors hover:border-white/40 hover:text-white"
              >
                <span className="flex flex-col items-center gap-2">
                  {busy === "upload" ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
                  {busy === "upload" ? "Uploading…" : "Upload image (max 4 MB)"}
                </span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
                e.target.value = "";
              }}
            />
            <Input value={f.cover ?? ""} onChange={(e) => set("cover", e.target.value)} placeholder="…or paste an image URL / path" className="text-xs" />
            <Input value={f.coverCaption ?? ""} onChange={(e) => set("coverCaption", e.target.value)} placeholder="Caption (optional)" />
          </div>

          <div className="space-y-5 rounded-2xl border border-white/[0.08] p-5">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-zinc-300">Date</Label>
              <Input id="date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-zinc-300">Category</Label>
              <Input id="category" value={f.category} onChange={(e) => set("category", e.target.value)} list="categories" />
              <datalist id="categories">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-zinc-300">Author</Label>
              <Input id="author" value={f.author} onChange={(e) => set("author", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-zinc-300">Summary</Label>
              <Textarea id="excerpt" value={f.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} rows={3} maxLength={300} placeholder="One or two lines shown on blog cards" />
            </div>
          </div>

          <p className="hud-label px-1">
            {f.draft ? "Currently a draft" : editing ? "Currently live" : "New post"} · {formatDate(f.date)}
          </p>
        </aside>
      </div>
    </div>
  );
}
