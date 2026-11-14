import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { StorageError, deletePost } from "@/lib/post-store";

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await deletePost(slug);
  } catch (err) {
    const msg = err instanceof StorageError ? err.message : "Could not delete the post.";
    return NextResponse.json({ error: msg }, { status: err instanceof StorageError ? 503 : 500 });
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ ok: true });
}
