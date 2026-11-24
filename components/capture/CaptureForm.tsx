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
import { track } from "@/lib/analytics";
import type { CaptureEntry, Daypart, EmotionId, FamilyId, MethodId, Occasion, RoomKind, Season, SourceKind } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Stamp } from "@/components/scene/Stamp";
import { CaptureScene } from "@/components/capture/CaptureScene";
import { Dialog } from "@/components/ui/Dialog";
import { Fireworks } from "@/components/ui/Fireworks";

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

/** Everything the postcard shows; the window after saving keeps a copy of the card that was just made. */
interface PostcardData {
  paper: string;
  room: RoomKind | null;
  daypart: Daypart | null;
  season: Season | null;
  chosen: FamilyId[];
  source: SourceKind | null;
  blendKey: number;
  emotions: EmotionId[];
  momentName: string;
  sentence: string;
  title: string;
  occasionLine: string;
  tags: string[];
  date: string;
}

function Postcard({ d }: { d: PostcardData }) {
  return (
    <div
      className="postcard"
      style={{
        "--pc-paper": d.paper,
        "--stripe-a": d.chosen[0] ? familyById(d.chosen[0]).hex : "#4C527A",
        "--stripe-b": d.chosen[1] ? familyById(d.chosen[1]).hex : d.chosen[0] ? "#4C527A" : "#E7B49F",
      } as CSSProperties}
    >
      <div className="postcard__inner">
        {/* the picture side: the place, its light, and what the scent brought */}
        <div className="postcard__view">
          <span className="tape tape--a" aria-hidden="true" />
          <span className="tape tape--b" aria-hidden="true" />
          <div className="postcard__photo" style={{ background: d.paper }}>
            <CaptureScene room={d.room} daypart={d.daypart} families={d.chosen} source={d.source} blendKey={d.blendKey} place={d.room ? roomLabel(d.room) : d.season ? SEASON_OPTIONS.find((x) => x.id === d.season)?.label : undefined} />
          </div>
        </div>

        <span className="postcard__divider" aria-hidden="true" />

        {/* the writing side: stamp, postmark, message, address lines */}
        <div className="postcard__back">
          <div className="postcard__corner">
            <span className="postcard__stamp" style={{ background: d.chosen[0] ? familyById(d.chosen[0]).hex : "#A0A6C8" }}>
              {d.chosen[0] ? <span className="postcard__stamp-img" style={{ backgroundImage: `url(${familyById(d.chosen[0]).texture})` }} /> : null}
              <span className="postcard__stamp-name">{d.chosen[0] ? familyById(d.chosen[0]).label : "Olfia"}</span>
            </span>
            <span className="postcard__postmark">
              {d.chosen[0] ? <Stamp family={d.chosen[0]} size={120} rot={-12} /> : null}
              <svg viewBox="0 0 120 40" className="postcard__waves" aria-hidden="true">
                {[8, 20, 32].map((y) => <path key={y} d={`M0 ${y} q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke="currentColor" strokeWidth="2" />)}
              </svg>
            </span>
          </div>
          <div className="postcard__message">
            {d.emotions.length ? <span className="postcard__feel">{d.emotions.map((id) => EMOTION_OPTIONS.find((e) => e.id === id)?.label.toLowerCase()).join(" & ")}</span> : null}
            <span className="postcard__name">{d.momentName || " "}</span>
            {d.sentence ? <span className="postcard__sentence">{d.sentence}</span> : null}
          </div>
          <div className="postcard__lines">
            <span className="postcard__line postcard__line--title">{d.title || " "}</span>
            <span className="postcard__line">{d.occasionLine || " "}</span>
            <span className="postcard__line postcard__line--tags">{d.tags.length ? d.tags.slice(0, 5).map((t) => `#${t}`).join(" ") : " "}</span>
            <span className="postcard__date">{d.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaptureForm() {
  const add = useAtlas((s) => s.add);
  const mounted = useMounted();

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
  // Tiffany 11/24: saving opens a window (close at the top right) with a short firework, the saved message and the
  // Scent Atlas button on the left and the card that was just made on the right; it replaces the small notice
  const [savedCard, setSavedCard] = useState<PostcardData | null>(null);
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
    setSavedCard(card);
    reset();
  };

  const paper = SEASON_OPTIONS.find((s) => s.id === season)?.paper ?? "var(--paper)";
  const progress = ((step + 1) / STEPS.length) * 100;
  const card: PostcardData = {
    paper, room, daypart, season, chosen, source, blendKey, emotions, momentName, sentence, tags,
    title: mode === "product" && (scentName || productName) ? [scentName, productName].filter(Boolean).join(", ") : source ? sourceLabel(source) : "",
    occasionLine: [occasion ? OCCASION_OPTIONS.find((o) => o.id === occasion)?.label : null, daypart ? DAYPART_OPTIONS.find((d) => d.id === daypart)?.label : null].filter(Boolean).join(" · "),
    date: mounted ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  };

  return (
    <div className="capture-layout">
      <div className="flow" style={{ flex: "1 1 520px", minWidth: 0 }}>
        <div className="flow__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Capture progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div key={current} className="flow__step" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {current === "season" ? (
            <>
              {/* copy v1 (Tiffany 11/24, §2): a lead at the start and a hint at the last step only; nine steps kept */}
              <p className="lead">Record a scent from today or a moment you still remember. Use Skip when you’re unsure about a detail.</p>
              <h2 className="flow__q">What <em>season</em> was it?</h2>
              <div className="opts">
                {SEASON_OPTIONS.map((o) => <Opt key={o.id} on={season === o.id} onClick={() => setSeason(o.id)} dot={o.paper}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "daypart" ? (
            <>
              <h2 className="flow__q"><em>When</em> did you notice it?</h2>
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
              <h2 className="flow__q">What was <em>happening</em> at the time?</h2>
              <div className="opts">
                {OCCASION_OPTIONS.map((o) => <Opt key={o.id} on={occasion === o.id} onClick={() => setOccasion(occasion === o.id ? null : o.id)}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "source" ? (
            <>
              <h2 className="flow__q">Where did the scent <em>come from</em>?</h2>
              <div className="opts">
                {SOURCE_OPTIONS.map((o) => <Opt key={o.id} on={source === o.id} onClick={() => setSource(o.id)}>{o.label}</Opt>)}
              </div>
            </>
          ) : null}

          {current === "what" ? (
            <>
              <h2 className="flow__q">Tell us more about the <em>source</em>.</h2>
              <div role="tablist" aria-label="Record by" className="seg" style={{ width: 280, maxWidth: "100%" }}>
                <span className="seg__thumb" aria-hidden="true" style={{ left: mode === "product" ? 5 : "50%", width: "calc(50% - 5px)" }} />
                <button type="button" role="tab" aria-selected={mode === "product"} className="seg__opt" onClick={() => setMode("product")}>A product</button>
                <button type="button" role="tab" aria-selected={mode === "method"} className="seg__opt" onClick={() => setMode("method")}>Something I did</button>
              </div>
              {mode === "product" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                  <label className="field" style={{ flex: "1 1 220px" }}>
                    Brand or shop
                    <input className="input" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Diptyque" maxLength={80} />
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
              {/* design round 11/24: the question stays on one line on a computer; the hint sits under it */}
              <h2 className="flow__q">Which fragrance <em>families</em> describe it?</h2>
              <p className="flow__hint">Choose up to two</p>
              {mode === "method" && method ? (
                <p className="lead">We’ve suggested some families based on your source. Choose the ones that match what you smelled.</p>
              ) : null}
              {/* Tiffany 11/24: one column, the family's colour dot larger */}
              <div className="opts opts--one opts--big-dots">
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
              <h2 className="flow__q">How did it make you <em>feel</em>?</h2>
              <p className="flow__hint">Choose up to two</p>
              <div className="chips">
                {EMOTION_OPTIONS.map((e) => (
                  <button key={e.id} type="button" className="chip" aria-pressed={emotions.includes(e.id)} onClick={() => toggleEmotion(e.id)} style={{ minHeight: 48, fontSize: 17 }}>{e.label}</button>
                ))}
              </div>
            </>
          ) : null}

          {current === "finish" ? (
            <>
              <h2 className="flow__q">How did you <em>like</em> the scent?</h2>
              <p className="field__hint" style={{ margin: 0 }}>You can save scents you loved and ones you would rather avoid.</p>
              <div role="radiogroup" aria-label="How you liked the scent" className="chips">
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
                <input className="input" type="text" value={momentName} onChange={(e) => { setNameTouched(true); setMomentName(e.target.value); }} maxLength={60} placeholder="Sunday morning, windows open" />
              </label>
              <label className="field">
                A note to remember <span className="field__hint">(optional)</span>
                <input className="input" type="text" value={sentence} onChange={(e) => setSentence(e.target.value)} maxLength={140} placeholder="Coffee on the table, rain drifting in through the window…" />
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Tags</span>
                <div className="chips">
                  {tags.map((t) => <span key={t} className={`tag${custom.includes(t) ? " tag--on" : ""}`}>#{t}</span>)}
                </div>
                {custom.length < 3 ? (
                  <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
                    <input className="input" type="text" value={customDraft} onChange={(e) => setCustomDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} placeholder="e.g. rainy day, reading" maxLength={24} aria-label="Add a tag" />
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
            <Link href={`/card?from=${savedId}`} className="btn btn--ghost">Make a Scent Card from this entry</Link>
          </div>
        ) : null}
      </div>

      <aside aria-label="Preview" className="capture-aside">
        <Postcard d={card} />
      </aside>

      <Dialog open={Boolean(savedCard)} onClose={() => setSavedCard(null)} label="Saved to your Scent Atlas" className="dlg--saved">
        {savedCard ? (
          <div className="saved">
            <Fireworks colors={[...savedCard.chosen.map((f) => familyById(f).hex), "#E7B49F", "#A0A6C8"]} />
            <button type="button" className="dlg__x" aria-label="Close" onClick={() => setSavedCard(null)}><Icon name="x" /></button>
            <div className="saved__text">
              <h2 className="saved__title">Saved to your Scent Atlas</h2>
              {savedCard.momentName ? <p className="hand saved__moment">{savedCard.momentName}</p> : null}
              <div className="saved__actions">
                <Link href="/atlas?tab=journal" className="btn btn--primary" data-autofocus>Open Scent Atlas</Link>
                {savedId ? <Link href={`/card?from=${savedId}`} className="btn btn--ghost">Make a Scent Card from this entry</Link> : null}
              </div>
            </div>
            <div className="saved__card"><Postcard d={savedCard} /></div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
