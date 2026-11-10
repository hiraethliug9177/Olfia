import Link from "next/link";
import { FAMILIES } from "@/lib/catalog";
import { LIBRARY_INTRO } from "@/lib/library";

/**
 * The Scent Library's own block at the top of The Olfia Edit (Tiffany 11/10: moved here from
 * My Account). The picture is a specimen board made from the site's own material cut-outs:
 * one family colour and one material for each of the seven families, held down with paper tape.
 */
const SPOTS = [
  { l: 6, t: 14, r: -6 },
  { l: 30, t: 6, r: 4 },
  { l: 54, t: 16, r: -3 },
  { l: 77, t: 8, r: 6 },
  { l: 16, t: 54, r: 5 },
  { l: 42, t: 52, r: -5 },
  { l: 67, t: 56, r: 3 },
];

export function LibraryCollage() {
  return (
    <div className="lib-collage" aria-hidden="true">
      <span className="tape tape--a" />
      <span className="tape tape--b" />
      {FAMILIES.map((f, i) => {
        const m = f.materials.find((x) => x.asset) ?? f.materials[0];
        const s = SPOTS[i];
        return (
          <span key={f.id} className="lib-collage__spec" style={{ left: `${s.l}%`, top: `${s.t}%`, rotate: `${s.r}deg` }}>
            <span className="lib-collage__dot" style={{ background: f.hex }} />
            {m.asset ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.asset} alt="" className="lib-collage__img" />
            ) : null}
            <span className="lib-collage__label">{f.label}</span>
          </span>
        );
      })}
    </div>
  );
}

export function LibraryBlock() {
  return (
    <section className="lib-block" aria-labelledby="lib-block-h">
      <LibraryCollage />
      <div className="lib-block__text">
        <h2 id="lib-block-h" className="h-section">Scent Library</h2>
        <p className="lead">{LIBRARY_INTRO}</p>
        <div className="lib-block__fams">
          {FAMILIES.map((f) => (
            <Link key={f.id} href={`/library#${f.id}`} className="lib-fam">
              <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />
              {f.label}
            </Link>
          ))}
        </div>
        <Link href="/library" className="btn btn--moss" style={{ alignSelf: "flex-start" }}>Open the Scent Library</Link>
      </div>
    </section>
  );
}
