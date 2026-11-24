"use client";

import { familyById } from "@/lib/catalog";
import { SCENT_MID, type SenseId } from "@/lib/roomScent";
import type { FamilyId } from "@/lib/types";

type RGB = [number, number, number];
const hexRgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;
const PERIWINKLE = hexRgb("#A0A6C8");
const APRICOT = hexRgb("#E7B49F");

/**
 * "Your sensory impression" (Tiffany's sensory sketch, 11/24): a soft swatch drawn from the room's scent families and
 * the five sliders. Light ↔ Rich sets the depth of the centre, Cool ↔ Warm leans it toward Periwinkle or Apricot,
 * Dry ↔ Creamy softens the edge, Subtle ↔ Intense its strength, Airy ↔ Enveloping how far it spreads.
 */
export function SensorySwatch({ families, values }: { families: FamilyId[]; values: Record<SenseId, number> }) {
  const a = families[0] ?? "fresh";
  const b = families[1];
  const v = (id: SenseId) => values[id] / 100;
  const lean = (v("warm") - 0.5) * 2;
  const tint = lean >= 0 ? APRICOT : PERIWINKLE;
  const core = mix(mix(hexRgb(SCENT_MID[a]), hexRgb(familyById(a).hex), 0.25 + v("rich") * 0.6), tint, Math.abs(lean) * 0.3);
  const halo = mix(b ? hexRgb(SCENT_MID[b]) : mix(core, PERIWINKLE, 0.55), tint, Math.abs(lean) * 0.2);
  const alpha = 0.55 + v("intense") * 0.45;
  const reach = 46 + v("envelop") * 24;
  const blur = 1 + v("creamy") * 5;
  return (
    <span
      className="swatch"
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle, ${rgba(core, alpha)} 0%, ${rgba(core, alpha * 0.85)} ${reach * 0.42}%, ${rgba(halo, alpha * 0.7)} ${reach * 0.78}%, ${rgba(halo, 0)} ${Math.min(100, reach + 22)}%)`,
        filter: `blur(${blur.toFixed(1)}px)`,
      }}
    />
  );
}
