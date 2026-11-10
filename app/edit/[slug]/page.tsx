import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, articleBySlug } from "@/lib/edit";
import { familyById } from "@/lib/catalog";
import { ArticleCover } from "@/components/edit/ArticleCover";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { ObjectPhoto } from "@/components/edit/ObjectPhoto";
import { Rich } from "@/components/edit/Rich";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return { title: a ? a.title : "The Olfia Edit", description: a?.dek };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const others = ARTICLES.filter((x) => x.slug !== a.slug);
  return (
    <div className="wrap page">
      <article className="article">
        <Link href="/edit" className="article__back"><Icon name="arrowLeft" size={18} />The Olfia Edit</Link>
        <p className="edit-card__meta" style={{ marginTop: 28 }}>{a.kicker} · {a.readTime}</p>
        <h1 className="h-page" style={{ margin: "12px 0 16px" }}>{a.title}</h1>
        <p className="lead" style={{ maxWidth: "none" }}>{a.dek}</p>

        <figure className="article__figure">
          <ArticleCover a={a} ratio="16 / 9" eager />
          {a.image ? (
            <figcaption>
              {a.image.alt}. {a.image.creditHref ? <a href={a.image.creditHref} target="_blank" rel="noopener noreferrer">{a.image.credit}</a> : a.image.credit}.
            </figcaption>
          ) : null}
        </figure>

        <div className="prose">
          {a.blocks.map((b, i) => (b.t === "h" ? <h2 key={i}><Rich text={b.text} /></h2> : <p key={i}><Rich text={b.text} /></p>))}
        </div>

        <aside className="article__try">
          <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>try this</span>
          <h2>{a.tryThis.title}</h2>
          {a.tryThis.paras.map((p, i) => <p key={i}><Rich text={p} /></p>)}
          <Link href={`/rooms?family=${a.families.join(",")}`} className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 6 }}>
            Build this room in {a.families.map((f) => familyById(f).label).join(" + ")}
          </Link>
        </aside>

        <section className="article__object">
          {a.objectImage ? <ObjectPhoto image={a.objectImage} /> : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: "1 1 300px", minWidth: 0 }}>
            <span className="edit-card__meta">The take-home edit</span>
            <h2 style={{ fontSize: 30 }}><Rich text={a.object.name} /></h2>
            {a.takeHome.paras.map((p, i) => <p key={i}><Rich text={p} /></p>)}
            <p className="muted" style={{ fontSize: 15 }}>{a.object.notes}</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{a.object.meta}</p>
            <a href={a.object.href} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" style={{ alignSelf: "flex-start" }}>
              {a.object.cta}<Icon name="external" size={18} />
            </a>
          </div>
        </section>

        <section className="article__refs">
          <h2>References</h2>
          <ol>
            {a.references.map((r, i) => (
              <li key={i}>{r.before} <a href={r.href} target="_blank" rel="noopener noreferrer">{r.label}</a><Rich text={r.after} /></li>
            ))}
          </ol>
        </section>
      </article>

      <section style={{ marginTop: 72 }}>
        <h2 className="h-section" style={{ marginBottom: 28 }}>Keep reading</h2>
        <div className="edit-grid">{others.map((x) => <ArticleCard key={x.slug} a={x} />)}</div>
      </section>
    </div>
  );
}
