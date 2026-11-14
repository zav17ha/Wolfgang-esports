import { InteractiveField } from "./interactive-field";
import { SplitHeading } from "@/components/motion/reveal";
import { WolfMark } from "./hud";

export function PageHeader({
  eyebrow,
  title,
  description,
  index,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** HUD index shown before the eyebrow, e.g. "02" */
  index?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] pt-36 pb-20 sm:pt-44 sm:pb-24">
      <InteractiveField className="mask-fade-b" gap={28} radius={160} drift={12} />
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[30rem] w-[64rem] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 65%)" }}
      />
      <WolfMark className="pointer-events-none absolute top-1/2 -right-10 hidden w-[34rem] -translate-y-1/2 text-white/[0.03] md:block" />
      <div className="container-x relative">
        <p className="eyebrow anim-fade-up flex items-center gap-3">
          {index && <span className="text-white">{index}</span>}
          <span className="h-px w-8 bg-white/70" />
          {eyebrow}
        </p>
        <SplitHeading
          as="h1"
          immediate
          delay={0.1}
          text={title}
          className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl"
        />
        {description && (
          <p
            style={{ animationDelay: "0.3s" }}
            className="anim-fade-up mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
