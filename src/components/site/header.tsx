"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";

import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { WolfMark } from "./hud";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden((h) => (y > 400 && y > prev + 4 ? true : y < prev - 4 ? false : h));
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? -90 : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "anim-fade-down transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-b border-white/[0.06] bg-black/70 backdrop-blur-xl" : "border-b border-transparent"
        )}
      >
        <div className="container-x flex h-16 items-center justify-between sm:h-[72px]">
          <Link href="/" className="group relative flex items-center gap-3" aria-label={`${site.name} home`}>
            <WolfMark className="h-7 w-auto text-white transition-transform duration-300 group-hover:-skew-x-6 sm:h-8" />
            <Image
              src="/images/wordmark.png"
              alt=""
              width={900}
              height={175}
              priority
              sizes="130px"
              className="h-[22px] w-auto sm:h-6"
            />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                  isActive(item.href) ? "text-black" : "text-zinc-400 hover:text-white"
                )}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5 font-medium">
                  {item.label}
                  {item.soon && (
                    <span className={cn("rounded-full px-1.5 py-px text-[9px] font-semibold tracking-wide uppercase", isActive(item.href) ? "bg-black/10 text-black" : "bg-white/10 text-zinc-300")}>
                      Soon
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden h-9 px-4 lg:inline-flex">
              <Link href="/contact">
                Get in touch <ArrowUpRight />
              </Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full border-white/[0.06] bg-[#070707] sm:max-w-sm">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
                <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative flex h-full flex-col px-6 pt-20 pb-8">
                  <p className="hud-label mb-4">{"// Menu"}</p>
                  <nav className="flex flex-col">
                    {nav.map((item, i) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between border-b border-white/[0.06] py-4 text-2xl font-medium tracking-tight",
                              isActive(item.href) ? "text-white" : "text-zinc-400"
                            )}
                          >
                            <span className="flex items-baseline gap-3">
                              <span className="font-mono text-xs text-zinc-600">0{i + 1}</span>
                              {item.label}
                              {item.soon && (
                                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-300 uppercase">Soon</span>
                              )}
                            </span>
                            {isActive(item.href) && <span className="size-1.5 rounded-full bg-white" />}
                          </Link>
                        </SheetClose>
                      </motion.div>
                    ))}
                  </nav>
                  <div className="mt-auto space-y-1 text-sm text-zinc-500">
                    <p>Get in touch</p>
                    <a href={`mailto:${site.email}`} className="break-all text-white">
                      {site.email}
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
