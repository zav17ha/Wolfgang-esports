"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InteractiveField } from "@/components/site/interactive-field";
import { HudCorners, WolfMark } from "@/components/site/hud";

type HeroStats = { titles: number; podiums: number; games: number };

const WORDS = ["Fight", "like"];

export function Hero({ stats }: { stats: HeroStats }) {
  // Normalised pointer position (-0.5 … 0.5), written straight from the event.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Stiff springs: depth layers settle quickly without trailing the cursor.
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const emblemX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const emblemY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const glowX = useTransform(sx, [-0.5, 0.5], [40, -40]);
  const glowY = useTransform(sy, [-0.5, 0.5], [30, -30]);
  const ringX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const ringY = useTransform(sy, [-0.5, 0.5], [-24, 24]);
  const textX = useTransform(sx, [-0.5, 0.5], [6, -6]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-28">
      {/* Background layers */}
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 -z-20 opacity-60" />
      <InteractiveField className="-z-10" gap={32} radius={190} drift={20} />
      {/* Soft glows as radial gradients (no blur filters: far cheaper to composite) */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY, background: "radial-gradient(circle, rgba(255,255,255,0.09), transparent 62%)" }}
        className="pointer-events-none absolute top-[12%] right-[2%] -z-10 h-[40rem] w-[40rem] will-change-transform"
      />
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <motion.div style={{ x: textX }} className="relative min-w-0 lg:col-span-6">
          <div
            className="anim-fade-up inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pr-4 pl-1 text-xs text-zinc-300"
          >
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black uppercase">
              We&apos;re back
            </span>
            The pack returns
          </div>

          <h1
            aria-label="Fight like a wolf."
            className="mt-8 text-6xl leading-[0.95] font-semibold tracking-[-0.05em] text-white uppercase sm:text-8xl xl:text-[7rem]"
          >
            {WORDS.map((w, i) => (
              <span key={w} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                <span className="anim-rise inline-block" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                  {w}&nbsp;
                </span>
              </span>
            ))}
            <br />
            <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
              <span className="anim-rise inline-block" style={{ animationDelay: "0.22s" }}>a&nbsp;</span>
            </span>
            {/* Extra right padding keeps the outlined full stop from being clipped by the tight letter-spacing */}
            <span aria-hidden className="inline-block overflow-hidden pr-[0.1em] -mr-[0.1em] pb-[0.08em] -mb-[0.08em] align-bottom">
              <span className="anim-rise inline-block" style={{ animationDelay: "0.3s" }}>
                <span className="glitch stroke-text" data-text="wolf.">wolf.</span>
              </span>
            </span>
          </h1>

          <p
            style={{ animationDelay: "0.4s" }}
            className="anim-fade-up mt-7 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Wolfgang e-Sports stands among Sri Lanka&apos;s most accomplished esports organisations. Its rosters claimed{" "}
            {stats.titles}+ championships across PUBG Mobile, Valorant, Dota 2 and beyond, and reached international finals
            such as the Red Bull M.E.O World Finals.
          </p>

          <div style={{ animationDelay: "0.5s" }} className="anim-fade-up mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Our story</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/achievements">
                Achievements <ArrowRight />
              </Link>
            </Button>
          </div>

          <dl style={{ animationDelay: "0.6s" }} className="anim-fade-up mt-12 grid max-w-md grid-cols-3 border-t border-white/[0.08] pt-6">
            {[
              { k: "Titles", v: stats.titles, plus: true },
              { k: "Podiums", v: stats.podiums, plus: true },
              { k: "Games", v: stats.games, plus: false },
            ].map((s, i) => (
              <div key={s.k} className={i ? "border-l border-white/[0.08] pl-5" : ""}>
                <dd className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">
                  {String(s.v).padStart(2, "0")}
                  {s.plus && <span className="text-zinc-500">+</span>}
                </dd>
                <dt className="hud-label mt-1">{s.k}</dt>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Emblem */}
        <div className="relative lg:col-span-6" style={{ perspective: 1200 }}>
          <motion.div
            aria-hidden
            style={{ x: ringX, y: ringY }}
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <svg viewBox="0 0 400 400" className="w-[96%] max-w-[580px] animate-[spin_60s_linear_infinite] opacity-70">
              <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="2 10" />
              <circle cx="200" cy="200" r="196" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="60 1171" />
              {/* crosshair ticks */}
              {[0, 90, 180, 270].map((deg) => (
                <line key={deg} x1="200" y1="0" x2="200" y2="16" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" transform={`rotate(${deg} 200 200)`} />
              ))}
            </svg>
          </motion.div>

          <div className="anim-emblem relative mx-auto aspect-square w-full max-w-[560px]" style={{ animationDelay: "0.1s" }}>
            <div aria-hidden className="pointer-events-none absolute inset-[12%] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 65%)" }} />
            <HudCorners size="size-6" className="opacity-60" />
            <span className="hud-label absolute top-3 left-10">WG // 01</span>
            <span className="hud-label absolute right-10 bottom-3">Sri Lanka · LK</span>
            <motion.div
              style={{ rotateX, rotateY, x: emblemX, y: emblemY, transformStyle: "preserve-3d" }}
              className="absolute inset-0 will-change-transform"
            >
              <div className="absolute inset-0 grid place-items-center" style={{ transform: "translateZ(60px)" }}>
                <WolfMark className="w-[66%] text-white" />
              </div>
              <div className="absolute inset-0 grid place-items-center" style={{ transform: "translateZ(-20px)" }}>
                <WolfMark className="w-[66%] translate-x-3 translate-y-3 text-white/[0.06]" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        style={{ animationDelay: "1s" }}
        className="anim-fade-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase sm:flex"
      >
        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="size-3.5" />
        </motion.span>
        Scroll
      </div>
    </section>
  );
}

