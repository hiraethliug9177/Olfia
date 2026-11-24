"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { familyById } from "@/lib/catalog";
import { useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { sampleEntries } from "@/lib/sample";
import { ScentSummary } from "@/components/account/ScentSummary";
import { Character } from "@/components/quiz/Character";
import { blendsWith, loadQuiz, type QuizResult } from "@/lib/quiz";
import { Plans } from "@/components/plans/Plans";
import { markSample, setSignedIn, useAuthState } from "@/lib/mockAuth";
import { clearAllData, exportAllData } from "@/lib/localData";

/**
 * The person's own quiz result, or an invitation to take the quiz. Tiffany 11/10: the character only
 * (not the whole result card), and the result and its details here instead of a link to the quiz page.
 */
function AccountQuiz() {
  const mounted = useMounted();
  const [r, setR] = useState<QuizResult | null>(null);
  useEffect(() => { if (mounted) setR(loadQuiz()); }, [mounted]);
  if (!mounted) return <section id="quiz" className="card anchor" style={{ minHeight: 200 }} />;
  if (!r) {
    return (
      <section id="quiz" className="card anchor" style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        <h2 className="h-section" style={{ fontSize: 40 }}>Which scent feels like you?</h2>
        <p className="lead">Twenty questions about your habits and sensory preferences. Meet one of sixteen scent characters, discover fragrance families to explore, and find a room to start with.</p>
        <Link href="/quiz" className="btn btn--primary">Take the quiz</Link>
      </section>
    );
  }
  const fam = familyById(r.family);
  const second = r.second ? familyById(r.second) : null;
  // copy v1 (§10.7, same line as the quiz result): a family to explore, not a layering claim
  const exploreId = blendsWith(r.family).find((id) => id !== r.second);
  const explore = exploreId ? familyById(exploreId) : null;
  return (
    <section id="quiz" className="card anchor account-quiz">
      <div className="account-quiz__figure">
        <Character code={r.code} alt={`${r.archetype.name}, the ${r.code} character`} eager />
      </div>
      <div className="account-quiz__text">
        <h2 className="h-section" style={{ fontSize: 40 }}>You are {r.archetype.name}.</h2>
        <p className="lead">{r.archetype.voice}</p>
        <p style={{ margin: 0 }}>
          Your result suggests <span className="account-quiz__fam"><span className="chip__dot" style={{ background: fam.hex }} aria-hidden="true" />{fam.label}</span>
          {second ? <>, with <span className="account-quiz__fam"><span className="chip__dot" style={{ background: second.hex }} aria-hidden="true" />{second.label}</span> as a secondary family</> : null}.
          {explore ? ` For another scent direction, explore ${explore.label}.` : null}
        </p>
        <Link href={`/rooms?family=${[r.family, r.second].filter(Boolean).join(",")}`} className="btn btn--primary" style={{ alignSelf: "flex-start" }}>Design a room in this style</Link>
      </div>
    </section>
  );
}

export function AccountView() {
  const mounted = useMounted();
  const entries = useAtlas((s) => s.entries);
  const add = useAtlas((s) => s.add);
  const clear = useAtlas((s) => s.clear);
  const show = useToast((s) => s.show);
  const auth = useAuthState();

  const days = new Set(entries.map((e) => new Date(e.createdAt).toDateString())).size;
  const rooms = entries.filter((e) => e.type === "rooms").length;
  const captures = entries.length - rooms;

  // copy v1 (§10.6): Export and Clear cover all of Olfia's data in this browser, not only the Atlas entries
  const exportData = () => {
    const blob = new Blob([exportAllData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "olfia-data.json";
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
          <h1 className="h-page" style={{ fontSize: "clamp(36px, 4.4vw, 56px)" }}>My Page</h1>
          <span className="muted">Personal accounts are not available yet. Your saved entries stay in this browser.</span>
          {/* the mock sign-in (v2, 11/23): signing out lets the sample walk-through start again */}
          {auth.signedIn ? (
            <span className="muted" style={{ fontSize: 15 }}>
              You’re signed in to the account preview. <button type="button" className="auth__link" onClick={() => { setSignedIn(false); show("Signed out"); }}>Sign out</button>
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <span className="callout">{mounted ? days : "–"} days recorded</span>
          <span className="callout" style={{ background: "var(--deep)" }}>{mounted ? rooms : "–"} rooms</span>
          <span className="callout" style={{ background: "var(--apricot)", color: "var(--ink)" }}>{mounted ? captures : "–"} captures</span>
        </div>
      </section>

      <div id="profile" className="anchor"><ScentSummary /></div>

      <section id="info" className="card anchor" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 className="h-section" style={{ fontSize: 34 }}>Personal Info</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {["Username", "Email", "City, country"].map((l) => (
            <label key={l} className="field">{l}<input className="input" disabled placeholder="Available when accounts launch" /></label>
          ))}
        </div>
      </section>

      <Plans />

      <section id="settings" className="card anchor" style={{ display: "flex", flexDirection: "column", gap: 14, background: "var(--mist)" }}>
        <h2 className="h-section" style={{ fontSize: 34 }}>Settings</h2>
        <p className="muted" style={{ margin: 0 }}>Your entries are stored in this browser. Export a copy before clearing site data or switching devices.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button type="button" className="btn btn--primary" onClick={() => { sampleEntries().forEach((e) => add(e)); markSample(true); show("Sample pages added to your Scent Atlas", "/atlas", "Open Scent Atlas"); }}>Load sample pages</button>
          <button type="button" className="btn btn--ghost" onClick={exportData} disabled={!mounted}>Export my data</button>
          <button type="button" className="btn btn--ghost" disabled={!mounted} onClick={() => { if (window.confirm("Clear all your locally saved Olfia data? Export a copy first if you want to keep it.")) { clear(); clearAllData(); markSample(false); setSignedIn(false); show("Local data cleared"); } }}>Clear this browser</button>
        </div>
      </section>

      <AccountQuiz />
    </div>
  );
}
