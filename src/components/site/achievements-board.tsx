"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ACHIEVEMENTS, GAMES, type GameKey, isPodium, placeLabel, placeRank } from "@/lib/achievements";
import { cn } from "@/lib/utils";

type PlaceFilter = "all" | "1" | "podium" | "other";
const PLACE_FILTERS: { key: PlaceFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "1", label: "Titles" },
  { key: "podium", label: "Podiums" },
  { key: "other", label: "Other" },
];

function placeShort(p: (typeof ACHIEVEMENTS)[number]["place"]) {
  if (p === 1) return "1st";
  if (p === 2) return "2nd";
  if (p === 3) return "3rd";
  if (typeof p === "number") return `${p}th`;
  return { F: "Final", Q: "Run", H: "Honour" }[p];
}

export function AchievementsBoard() {
  const [game, setGame] = useState<GameKey | "all">("all");
  const [place, setPlace] = useState<PlaceFilter>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const g = new URLSearchParams(window.location.search).get("game") as GameKey | null;
    if (g && g in GAMES) setGame(g);
  }, []);

  const counts = useMemo(() => {
    const c: Partial<Record<GameKey, number>> = {};
    ACHIEVEMENTS.forEach((a) => (c[a.game] = (c[a.game] ?? 0) + 1));
    return c;
  }, []);
  const order = (Object.keys(counts) as GameKey[]).sort((a, b) =>
    a === "other" ? 1 : b === "other" ? -1 : (counts[b] ?? 0) - (counts[a] ?? 0));

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ACHIEVEMENTS.filter((a) => {
      if (game !== "all" && a.game !== game) return false;
      if (place === "1" && a.place !== 1) return false;
      if (place === "podium" && !isPodium(a)) return false;
      if (place === "other" && isPodium(a)) return false;
      return !query || `${a.event} ${a.team}`.toLowerCase().includes(query);
    }).sort((a, b) => placeRank(a.place) - placeRank(b.place) || (b.year ?? 0) - (a.year ?? 0));
  }, [game, place, q]);

  const tabs: { key: GameKey | "all"; label: string }[] = [{ key: "all", label: "All games" }, ...order.map((g) => ({ key: g, label: GAMES[g] }))];

  return (
    <div>
      {/* Game tabs */}
      <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-6 border-b border-white/[0.08]" role="tablist" aria-label="Filter by game">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={game === t.key}
              onClick={() => setGame(t.key)}
              className={cn("relative pb-3 text-sm transition-colors", game === t.key ? "text-white" : "text-zinc-500 hover:text-zinc-200")}
            >
              {t.label}
              {game === t.key && <motion.span layoutId="game-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-white" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Placement + search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-full border border-white/[0.08] bg-white/[0.02] p-1" role="group" aria-label="Filter by placement">
          {PLACE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={place === f.key}
              onClick={() => setPlace(f.key)}
              className={cn("relative rounded-full px-4 py-1.5 text-sm transition-colors", place === f.key ? "text-black" : "text-zinc-400 hover:text-white")}
            >
              {place === f.key && <motion.span layoutId="place-seg" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search achievements</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-full border border-white/[0.08] bg-white/[0.02] pr-9 pl-10 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-white/30"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>

      <p className="mt-8 mb-2 font-mono text-[10px] tracking-[0.2em] text-zinc-600 uppercase">{rows.length} results</p>

      <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]" aria-live="polite">
        {rows.length === 0 && <li className="py-14 text-center text-sm text-zinc-500">No results match those filters.</li>}
        {rows.map((a, i) => (
          <li key={`${a.event}-${a.team}-${i}`} className="group flex items-center gap-5 py-4 transition-colors hover:bg-white/[0.015] sm:gap-6 sm:px-2">
            <span
              title={placeLabel(a.place)}
              className={cn(
                "clip-chamfer-sm grid h-10 w-14 shrink-0 place-items-center font-mono text-xs font-semibold uppercase",
                a.place === 1 ? "bg-white text-black" : "bg-white/[0.06] text-zinc-300",
              )}
            >
              {placeShort(a.place)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-[15px] font-medium text-white">
                <span className="truncate">{a.event}</span>
                {a.source === "news" && (
                  <span title="Verified: reported by Gamer.LK or the Daily FT" className="shrink-0">
                    <BadgeCheck aria-label="Verified" className="size-3.5 text-zinc-500" />
                  </span>
                )}
              </p>
              <p className="mt-0.5 truncate text-sm text-zinc-500">
                {a.team}
                {game === "all" && <span className="text-zinc-600"> · {GAMES[a.game]}</span>}
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs text-zinc-600 tabular-nums">{a.year ?? ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
