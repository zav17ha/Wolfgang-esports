import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { getPost } from "@/lib/posts";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, { includeDrafts: true });
  if (!post) notFound();
  return (
    <PostEditor
      initial={{
        slug: post.slug,
        title: post.title,
        date: post.date,
        category: post.category,
        author: post.author,
        cover: post.cover ?? "",
        coverCaption: post.coverCaption ?? "",
        excerpt: post.excerpt ?? "",
        draft: post.draft,
        body: post.body,
      }}
    />
  );
}
