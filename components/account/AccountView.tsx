"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { FAMILIES, SOURCE_OPTIONS, familyById } from "@/lib/catalog";
import { useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { partOfDay } from "@/lib/dates";
import { sampleEntries } from "@/lib/sample";
import type { Entry, FamilyId, SourceKind } from "@/lib/types";
import { ScentProfile } from "@/components/account/ScentProfile";
import { ResultCard } from "@/components/quiz/Quiz";
import { loadQuiz, type QuizResult } from "@/lib/quiz";

/** The person's own quiz result, or an invitation to take the quiz (Tiffany 11/10). */
function AccountQuiz() {
  const mounted = useMounted();
  const [r, setR] = useState<QuizResult | null>(null);
  useEffect(() => { if (mounted) setR(loadQuiz()); }, [mounted]);
  if (!mounted) return <section id="quiz" className="card anchor" style={{ minHeight: 200, background: "var(--honey-soft)" }} />;
  return (
    <section id="quiz" className="card anchor" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 36, background: "var(--honey-soft)" }}>
      {r ? (
        <>
          <div style={{ flex: "0 1 280px", minWidth: 220, rotate: "-2deg" }}><ResultCard r={r} /></div>
          <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            <h2 className="h-section" style={{ fontSize: 40 }}>You are {r.archetype.name}.</h2>
            <p className="lead">{r.archetype.voice}</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px" }}>
              <Link href={`/rooms?family=${r.family}`} className="btn btn--terra">Design a room in this style</Link>
              <Link href="/quiz" className="hero__link">See your result</Link>
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <h2 className="h-section" style={{ fontSize: 40 }}>Which scent is you?</h2>
          <p className="lead">Twenty questions about how you live. You get one of sixteen characters, the scent family that fits, and a room to start from.</p>
          <Link href="/quiz" className="btn btn--terra">Take the quiz</Link>
        </div>
      )}
    </section>
  );
}

const PREFS_KEY = "olfia.prefs.v1";
interface Prefs { families: FamilyId[]; sources: SourceKind[] }

function topFamily(entries: Entry[], part: "morning" | "night"): FamilyId | null {
  const n = new Map<FamilyId, number>();
  entries.filter((e) => {
    const p = partOfDay(new Date(e.createdAt));
    return part === "night" ? p === "night" : p === "morning";
  }).forEach((e) => e.families.forEach((f) => n.set(f, (n.get(f) ?? 0) + 1)));
  let best: FamilyId | null = null;
  let max = 0;
  n.forEach((v, k) => { if (v > max) { max = v; best = k; } });
  return best;
}

export function AccountView() {
  const mounted = useMounted();
  const entries = useAtlas((s) => s.entries);
  const add = useAtlas((s) => s.add);
  const clear = useAtlas((s) => s.clear);
  const show = useToast((s) => s.show);
  const [prefs, setPrefs] = useState<Prefs>({ families: [], sources: [] });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs(JSON.parse(raw) as Prefs);
    } catch {
      // storage unavailable
    }
  }, []);
  const savePrefs = (p: Prefs) => {
    setPrefs(p);
    try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
  };
  const flip = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const days = new Set(entries.map((e) => new Date(e.createdAt).toDateString())).size;
  const rooms = entries.filter((e) => e.type === "rooms").length;
  const captures = entries.length - rooms;
  const night = mounted ? topFamily(entries, "night") : null;
  const morning = mounted ? topFamily(entries, "morning") : null;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "olfia-atlas.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <section className="card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, background: "var(--peri-soft)" }}>
        <span aria-hidden="true" style={{ width: 88, height: 88, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #DADDF0, #A0A6C8)", boxShadow: "0 0 0 5px #fff" }} />
        <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 4 }}>
          <h1 className="h-page" style={{ fontSize: "clamp(36px, 4.4vw, 56px)" }}>My Account</h1>
          <span className="muted">Accounts come later. For now, everything lives in this browser.</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <span className="callout">{mounted ? days : "–"} days recorded</span>
          <span className="callout" style={{ background: "var(--terra)" }}>{mounted ? rooms : "–"} rooms</span>
          <span className="callout" style={{ background: "var(--moss)" }}>{mounted ? captures : "–"} captures</span>
        </div>
      </section>

      <div id="profile" className="anchor"><ScentProfile /></div>

      <section id="preferences" className="card anchor" style={{ display: "flex", flexDirection: "column", gap: 18, background: "var(--apricot-soft)" }}>
        <h2 className="h-section" style={{ fontSize: 34 }}>My preferences</h2>
        <span className="label-mono">Preferred scent styles</span>
        <div className="chips">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={prefs.families.includes(f.id)} onClick={() => savePrefs({ ...prefs, families: flip(prefs.families, f.id) })}>
              <span className="chip__dot" style={{ background: f.hex }} />{f.label}
            </button>
          ))}
        </div>
        <span className="label-mono">Preferred products</span>
        <div className="chips">
          {SOURCE_OPTIONS.filter((s) => s.id !== "other").map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={prefs.sources.includes(s.id)} onClick={() => savePrefs({ ...prefs, sources: flip(prefs.sources, s.id) })}>{s.label}</button>
          ))}
        </div>
        {night || morning ? (
          <p style={{ margin: 0, fontSize: 20 }}>
            You reach for{" "}
            {night ? <><span className="hl" style={{ "--hl": `${familyById(night).hex}66` } as CSSProperties}>{familyById(night).label.toLowerCase()}</span> scents at night</> : null}
            {night && morning ? " and " : null}
            {morning ? <><span className="hl" style={{ "--hl": `${familyById(morning).hex}66` } as CSSProperties}>{familyById(morning).label.toLowerCase()}</span> in the morning</> : null}.
          </p>
        ) : null}
      </section>

      <section id="info" className="card anchor" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 className="h-section" style={{ fontSize: 34 }}>Personal info</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {["Username", "Email", "City, country"].map((l) => (
            <label key={l} className="field">{l}<input className="input" disabled placeholder="Available with accounts" /></label>
          ))}
        </div>
      </section>

      <section id="settings" className="card anchor" style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--sea-soft)" }}>
        <h2 className="h-section" style={{ fontSize: 34 }}>Settings</h2>
        <p className="muted" style={{ margin: 0 }}>Entries are saved in this browser only.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button type="button" className="btn btn--honey" onClick={() => { sampleEntries().forEach((e) => add(e)); show("Sample pages added", "/atlas", "Open Scent Atlas"); }}>Load sample pages</button>
          <button type="button" className="btn btn--ghost" onClick={exportData} disabled={!mounted || entries.length === 0}>Export my data</button>
          <button type="button" className="btn btn--ghost" disabled={!mounted || entries.length === 0} onClick={() => { if (window.confirm("Clear every entry saved in this browser?")) { clear(); show("This browser is cleared"); } }}>Clear this browser</button>
        </div>
      </section>

      <AccountQuiz />
    </div>
  );
}
