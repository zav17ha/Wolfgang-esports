import type { Metadata } from "next";
import { Crosshair, Flame, Swords, Users } from "lucide-react";

import { site } from "@/lib/site";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { ParallaxBanner } from "@/components/site/parallax-banner";
import { HudCorners, WolfMark } from "@/components/site/hud";
import { Cta } from "@/components/site/cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Wolfgang e-Sports, a Sri Lankan esports organisation whose rosters have won 29+ championships.",
};

const pillars = [
  {
    no: "01",
    title: "Competitive rosters",
    body: "Wolfgang fielded teams across PUBG Mobile, Valorant, Dota 2, COD Mobile, Mobile Legends, Free Fire, Rainbow Six Siege and the fighting game scene.",
  },
  {
    no: "02",
    title: "Community events",
    body: "Wolfgang hosted its own tournaments, including the Wolfgang Pro League for COD Mobile, Blood Hunters 2020 for PUBG Mobile and the FFLC for Free Fire.",
  },
  {
    no: "03",
    title: "Developing talent",
    body: "Wolfgang players went from local brackets to the Red Bull M.E.O World Finals.",
  },
];

const values = [
  { Icon: Crosshair, title: "Compete to win", body: "Wolfgang entered tournaments to take the trophy. Preparation, scrims and review came first." },
  { Icon: Users, title: "Move as a pack", body: "Rosters and titles changed, but Wolfgang players backed each other across every division." },
  { Icon: Swords, title: "Every arena", body: "Mobile, PC or console, shooter or fighter: Wolfgang competed wherever there was a bracket." },
  { Icon: Flame, title: "Grow the scene", body: "Wolfgang was one of the voting member clans of the Sri Lanka Esports Association." },
];

const timeline = [
  { when: "2017", title: "Titles at the ICBT Game Fest", body: "Wolfgang players finish first and second in Mortal Kombat X singles at the ICBT Game Fest '17." },
  { when: "2019", title: "Hunting Grounds champions", body: "Team Matto wins Hunting Grounds 2019 for Wolfgang." },
  {
    when: "2020",
    title: "SLESA, Red Bull and the PUBG Mobile wing",
    body: "Wolfgang finishes second in COD Mobile and third in Valorant at the first SLESA Invitational, and WG Born 2 Rush wins the Red Bull M.E.O Sri Lanka finals.",
  },
  {
    when: "2021",
    title: "The No.1 PUBG Mobile team",
    body: "B2R places eighth at the Red Bull M.E.O World Finals East. WG NRC Esports wins Red Bull M.E.O Season 4 and finishes the season ranked first in Sri Lanka with 12 titles.",
  },
  {
    when: "2022",
    title: "Valorant champions",
    body: "Wolfgang wins the first Logitech G Valorant Pro League, and the PUBG Mobile squad finishes second at Pro Championship Sri Lanka 2022.",
  },
  {
    when: "Now",
    title: "Back in the hunt",
    body: "Wolfgang e-Sports is back. The rosters behind this record have moved on to other organisations, and a new pack is ready to write the next chapter.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="About us"
        title="Built by those who played to win."
        description={`${site.legalName} is a Sri Lankan esports organisation. Its rosters have won 29+ championships across PUBG Mobile, Valorant, Dota 2 and more.`}
      />

      <section className="container-x grid items-center gap-14 py-28 sm:py-32 lg:grid-cols-2">
        <Reveal>
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#151515] to-black">
            <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
            <div aria-hidden className="scanlines absolute inset-0 opacity-50" />
            <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.12), transparent 45%)" }} />
            <HudCorners size="size-5" className="opacity-60" />
            <span className="hud-label absolute top-4 left-10">Sri Lanka · LK</span>
            <WolfMark className="relative w-1/2 text-white" />
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="Our story" title="From LAN halls to world finals." />
          <Reveal delay={0.15}>
            <div className="mt-6 space-y-5 leading-relaxed text-zinc-400">
              <p className="text-lg font-medium text-white">A group of players who wanted to compete seriously, and win together.</p>
              <p>
                Wolfgang players made their name at LAN events like the ICBT Game Fest. As the scene moved to mobile,
                Wolfgang&apos;s PUBG Mobile wing grew into one of the strongest in the country, with NRC Esports, Bullet Track and
                Born 2 Rush winning tournament after tournament.
              </p>
              <p>
                On PC, Wolfgang won the first Logitech G Valorant Pro League, took the Recalled Dota 2 Community Cup, and swept
                the podium at National Esports in Tekken 7, Street Fighter V and Arena of Valor. The slogan was always the same:{" "}
                <span className="text-white">&ldquo;{site.slogan}&rdquo;</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-28 sm:pb-32">
        <ParallaxBanner src="/images/cover.jpg" alt="Two Wolfgang players in team jerseys under the #WolfgangEsports banner" pos="50% 50%" />
      </section>

      <section className="container-x pb-28 sm:pb-32">
        <SectionHeading
          eyebrow="What we did"
          title="Three pillars. One standard."
          description="Everything Wolfgang builds is held to the same expectation: compete, win and lift the scene."
        />
        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <StaggerItem key={p.no} className="h-full">
              <SpotlightCard className="h-full">
                <div className="p-7 sm:p-8">
                  <span className="font-mono text-xs text-white">{p.no}</span>
                  <h3 className="mt-10 text-xl font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.body}</p>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012] py-28 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Our values" title="What we stood for." />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, body }) => (
              <StaggerItem key={title} className="h-full">
                <SpotlightCard className="h-full">
                  <div className="p-7">
                    <Icon className="size-6 text-white" />
                    <h3 className="mt-8 text-lg font-semibold tracking-tight text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x py-28 sm:py-32">
        <SectionHeading eyebrow="Our journey" title="The road so far." />
        <ol className="relative mt-14 border-l border-white/[0.08] pl-8 sm:pl-12">
          {timeline.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="relative pb-14 last:pb-0">
              <li>
                <span className="absolute top-1.5 -left-[calc(2rem+5px)] size-2.5 rotate-45 bg-white ring-4 ring-white/10 sm:-left-[calc(3rem+5px)]" />
                <p className="font-mono text-xs tracking-[0.2em] text-zinc-400 uppercase">{item.when}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-zinc-400">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <Cta title="Write the next chapter." />
    </>
  );
}
