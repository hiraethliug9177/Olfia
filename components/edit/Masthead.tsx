"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FAMILIES } from "@/lib/catalog";
import { MOTTOS, dailyIndex, isoWeek, ordinal } from "@/lib/mottos";

/**
 * The Olfia Edit's masthead, redrawn from her mockup and mood board (11/24 evening): a newspaper nameplate with her
 * line on the left ("Cultures, fragrances, & the art of living", her choice the same evening), the title in the
 * middle and a date stamp wheel on the right; under it one ruled line with today's recommended family on the left
 * and the day's motto with the edition on the right.
 * - Today's recommendation: one of the seven families, at random for each day, "like a lucky colour of the day".
 * - Motto: a short public-domain line about plants or fragrance materials, at random for each day (lib/mottos.ts).
 * - Edition: the ISO week number, so it moves on every Monday.
 * The page is built ahead of time, so all three are read in the visitor's browser, on their own date, and again when
 * a tab left open comes back into view.
 */
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
const LONG: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };

interface Today {
  y: number;
  m: number;
  d: number;
  iso: string;
  text: string;
}

function readToday(): Today {
  const n = new Date();
  const iso = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate(), iso, text: n.toLocaleDateString("en-US", LONG) };
}

/**
 * A round date stamp like her sample: the twelve months around the rim, the year and this month's days inside, set
 * as a calendar; this month and today are marked with a colour that slowly breathes (still under reduced motion).
 */
function DateWheel({ t }: { t: Today | null }) {
  const R = 85; // radius of the month ring's text line
  const ring = `M 100 ${100 - R} a ${R} ${R} 0 1 1 0 ${2 * R} a ${R} ${R} 0 1 1 0 ${-2 * R}`;
  const circ = 2 * Math.PI * R;
  // an arc along the ring, from a0 to a1 degrees clockwise from the top
  const arc = (a0: number, a1: number) => {
    const pt = (a: number) => `${(100 + R * Math.sin((a * Math.PI) / 180)).toFixed(2)} ${(100 - R * Math.cos((a * Math.PI) / 180)).toFixed(2)}`;
    return `M ${pt(a0)} A ${R} ${R} 0 0 1 ${pt(a1)}`;
  };
  const cells: Array<{ day: number; x: number; y: number }> = [];
  if (t) {
    const first = (new Date(t.y, t.m, 1).getDay() + 6) % 7; // Monday first
    const days = new Date(t.y, t.m + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      const k = first + day - 1;
      cells.push({ day, x: 58 + (k % 7) * 14, y: 93 + Math.floor(k / 7) * 11 }); // six rows stay inside the ring
    }
  }
  return (
    <svg className="np-wheel" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="np-wheel-ring" d={ring} />
      </defs>
      <circle cx="100" cy="100" r="97" className="np-wheel__rim" />
      <circle cx="100" cy="100" r="74" className="np-wheel__line" />
      {t ? (() => {
        // this month: a soft band behind its name on the ring
        const c = t.m * 30 + 15;
        const half = ((MONTHS[t.m].length * 6.6) / 2 + 7) / R * (180 / Math.PI);
        return <path d={arc(c - half, c + half)} className="np-wheel__band" />;
      })() : null}
      {MONTHS.map((name, i) => (
        <text key={name} textAnchor="middle" dy="3.3" className={`np-wheel__month${t?.m === i ? " is-on" : ""}`}>
          <textPath href="#np-wheel-ring" startOffset={((i * 30 + 15) / 360) * circ}>{name}</textPath>
        </text>
      ))}
      <text x="100" y="78" textAnchor="middle" className="np-wheel__year">{t ? t.y : ""}</text>
      {cells.map((c) => (
        <g key={c.day}>
          {t && c.day === t.d ? <circle cx={c.x} cy={c.y} r="6.2" className="np-wheel__today" /> : null}
          <text x={c.x} y={c.y} dy="2.9" textAnchor="middle" className={`np-wheel__day${t && c.day === t.d ? " is-on" : ""}`}>{c.day}</text>
        </g>
      ))}
    </svg>
  );
}

export function Masthead() {
  const [t, setT] = useState<Today | null>(null);
  useEffect(() => {
    const update = () => setT(readToday());
    update();
    const onVisible = () => { if (document.visibilityState === "visible") update(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const fam = t ? FAMILIES[dailyIndex(t.iso, "family", FAMILIES.length)] : null;
  const motto = t ? MOTTOS[dailyIndex(t.iso, "motto", MOTTOS.length)] : null;
  const week = t ? isoWeek(new Date(t.y, t.m, t.d)) : null;

  return (
    <header className="np-mast">
      <div className="np-mast__top">
        <p className="np-mast__motto">“Cultures,<br /> fragrances, &amp;<br /> the art of living”</p>
        <h1 className="np-mast__title">The Olfia Edit</h1>
        <div className="np-mast__stamp">
          <DateWheel t={t} />
          {t ? <time className="sr-only" dateTime={t.iso}>{t.text}</time> : null}
        </div>
      </div>
      <div className="np-mast__bar">
        <p className="np-mast__pick">
          Today’s recommendations:{" "}
          {fam ? (
            <Link href={`/scentpedia#${fam.id}`} className="np-mast__fam">
              <span className="chip__dot" style={{ background: fam.hex }} aria-hidden="true" />
              {fam.label}
            </Link>
          ) : null}
        </p>
        <p className="np-mast__issue">
          {motto ? (
            <span className="np-mast__line">
              <q>{motto.text}</q>
              <span className="np-mast__by"> — {motto.by}{motto.tr ? `, tr. ${motto.tr}` : ""}</span>
            </span>
          ) : null}
          {week ? (
            <span className="np-mast__ed">
              <span aria-hidden="true"> | </span>
              {week}<sup>{ordinal(week)}</sup> Edition
            </span>
          ) : null}
        </p>
      </div>
    </header>
  );
}
