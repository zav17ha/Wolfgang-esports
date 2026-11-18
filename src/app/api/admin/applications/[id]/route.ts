import { NextResponse } from "next/server";

import { deleteApplication } from "@/lib/application-store";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteApplication(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not delete." }, { status: 400 });
  }
}
