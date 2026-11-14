import { NextResponse } from "next/server";
import { StorageError, uploadImage } from "@/lib/post-store";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    const msg = err instanceof StorageError ? err.message : "Upload failed.";
    if (!(err instanceof StorageError)) console.error(err);
    return NextResponse.json({ error: msg }, { status: err instanceof StorageError ? 422 : 500 });
  }
}
