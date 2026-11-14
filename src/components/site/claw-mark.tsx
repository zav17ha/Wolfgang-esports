import { useId } from "react";

import { cn } from "@/lib/utils";

/** The three claw marks of the Wolfgang logo (same shapes as `WolfMark`). */
const MARKS = [
  "10,0 553,0 403,440 593,0 883,0 444,1335",
  "1028,0 1441,3 992,1306 783,574",
  "1572,38 1742,554 1514,1214 1767,630 1997,1325 1016,1335",
];

/**
 * Intro: each mark is revealed by a wide stroke drawn along it, top to bottom,
 * so the logo appears as a three-claw swipe. Width = how far the stroke reaches sideways.
 */
const SWIPES = [
  { d: "M450 -60 L444 1400", width: 1000 },
  { d: "M1250 -60 L985 1400", width: 760 },
  { d: "M1560 -60 L1506 1400", width: 1120 },
];

/** Claw strikes: one scratch down each of the four dark slits, top-right to bottom-left. */
const STRIKES = [
  "M700 -330 L380 500",
  "M1060 -280 L690 700",
  "M1610 -250 L980 1390",
  "M1870 295 L1490 1275",
];

/** Seconds after load when the claw strikes and the spin start (after the intro). */
export const CLAW_LOOP_DELAY = 1.6;

/**
 * Animated Wolfgang mark for the landing page.
 * - On load: a staggered claw-swipe reveal.
 * - Then, on a loop: four claw scratches flash along the slits.
 * The parent spins the whole logo slowly and continuously (`.claw-spin`).
 * Pure CSS (see the claw-* rules in globals.css). With reduced motion it is shown static.
 */
export function ClawMark({ className, delay = 0.35 }: { className?: string; delay?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 2000 1340" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        {SWIPES.map((s, i) => (
          <mask key={i} id={`${id}-m${i}`} maskUnits="userSpaceOnUse" x="-200" y="-200" width="2400" height="1800">
            <path
              d={s.d}
              pathLength={1}
              fill="none"
              stroke="#fff"
              strokeWidth={s.width}
              className="claw-swipe"
              style={{ animationDelay: `${delay + i * 0.14}s` }}
            />
          </mask>
        ))}
      </defs>

      {MARKS.map((p, i) => (
        <polygon key={p} points={p} fill="currentColor" mask={`url(#${id}-m${i})`} />
      ))}

      {STRIKES.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={20}
          strokeLinecap="round"
          className="claw-strike"
          style={{ animationDelay: `${CLAW_LOOP_DELAY + i * 0.07}s` }}
        />
      ))}
    </svg>
  );
}
