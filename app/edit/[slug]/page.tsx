import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, articleBySlug } from "@/lib/edit";
import { ArticleCover } from "@/components/edit/ArticleCover";
import { ArticleProducts } from "@/components/edit/ArticleProducts";
import { familyById } from "@/lib/catalog";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return { title: a ? a.title : "The Olfia Edit" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const todo = a.dek.startsWith("TODO(");
  return (
    <div className="wrap page">
      <Link href="/edit" className="label-mono" style={{ textDecoration: "none" }}>← THE OLFIA EDIT</Link>
      <h1 className="h-page" style={{ margin: "16px 0 14px", maxWidth: "14em" }}>{a.title}</h1>
      {!todo ? <p className="lead" style={{ marginBottom: 28 }}>{a.dek}</p> : null}
      <div style={{ marginBottom: 36 }}>
        <ArticleCover families={a.families} big />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
        <article className="prose" style={{ flex: "2 1 480px", minWidth: 0 }}>
          {a.body.length ? a.body.map((p, i) => <p key={i}>{p}</p>) : (
            <div className="todo">TODO(Tiffany): article text goes here — see the notes and sources on the right.</div>
          )}
        </article>
        <aside style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="label-mono">NOTES &amp; SOURCES</span>
          <ol style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 20, fontSize: 16, lineHeight: 1.5 }}>
            {a.notes.map((n, i) => (
              <li key={i}>
                {n.text}{" "}
                {n.source ? <a href={n.source.url} target="_blank" rel="noopener noreferrer">{n.source.label}</a> : null}
              </li>
            ))}
          </ol>
          <Link href={`/rooms?family=${a.families[0]}`} className="btn btn--primary" style={{ alignSelf: "flex-start" }}>
            Try {familyById(a.families[0]).label} in Rooms
          </Link>
        </aside>
      </div>
      <div className="card" style={{ marginTop: 48 }}>
        <ArticleProducts ids={a.products} />
      </div>
    </div>
  );
}
