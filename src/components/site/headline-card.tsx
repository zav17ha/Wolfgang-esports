import Image from "next/image";
import { Trophy } from "lucide-react";

import { type Achievement, GAMES, placeLabel } from "@/lib/achievements";
import { cn } from "@/lib/utils";
import { HudCorners, PlaceBadge } from "./hud";

/** Headline title card: photo-backed when a picture exists, HUD-style otherwise. */
export function HeadlineCard({
  a,
  img,
  pos = "50% 25%",
  className,
  big = false,
}: {
  a: Achievement;
  img?: string;
  pos?: string;
  className?: string;
  big?: boolean;
}) {
  const champion = a.place === 1;
  return (
    <article
      className={cn(
        "group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-card transition-colors duration-300 hover:border-white/30 lg:min-h-0",
        className,
      )}
    >
      {img ? (
        <>
          <Image
            src={img}
            alt={`${a.team}: ${a.event}`}
            fill
            sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            className="photo-zoom object-cover group-hover:scale-[1.04]"
            style={{ objectPosition: pos }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
        </>
      ) : (
        <>
          <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.1), transparent 55%)" }} />
          <span aria-hidden className="stroke-text-dim pointer-events-none absolute -right-2 -bottom-8 font-mono text-[9rem] leading-none font-bold">
            {champion ? "01" : String(a.place).padStart(2, "0")}
          </span>
          <Trophy aria-hidden className="absolute top-6 right-6 size-5 text-zinc-500" />
        </>
      )}
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <HudCorners hover size="size-3" className="z-10" />

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <PlaceBadge label={placeLabel(a.place)} champion={champion} />
          {a.year && <span className="font-mono text-xs text-zinc-400">{a.year}</span>}
        </div>
        <div className="mt-auto pt-16">
          <h3 className={cn("font-semibold tracking-tight text-white", big ? "text-2xl sm:text-4xl" : "text-xl")}>{a.event}</h3>
          <p className="mt-2 text-sm text-zinc-300">
            {a.team} <span className="text-zinc-500">· {GAMES[a.game]}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
