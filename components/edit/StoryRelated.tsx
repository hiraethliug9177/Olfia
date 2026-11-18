import Link from "next/link";
import { familyById, texture } from "@/lib/catalog";
import { FAMILY_WASH } from "@/lib/colors";
import { storyFor } from "@/lib/library";
import { storyPicks } from "@/lib/picks";
import { ProductCard } from "@/components/products/ProductCards";
import type { FamilyId } from "@/lib/types";

/**
 * Recreate This at Home (11/17, review item 9): the story's scent families, each opening its Scent Library story, then
 * three products in those families that can be bought online (lib/picks.ts storyPicks). Since 11/18 (Tiffany) it is the
 * left column of a story page on a computer, with Try This on the right in the same heading and card design.
 */
export function StoryRelated({ families }: { families: FamilyId[] }) {
  const products = storyPicks(families);
  return (
    <aside className="story-side article__rel" aria-labelledby="story-rel-h">
      <h2 id="story-rel-h" className="story-side__h">Recreate This at Home</h2>
      <div className="story-side__fams">
        {families.map((id) => {
          const f = familyById(id);
          const lib = storyFor(id);
          return (
            <Link key={id} href={`/library#${id}`} className="story-card story-fam" style={{ background: FAMILY_WASH[id] }}>
              <span className="story-card__head">
                <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />
                {f.label}
              </span>
              <span className="story-fam__mats" aria-hidden="true">
                {f.materials.map((m) =>
                  m.asset ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={m.id} src={m.asset} alt="" width={56} height={56} />
                  ) : (
                    <span key={m.id} className="story-fam__swatch" style={{ background: texture(m.colors) }} />
                  ),
                )}
              </span>
              {lib ? <span className="story-fam__title">{lib.title}</span> : null}
            </Link>
          );
        })}
      </div>
      {products.length ? (
        <div className="story-side__products">{products.map((p) => <ProductCard key={p.id} p={p} place="story" />)}</div>
      ) : null}
      <Link href={`/gifts?family=${families[0]}#all`} className="hero__link story-side__more">More in Gifts</Link>
    </aside>
  );
}
