"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FAMILIES,
  METHOD_OPTIONS,
  ROOM_OPTIONS,
  SOURCE_OPTIONS,
  familyById,
  roomLabel,
  sourceLabel,
  texture,
} from "@/lib/catalog";
import { newId, useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import type { CaptureEntry, FamilyId, MethodId, RoomKind, SourceKind } from "@/lib/types";
import { dotDate } from "@/lib/dates";

const SPOTS = [
  { ax: "6%", ay: "14%", sx: "20%", sy: "25%", lx: "43%", ly: "29%" },
  { ax: "34%", ay: "36%", sx: "58%", sy: "46%", lx: "57%", ly: "63%" },
  { ax: "0%", ay: "46%", sx: "18%", sy: "56%", lx: "17%", ly: "73%" },
];

export function CaptureForm() {
  const add = useAtlas((s) => s.add);
  const mounted = useMounted();
  const show = useToast((s) => s.show);

  const [room, setRoom] = useState<RoomKind | null>(null);
  const [source, setSource] = useState<SourceKind | null>(null);
  const [situation, setSituation] = useState("");
  const [feeling, setFeeling] = useState<"loved" | "not-for-me" | null>(null);
  const [mode, setMode] = useState<"product" | "method">("product");
  const [productName, setProductName] = useState("");
  const [scentName, setScentName] = useState("");
  const [fams, setFams] = useState<FamilyId[]>([]);
  const [method, setMethod] = useState<MethodId | null>(null);
  const [methodText, setMethodText] = useState("");
  const [sentence, setSentence] = useState("");
  const [tried, setTried] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const chosen: FamilyId[] = useMemo(() => {
    if (mode === "product") return fams.slice(0, 3);
    const m = METHOD_OPTIONS.find((o) => o.id === method);
    return (m?.families ?? []).slice(0, 3);
  }, [mode, fams, method]);

  const toggleFam = (id: FamilyId) =>
    setFams((cur) => (cur.includes(id) ? cur.filter((f) => f !== id) : cur.length < 3 ? [...cur, id] : cur));

  const missing: string[] = [];
  if (!room) missing.push("room");
  if (!source) missing.push("scent source");
  if (!situation.trim()) missing.push("what was going on");
  if (!feeling) missing.push("feelings");
  if (mode === "product" && fams.length === 0) missing.push("at least one family");
  if (mode === "method" && !method) missing.push("a method");

  const reset = () => {
    setRoom(null); setSource(null); setSituation(""); setFeeling(null); setProductName(""); setScentName("");
    setFams([]); setMethod(null); setMethodText(""); setSentence(""); setTried(false);
  };

  const save = () => {
    setTried(true);
    if (missing.length || !room || !source || !feeling) return;
    const now = new Date().toISOString();
    const entry: CaptureEntry = {
      id: newId(),
      schemaVersion: 2,
      type: "capture",
      createdAt: now,
      updatedAt: now,
      starred: false,
      families: chosen,
      room,
      source,
      situation: situation.trim(),
      feeling,
      what: mode === "product"
        ? { mode: "product", productName: productName.trim(), scentName: scentName.trim() }
        : { mode: "method", method: method ?? "other", text: methodText.trim() },
      sentence: sentence.trim(),
    };
    add(entry);
    track("creation_complete", { mode: "capture" });
    setSavedId(entry.id);
    show("Saved to your Scent Atlas", "/atlas", "Open the Atlas");
    reset();
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 40 }}>
      <form style={{ flex: "1 1 600px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }} onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
        <fieldset className="fieldset">
          <legend className="legend">Room <span className="field__hint">(required)</span></legend>
          <div className="chips">
            {ROOM_OPTIONS.map((r) => (
              <button key={r.id} type="button" className="chip chip--solid" aria-pressed={room === r.id} onClick={() => setRoom(r.id)}>{r.label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Scent source <span className="field__hint">(required)</span></legend>
          <div className="chips">
            {SOURCE_OPTIONS.map((s) => (
              <button key={s.id} type="button" className="chip chip--solid" aria-pressed={source === s.id} onClick={() => setSource(s.id)}>{s.label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Add detail <span className="field__hint">(required)</span></legend>
          <label className="field">
            What was going on?
            <input className="input" type="text" value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="Rainy afternoon, reading after work" maxLength={120} />
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span id="feel-label" style={{ fontSize: 17, fontWeight: 600 }}>Feelings?</span>
            <div role="radiogroup" aria-labelledby="feel-label" className="chips">
              <button type="button" role="radio" aria-checked={feeling === "loved"} className="chip" onClick={() => setFeeling("loved")} style={{ minHeight: 52, borderRadius: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C527A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                Loved it
              </button>
              <button type="button" role="radio" aria-checked={feeling === "not-for-me"} className="chip" onClick={() => setFeeling("not-for-me")} style={{ minHeight: 52, borderRadius: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C5E6B" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                Not for me
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">What is it?</legend>
          <div role="tablist" aria-label="Record by" className="seg" style={{ width: 280, maxWidth: "100%" }}>
            <span className="seg__thumb" aria-hidden="true" style={{ left: mode === "product" ? 5 : "50%", width: "calc(50% - 5px)" }} />
            <button type="button" role="tab" aria-selected={mode === "product"} className="seg__opt" onClick={() => setMode("product")}>Product</button>
            <button type="button" role="tab" aria-selected={mode === "method"} className="seg__opt" onClick={() => setMode("method")}>Method</button>
          </div>
          {mode === "product" ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <label className="field" style={{ flex: "1 1 220px" }}>
                  Product name
                  <input className="input" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Corner-shop cedar candle" maxLength={80} />
                </label>
                <label className="field" style={{ flex: "1 1 220px" }}>
                  Scent name
                  <input className="input" type="text" value={scentName} onChange={(e) => setScentName(e.target.value)} placeholder="Cedar & Clove" maxLength={80} />
                </label>
              </div>
              <span style={{ fontSize: 17, fontWeight: 600 }}>Which families? <span className="field__hint">Pick up to 3</span></span>
              <div className="chips">
                {FAMILIES.map((f) => (
                  <button key={f.id} type="button" className="chip" aria-pressed={fams.includes(f.id)} onClick={() => toggleFam(f.id)}>
                    <span className="chip__dot" style={{ background: f.hex }} />
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="chips">
                {METHOD_OPTIONS.map((m) => (
                  <button key={m.id} type="button" className="chip" aria-pressed={method === m.id} onClick={() => setMethod(m.id)}>
                    <span className="chip__dot" style={{ background: m.families[0] ? familyById(m.families[0]).hex : "#C9CBD6" }} />
                    {m.label}
                  </button>
                ))}
              </div>
              <label className="field">
                In your words
                <input className="input" type="text" value={methodText} onChange={(e) => setMethodText(e.target.value)} placeholder="Simmered orange peel and cloves on the stove" maxLength={100} />
              </label>
            </>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">One sentence worth keeping</legend>
          <textarea className="input" maxLength={140} aria-label="One sentence worth keeping" value={sentence} onChange={(e) => setSentence(e.target.value)} placeholder="What it was like, or why you want to remember it" />
          <span className="mono muted" style={{ alignSelf: "flex-end", fontSize: 13 }}>{sentence.length} / 140</span>
        </fieldset>

        {tried && missing.length ? <p className="error" role="alert">Still needed: {missing.join(", ")}.</p> : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 6 }}>
          <button type="submit" className="btn btn--primary">Save to Scent Atlas</button>
          {savedId ? <Link href={`/card?from=${savedId}`} className="btn btn--ghost">Make a Scent Card</Link> : null}
        </div>
      </form>

      <aside aria-label="Preview" style={{ flex: "1 1 340px", minWidth: 0, display: "flex", justifyContent: "center" }}>
        <div className="scene-sheet" style={{ maxWidth: 360, rotate: "1.2deg" }}>
          <div className="scene-sheet__paper">
            <div className="scene-sheet__grain" aria-hidden="true" />
            <div className="scene-sheet__head">
              <span>{room ? roomLabel(room).toUpperCase() : "ROOM"}</span>
              <span>{mounted ? dotDate(new Date()) : ""}</span>
            </div>
            {chosen.map((f, i) => {
              const fam = familyById(f);
              const s = SPOTS[i];
              return (
                <div key={f}>
                  <div className="anim-bloom" aria-hidden="true" style={{ position: "absolute", left: s.ax, top: s.ay, width: "66%", aspectRatio: "1.1", borderRadius: "50%", background: `radial-gradient(circle, ${fam.glow} 0%, rgba(255,255,255,0) 70%)`, filter: "blur(14px)" }} />
                  <div className="window anim-rise" aria-hidden="true" style={{ position: "absolute", left: s.sx, top: s.sy, width: "21%", aspectRatio: "1", background: texture(fam.materials[0].colors) }} />
                  <span className="hand" style={{ position: "absolute", left: s.lx, top: s.ly, fontSize: "max(14px, 6cqw)" }}>{fam.materials[0].label}</span>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: "6%", right: "6%", bottom: "5%", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "max(18px, 7cqw)" }}>
                {mode === "product" && scentName ? scentName : source ? sourceLabel(source) : "Your scent"}
              </span>
              <span className="hand muted" style={{ fontSize: "max(15px, 6cqw)" }}>
                {chosen.length ? chosen.map((f) => familyById(f).label.toLowerCase()).join(" · ") : situation || "pick a family"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
