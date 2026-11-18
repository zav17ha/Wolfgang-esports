import fs from "node:fs/promises";
import path from "node:path";
import { del, get, list, put } from "@vercel/blob";

import type { Application } from "./apply";
import { StorageError, blobAuth, storageMode } from "./blob";

/**
 * Where player & team applications are saved.
 *
 * - On Vercel: in the connected Blob store as private files (applications/<id>.json), readable only
 *   by the site. If the store only allows public files, they are saved under an unguessable
 *   random address instead (applications/public/<id>__<random>.json) that is never shown anywhere.
 * - On your computer: data/applications/<id>.json (git-ignored, so applicants' details never get committed).
 */

const PREFIX = "applications/";
const PUBLIC_PREFIX = "applications/public/";
const LOCAL_DIR = path.join(process.cwd(), "data", "applications");

/** Short, readable, sortable reference, e.g. WG-261118-7K2QXM. */
export function newApplicationId(now = new Date()) {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `WG-${d}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

function assertWritable() {
  if (storageMode() === "none") {
    throw new StorageError("Applications can't be saved yet: the site has no storage connected.");
  }
}

export async function saveApplication(app: Application) {
  assertWritable();
  const body = JSON.stringify(app);

  if (storageMode() === "local") {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(path.join(LOCAL_DIR, `${app.id}.json`), body, "utf8");
    return;
  }

  try {
    await put(`${PREFIX}${app.id}.json`, body, { access: "private", contentType: "application/json", ...blobAuth() });
  } catch (privateErr) {
    // Stores created as public-only can't hold private files: fall back to an unguessable address.
    try {
      await put(`${PUBLIC_PREFIX}${app.id}__.json`, body, {
        access: "public",
        addRandomSuffix: true,
        contentType: "application/json",
        ...blobAuth(),
      });
    } catch {
      throw privateErr;
    }
  }
}

async function blobFiles() {
  const out: { url: string; pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: PREFIX, cursor, limit: 1000, ...blobAuth() });
    out.push(...res.blobs.map((b) => ({ url: b.url, pathname: b.pathname })));
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return out;
}

async function readBlob(file: { url: string; pathname: string }): Promise<Application | null> {
  try {
    if (file.pathname.startsWith(PUBLIC_PREFIX)) {
      const r = await fetch(file.url, { cache: "no-store" });
      return r.ok ? ((await r.json()) as Application) : null;
    }
    const res = await get(file.pathname, { access: "private", useCache: false, ...blobAuth() });
    if (!res || res.statusCode !== 200) return null;
    return (await new Response(res.stream).json()) as Application;
  } catch {
    return null;
  }
}

/** Every application, newest first. */
export async function listApplications(): Promise<Application[]> {
  const mode = storageMode();
  let apps: (Application | null)[] = [];

  if (mode === "local") {
    const files = await fs.readdir(LOCAL_DIR).catch(() => [] as string[]);
    apps = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, f), "utf8")) as Application;
          } catch {
            return null;
          }
        }),
    );
  } else if (mode === "blob") {
    apps = await Promise.all((await blobFiles()).map(readBlob));
  }

  return apps.filter((a): a is Application => Boolean(a?.id)).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function deleteApplication(id: string) {
  if (!/^WG-\d{6}-[A-Z0-9]{6}$/.test(id)) throw new StorageError("Unknown application.");
  const mode = storageMode();
  if (mode === "local") {
    await fs.rm(path.join(LOCAL_DIR, `${id}.json`), { force: true });
    return;
  }
  if (mode !== "blob") throw new StorageError("No storage connected.");
  const mine = (await blobFiles()).filter((f) => f.pathname === `${PREFIX}${id}.json` || f.pathname.startsWith(`${PUBLIC_PREFIX}${id}__`));
  if (mine.length) await del(mine.map((f) => f.url), blobAuth());
}
