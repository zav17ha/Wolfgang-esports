import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import { nav, site } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "./social-icons";
import { WolfMark } from "./hud";

const socials = [
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: site.socials.facebook, Icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-black">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="container-x flex flex-col items-center gap-6 py-8 lg:flex-row lg:justify-between">
        <Link href="/" aria-label={`${site.name} home`} className="group flex shrink-0 items-center gap-3">
          <WolfMark className="h-9 w-auto text-white transition-transform duration-300 group-hover:-skew-x-6" />
          <Image src="/images/wordmark.png" alt="" width={900} height={175} sizes="140px" className="h-7 w-auto" />
        </Link>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-zinc-400 transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${site.email}`}
            aria-label={`Email ${site.email}`}
            className="grid size-9 place-items-center rounded-full border border-white/[0.08] text-zinc-400 transition-colors duration-200 hover:border-white/40 hover:text-white"
          >
            <Mail className="size-4" />
          </a>
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-9 place-items-center rounded-full border border-white/[0.08] text-zinc-400 transition-colors duration-200 hover:border-white/40 hover:text-white"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs text-zinc-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="font-mono tracking-[0.2em] uppercase">
            {site.location} · #FightLikeAWolf
          </p>
        </div>
      </div>
    </footer>
  );
}
