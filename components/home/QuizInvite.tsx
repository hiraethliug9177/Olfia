"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ARCHETYPES, loadQuiz, type QuizResult } from "@/lib/quiz";
import { useMounted } from "@/lib/store";
import { ResultCard } from "@/components/quiz/Quiz";

/** What the quiz gives you, shown before you take it (11/9 feedback 02). */
const SAMPLE: QuizResult = {
  code: "ISTJ",
  archetype: ARCHETYPES.find((a) => a.code === "ISTJ") ?? ARCHETYPES[0],
  family: "woody",
  second: "spicy",
  scores: { floral: 0, gourmand: 2, spicy: 6, woody: 11, green: 3, citrus: 1, fresh: 2 },
  takenAt: "2026-11-09T18:00:00.000Z",
};

export function QuizInvite() {
  const mounted = useMounted();
  const [r, setR] = useState<QuizResult | null>(null);
  useEffect(() => { if (mounted) setR(loadQuiz()); }, [mounted]);
  const shown = r ?? SAMPLE;
  return (
    <div className="quiz-invite">
      <div className="quiz-invite__card">
        <ResultCard r={shown} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 340px", minWidth: 0 }}>
        <h2 className="h-section">{r ? `You are ${r.archetype.name}.` : "Which scent is you?"}</h2>
        <p className="lead">
          {r ? r.archetype.voice : "Twenty questions about how you live. You get one of sixteen characters, the scent family that fits, and a room to start from."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px", paddingTop: 4 }}>
          <Link href="/quiz" className="btn btn--primary">{r ? "See your result" : "Take the quiz"}</Link>
          {r ? <Link href={`/rooms?family=${r.family}`} className="hero__link">Design a room in this style</Link> : <span className="muted" style={{ fontSize: 15 }}>About three minutes</span>}
        </div>
      </div>
    </div>
  );
}
