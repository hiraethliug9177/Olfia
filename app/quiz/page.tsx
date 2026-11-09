import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = { title: "Scent quiz" };

export default function QuizPage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ marginBottom: 12, fontSize: "clamp(40px, 5vw, 64px)", maxWidth: "14em" }}>
        Which scent is <em>you</em>?
      </h1>
      <p className="lead" style={{ marginBottom: 36 }}>Twenty quick questions. Tap what feels right; there are no wrong answers.</p>
      <Quiz />
    </div>
  );
}
