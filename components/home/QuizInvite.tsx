"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { familyById } from "@/lib/catalog";
import { loadQuiz, type QuizResult } from "@/lib/quiz";
import { useMounted } from "@/lib/store";
import { Stamp } from "@/components/scene/Stamp";
import { Atmosphere } from "@/components/scene/Atmosphere";

/** Home hook (11/4 feedback): the scent quiz, or the saved result if one exists in this browser. */
export function QuizInvite() {
  const mounted = useMounted();
  const [r, setR] = useState<QuizResult | null>(null);
  useEffect(() => { if (mounted) setR(loadQuiz()); }, [mounted]);
  const fam = r ? familyById(r.family) : null;
  return (
    <div className="invite" style={{ position: "relative", overflow: "hidden" }}>
      {fam ? <Atmosphere families={[r!.family]} intensity={0.6} /> : null}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10, maxWidth: "22em" }}>
        <span className="hand" style={{ fontSize: 24, color: "var(--deep)" }}>{r ? "your result, saved here" : "twenty questions, one scent"}</span>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: 1.1 }}>
          {r ? <>You are <em>{r.archetype.name}</em>.</> : <>Which scent is <em>you</em>?</>}
        </p>
        {r ? <span className="hand" style={{ fontSize: 22 }}>{r.archetype.voice}</span> : null}
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
        {fam ? <Stamp family={fam.id} size={96} rot={8} /> : null}
        <Link href="/quiz" className="btn btn--primary">{r ? "See your result" : "Take the scent quiz"}</Link>
      </div>
    </div>
  );
}
