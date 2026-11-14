/**
 * Minimal username/password auth for the blog admin.
 *
 * Credentials come from environment variables (set them in Vercel → Project → Settings →
 * Environment Variables, or in .env.local when running locally):
 *   ADMIN_USERNAME   the login name
 *   ADMIN_PASSWORD   the password (use a long, unique one)
 *   AUTH_SECRET      a long random string used to sign the session cookie
 *
 * The session is an HMAC-signed cookie (Web Crypto), so it works in middleware (Edge runtime)
 * and in route handlers, with no database.
 */

export const SESSION_COOKIE = "wg_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  arr.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmac(data: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) throw new Error("AUTH_SECRET is missing or too short");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** What is wrong with the login setup, as plain messages (variable names only, never values). */
export function authProblems(): string[] {
  const problems: string[] = [];
  if (!process.env.ADMIN_USERNAME?.trim()) problems.push("ADMIN_USERNAME is missing.");
  if (!process.env.ADMIN_PASSWORD) problems.push("ADMIN_PASSWORD is missing.");
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret) problems.push("AUTH_SECRET is missing.");
  else if (secret.length < 16) problems.push(`AUTH_SECRET is too short (${secret.length} characters, needs at least 16).`);
  return problems;
}

export function authConfigured() {
  return authProblems().length === 0;
}

/** Constant-time check of the submitted username and password against the env values. */
export async function checkCredentials(username: string, password: string) {
  if (!authConfigured()) return false;
  const [a, b] = await Promise.all([hmac(`u:${username}`), hmac(`u:${process.env.ADMIN_USERNAME}`)]);
  const [c, d] = await Promise.all([hmac(`p:${password}`), hmac(`p:${process.env.ADMIN_PASSWORD}`)]);
  return safeEqual(a, b) && safeEqual(c, d);
}

export async function createSession(username: string) {
  const payload = b64url(enc.encode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  return `${payload}.${b64url(await hmac(payload))}`;
}

export async function verifySession(token: string | undefined): Promise<{ u: string } | null> {
  if (!token || !authConfigured()) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    if (!safeEqual(fromB64url(sig), await hmac(payload))) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { u: string; exp: number };
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (data.u !== process.env.ADMIN_USERNAME) return null;
    return { u: data.u };
  } catch {
    return null;
  }
}
