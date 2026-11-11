import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import { Character } from "@/components/quiz/Character";
import { ARCHETYPES } from "@/lib/quiz";
import { familyById } from "@/lib/catalog";
import { FAMILY_WASH } from "@/lib/colors";

export const metadata: Metadata = { title: "Scent quiz" };

/** The quiz, and below it all sixteen characters (Tiffany 11/10: one figure per archetype). */
export default function QuizPage() {
  return (
    <div className="wrap page">
      <Quiz />
      <section className="section" aria-labelledby="cast-h">
        <h2 id="cast-h" className="h-section" style={{ marginBottom: 32 }}>Sixteen characters</h2>
        <div className="cast">
          {ARCHETYPES.map((a) => {
            const f = familyById(a.home);
            return (
              <figure key={a.code} className="cast__card" style={{ background: FAMILY_WASH[a.home] }}>
                <div className="cast__img"><Character code={a.code} alt={`${a.name}, the ${a.code} character`} /></div>
                <figcaption className="cast__cap">
                  <span className="cast__name">{a.name}</span>
                  <span className="cast__meta"><span className="chip__dot" style={{ background: f.hex, width: 10, height: 10 }} />{a.code} · {f.label}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
