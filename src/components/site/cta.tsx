import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal, SplitHeading } from "@/components/motion/reveal";
import { HudCorners, WolfMark } from "./hud";

export function Cta({
  title = "Fight like a wolf.",
  description = "Players, creators, brands and tournament organisers: if you want to help write what comes next for Wolfgang, we'd like to hear from you.",
  secondary = { href: "/achievements", label: "Achievements" },
}: {
  title?: string;
  description?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#111111] to-black px-6 py-20 text-center sm:px-12 sm:py-24">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[50rem] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.12), transparent 65%)" }}
        />
        <WolfMark className="pointer-events-none absolute -bottom-16 -left-10 w-80 text-white/[0.03]" />
        <HudCorners size="size-5" className="opacity-50" />
        <div className="relative">
          <p className="hud-label">{"// What comes next"}</p>
          <SplitHeading
            text={title}
            className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl"
          />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-xl text-zinc-400">{description}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get in touch <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
