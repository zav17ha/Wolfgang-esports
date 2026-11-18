import { NextResponse } from "next/server";

import { type Application, type ApplicationInput, validateApplication } from "@/lib/apply";
import { newApplicationId, saveApplication } from "@/lib/application-store";
import { StorageError } from "@/lib/blob";

// Simple spam protection: per-IP limit (per server instance) plus a hidden "website" honeypot field.
const recent = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 30 * 60 * 1000;
const MAX_BYTES = 64 * 1024;

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "That application is too large." }, { status: 413 });

  let body: Partial<ApplicationInput> & { website?: string };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field; people never see this one. Pretend it worked.
  if (body.website) return NextResponse.json({ ok: true, id: newApplicationId() });

  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= LIMIT) {
    return NextResponse.json({ error: "Too many applications from this connection. Please try again later." }, { status: 429 });
  }

  const result = validateApplication(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Please check the highlighted fields.", errors: result.errors }, { status: 400 });
  }

  const app: Application = { id: newApplicationId(new Date(now)), submittedAt: new Date(now).toISOString(), ...result.data };
  try {
    await saveApplication(app);
  } catch (err) {
    console.error("Could not save application", err);
    const msg = err instanceof StorageError ? err.message : "We couldn't save your application. Please try again in a moment.";
    return NextResponse.json({ error: msg }, { status: 503 });
  }

  times.push(now);
  recent.set(ip, times);
  return NextResponse.json({ ok: true, id: app.id });
}
