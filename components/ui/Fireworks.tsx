"use client";

import { useEffect, useRef } from "react";

/**
 * A short burst of fireworks over the window that opens after saving a capture (Tiffany 11/24: "放烟花的动效小彩蛋").
 * Drawn on a canvas that covers its parent and lets clicks pass through; five bursts over about two and a half
 * seconds in the colours given (the scent families just recorded, with the brand's apricot and periwinkle), then it
 * clears itself. People whose device asks for reduced motion see nothing move.
 */
export function Fireworks({ colors, bursts = 5, duration = 2600 }: { colors: string[]; bursts?: number; duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // a new array on every render must not restart the show: the effect keys on the colours' text
  const key = colors.join(",");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const W = () => canvas.width / dpr;
    const H = () => canvas.height / dpr;
    const palette = key ? key.split(",") : ["#E7B49F", "#A0A6C8"];

    type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };
    const sparks: Spark[] = [];
    const burst = (i: number) => {
      // bursts spread across the window, a little above the middle
      const x = W() * (0.15 + ((i * 0.37) % 0.7)) + (Math.random() - 0.5) * 40;
      const y = H() * (0.18 + Math.random() * 0.3);
      const count = 70;
      const color = palette[i % palette.length];
      for (let k = 0; k < count; k++) {
        const a = (k / count) * Math.PI * 2 + Math.random() * 0.2;
        const speed = 2.8 + Math.random() * 3.4;
        sparks.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 0, max: 60 + Math.random() * 30, color: k % 5 === 0 ? "#FFFFFF" : color, size: 2.2 + Math.random() * 2.6 });
      }
    };

    const start = performance.now();
    const gap = duration / (bursts + 1);
    let fired = 0;
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      while (fired < bursts && t >= fired * gap) burst(fired++);
      ctx.clearRect(0, 0, W(), H());
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        s.vx *= 0.975;
        s.vy = s.vy * 0.975 + 0.06; // a little gravity
        s.x += s.vx;
        s.y += s.vy;
        const fade = 1 - s.life / s.max;
        if (fade <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = fade;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (0.6 + fade * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (fired < bursts || sparks.length) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W(), H());
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", fit);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
  }, [key, bursts, duration]);

  return <canvas ref={ref} className="fireworks" aria-hidden="true" />;
}
