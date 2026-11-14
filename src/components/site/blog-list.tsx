"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { PostMeta } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PostCard } from "./post-card";

export function BlogList({ posts }: { posts: PostMeta[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return posts.filter((p) => (cat === "All" || p.category === cat) && (!query || `${p.title} ${p.excerpt ?? ""} ${p.category}`.toLowerCase().includes(query)));
  }, [posts, cat, q]);

  if (!posts.length) return <p className="text-zinc-500">No posts yet. Check back soon.</p>;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn("relative rounded-full border px-4 py-1.5 text-sm transition-colors duration-200", cat === c ? "border-white text-black" : "border-white/10 text-zinc-400 hover:text-white")}
            >
              {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search posts</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts" className="pl-9" type="search" />
        </label>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => <PostCard key={p.slug} post={p} priority={i < 3} />)}
      </div>
      {filtered.length === 0 && <p className="mt-10 text-zinc-500">No posts match your search.</p>}
    </>
  );
}
