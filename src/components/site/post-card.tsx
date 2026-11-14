import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatDate, type PostMeta } from "@/lib/format";
import { TiltCard } from "./tilt-card";

export function PostCard({ post, priority = false }: { post: PostMeta; priority?: boolean }) {
  return (
    <TiltCard max={4} className="h-full">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col bg-card">
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.cover && (
            <Image
              src={post.cover}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="photo-zoom object-cover group-hover/tilt:scale-[1.04]"
              style={{ objectPosition: "50% 25%" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute top-4 left-4 rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 items-start justify-between gap-6 p-6">
          <div>
            <p className="hud-label">{formatDate(post.date)} · {post.readingTime}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{post.title}</h3>
            {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{post.excerpt}</p>}
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 transition-all duration-300 group-hover/tilt:border-white group-hover/tilt:bg-white group-hover/tilt:text-black">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
