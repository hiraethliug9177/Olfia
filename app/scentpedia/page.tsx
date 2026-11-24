import type { Metadata } from "next";
import Link from "next/link";
import { FAMILIES, texture } from "@/lib/catalog";
import { storyFor } from "@/lib/library";
import { FAMILY_FILL, FAMILY_WASH } from "@/lib/colors";
import { FAMILY_GUIDE, GUIDE_INTRO, WHEEL_HINT } from "@/lib/copy/familyGuide";
import { Story } from "@/components/library/Story";
import { GuideText } from "@/components/library/GuideText";
import { QuizInvite } from "@/components/home/QuizInvite";

export const metadata: Metadata = { title: "Scentpedia" };

/**
 * Scentpedia (v2, 11/23; the Scent Library until then, /library forwards here): the quiz module on top (an invitation,
 * or your result), then the seven families, each with Tiffany's little story (her Notion: "quiz在上family在下").
 * Copy v1 (11/24, §7): each family has her long guide (first paragraph shown, the rest behind "Continue reading"),
 * signature notes, its place on the fragrance wheel, at home, and the same scent recipe as the home dial (research links removed 11/24).
 */
export default function LibraryPage() {
  return (
    <div className="wrap page">
      <div className="split-head">
        <h1 className="h-page">Scentpedia</h1>
        <p className="lead">Get to know seven fragrance families through their ingredients, their character, and the stories behind them.</p>
      </div>
      <section id="quiz" aria-label="Scent personality quiz" style={{ marginBottom: 48 }}>
        <QuizInvite />
      </section>
      <p className="lib-guide-intro">{GUIDE_INTRO}</p>
      <nav aria-label="Families" className="lib-jump">
        {FAMILIES.map((f) => (
          <a key={f.id} href={`#${f.id}`} className="lib-fam">
            <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />{f.label}
          </a>
        ))}
      </nav>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {FAMILIES.map((f, i) => {
          const story = storyFor(f.id);
          const g = FAMILY_GUIDE[f.id];
          return (
            <section key={f.id} id={f.id} className="lib-fam-card" style={{ background: FAMILY_WASH[f.id] }}>
              <div className="lib-fam-card__mark">
                <span className="lib-fam-card__num">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="lib-fam-card__dot" style={{ background: f.hex, boxShadow: `0 0 0 6px #fff, 0 0 48px ${f.glow}` }} />
              </div>
              {/* design round (11/24, her rule 3): on wide screens the reading text and the at-home cards sit side by side */}
              <div className="lib-fam-card__body">
                <div className="lib-fam-card__main">
                <h2 className="h-section" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>{f.label}</h2>
                <p className="lead" style={{ margin: 0 }}>{g.descriptors}</p>
                <dl className="fam-facts">
                  <div><dt>Signature notes</dt><dd>{g.signatureNotes}</dd></div>
                  <div><dt>On the fragrance wheel</dt><dd>{g.onWheel}</dd></div>
                </dl>
                <GuideText paragraphs={g.guide} />
                <Link href={`/rooms?family=${f.id}`} className="hero__link" style={{ alignSelf: "flex-start" }}>Try {f.label} in a room</Link>
                </div>
                <div className="lib-fam-card__side">
                <dl className="fam-facts">
                  <div><dt>At home</dt><dd>{g.atHome}</dd></div>
                </dl>
                <div className="lib-materials">
                  {f.materials.map((m) => (
                    <span key={m.id} className="lib-material">
                      {m.asset ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.asset} alt="" width={56} height={56} style={{ objectFit: "contain" }} />
                      ) : (
                        <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: "50%", background: texture(m.colors), boxShadow: "0 0 0 2.5px #fff, 0 2px 6px rgba(41,42,49,0.2)" }} />
                      )}
                      {m.label}
                    </span>
                  ))}
                </div>
                <div className="recipe recipe--open">
                  <span className="recipe__label">Scent recipe</span>
                  <h3 className="recipe__title">{g.recipe.title}</h3>
                  <p className="recipe__parts"><span>Main scent: {g.recipe.main}</span><span>Accent: {g.recipe.accent}</span></p>
                  <p style={{ margin: 0 }}>{g.recipe.body}</p>
                  <p className="muted recipe__hint">{WHEEL_HINT}</p>
                </div>
                {story ? <Story story={story} fill={FAMILY_FILL[f.id]} /> : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
