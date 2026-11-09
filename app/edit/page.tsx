import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/edit";
import { ArticleCover } from "@/components/edit/ArticleCover";
import { familyById } from "@/lib/catalog";

export const metadata: Metadata = { title: "The Olfia Edit" };

export default function EditPage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ marginBottom: 12 }}>The Olfia <em>Edit</em></h1>
      <p className="lead" style={{ marginBottom: 40 }}>Scent in films, hotels and seasons. New pieces as they come.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 }}>
        {ARTICLES.map((a) => (
          <Link key={a.slug} href={`/edit/${a.slug}`} className="edit-card">
            <ArticleCover families={a.families} />
            <span className="label-mono" style={{ fontSize: 13 }}>{a.date.replace(/-/g, " · ")} · {a.families.map((f) => familyById(f).label).join(" + ")}</span>
            <span className="edit-card__title">{a.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
