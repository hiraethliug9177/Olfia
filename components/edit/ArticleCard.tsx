import Link from "next/link";
import { articleDate, reads, type Article } from "@/lib/edit";
import { ArticleCover } from "@/components/edit/ArticleCover";

type Variant = "card" | "lead" | "row" | "mini";

/**
 * One story in The Olfia Edit. "card" for grids, "lead" for the top story, "row" for the dated list
 * (picture left, words right, like a newspaper section front), "mini" for the side rail.
 */
export function ArticleCard({ a, lead = false, variant }: { a: Article; lead?: boolean; variant?: Variant }) {
  const v: Variant = variant ?? (lead ? "lead" : "card");
  if (v === "mini") {
    return (
      <Link href={`/edit/${a.slug}`} className="edit-mini">
        <span className="edit-card__meta">{a.topic} · {articleDate(a.date)}</span>
        <span className="edit-mini__title">{a.title}</span>
        <span className="edit-card__foot">{a.readTime} · {reads(a.views)}</span>
      </Link>
    );
  }
  return (
    <Link href={`/edit/${a.slug}`} className={`edit-card edit-card--${v}`}>
      <ArticleCover a={a} ratio={v === "lead" ? "16 / 10" : v === "row" ? "4 / 3" : "4 / 3"} eager={v === "lead"} />
      <span className="edit-card__text">
        <span className="edit-card__meta">{a.topic} · {articleDate(a.date)}</span>
        <span className="edit-card__title">{a.title}</span>
        <span className="edit-card__dek">{a.dek}</span>
        <span className="edit-card__foot">{a.readTime} · {reads(a.views)}</span>
      </span>
    </Link>
  );
}
