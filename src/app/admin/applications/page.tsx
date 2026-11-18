import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Download, MessageCircle } from "lucide-react";

import { APPLICATION_TYPES, SECTIONS, formatAnswer, gamesOf, typeLabel } from "@/lib/apply";
import { filterApplications } from "@/lib/apply-filter";
import { listApplications } from "@/lib/application-store";
import { storageMode } from "@/lib/blob";
import { cn } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteApplicationButton, LogoutButton } from "@/components/admin/admin-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" });

/** wa.me link from a number like "+94 77 123 4567". */
const waLink = (n: string) => `https://wa.me/${n.replace(/[^0-9]/g, "")}`;

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ type?: string; game?: string }> }) {
  const { type = "", game = "" } = await searchParams;
  const mode = storageMode();
  const all = await listApplications();
  const apps = filterApplications(all, { type, game });
  const games = [...new Set(all.flatMap((a) => gamesOf(a).map((g) => g.game)))].sort((a, b) => a.localeCompare(b));

  const href = (next: { type?: string; game?: string }) => {
    const q = new URLSearchParams();
    const t = next.type ?? type;
    const g = next.game ?? game;
    if (t) q.set("type", t);
    if (g) q.set("game", g);
    const s = q.toString();
    return s ? `?${s}` : "?";
  };
  const exportHref = `/api/admin/applications/export${href({}) === "?" ? "" : href({})}`;

  return (
    <>
      <AdminNav />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="hud-label">{"// Recruitment"}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Applications</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {apps.length} {apps.length === 1 ? "application" : "applications"}
            {apps.length !== all.length && ` of ${all.length}`} · from the{" "}
            <Link href="/apply" target="_blank" className="text-zinc-300 underline decoration-white/20 underline-offset-4 hover:decoration-white">
              /apply
            </Link>{" "}
            page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
          <Button asChild size="sm" className="h-9 px-4" aria-disabled={apps.length === 0}>
            <a href={exportHref} download>
              <Download /> Download CSV
            </a>
          </Button>
        </div>
      </div>

      {mode === "none" && (
        <p className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm text-zinc-400">
          Applications can&apos;t be saved yet: no Blob store reached this deployment. Connect one in Vercel → Storage with Production ticked, then
          redeploy.
        </p>
      )}

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="hud-label mr-1 w-14">Type</span>
          {[{ value: "", label: "All" }, ...APPLICATION_TYPES].map((t) => (
            <FilterPill key={t.value || "all"} href={href({ type: t.value })} on={type === t.value}>
              {t.label}
            </FilterPill>
          ))}
        </div>
        {games.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="hud-label mr-1 w-14">Game</span>
            <FilterPill href={href({ game: "" })} on={!game}>
              All
            </FilterPill>
            {games.map((g) => (
              <FilterPill key={g} href={href({ game: g })} on={game === g}>
                {g}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <ul className="mt-8 space-y-3">
        {apps.length === 0 && (
          <li className="rounded-2xl border border-white/[0.08] p-10 text-center text-zinc-500">
            {all.length === 0 ? "No applications yet. They'll appear here as soon as someone applies." : "No applications match these filters."}
          </li>
        )}
        {apps.map((a) => {
          const name = String(a.answers.fullName ?? "Unnamed");
          const ign = String(a.answers.ign ?? "");
          const whatsapp = String(a.answers.whatsapp ?? "");
          const team = a.type === "team" ? String(a.answers.teamName ?? "") : "";
          return (
            <li key={a.id}>
              <details className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] open:border-white/20">
                <summary className="flex cursor-pointer list-none flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase",
                          a.type === "team" ? "bg-white text-black" : "border border-white/15 text-zinc-300",
                        )}
                      >
                        {typeLabel(a.type)}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">{a.id}</span>
                    </div>
                    <p className="mt-1.5 truncate text-lg font-semibold tracking-tight text-white">
                      {team ? `${team} · ` : ""}
                      {name}
                      {ign && <span className="font-normal text-zinc-400"> ({ign})</span>}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {gamesOf(a).map((g) => (
                        <span key={`${g.platform}-${g.game}`} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-zinc-300">
                          {g.game} <span className="text-zinc-600">· {g.platform}</span>
                        </span>
                      ))}
                      <span className="ml-1 text-xs text-zinc-500">{fmtDate(a.submittedAt)}</span>
                    </div>
                  </div>
                  <ChevronDown className="hidden size-5 shrink-0 text-zinc-500 transition-transform group-open:rotate-180 sm:block" />
                </summary>

                <div className="border-t border-white/[0.06] px-5 py-6 sm:px-6">
                  <div className="space-y-8">
                    {SECTIONS.filter((s) => (!s.teamOnly || a.type === "team") && s.id !== "confirm").map((s) => (
                      <div key={s.id}>
                        <h3 className="hud-label mb-3">{s.title}</h3>
                        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                          {s.fields.map((f) => {
                            const v = formatAnswer(a.answers[f.key]);
                            const long = f.type === "textarea";
                            return (
                              <div key={f.key} className={cn("min-w-0", long && "sm:col-span-2")}>
                                <dt className="text-xs text-zinc-500">{f.label}</dt>
                                <dd className={cn("mt-0.5 text-sm break-words text-zinc-200", long && "whitespace-pre-line", !v && "text-zinc-600")}>
                                  {f.type === "url" && v ? (
                                    <a href={v} target="_blank" rel="noopener noreferrer" className="underline decoration-white/25 underline-offset-4 hover:decoration-white">
                                      {v}
                                    </a>
                                  ) : (
                                    v || "—"
                                  )}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
                    <p className="text-xs text-zinc-500">All confirmations were ticked when submitting.</p>
                    <div className="flex gap-2">
                      {whatsapp && (
                        <Button asChild variant="outline" size="sm" className="h-9">
                          <a href={waLink(whatsapp)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle /> WhatsApp
                          </a>
                        </Button>
                      )}
                      <DeleteApplicationButton id={a.id} name={name} />
                    </div>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function FilterPill({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "rounded-full border px-3.5 py-1 text-sm transition-colors",
        on ? "border-white bg-white text-black" : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
