import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, authConfigured, checkCredentials, createSession } from "@/lib/auth";

// Basic brute-force protection: per-IP attempt counter (per server instance).
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 10 * 60 * 1000;

export async function POST(req: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "Admin login isn't configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and AUTH_SECRET in your environment variables." },
      { status: 503 },
    );
  }
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.n >= MAX_ATTEMPTS && rec.until > now) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const username = String(body.username ?? "").slice(0, 200);
  const password = String(body.password ?? "").slice(0, 500);

  if (!(await checkCredentials(username, password))) {
    const n = rec && rec.until > now ? rec.n + 1 : 1;
    attempts.set(ip, { n, until: now + LOCK_MS });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
