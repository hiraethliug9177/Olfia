"use client";

import { useEffect, useRef } from "react";
import { familyById, type ScentType } from "@/lib/catalog";
import { SCENT_MID, type FeelingShape, type SensoryValues } from "@/lib/roomScent";
import type { FamilyId, TimeOfDay } from "@/lib/types";

/**
 * Scent View (Tiffany's Notion, 11/23): a living layer of scent over the room. Each product type moves its own way:
 * - candle: warm field of candlelight, a slight flicker, the scent spreading slowly outward
 * - reed: a soft bloom that is always there, breathing a little
 * - incense: thin, translucent trails that curl upward and thin out
 * - spray: a cloud of particles released at once, fading slowly
 * - aroma: soft mist released in a steady rhythm
 * - wax: warm, low-saturation blooms that slowly merge
 * - flora (flowers & plants): mist with no edge, released evenly in one place
 * - stones: a still, steady bloom
 * Everything is a function of time, so pausing freezes the picture and reduced motion shows one still frame.
 */

export interface FlowSource {
  uid: string;
  type: ScentType;
  /** where the scent leaves the product, in stage fractions */
  x: number;
  y: number;
  /** the product's box width, in stage fractions (bigger products make bigger fields) */
  w: number;
  family: FamilyId;
}

export interface FlowSettings {
  /** 20–100, the room's Scent strength */
  strength: number;
  sensory: SensoryValues;
  feel: FeelingShape;
  time: TimeOfDay;
  windowOpen: boolean;
  paused: boolean;
  /** a product to bring forward; the others fade back */
  focus: string | null;
}

type RGB = [number, number, number];
const hexRgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const grey = (c: RGB, keep: number): RGB => {
  const g = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
  return mix([g, g, g], c, keep);
};
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const PERIWINKLE: RGB = hexRgb("#A0A6C8");
const APRICOT: RGB = hexRgb("#E7B49F");
const IVORY: RGB = hexRgb("#F8F6F0");
const CANDLELIGHT: RGB = [255, 232, 196];
const TAU = Math.PI * 2;
/** v2 motion spec: family tempo (citrus quicker, woody slower) */
const TEMPO: Partial<Record<FamilyId, number>> = { citrus: 1 / 0.7, woody: 1 / 1.3 };

/** A small fixed random number for index n (no state, so every frame agrees). */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const seedOf = (uid: string) => {
  let h = 0;
  for (let i = 0; i < uid.length; i += 1) h = (h * 31 + uid.charCodeAt(i)) >>> 0;
  return (h % 1000) / 97;
};

interface Paint {
  /** the layer behind the fragrance products (fields, blooms, mist) */
  ctx: CanvasRenderingContext2D;
  /** the layer in front of them (flames, threads, particles, motes) */
  fx: CanvasRenderingContext2D;
  x: number;
  y: number;
  /** field radius in px */
  R: number;
  /** the product's own width in px (flames and threads are sized by it) */
  pw: number;
  /** base opacity */
  a: number;
  c: RGB;
  core: RGB;
  t: number;
  seed: number;
  /** 0 dry … 1 creamy */
  cream: number;
  /** spread and rise multipliers (Airy ↔ Enveloping and the feelings) */
  spread: number;
  rise: number;
  wobble: number;
  /** stop where a field starts to fade (higher = denser edge) */
  edge: number;
  /** sideways drift when the window is open */
  wind: number;
  night: boolean;
}

function blob(g2: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB, a: number, edge = 0.45) {
  if (r < 1 || a < 0.004) return;
  const g = g2.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(c, a));
  g.addColorStop(edge, rgba(c, a * 0.55));
  g.addColorStop(1, rgba(c, 0));
  g2.fillStyle = g;
  g2.beginPath();
  g2.arc(x, y, r, 0, TAU);
  g2.fill();
}

function ring(g2: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB, a: number) {
  if (r < 2 || a < 0.004) return;
  const g = g2.createRadialGradient(x, y, r * 0.4, x, y, r);
  g.addColorStop(0, rgba(c, 0));
  g.addColorStop(0.6, rgba(c, a * 0.6));
  g.addColorStop(0.82, rgba(c, a));
  g.addColorStop(1, rgba(c, 0));
  g2.fillStyle = g;
  g2.beginPath();
  g2.arc(x, y, r, 0, TAU);
  g2.fill();
}

function dot(g2: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB, a: number) {
  if (a < 0.01) return;
  g2.fillStyle = rgba(c, a);
  g2.beginPath();
  g2.arc(x, y, Math.max(0.6, r), 0, TAU);
  g2.fill();
}

/**
 * Tiffany's Scent View sketch (11/24): dashed rings around each product's field, drifting slowly outward and fading as
 * they widen, so the reach of each scent reads like a map. Drawn on the back layer, under the products.
 */
function dashedRings(p: Paint, count: number, lift: number) {
  const g2 = p.ctx;
  const col = mix(p.core, [41, 42, 49], 0.3);
  const cy = p.y - p.R * lift * p.rise;
  g2.save();
  g2.setLineDash([5, 6]);
  g2.lineWidth = 1.2;
  g2.lineDashOffset = -p.t * 5;
  for (let i = 0; i < count; i += 1) {
    const f = (i / count + p.t * 0.04 + p.seed * 0.1) % 1;
    const r = p.R * p.spread * (0.3 + 0.95 * f);
    const a = Math.min(0.45, p.a * 0.62) * Math.sin(Math.PI * f) ** 0.7;
    if (a < 0.01) continue;
    g2.strokeStyle = rgba(col, a);
    g2.beginPath();
    g2.ellipse(p.x + p.wind * r * 0.25, cy, r * 1.1, r * 0.88, 0, 0, TAU);
    g2.stroke();
  }
  g2.restore();
}

/** The scent filling the room: one wide, faint wash per product. */
function ambient(p: Paint, lift = 0.5) {
  blob(p.ctx, p.x + p.wind * p.R * 0.6, p.y - p.R * lift * p.rise, p.R * 2.5 * p.spread, p.c, p.a * 0.16, p.edge * 0.6);
}

/** Dry settings scatter a fine grain over a field; creamy settings leave it smooth. */
function grain(p: Paint, x: number, y: number, r: number) {
  const n = Math.round((0.5 - p.cream) * 2 * 18);
  for (let i = 0; i < n; i += 1) {
    const ang = rnd(p.seed * 3 + i) * TAU + p.t * 0.05;
    const d = Math.sqrt(rnd(p.seed * 5 + i * 1.7)) * r;
    dot(p.fx, x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.8, 1, p.core, p.a * 0.6 * (1 - d / r));
  }
}

/** A small candle flame, flickering, standing on the wick. */
function flame(p: Paint, flicker: number) {
  const h = Math.max(9, Math.min(26, p.pw * 0.3)) * (0.9 + (flicker - 0.93) * 2.4);
  const w = h * 0.42;
  const sway = Math.sin(p.t * 5.3 + p.seed) * w * 0.12;
  const cx = p.x + sway;
  const cy = p.y - h * 0.55;
  const g2 = p.fx;
  blob(g2, cx, cy, h * 1.4, CANDLELIGHT, p.night ? 0.45 : 0.3, 0.3);
  g2.save();
  g2.translate(cx, cy);
  g2.scale(w / h, 1);
  const g = g2.createRadialGradient(0, h * 0.2, 0, 0, 0, h * 0.62);
  g.addColorStop(0, "rgba(255,252,236,0.98)");
  g.addColorStop(0.45, "rgba(255,214,140,0.92)");
  g.addColorStop(0.85, "rgba(236,150,80,0.55)");
  g.addColorStop(1, "rgba(236,150,80,0)");
  g2.fillStyle = g;
  g2.beginPath();
  g2.moveTo(0, -h * 0.62);
  g2.bezierCurveTo(h * 0.42, -h * 0.1, h * 0.42, h * 0.42, 0, h * 0.5);
  g2.bezierCurveTo(-h * 0.42, h * 0.42, -h * 0.42, -h * 0.1, 0, -h * 0.62);
  g2.fill();
  g2.restore();
}

const DRAW: Record<ScentType, (p: Paint) => void> = {
  candle(p) {
    const { x, y, R, t, seed } = p;
    const flicker = 0.93 + 0.05 * Math.sin(t * 8.3 + seed) + 0.03 * Math.sin(t * 13.1 + seed * 1.7) + 0.02 * Math.sin(t * 21.7 + seed * 0.3);
    const warmC = mix(p.c, APRICOT, 0.3);
    ambient(p, 0.3);
    blob(p.ctx, x, y - R * 0.15, R * 1.05 * p.spread * flicker, warmC, p.a * 0.55, p.edge);
    for (let k = 0; k < 3; k += 1) {
      const ph = (t / 6 + k / 3 + seed * 0.1) % 1;
      ring(p.ctx, x, y - R * 0.25 * ph * p.rise, R * (0.5 + ph * 1.5) * p.spread, warmC, p.a * 0.5 * (1 - ph) * Math.min(1, ph * 4));
    }
    blob(p.ctx, x, y, R * 0.42 * flicker, mix(warmC, CANDLELIGHT, 0.6), p.a * (p.night ? 1 : 0.8), 0.3);
    flame(p, flicker);
    grain(p, x, y - R * 0.1, R * 0.9 * p.spread);
  },
  reed(p) {
    const { x, y, R, t, seed } = p;
    const breathe = 1 + 0.1 * Math.sin((t / 5) * TAU + seed);
    ambient(p, 0.6);
    blob(p.ctx, x, y - R * 0.3 * p.rise, R * 1.15 * breathe * p.spread, p.c, p.a * 0.6, p.edge);
    blob(p.ctx, x, y - R * 0.38 * p.rise, R * 0.6 * breathe, p.core, p.a * 0.32, 0.4);
    for (let i = 0; i < 9; i += 1) {
      const ph = (t * 0.05 + rnd(seed + i)) % 1;
      const mx = x + Math.sin(t * 0.4 * p.wobble + i * 1.7) * R * 0.6 * p.spread + p.wind * ph * R;
      const my = y - ph * R * 1.5 * p.rise;
      dot(p.fx, mx, my, 1.6 + p.cream * 1.8, p.core, p.a * 0.75 * Math.sin(Math.PI * ph));
    }
    grain(p, x, y - R * 0.3, R * 0.95 * p.spread);
  },
  incense(p) {
    const { x, y, R, t, seed } = p;
    const H = R * 2.9 * p.rise;
    const lw = 1.3 + p.cream * 1.6;
    blob(p.ctx, x + p.wind * R * 0.8, y - H * 0.55, R * 1.1 * p.spread, p.c, p.a * 0.26, p.edge);
    blob(p.ctx, x, y - H * 0.95, R * 1.6 * p.spread, p.c, p.a * 0.1, p.edge * 0.6);
    for (const g2 of [p.ctx, p.fx]) {
      g2.lineCap = "round";
      g2.lineJoin = "round";
    }
    for (let k = 0; k < 3; k += 1) {
      const ph = ((t + k * 2.33 + seed) % 7) / 7;
      const life = Math.sin(Math.PI * ph);
      const grow = Math.min(1, ph * 2.2);
      if (life < 0.02) continue;
      const path = new Path2D();
      const N = 44;
      for (let j = 0; j <= N; j += 1) {
        const s = (j / N) * grow;
        const xx = x + p.wind * s * s * R * 1.4 + p.wobble * R * 0.32 * Math.pow(s, 1.35) * Math.sin(s * 7 - t * 0.9 + k * 2.1 + seed);
        const yy = y - s * H;
        if (j === 0) path.moveTo(xx, yy);
        else path.lineTo(xx, yy);
      }
      const make = (g2: CanvasRenderingContext2D, alpha: number) => {
        const g = g2.createLinearGradient(x, y, x, y - H);
        g.addColorStop(0, rgba(p.core, alpha * life));
        g.addColorStop(0.55, rgba(p.core, alpha * 0.45 * life));
        g.addColorStop(1, rgba(p.core, 0));
        return g;
      };
      // a wide, faint haze behind the products, the thread itself in front
      p.ctx.strokeStyle = make(p.ctx, p.a * 0.3);
      p.ctx.lineWidth = lw * 7 * p.spread;
      p.ctx.stroke(path);
      p.fx.strokeStyle = make(p.fx, Math.min(1, p.a * 1.15));
      p.fx.lineWidth = lw;
      p.fx.stroke(path);
    }
  },
  spray(p) {
    const { x, y, R, t, seed } = p;
    const P = 5.2;
    const age = (t + seed * 1.3) % P;
    const tau = 0.28;
    const out = 1 - Math.exp(-age / tau);
    const fade = Math.exp(-age / 2.8) * Math.min(1, age / 0.05);
    const n = Math.round(56 + p.spread * 28);
    const ang0 = -Math.PI / 2 + 0.5;
    const cx = x + Math.cos(ang0) * R * 0.85 * out * p.spread + p.wind * age * R * 0.12;
    const cy = y + Math.sin(ang0) * R * 0.85 * out * p.spread - age * R * 0.06 * p.rise;
    ambient(p, 0.7);
    blob(p.ctx, cx, cy, R * (0.6 + age * 0.22) * p.spread, p.c, p.a * 0.55 * Math.exp(-age / 2.6), p.edge);
    for (let i = 0; i < n; i += 1) {
      const ang = ang0 + (rnd(i * 3.1 + seed) - 0.5) * 1.5;
      const v = R * (1.5 + rnd(i * 7.7 + seed) * 2) * p.spread;
      const d = v * tau * out;
      const px = x + Math.cos(ang) * d + p.wind * age * R * 0.12 + Math.sin(age * 0.8 + i) * R * 0.05 * age * p.wobble;
      const py = y + Math.sin(ang) * d - age * R * 0.06 * p.rise;
      dot(p.fx, px, py, (1.2 + rnd(i * 1.3 + seed) * 2.2) * (0.7 + p.cream * 0.9), p.core, p.a * 0.85 * fade);
    }
  },
  aroma(p) {
    const { x, y, R, t, seed } = p;
    const period = 2.4;
    const life = 9;
    ambient(p, 0.9);
    blob(p.ctx, x, y, R * 0.38, p.c, p.a * 0.45, 0.4);
    for (let j = 0; j < 4; j += 1) {
      const born = (Math.floor(t / period) - j) * period;
      const age = t - born;
      if (age < 0 || age > life) continue;
      const q = age / life;
      const px = x + Math.sin(born * 1.37 + seed + age * 0.45) * R * 0.24 * p.wobble + p.wind * age * R * 0.1;
      const py = y - age * R * 0.24 * p.rise;
      blob(p.ctx, px, py, R * (0.26 + age * 0.15) * p.spread, p.c, p.a * 0.62 * Math.pow(1 - q, 1.4) * Math.min(1, age / 0.7), p.edge);
    }
    grain(p, x, y - R * 0.7, R * 0.8 * p.spread);
  },
  wax(p) {
    const { x, y, R, t, seed } = p;
    const warmGrey = grey(mix(p.c, APRICOT, 0.25), 0.55);
    ambient(p, 0.6);
    for (let i = 0; i < 4; i += 1) {
      const ang = t * 0.11 * (i % 2 ? 1 : -1) * p.wobble + i * (Math.PI / 2) + seed;
      const dist = R * 0.42 * (1 + 0.35 * Math.sin(t * 0.19 + i * 1.3)) * p.spread;
      blob(p.ctx, x + Math.cos(ang) * dist, y - R * 0.5 * p.rise + Math.sin(ang) * dist * 0.55, R * 0.85 * p.spread, warmGrey, p.a * 0.42, p.edge);
    }
    blob(p.ctx, x, y - R * 0.15, R * 0.55, warmGrey, p.a * 0.45, 0.4);
  },
  flora(p) {
    const { x, y, R, t, seed } = p;
    const Z = R * 1.35 * p.spread;
    for (let i = 0; i < 9; i += 1) {
      const ox = (rnd(i * 2.3 + seed) - 0.5) * Z * 1.5;
      const oy = (rnd(i * 5.1 + seed) - 0.62) * Z;
      const dx = Math.sin(t * 0.07 + i * 1.9) * R * 0.12 * p.wobble;
      const dy = Math.cos(t * 0.06 + i * 1.3) * R * 0.08;
      blob(p.ctx, x + ox + dx, y + oy + dy, Z * (0.5 + rnd(i * 9.7 + seed) * 0.4), p.c, p.a * 0.3, p.edge);
    }
    for (let i = 0; i < 14; i += 1) {
      const ang = rnd(i * 4.4 + seed) * TAU;
      const d = Math.sqrt(rnd(i * 6.6 + seed)) * Z;
      const tw = 0.5 + 0.5 * Math.sin(t * 0.5 + i * 2.2);
      dot(p.fx, x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.7 - R * 0.25, 1.3 + p.cream, p.core, p.a * 0.5 * tw);
    }
  },
  stones(p) {
    const { x, y, R, t, seed } = p;
    const breathe = 1 + 0.04 * Math.sin((t / 8) * TAU + seed);
    ambient(p, 0.3);
    blob(p.ctx, x, y, R * 0.9 * breathe * p.spread, p.c, p.a * 0.55, p.edge);
    blob(p.ctx, x, y - R * 0.2 * p.rise, R * 0.45 * breathe, p.core, p.a * 0.25, 0.4);
    grain(p, x, y, R * 0.75 * p.spread);
  },
};

export function ScentFlow({ sources, settings }: { sources: FlowSource[]; settings: FlowSettings }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ sources, settings, dirty: true });
  useEffect(() => {
    live.current = { sources, settings, dirty: true };
  });

  useEffect(() => {
    const canvas = ref.current;
    const front = frontRef.current;
    if (!canvas || !front) return;
    const ctx = canvas.getContext("2d");
    const fx = front.getContext("2d");
    if (!ctx || !fx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let T = 3.2;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      for (const [el, g2] of [[canvas, ctx], [front, fx]] as const) {
        el.width = Math.max(1, Math.round(W * dpr));
        el.height = Math.max(1, Math.round(H * dpr));
        g2.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      live.current.dirty = true;
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; live.current.dirty = true; });
    io.observe(canvas);
    size();

    const draw = () => {
      const { sources: list, settings: st } = live.current;
      ctx.clearRect(0, 0, W, H);
      fx.clearRect(0, 0, W, H);
      const k = 0.7 + ((st.strength - 20) / 80) * 0.6;
      const e = st.sensory.envelop / 100;
      const cream = st.sensory.creamy / 100;
      const warm = Math.max(-1, Math.min(1, (st.sensory.warm - 50) / 50 + st.feel.warm));
      const coreA = (0.58 + 0.4 * (st.sensory.rich / 100)) * (0.85 + st.strength / 400) * st.feel.alpha * (st.time === "morning" ? 0.92 : 1);
      for (const s of list) {
        const fam = familyById(s.family);
        // the field colour leans from the family's mid tone toward its own colour, so it reads on ivory paper
        let c = mix(mix(hexRgb(SCENT_MID[s.family]), hexRgb(fam.hex), 0.35), warm >= 0 ? APRICOT : PERIWINKLE, Math.min(0.22, Math.abs(warm) * 0.15));
        let core = mix(hexRgb(fam.hex), warm >= 0 ? APRICOT : PERIWINKLE, Math.min(0.15, Math.abs(warm) * 0.1));
        c = grey(c, st.feel.sat);
        core = grey(core, st.feel.sat);
        if (cream > 0.5) c = mix(c, IVORY, (cream - 0.5) * 0.3);
        const tempo = TEMPO[s.family] ?? 1;
        const focusFade = st.focus && st.focus !== s.uid ? 0.3 : 1;
        const lit = st.time === "night" && (s.type === "candle" || s.type === "wax") ? 1.2 : 1;
        const paint: Paint = {
          ctx,
          fx,
          x: s.x * W,
          y: s.y * H,
          R: W * (0.17 + Math.min(0.25, s.w) * 0.6) * k,
          pw: s.w * W,
          a: coreA * focusFade * lit,
          c,
          core,
          t: T * tempo,
          seed: seedOf(s.uid),
          cream,
          spread: (0.8 + e * 0.5) * st.feel.spread,
          rise: (1.25 - e * 0.45) * st.feel.rise,
          wobble: st.feel.wobble,
          edge: 0.32 + e * 0.36,
          wind: st.windowOpen ? 0.35 : 0,
          night: st.time === "night",
        };
        DRAW[s.type](paint);
        dashedRings(paint, s.w > 0.1 ? 3 : 2, s.type === "stones" || s.type === "flora" ? 0.05 : 0.2);
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = live.current.settings;
      const moving = !reduce && !st.paused;
      if (visible && (moving || live.current.dirty)) {
        if (moving) T += dt * st.feel.speed;
        draw();
        live.current.dirty = false;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="scent-flow" aria-hidden="true" />
      <canvas ref={frontRef} className="scent-flow scent-flow--front" aria-hidden="true" />
    </>
  );
}
