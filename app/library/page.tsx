import type { Metadata } from "next";
import Link from "next/link";
import { FAMILIES, texture } from "@/lib/catalog";
import { LIBRARY_INTRO, storyFor } from "@/lib/library";
import { FAMILY_FILL, FAMILY_WASH } from "@/lib/colors";
import { Story } from "@/components/library/Story";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Scent Library" };

/** Scent Library (part of The Olfia Edit since 11/10): seven families, each with Tiffany's little story. */
export default function LibraryPage() {
  return (
    <div className="wrap page">
      <Link href="/edit" className="article__back"><Icon name="arrowLeft" size={18} />The Olfia Edit</Link>
      <div className="split-head" style={{ marginTop: 20 }}>
        <h1 className="h-page">Scent Library</h1>
        <p className="lead">{LIBRARY_INTRO}</p>
      </div>
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
          return (
            <section key={f.id} id={f.id} className="lib-fam-card" style={{ background: FAMILY_WASH[f.id] }}>
              <div className="lib-fam-card__mark">
                <span className="lib-fam-card__num">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="lib-fam-card__dot" style={{ background: f.hex, boxShadow: `0 0 0 6px #fff, 0 0 48px ${f.glow}` }} />
              </div>
              <div className="lib-fam-card__body">
                <h2 className="h-section" style={{ fontSize: "clamp(32px, 3.4vw, 44px)" }}>{f.label}</h2>
                <p>{f.what}</p>
                <span className="muted" style={{ fontSize: 15 }}>{f.notes}</span>
                <p><strong>At home:</strong> {f.home}</p>
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
                {story ? <Story story={story} fill={FAMILY_FILL[f.id]} /> : null}
                <Link href={`/rooms?family=${f.id}`} className="hero__link" style={{ alignSelf: "flex-start" }}>Try {f.label} in a room</Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
