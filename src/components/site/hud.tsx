import { cn } from "@/lib/utils";

/** The Wolfgang mark as an inline SVG, so it stays crisp at any size. */
export function WolfMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2000 1340" fill="currentColor" aria-hidden className={className}>
      <polygon points="10,0 553,0 403,440 593,0 883,0 444,1335" />
      <polygon points="1028,0 1441,3 992,1306 783,574" />
      <polygon points="1572,38 1742,554 1514,1214 1767,630 1997,1325 1016,1335" />
    </svg>
  );
}

/** HUD corner brackets. Use inside a `relative` parent. */
export function HudCorners({ className, size = "size-3", hover = false }: { className?: string; size?: string; hover?: boolean }) {
  const base = cn(
    "pointer-events-none absolute border-white/50",
    size,
    hover && "opacity-0 transition-all duration-300 group-hover/spot:opacity-100 group-hover/tilt:opacity-100 group-hover:opacity-100",
  );
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(base, "top-2 left-2 border-t border-l")} />
      <span className={cn(base, "top-2 right-2 border-t border-r")} />
      <span className={cn(base, "bottom-2 left-2 border-b border-l")} />
      <span className={cn(base, "right-2 bottom-2 border-r border-b")} />
    </span>
  );
}

/** Small "status" chip with a blinking dot, e.g. LEGACY · RECORD. */
export function StatusChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] font-medium tracking-[0.2em] text-zinc-200 uppercase",
        className,
      )}
    >
      <span className="anim-blink size-1.5 rounded-full bg-white" />
      {children}
    </span>
  );
}

/** Placement badge: solid white for titles, outlined otherwise. */
export function PlaceBadge({ label, champion = false, className }: { label: string; champion?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "clip-chamfer-sm inline-flex h-7 min-w-[5.5rem] items-center justify-center px-3 font-mono text-[10px] font-semibold tracking-[0.16em] uppercase",
        champion ? "bg-white text-black" : "bg-white/[0.07] text-zinc-200",
        className,
      )}
    >
      {label}
    </span>
  );
}
