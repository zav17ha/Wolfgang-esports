import type { Metadata } from "next";

import { getPostMetas } from "@/lib/posts";
import { PageHeader } from "@/components/site/page-header";
import { BlogList } from "@/components/site/blog-list";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, interviews and looks back at the moments that built Wolfgang e-Sports.",
};

export const revalidate = 60;

export default async function BlogPage() {
  return (
    <>
      <PageHeader
        index="04"
        eyebrow="Blog"
        title="Stories from the den."
        description="Stories, interviews and looks back at the moments that built the pack."
      />
      <section className="container-x py-20 sm:py-24">
        <BlogList posts={await getPostMetas()} />
      </section>
    </>
  );
}
