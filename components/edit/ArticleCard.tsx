import Link from "next/link";
import type { Article } from "@/lib/edit";
import { ArticleCover } from "@/components/edit/ArticleCover";

export function ArticleCard({ a, lead = false }: { a: Article; lead?: boolean }) {
  return (
    <Link href={`/edit/${a.slug}`} className={`edit-card${lead ? " edit-card--lead" : ""}`}>
      <ArticleCover a={a} ratio={lead ? "16 / 10" : "4 / 3"} eager={lead} />
      <span className="edit-card__meta">{a.topic} · {a.readTime}</span>
      <span className="edit-card__title">{a.title}</span>
      <span className="muted" style={{ fontSize: lead ? 17 : 15 }}>{a.dek}</span>
    </Link>
  );
}
