import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/post-editor";

export const metadata: Metadata = { title: "New post" };
export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <PostEditor />;
}
