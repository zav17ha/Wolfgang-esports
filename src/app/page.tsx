import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { Cta } from "@/components/site/cta";
import { CountUp } from "@/components/site/count-up";
import { PostCard } from "@/components/site/post-card";
import { HeadlineCard } from "@/components/site/headline-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ACHIEVEMENTS, type Achievement, stats } from "@/lib/achievements";
import { getPostMetas } from "@/lib/posts";

export const revalidate = 60;

const explore = [
  { href: "/about", no: "01", title: "About", body: "Where Wolfgang came from, what it stands for and the road so far." },
  { href: "/achievements", no: "02", title: "Achievements", body: "Every title, podium and notable run, filterable by game." },
  { href: "/merch", no: "03", title: "Merch", body: "The official Wolfgang e-Sports collection.", soon: true },
  { href: "/blog", no: "04", title: "Blog", body: "Stories, interviews and looks back at the moments that mattered." },
];

const NATIONAL = [
  { ign: "DOOM", name: "Pasan Rodrigo" },
  { ign: "AMARÉ", name: "Harindu Amaratunga" },
  { ign: "HAZEN", name: "Suhaib Hazen" },
  { ign: "SUSTHY", name: "Thamara Surendra" },
];

/** Headline titles shown in the photo grid. `team` narrows events that appear more than once. */
const HEADLINES: { event: string; team?: string; img?: string; pos?: string; className: string; big?: boolean }[] = [
  { event: "Dialog Axita Game Hero Season 3", img: "/images/nrc-gamehero.jpg", pos: "50% 18%", className: "sm:col-span-2 lg:row-span-2", big: true },
  { event: "Logitech G Valorant Pro League 2021", className: "" },
  { event: "Red Bull M.E.O Season 3 — Sri Lanka Finals", className: "" },
  { event: "Codashop Global Series — Sri Lanka", team: "WG Bullet Track", img: "/images/bullet-track-codashop.jpg", pos: "50% 16%", className: "sm:col-span-2" },
  { event: "#01 PUBG Mobile Team in Sri Lanka 2020/21", img: "/images/nrc-ranking-2021.jpg", pos: "50% 32%", className: "sm:col-span-2" },
  { event: "Pro Championship Sri Lanka 2022", img: "/images/squad-pro-championship-2022.jpg", pos: "50% 30%", className: "sm:col-span-2" },
];

function find(event: string, team?: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.event === event && (!team || a.team === team));
}

export default async function Home() {
  const s = stats();
  const posts = (await getPostMetas()).slice(0, 3);
  const headlines = HEADLINES.map((h) => ({ ...h, a: find(h.event, h.team) })).filter((h) => h.a);

  return (
    <>
      <Hero stats={{ titles: s.titles, podiums: s.podiums, games: s.games }} />

      <section className="container-x py-28 sm:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-white/70" />
              The legacy
            </p>
            <h2 className="mt-6 text-3xl leading-[1.1] font-semibold tracking-[-0.035em] text-white sm:text-[2.75rem]">
              Nearly thirty titles under one banner.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:pt-11">
            <p className="text-lg leading-relaxed text-zinc-400">
              From LAN brackets at the ICBT Game Fest to the Red Bull M.E.O World Finals,
              Wolfgang rosters won in almost every game they entered. Those players have since moved on to other
              organisations. Their record stays here in Wolfgang colours, and the pack is now back for its next chapter.
            </p>
            <Link href="/about" className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-white">
              <span className="border-b border-white/25 pb-0.5 transition-colors group-hover:border-white">Read our story</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.06] lg:grid-cols-4">
            {[
              { k: "Championships", v: s.titles, plus: true },
              { k: "Podium finishes", v: s.podiums, plus: true },
              { k: "Game titles", v: s.games, plus: false },
              { k: "Runner-up finishes", v: s.second, plus: true },
            ].map((f) => (
              <div key={f.k} className="relative bg-background px-6 py-7 sm:px-8">
                <dd className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-white sm:text-5xl">
                  <CountUp value={f.v} suffix={f.plus ? "+" : undefined} />
                </dd>
                <dt className="hud-label mt-3">{f.k}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="container-x pb-28 sm:pb-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Trophy cabinet" title="Headline titles." />
          <Reveal>
            <Link href="/achievements" className="group inline-flex items-center gap-2 text-sm font-medium text-white">
              <span className="border-b border-white/25 pb-0.5 transition-colors group-hover:border-white">All achievements</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-flow-dense lg:grid-cols-4">
            {headlines.map((h) => (
              <HeadlineCard key={`${h.event}-${h.team ?? ""}`} a={h.a!} img={h.img} pos={h.pos} className={h.className} big={h.big} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012] py-28 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Explore" title="Everything Wolfgang." />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {explore.map((item) => (
              <StaggerItem key={item.href} className="h-full">
                <Link href={item.href} className="block h-full">
                  <SpotlightCard className="h-full">
                    <div className="flex h-full min-h-56 flex-col p-7">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-zinc-600">{item.no}</span>
                        {item.soon ? (
                          <span className="rounded-full border border-white/20 bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-200 uppercase">
                            Coming soon
                          </span>
                        ) : (
                          <ArrowUpRight className="size-4 text-zinc-600 transition-all duration-300 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5 group-hover/spot:text-white" />
                        )}
                      </div>
                      <h3 className="mt-auto pt-12 text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
                    </div>
                  </SpotlightCard>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x py-28 sm:py-32">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/national-player.jpg"
                alt="Wolfgang player selected for the Sri Lanka PUBG Mobile national team, Bali 2022"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 20%" }}
              />
              <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />
              <span className="hud-label absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-zinc-300">IESF WEC · Bali 2022</span>
            </div>
            <div>
              <SectionHeading
                eyebrow="National duty"
                title="Four wolves. One flag."
                description="When Sri Lanka named its PUBG Mobile squad for the 2022 IESF World Esports Championship in Bali, four of the players came from Wolfgang. The team finished second in its group, one point off top spot."
              />
              <div className="mt-8 grid grid-cols-2 gap-3">
                {NATIONAL.map((p, i) => (
                  <div key={p.ign} className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <span className="font-mono text-[10px] text-zinc-600">#{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-white">{p.ign}</p>
                    <p className="text-xs text-zinc-500">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {posts.length > 0 && (
        <section className="container-x pb-28 sm:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="From the den" title="Latest stories." />
            <Reveal>
              <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-white">
                <span className="border-b border-white/25 pb-0.5 transition-colors group-hover:border-white">Visit the blog</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <StaggerItem key={p.slug} className="h-full">
                <PostCard post={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <Cta />
    </>
  );
}
