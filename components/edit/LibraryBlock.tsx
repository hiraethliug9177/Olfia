import Link from "next/link";
import { FAMILIES } from "@/lib/catalog";

/**
 * The Scent Library's entry at the top of The Olfia Edit: the title and the seven families on one line,
 * each opening its own section of the library (Tiffany 11/10: no picture, families only).
 */
export function LibraryBlock() {
  return (
    <section className="lib-block" aria-labelledby="lib-block-h">
      <h2 id="lib-block-h" className="h-section lib-block__title"><Link href="/library">Scent Library</Link></h2>
      <nav className="lib-block__fams" aria-label="Scent families">
        {FAMILIES.map((f) => (
          <Link key={f.id} href={`/library#${f.id}`} className="lib-fam">
            <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />
            {f.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
