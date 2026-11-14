import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InteractiveField } from "@/components/site/interactive-field";
import { WolfMark } from "@/components/site/hud";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden px-5 pt-24 text-center">
      <InteractiveField className="mask-fade-b" />
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative">
        <WolfMark className="mx-auto mb-8 w-20 text-white/20" />
        <p className="font-mono text-sm tracking-[0.3em] text-zinc-400">ERROR 404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">
          <span className="glitch" data-text="Out of bounds.">Out of bounds.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">The page you are looking for does not exist or has been moved.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeft /> Back to home
          </Link>
        </Button>
      </div>
    </section>
  );
}
