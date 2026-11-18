import { csvColumns } from "@/lib/apply";
import { listApplications } from "@/lib/application-store";
import { filterApplications } from "@/lib/apply-filter";

export const dynamic = "force-dynamic";

/** Quote a CSV cell, and neutralise values a spreadsheet would run as a formula. */
function cell(v: string) {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Downloads the applications (respecting the dashboard's type/game filters) as a CSV file. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apps = filterApplications(await listApplications(), {
    type: searchParams.get("type") ?? "",
    game: searchParams.get("game") ?? "",
  });
  const cols = csvColumns();
  const rows = [cols.map((c) => cell(c.label)).join(","), ...apps.map((a) => cols.map((c) => cell(c.get(a))).join(","))];
  // BOM so Excel opens it as UTF-8 (names like AMARÉ stay intact).
  const csv = "﻿" + rows.join("\r\n") + "\r\n";
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wolfgang-applications-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
