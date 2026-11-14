"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Distance between dots in CSS pixels */
  gap?: number;
  /** Radius of cursor influence in CSS pixels */
  radius?: number;
  /** How far the background drifts with the cursor (parallax) */
  drift?: number;
};

/**
 * Canvas dot-field that reacts to the pointer (white on black).
 *
 * Performance: the static grid is rendered once into an offscreen bitmap and blitted each frame;
 * only the dots near the pointer (and ones still settling) are computed per frame, and the loop
 * stops completely when nothing is moving. The pointer position is read straight from events,
 * so the effect never trails the cursor.
 */
export function InteractiveField({ className, gap = 32, radius = 180, drift = 18 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rect = canvas.getBoundingClientRect();
    let cols = 0;
    let rows = 0;
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let heat = new Float32Array(0);
    let active = new Set<number>();
    const stat = document.createElement("canvas");
    const sctx = stat.getContext("2d")!;

    const pointer = { x: -9999, y: -9999, active: false };
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = true;

    const resize = () => {
      rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil((width + drift * 4) / gap) + 1;
      rows = Math.ceil((height + drift * 4) / gap) + 1;
      const n = cols * rows;
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      heat = new Float32Array(n);
      active = new Set();
      // static grid bitmap (slightly larger than the canvas to allow parallax drift)
      stat.width = Math.round((width + drift * 4) * dpr);
      stat.height = Math.round((height + drift * 4) * dpr);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, width + drift * 4, height + drift * 4);
      sctx.fillStyle = "rgba(255,255,255,0.11)";
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) sctx.fillRect(i * gap - 0.55, j * gap - 0.55, 1.1, 1.1);
    };

    const start = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.active = x >= -radius && y >= -radius && x <= width + radius && y <= height + radius;
      parallax.tx = (e.clientX / window.innerWidth - 0.5) * -drift * 2;
      parallax.ty = (e.clientY / window.innerHeight - 0.5) * -drift * 2;
      start();
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = pointer.y = -9999;
      start();
    };
    const onScroll = () => {
      rect = canvas.getBoundingClientRect();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      parallax.x += (parallax.tx - parallax.x) * 0.1;
      parallax.y += (parallax.ty - parallax.y) * 0.1;
      const startX = -drift * 2 + parallax.x;
      const startY = -drift * 2 + parallax.y;
      ctx.drawImage(stat, startX, startY, width + drift * 4, height + drift * 4);

      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius * 1.6);
        g.addColorStop(0, "rgba(255, 255, 255, 0.06)");
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - radius * 1.6, pointer.y - radius * 1.6, radius * 3.2, radius * 3.2);

        // add the dots inside the pointer radius to the active set
        const i0 = Math.max(0, Math.floor((pointer.x - startX - radius) / gap));
        const i1 = Math.min(cols - 1, Math.ceil((pointer.x - startX + radius) / gap));
        const j0 = Math.max(0, Math.floor((pointer.y - startY - radius) / gap));
        const j1 = Math.min(rows - 1, Math.ceil((pointer.y - startY + radius) / gap));
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) active.add(j * cols + i);
      }

      const r2 = radius * radius;
      active.forEach((k) => {
        const i = k % cols;
        const j = (k - i) / cols;
        const bx = startX + i * gap;
        const by = startY + j * gap;
        let tx = 0, ty = 0, th = 0;
        if (pointer.active) {
          const dx = bx - pointer.x;
          const dy = by - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / radius;
            const push = f * f * 26;
            tx = (dx / d) * push;
            ty = (dy / d) * push;
            th = f;
          }
        }
        ox[k] += (tx - ox[k]) * 0.22;
        oy[k] += (ty - oy[k]) * 0.22;
        heat[k] += (th - heat[k]) * 0.22;
        const h = heat[k];
        if (h < 0.01 && Math.abs(ox[k]) < 0.1 && Math.abs(oy[k]) < 0.1 && th === 0) {
          ox[k] = oy[k] = heat[k] = 0;
          active.delete(k);
          return;
        }
        const size = 1.1 + h * 1.8;
        ctx.fillStyle = `rgba(255,255,255,${0.14 + h * 0.8})`;
        ctx.fillRect(bx + ox[k] - size / 2, by + oy[k] - size / 2, size, size);
      });
    };

    const loop = () => {
      draw();
      const settling = Math.abs(parallax.tx - parallax.x) > 0.05 || Math.abs(parallax.ty - parallax.y) > 0.05;
      raf = visible && (pointer.active || active.size > 0 || settling) ? requestAnimationFrame(loop) : 0;
    };

    resize();
    draw();
    if (!reduced && !coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [gap, radius, drift]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
