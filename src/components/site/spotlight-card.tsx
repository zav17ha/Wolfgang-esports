"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { HudCorners } from "./hud";

/** Card with a white glow that tracks the pointer instantly via CSS variables, plus HUD corners on hover. */
export function SpotlightCard({
  className,
  children,
  hud = true,
  ...props
}: React.ComponentProps<"div"> & { hud?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group/spot relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent transition-colors duration-300 hover:border-white/25",
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.08), transparent 45%)",
        }}
      />
      {hud && <HudCorners hover />}
      <div className="relative">{children}</div>
    </div>
  );
}
