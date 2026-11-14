import type { Metadata } from "next";
import Image from "next/image";
import { BellRing } from "lucide-react";

import { site } from "@/lib/site";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { FacebookIcon, InstagramIcon } from "@/components/site/social-icons";
import { ComingSoon } from "@/components/site/coming-soon";
import { HudCorners } from "@/components/site/hud";

export const metadata: Metadata = {
  title: "Merch",
  description: "The official Wolfgang e-Sports merchandise collection is coming soon.",
};

const socials = [
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
];

export default function MerchPage() {
  const notify = `mailto:${site.email}?subject=${encodeURIComponent("Merch launch: notify me")}&body=${encodeURIComponent(
    "Please let me know when the official Wolfgang e-Sports merchandise becomes available."
  )}`;

  return (
    <>
      <PageHeader
        index="03"
        eyebrow="Merch"
        title="Wear the pack."
        description="The official Wolfgang e-Sports collection is in development, made for players and supporters alike."
      />

      <section className="container-x py-24 sm:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#111111] to-black">
            <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-[10%] h-96 w-96 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 65%)" }}
            />
            <HudCorners size="size-5" className="opacity-50" />
            <div className="relative grid items-center gap-12 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 text-xs font-medium text-zinc-200">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                  </span>
                  In development
                </span>
                <ComingSoon />
                <p className="mt-6 max-w-md leading-relaxed text-zinc-400">
                  Be among the first to know when the collection launches. Register your interest by email or follow our
                  official channels for announcements.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg">
                    <a href={notify}>
                      <BellRing /> Notify me
                    </a>
                  </Button>
                  <div className="flex gap-2">
                    {socials.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="grid size-12 place-items-center rounded-md border border-white/[0.08] text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white"
                      >
                        <Icon className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-lg">
                <div aria-hidden className="absolute inset-[8%] rounded-full border border-white/[0.06]" />
                <div aria-hidden className="absolute inset-[20%] rounded-full border border-dashed border-white/15" />
                <div aria-hidden className="absolute inset-x-[24%] bottom-[6%] h-6 rounded-[100%] bg-white/15 blur-2xl" />
                <Image
                  src="/images/merch-tshirt.webp"
                  alt="Wolfgang e-Sports official T-shirt"
                  width={560}
                  height={630}
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="absolute inset-0 m-auto h-[84%] w-auto animate-[float_6s_ease-in-out_infinite] object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
                />
                <span className="hud-label absolute top-[6%] left-[6%]">Official tee</span>
                <span className="hud-label absolute right-[6%] bottom-[4%]">Drop 01</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
