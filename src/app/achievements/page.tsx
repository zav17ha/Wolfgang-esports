import type { Metadata } from "next";
import Link from "next/link";

import { stats } from "@/lib/achievements";
import { PageHeader } from "@/components/site/page-header";
import { AchievementsBoard } from "@/components/site/achievements-board";
import { CountUp } from "@/components/site/count-up";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Every championship, podium and notable run won by Wolfgang e-Sports rosters.",
};

export default function AchievementsPage() {
  const s = stats();
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="Trophy cabinet"
        title="Every title. Every podium."
        description="Results won by former Wolfgang rosters, from school tournaments to international finals."
      />

      <section className="container-x py-20 sm:py-24">
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {[
              { k: "Championships", v: s.titles, plus: true },
              { k: "Podium finishes", v: s.podiums, plus: true },
              { k: "Runner-up", v: s.second, plus: true },
              { k: "Game titles", v: s.games, plus: false },
            ].map((f) => (
              <div key={f.k} className="border-l border-white/10 pl-5">
                <dd className="font-mono text-4xl font-semibold tabular-nums text-white sm:text-5xl">
                  <CountUp value={f.v} suffix={f.plus ? "+" : undefined} />
                </dd>
                <dt className="hud-label mt-2">{f.k}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-16">
          <AchievementsBoard />
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          All results were won by rosters who have since moved on to other organisations. Years are shown where known.{" "}
          <Link href="/contact" className="text-zinc-300 underline underline-offset-4 hover:text-white">Report a missing result</Link>.
        </p>
      </section>
    </>
  );
}
