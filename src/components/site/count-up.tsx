"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

/** Number that counts up once when it scrolls into view (scoreboard style). */
export function CountUp({ value, pad = 2, className, suffix }: { value: number; pad?: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(value).padStart(pad, "0");
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v)).padStart(pad, "0");
      },
    });
    return () => controls.stop();
  }, [inView, value, pad]);

  return (
    <span className={className}>
      <span ref={ref}>{String(value).padStart(pad, "0")}</span>
      {suffix && <span className="text-zinc-500">{suffix}</span>}
    </span>
  );
}
