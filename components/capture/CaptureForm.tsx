"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  DAYPART_OPTIONS,
  EMOTION_OPTIONS,
  FAMILIES,
  METHOD_OPTIONS,
  OCCASION_OPTIONS,
  ROOM_OPTIONS,
  SEASON_OPTIONS,
  SOURCE_OPTIONS,
  autoTags,
  daypartOf,
  familyById,
  roomLabel,
  seasonOf,
  sourceLabel,
  suggestMomentName,
} from "@/lib/catalog";
import { newId, useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import type { CaptureEntry, Daypart, EmotionId, FamilyId, MethodId, Occasion, RoomKind, Season, SourceKind } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Stamp } from "@/components/scene/Stamp";
import { CaptureScene } from "@/components/capture/CaptureScene";

/**
 * Capture as a step-by-step flow (11/4 feedback): one question per screen, a progress bar,
 * taps instead of typing wherever possible, and a live collage that reacts to every answer.
 * Typing only: product name, the moment's name (suggested first), and one optional line.
 */

const STEPS = ["season", "daypart", "room", "occasion", "source", "what", "families", "emotions", "finish"] as const;
type Step = (typeof STEPS)[number];

const LIGHT: Record<Daypart, string> = {
  morning: "rgba(255, 214, 150, 0.16)",
  afternoon: "rgba(255, 255, 255, 0)",
  evening: "rgba(231, 150, 110, 0.16)",
  night: "rgba(70, 74, 120, 0.16)",
};

function Opt({ on, onClick, children, dot }: { on: boolean; onClick: () => void; children: ReactNode; dot?: string }) {
  return (
    <button type="button" className="opt" aria-pressed={on} onClick={onClick}>
      {dot ? <span className="opt__sw" style={{ background: dot }} /> : null}
      {children}
    </button>
  );
}

export function CaptureForm() {
  const add = useAtlas((s) => s.add);
  const mounted = useMounted();
  const show = useToast((s) => s.show);

  const [step, setStep] = useState(0);
  const [season, setSeason] = useState<Season | null>(null);
  const [daypart, setDaypart] = useState<Daypart | null>(null);
  const [room, setRoom] = useState<RoomKind | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [source, setSource] = useState<SourceKind | null>(null);
  const [mode, setMode] = useState<"product" | "method">("product");
  const [productName, setProductName] = useState("");
  const [scentName, setScentName] = useState("");
  const [method, setMethod] = useState<MethodId | null>(null);
  const [fams, setFams] = useState<FamilyId[]>([]);
  const [emotions, setEmotions] = useState<EmotionId[]>([]);
  const [feeling, setFeeling] = useState<"loved" | "not-for-me" | null>(null);
  const [momentName, setMomentName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [sentence, setSentence] = useState("");
  const [custom, setCustom] = useState<string[]>([]);
  const [customDraft, setCustomDraft] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [blendKey, setBlendKey] = useState(0);

  // Pre-select season and time of day from the clock; the person can change them.
  useEffect(() => {
    if (!mounted) return;
    const now = new Date();
    setSeason((s) => s ?? seasonOf(now));
    setDaypart((d) => d ?? daypartOf(now));
  }, [mounted]);

  const chosen: FamilyId[] = useMemo(() => {
    if (mode === "product") return fams.slice(0, 2);
    const m = METHOD_OPTIONS.find((o) => o.id === method);
    return (m?.families ?? []).slice(0, 2);
  }, [mode, fams, method]);

  const suggested = useMemo(
    () => suggestMomentName({ daypart: daypart ?? undefined, season: season ?? undefined, families: chosen, emotions, room }),
    [daypart, season, chosen, emotions, room],
  );
  useEffect(() => {
    if (!nameTouched) setMomentName(suggested);
  }, [suggested, nameTouched]);

  const tags = useMemo(
    () => [...autoTags({ season: season ?? undefined, daypart: daypart ?? undefined, room, occasion: occasion ?? undefined, families: chosen, emotions }), ...custom],
    [season, daypart, room, occasion, chosen, emotions, custom],
  );

  const toggleFam = (id: FamilyId) => {
    setFams((cur) => (cur.includes(id) ? cur.filter((f) => f !== id) : cur.length < 2 ? [...cur, id] : [cur[1], id]));
    setBlendKey((k) => k + 1);
  };
  const toggleEmotion = (id: EmotionId) =>
    setEmotions((cur) => (cur.includes(id) ? cur.filter((e) => e !== id) : cur.length < 2 ? [...cur, id] : [cur[1], id]));

  const current: Step = STEPS[step];
  const canNext = (() => {
    switch (current) {
      case "season": return !!season;
      case "daypart": return !!daypart;
      case "room": return !!room;
      case "occasion": return true;
      case "source": return !!source;
      case "what": return mode === "product" ? true : !!method;
      case "families": return chosen.length > 0;
      case "emotions": return true;
      case "finish": return !!feeling;
    }
  })();
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const reset = () => {
    setStep(0); setSeason(null); setDaypart(null); setRoom(null); setOccasion(null); setSource(null);
    setMode("product"); setProductName(""); setScentName(""); setMethod(null); setFams([]); setEmotions([]);
    setFeeling(null); setMomentName(""); setNameTouched(false); setSentence(""); setCustom([]); setCustomDraft("");
  };

  const addCustom = () => {
    const t = customDraft.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "");
    if (!t || custom.includes(t) || custom.length >= 3) { setCustomDraft(""); return; }
    setCustom((c) => [...c, t]);
    setCustomDraft("");
  };

  const save = () => {
    if (!room || !source || !feeling || chosen.length === 0) return;
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
      situation: momentName.trim(),
      feeling,
      what: mode === "product"
        ? { mode: "product", productName: productName.trim(), scentName: scentName.trim() }
        : { mode: "method", method: method ?? "other", text: "" },
      sentence: sentence.trim(),
      season: season ?? undefined,
      daypart: daypart ?? undefined,
      occasion: occasion ?? undefined,
      emotions,
      momentName: momentName.trim(),
      tags,
    };
    add(entry);
    track("creation_complete", { mode: "capture" });
    setSavedId(entry.id);
    show("Saved to your Scent Atlas", "/atlas", "Open the Atlas");
    reset();
  };

  const paper = SEASON_OPTIONS.find((s) => s.id === season)?.paper ?? "var(--paper)";
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="capture-layout">
      <div className="flow" style={{ flex: "1 1 420px", minWidth: 0 }}>
        <div className="flow__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Capture progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div key={current} className="flow__step" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {current === "season" ? (
            <>
              <h2 className="flow__q">Which <em>season</em> is it?</h2>
              <div className="opts">
                {SEASON_OPTIONS.map((o) => <Opt key={o.id} on={season === o.id} onClick={() => setSeason(o.id)} dot={o.paper}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "daypart" ? (
            <>
              <h2 className="flow__q">What <em>time</em> of day?</h2>
              <div className="opts">
                {DAYPART_OPTIONS.map((o) => <Opt key={o.id} on={daypart === o.id} onClick={() => setDaypart(o.id)} dot={LIGHT[o.id] === "rgba(255, 255, 255, 0)" ? "#F8F6F0" : LIGHT[o.id].replace("0.16", "0.9")}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "room" ? (
            <>
              <h2 className="flow__q">Where did you notice it?</h2>
              <div className="opts">
                {ROOM_OPTIONS.map((o) => <Opt key={o.id} on={room === o.id} onClick={() => setRoom(o.id)}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "occasion" ? (
            <>
              <h2 className="flow__q">What&rsquo;s the <em>occasion</em>?</h2>
              <div className="opts">
                {OCCASION_OPTIONS.map((o) => <Opt key={o.id} on={occasion === o.id} onClick={() => setOccasion(occasion === o.id ? null : o.id)}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "source" ? (
            <>
              <h2 className="flow__q">What is the scent <em>coming from</em>?</h2>
              <div className="opts">
                {SOURCE_OPTIONS.map((o) => <Opt key={o.id} on={source === o.id} onClick={() => setSource(o.id)}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "what" ? (
            <>
              <h2 className="flow__q">What <em>is</em> it?</h2>
              <div role="tablist" aria-label="Record by" className="seg" style={{ width: 280, maxWidth: "100%" }}>
                <span className="seg__thumb" aria-hidden="true" style={{ left: mode === "product" ? 5 : "50%", width: "calc(50% - 5px)" }} />
                <button type="button" role="tab" aria-selected={mode === "product"} className="seg__opt" onClick={() => setMode("product")}>A product</button>
                <button type="button" role="tab" aria-selected={mode === "method"} className="seg__opt" onClick={() => setMode("method")}>Something I did</button>
              </div>
              {mode === "product" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                  <label className="field" style={{ flex: "1 1 220px" }}>
                    Product
                    <input className="input" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Brand or shop" maxLength={80} />
                  </label>
                  <label className="field" style={{ flex: "1 1 220px" }}>
                    Scent name
                    <input className="input" type="text" value={scentName} onChange={(e) => setScentName(e.target.value)} placeholder="Cedar & Clove" maxLength={80} />
                  </label>
                </div>
              ) : (
                <div className="opts">
                  {METHOD_OPTIONS.map((m) => (
                    <Opt key={m.id} on={method === m.id} onClick={() => setMethod(m.id)} dot={m.families[0] ? familyById(m.families[0]).hex : "#C9CBD6"}>{m.label}</Opt>
                  ))}
                </div>
              )}
            </>
          ) : null}

          {current === "families" ? (
            <>
              <h2 className="flow__q">Which <em>families</em> does it belong to? <span className="field__hint" style={{ fontSize: 18, fontFamily: "var(--font-ui)" }}>Pick one or two</span></h2>
              {mode === "method" && method ? (
                <p className="lead">We&rsquo;ve picked the usual families for that. Change them if it smelled different.</p>
              ) : null}
              <div className="opts">
                {FAMILIES.map((f) => (
                  <Opt key={f.id} on={chosen.includes(f.id)} onClick={() => { if (mode === "method") setMode("product"); toggleFam(f.id); }} dot={f.hex}>
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span>{f.label}</span>
                      <span className="muted" style={{ fontSize: 14 }}>{f.notes}</span>
                    </span>
                  </Opt>
                ))}
              </div>
            </>
          ) : null}

          {current === "emotions" ? (
            <>
              <h2 className="flow__q">How did it make you <em>feel</em>? <span className="field__hint" style={{ fontSize: 18, fontFamily: "var(--font-ui)" }}>Up to two</span></h2>
              <div className="chips">
                {EMOTION_OPTIONS.map((e) => (
                  <button key={e.id} type="button" className="chip" aria-pressed={emotions.includes(e.id)} onClick={() => toggleEmotion(e.id)} style={{ minHeight: 48, fontSize: 17 }}>{e.label}</button>
                ))}
              </div>
            </>
          ) : null}

          {current === "finish" ? (
            <>
              <h2 className="flow__q">Keep it or <em>let it go</em>?</h2>
              <div role="radiogroup" aria-label="Feelings" className="chips">
                <button type="button" role="radio" aria-checked={feeling === "loved"} className="chip" onClick={() => setFeeling("loved")} style={{ minHeight: 56, borderRadius: 16, fontSize: 18 }}>
                  <Icon name="check" />
                  Loved it
                </button>
                <button type="button" role="radio" aria-checked={feeling === "not-for-me"} className="chip" onClick={() => setFeeling("not-for-me")} style={{ minHeight: 56, borderRadius: 16, fontSize: 18 }}>
                  <Icon name="x" />
                  Not for me
                </button>
              </div>
              <label className="field">
                Name this moment
                <input className="input" type="text" value={momentName} onChange={(e) => { setNameTouched(true); setMomentName(e.target.value); }} maxLength={60} />
              </label>
              <label className="field">
                One line worth keeping <span className="field__hint">(optional)</span>
                <input className="input" type="text" value={sentence} onChange={(e) => setSentence(e.target.value)} maxLength={140} placeholder="What it was like, or why you want to remember it" />
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Tags</span>
                <div className="chips">
                  {tags.map((t) => <span key={t} className={`tag${custom.includes(t) ? " tag--on" : ""}`}>#{t}</span>)}
                </div>
                {custom.length < 3 ? (
                  <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
                    <input className="input" type="text" value={customDraft} onChange={(e) => setCustomDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} placeholder="add your own" maxLength={24} aria-label="Add a tag" />
                    <button type="button" className="btn btn--ghost btn--sm" onClick={addCustom} style={{ flex: "none", height: 52 }}>Add</button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <div className="flow__nav">
          <button type="button" className="btn btn--ghost" onClick={back} disabled={step === 0} style={{ visibility: step === 0 ? "hidden" : "visible" }}>Back</button>
          <span className="mono muted" style={{ fontSize: 14 }}>{step + 1} / {STEPS.length}</span>
          {current === "finish" ? (
            <button type="button" className="btn btn--primary" onClick={save} disabled={!canNext}>Save to Scent Atlas</button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={next} disabled={!canNext}>{current === "occasion" && !occasion ? "Skip" : current === "emotions" && emotions.length === 0 ? "Skip" : "Next"}</button>
          )}
        </div>
        {savedId ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href={`/card?from=${savedId}`} className="btn btn--ghost">Make a Scent Card from the last one</Link>
          </div>
        ) : null}
      </div>

      <aside aria-label="Preview" className="capture-aside">
        <div
          className="postcard"
          style={{
            "--pc-paper": paper,
            "--stripe-a": chosen[0] ? familyById(chosen[0]).hex : "#4C527A",
            "--stripe-b": chosen[1] ? familyById(chosen[1]).hex : chosen[0] ? "#4C527A" : "#E7B49F",
          } as CSSProperties}
        >
          <div className="postcard__inner">
            {/* the picture side: the place, its light, and what the scent brought */}
            <div className="postcard__view">
              <span className="tape tape--a" aria-hidden="true" />
              <span className="tape tape--b" aria-hidden="true" />
              <div className="postcard__photo" style={{ background: paper }}>
                <CaptureScene room={room} daypart={daypart} families={chosen} source={source} blendKey={blendKey} place={room ? roomLabel(room) : season ? SEASON_OPTIONS.find((x) => x.id === season)?.label : undefined} />
              </div>
            </div>

            <span className="postcard__divider" aria-hidden="true" />

            {/* the writing side: stamp, postmark, message, address lines */}
            <div className="postcard__back">
              <div className="postcard__corner">
                <span className="postcard__stamp" style={{ background: chosen[0] ? familyById(chosen[0]).hex : "#A0A6C8" }}>
                  {chosen[0] ? <span className="postcard__stamp-img" style={{ backgroundImage: `url(${familyById(chosen[0]).texture})` }} /> : null}
                  <span className="postcard__stamp-name">{chosen[0] ? familyById(chosen[0]).label : "Olfia"}</span>
                </span>
                <span className="postcard__postmark">
                  {chosen[0] ? <Stamp family={chosen[0]} size={120} rot={-12} /> : null}
                  <svg viewBox="0 0 120 40" className="postcard__waves" aria-hidden="true">
                    {[8, 20, 32].map((y) => <path key={y} d={`M0 ${y} q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke="currentColor" strokeWidth="2" />)}
                  </svg>
                </span>
              </div>
              <div className="postcard__message">
                {emotions.length ? <span className="postcard__feel">{emotions.map((id) => EMOTION_OPTIONS.find((e) => e.id === id)?.label.toLowerCase()).join(" & ")}</span> : null}
                <span className="postcard__name">{momentName || " "}</span>
                {sentence ? <span className="postcard__sentence">{sentence}</span> : null}
              </div>
              <div className="postcard__lines">
                <span className="postcard__line postcard__line--title">{mode === "product" && (scentName || productName) ? [scentName, productName].filter(Boolean).join(", ") : source ? sourceLabel(source) : " "}</span>
                <span className="postcard__line">{[occasion ? OCCASION_OPTIONS.find((o) => o.id === occasion)?.label : null, daypart ? DAYPART_OPTIONS.find((d) => d.id === daypart)?.label : null].filter(Boolean).join(" · ") || " "}</span>
                <span className="postcard__line postcard__line--tags">{tags.length ? tags.slice(0, 5).map((t) => `#${t}`).join(" ") : " "}</span>
                <span className="postcard__date">{mounted ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
