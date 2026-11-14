import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { site } from "@/lib/site";
import { ContactForm } from "@/components/site/contact-form";
import { InteractiveField } from "@/components/site/interactive-field";
import { SplitHeading, Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Wolfgang e-Sports about partnerships, players and creators, press or merch.",
};

const channels = [
  { k: "Email", v: site.email, href: `mailto:${site.email}`, external: false },
  { k: "Instagram", v: site.handles.instagram, href: site.socials.instagram, external: true },
  { k: "Facebook", v: site.handles.facebook, href: site.socials.facebook, external: true },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      <InteractiveField className="mask-fade-b opacity-70" gap={32} radius={160} drift={10} />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/4 h-[32rem] w-[60rem] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 65%)" }}
      />

      <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <p className="eyebrow anim-fade-up flex items-center gap-3">
            <span className="text-white">05</span>
            <span className="h-px w-8 bg-white/70" />
            Contact
          </p>
          <SplitHeading
            as="h1"
            immediate
            delay={0.1}
            text="Let's talk."
            className="mt-6 text-6xl font-semibold tracking-[-0.05em] text-white sm:text-8xl"
          />
          <p style={{ animationDelay: "0.3s" }} className="anim-fade-up mt-6 max-w-md text-lg leading-relaxed text-zinc-400">
            Partnerships, press, merch or a result we&apos;ve missed. Drop us a line and someone from the team will reply personally.
          </p>

          <ul style={{ animationDelay: "0.4s" }} className="anim-fade-up mt-12 border-t border-white/[0.08]">
            {channels.map((c) => (
              <li key={c.k} className="border-b border-white/[0.08]">
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="hud-label w-24 shrink-0">{c.k}</span>
                  <span className="min-w-0 flex-1 truncate text-base text-zinc-200 transition-colors group-hover:text-white sm:text-lg">{c.v}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-zinc-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.15} className="min-w-0 lg:col-span-6 lg:col-start-7 lg:pt-4">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/80 p-7 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Send a message</h2>
            <p className="mt-2 mb-10 text-sm text-zinc-500">Fill in the form and we&apos;ll get back to you by email.</p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
