import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { ParallaxBanner } from "@/components/site/parallax-banner";
import { ShareLinks } from "@/components/site/share-links";
import { SplitHeading } from "@/components/motion/reveal";
import { InteractiveField } from "@/components/site/interactive-field";

type Params = { slug: string };

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, images: post.cover ? [{ url: post.cover }] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const post = posts[i];
  const newer = posts[i - 1];
  const older = posts[i + 1];

  return (
    <article>
      <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40">
        <InteractiveField className="mask-fade-b" gap={28} radius={160} drift={12} />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-40" />
        <div aria-hidden className="pointer-events-none absolute -top-48 left-1/2 h-[30rem] w-[64rem] -translate-x-1/2" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 65%)" }} />
        <div className="container-x relative">
          <div className="anim-fade-up">
            <Link href="/blog" className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
              All stories
            </Link>
          </div>
          <div className="anim-fade-up mt-8 flex flex-wrap gap-2" style={{ animationDelay: "0.05s" }}>
            <Badge>{post.category}</Badge>
            <Badge variant="outline" className="text-zinc-400">{formatDate(post.date)}</Badge>
            <Badge variant="outline" className="text-zinc-400">{post.readingTime}</Badge>
          </div>
          <SplitHeading as="h1" immediate delay={0.1} text={post.title} className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl" />
        </div>
      </section>

      {post.cover && (
        <section className="container-x">
          <ParallaxBanner src={post.cover} alt={post.coverCaption ?? ""} pos="50% 25%" />
          {post.coverCaption && <p className="hud-label mt-3">{post.coverCaption}</p>}
        </section>
      )}

      <section className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="hud-label">Written by</p>
            <p className="mt-1 text-sm text-white">{post.author}</p>
            <p className="hud-label mt-6 mb-3">Share</p>
            <ShareLinks title={post.title} />
          </div>
        </aside>
        <div className="prose-wolf max-w-[720px] lg:col-span-8" dangerouslySetInnerHTML={{ __html: post.html }} />
      </section>

      <nav aria-label="More stories" className="container-x grid gap-4 sm:grid-cols-2">
        {older ? (
          <Link href={`/blog/${older.slug}`} className="group rounded-2xl border border-white/[0.07] p-6 transition-colors hover:border-white/25">
            <span className="hud-label inline-flex items-center gap-2"><ArrowLeft className="size-3.5" /> Previous</span>
            <p className="mt-2 font-semibold tracking-tight text-white">{older.title}</p>
          </Link>
        ) : <span />}
        {newer && (
          <Link href={`/blog/${newer.slug}`} className="group rounded-2xl border border-white/[0.07] p-6 text-right transition-colors hover:border-white/25">
            <span className="hud-label inline-flex items-center gap-2">Next <ArrowRight className="size-3.5" /></span>
            <p className="mt-2 font-semibold tracking-tight text-white">{newer.title}</p>
          </Link>
        )}
      </nav>
    </article>
  );
}
