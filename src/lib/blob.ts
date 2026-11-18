/**
 * Shared Vercel Blob setup for everything the site stores (blog posts, applications).
 *
 * Connecting a Blob store to the Vercel project gives the site one of:
 * BLOB_READ_WRITE_TOKEN, a token under a custom prefix (e.g. MYSTORE_READ_WRITE_TOKEN),
 * or BLOB_STORE_ID (Vercel's newer OIDC sign-in). All three work.
 *
 * - "blob":  Vercel Blob (used on Vercel's read-only filesystem).
 * - "local": running on your own computer; data is written to files in the project.
 * - "none":  deployed without a Blob store; saving is disabled with a clear message.
 */
export type StorageMode = "blob" | "local" | "none";

export class StorageError extends Error {}

/** A Blob read-write token, wherever Vercel put it (default name, or a custom prefix chosen on connect). */
function blobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const [k, v] of Object.entries(process.env)) {
    if (k.endsWith("_READ_WRITE_TOKEN") && v?.startsWith("vercel_blob_rw_")) return v;
  }
  return undefined;
}

/** Credentials passed to every Blob call. With BLOB_STORE_ID only, the SDK signs in via Vercel OIDC by itself. */
export function blobAuth(): { token?: string } {
  const token = blobToken();
  return token && !process.env.BLOB_READ_WRITE_TOKEN ? { token } : {};
}

export function storageMode(): StorageMode {
  if (blobToken() || process.env.BLOB_STORE_ID) return "blob";
  if (!process.env.VERCEL) return "local";
  return "none";
}
