"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import { familyById } from "@/lib/catalog";
import { QUESTIONS, blendsWith, loadQuiz, saveQuiz, scoreQuiz, type QuizResult } from "@/lib/quiz";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { useMounted } from "@/lib/store";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { ItemArt } from "@/components/scene/Cutout";
import { Stamp } from "@/components/scene/Stamp";
import { dotDate } from "@/lib/dates";

/** Result card: archetype headline, family by colour + stamp + materials, Tiffany's line. Exported as a 1080-wide PNG. */
export function ResultCard({ r, cardRef }: { r: QuizResult; cardRef?: Ref<HTMLDivElement> }) {
  const f = familyById(r.family);
  const mats = f.materials;
  return (
    <div ref={cardRef} className="scene-sheet" style={{ width: "100%", maxWidth: 420, aspectRatio: "3 / 4", position: "relative", borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 18px 40px rgba(41,42,49,0.16)" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${f.hex}33 0%, #F5EEE1 60%)` }} />
      <Atmosphere families={[r.family, r.second ?? r.family]} intensity={0.9} />
      <div className="scene-sheet__grain" aria-hidden="true" />
      <div style={{ position: "absolute", inset: 0, padding: "7% 8%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span className="label-mono" style={{ fontSize: "max(10px, 3cqw)", letterSpacing: "0.16em" }}>OLFIA · {dotDate(new Date(r.takenAt))}</span>
          <Stamp family={r.family} size={82} rot={9} />
        </div>
        <div style={{ position: "relative", height: "34%" }}>
          {mats.map((m, i) => {
            const spots = [{ l: "6%", t: "10%", r: -10, w: "34%" }, { l: "38%", t: "0%", r: 6, w: "36%" }, { l: "62%", t: "28%", r: -4, w: "32%" }];
            const s = spots[i];
            return (
              <div key={m.id} aria-hidden="true" style={{ position: "absolute", left: s.l, top: s.t, width: s.w, aspectRatio: "1", rotate: `${s.r}deg` }}>
                <ItemArt kind={m.id} prefix="qz" />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "max(26px, 10.5cqw)", lineHeight: 1 }}>{r.archetype.name}</span>
          <span className="hand" style={{ fontSize: "max(16px, 6cqw)", lineHeight: 1.2, color: "var(--ink)" }}>{r.archetype.voice}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontFamily: "var(--font-mono)", fontSize: "max(10px, 3.2cqw)", letterSpacing: "0.08em", color: "var(--slate)" }}>
            <span className="chip__dot" style={{ background: f.hex, width: 12, height: 12 }} />
            {f.label.toUpperCase()}
            {r.second ? <><span>·</span><span className="chip__dot" style={{ background: familyById(r.second).hex, width: 12, height: 12 }} />{familyById(r.second).label.toUpperCase()}</> : null}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Quiz() {
  const mounted = useMounted();
  const show = useToast((s) => s.show);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [i, setI] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Keep the layer order (who → reach) but shuffle inside each layer, once per visit.
  const order = useMemo(() => {
    const seed = Math.random();
    const shuffle = <T,>(a: T[]) => a.map((v, k) => ({ v, k: Math.sin(seed * 1000 + k) })).sort((x, y) => x.k - y.k).map((x) => x.v);
    return [...shuffle(QUESTIONS.filter((q) => q.layer === "who")), ...shuffle(QUESTIONS.filter((q) => q.layer === "reach"))];
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const saved = loadQuiz();
    if (saved) setResult(saved);
  }, [mounted]);

  const q = order[i];
  const answered = Object.keys(answers).length;
  const progress = (Math.min(answered, QUESTIONS.length) / QUESTIONS.length) * 100;

  const choose = (idx: number) => {
    const next = { ...answers, [q.id]: idx };
    setAnswers(next);
    if (i < order.length - 1) {
      window.setTimeout(() => setI(i + 1), 180);
    } else {
      const r = scoreQuiz(next);
      setResult(r);
      saveQuiz(r);
      track("quiz_complete", { code: r.code, family: r.family });
    }
  };

  const restart = () => {
    setAnswers({}); setI(0); setResult(null);
    try { window.localStorage.removeItem("olfia.quiz.v1"); } catch { /* ignore */ }
  };

  const exportCard = async (prefer: "share" | "download") => {
    const node = cardRef.current;
    if (!node || busy || !result) return;
    setBusy(true);
    try {
      const { toBlob } = await import("html-to-image");
      const pixelRatio = 1080 / node.offsetWidth;
      let blob: Blob | null = null;
      try { blob = await toBlob(node, { pixelRatio, cacheBust: true }); } catch { blob = await toBlob(node, { pixelRatio, cacheBust: true, skipFonts: true }); }
      if (!blob) throw new Error("no image");
      const file = new File([blob], `olfia-${result.archetype.name.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (prefer === "share" && nav.share && nav.canShare?.({ files: [file] })) {
        try { await nav.share({ files: [file], title: result.archetype.name }); } catch { /* closed */ }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        show("Image saved");
      }
      track("quiz_share", { method: prefer });
    } catch {
      show("Couldn’t make the image. Try again?");
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    const f = familyById(result.family);
    const neighbours = blendsWith(result.family).map(familyById);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", justifyContent: "center" }}>
          <ResultCard r={result} cardRef={cardRef} />
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
          <h2 className="flow__q" style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>You are <em>{result.archetype.name}</em>.</h2>
          <p className="lead">{f.what} At home it suits {f.home}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="label-mono">BLENDS WELL WITH</span>
            <div className="chips">
              {neighbours.map((n) => (
                <Link key={n.id} href={`/library#${n.id}`} className="chip" style={{ textDecoration: "none" }}><span className="chip__dot" style={{ background: n.hex }} />{n.label}</Link>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href={`/rooms?family=${result.family}`} className="btn btn--primary">Open a room with this scent</Link>
            <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => exportCard("share")}>{busy ? "Making image…" : "Share"}</button>
            <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => exportCard("download")}>Save image</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            <Link href="/edit" style={{ fontWeight: 600 }}>Read The Olfia Edit →</Link>
            <button type="button" className="btn btn--ghost btn--sm" onClick={restart}>Take it again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flow" style={{ maxWidth: 720 }}>
      <div className="flow__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Quiz progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div key={q.id} className="flow__step" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span className="mono muted" style={{ fontSize: 14 }}>{i + 1} / {order.length}</span>
        <h2 className="flow__q">
          {q.em && q.prompt.includes(q.em) ? (
            <>
              {q.prompt.slice(0, q.prompt.indexOf(q.em))}<em>{q.em}</em>{q.prompt.slice(q.prompt.indexOf(q.em) + q.em.length)}
            </>
          ) : q.prompt}
        </h2>
        {q.options.every((o) => o.swatch) ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 22, padding: "8px 4px" }} role="group" aria-label={q.prompt}>
            {q.options.map((o, idx) => (
              <button key={o.label} type="button" className="swatch" aria-pressed={answers[q.id] === idx} aria-label={o.label} style={{ background: o.swatch }} onClick={() => choose(idx)} />
            ))}
          </div>
        ) : (
          <div className="opts">
            {q.options.map((o, idx) => (
              <button key={o.label} type="button" className="opt" aria-pressed={answers[q.id] === idx} onClick={() => choose(idx)}>{o.label}</button>
            ))}
          </div>
        )}
      </div>
      <div className="flow__nav">
        <button type="button" className="btn btn--ghost" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} style={{ visibility: i === 0 ? "hidden" : "visible" }}>Back</button>
        {answers[q.id] !== undefined && i < order.length - 1 ? (
          <button type="button" className="btn btn--ghost" onClick={() => setI(i + 1)}>Next</button>
        ) : <span />}
      </div>
    </div>
  );
}
