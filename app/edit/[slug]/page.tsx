import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, articleBySlug, articleDate, relatedTo } from "@/lib/edit";
import { familyById } from "@/lib/catalog";
import { ArticleCover } from "@/components/edit/ArticleCover";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { TopicTag } from "@/components/edit/TopicTag";
import { ObjectPhoto } from "@/components/edit/ObjectPhoto";
import { Rich } from "@/components/edit/Rich";
import { Icon } from "@/components/ui/Icon";
import { ProductLink } from "@/components/products/ProductLink";
import { SITE_URL, shareImageFor } from "@/lib/share";
import { ShareRow } from "@/components/edit/ShareRow";
import { StoryRelated } from "@/components/edit/StoryRelated";
import { SignupForm } from "@/components/SignupForm";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return { title: "The Olfia Edit" };
  const images = shareImageFor(a.image);
  return {
    title: a.title,
    description: a.dek,
    openGraph: { type: "article", title: a.title, description: a.dek, siteName: "Olfia", publishedTime: a.date, images },
    twitter: { card: "summary_large_image", title: a.title, description: a.dek, images: images.map((i) => i.url) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const others = relatedTo(a);
  const pinImage = shareImageFor(a.image)[0].url;
  return (
    <div className="wrap page">
      <article className="article">
        <Link href="/edit" className="article__back"><Icon name="arrowLeft" size={18} />The Olfia Edit</Link>
        <div className="article__meta">
          <TopicTag topic={a.topic} label={a.kicker} />
          <span>{articleDate(a.date)} · {a.readTime}</span>
        </div>
        <h1 className="h-page article__title" style={{ margin: "16px 0" }}>{a.title}</h1>
        <p className="lead article__dek" style={{ maxWidth: "none" }}>{a.dek}</p>

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

        <aside id="try" className="article__try anchor">
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
            {a.object.notes ? <p className="muted" style={{ fontSize: 15 }}>{a.object.notes}</p> : null}
            {a.object.meta ? <p style={{ fontSize: 15, fontWeight: 600 }}>{a.object.meta}</p> : null}
            {a.object.href ? (
              <ProductLink href={a.object.href} product={{ id: `edit-${a.slug}`, family: a.families[0] }} place="edit" className="btn btn--ghost" style={{ alignSelf: "flex-start" }}>
                {a.object.cta ?? "Discover it"}<Icon name="external" size={18} />
              </ProductLink>
            ) : null}
          </div>
        </section>

        <section className="article__refs">
          <h2>References</h2>
          <ol>
            {a.references.map((r, i) => (
              <li key={i}>
                <Rich text={r.before} />{r.before && r.label ? " " : null}
                {r.label && r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer">{r.label}</a> : r.label ?? null}
                {r.after ? <Rich text={r.after} /> : null}
              </li>
            ))}
          </ol>
        </section>

        <ShareRow
          url={`${SITE_URL}/edit/${a.slug}`}
          title={a.title}
          image={pinImage.startsWith("/") ? `${SITE_URL}${pinImage}` : pinImage}
          slug={a.slug}
        />
      </article>

      <StoryRelated families={a.families} />

      <section className="story-signup" aria-label="Email sign-up">
        <div className="story-signup__brand">
          <span className="story-signup__mark">Olfia</span>
          <span className="muted">For the rooms you live in, and the ones you imagine.</span>
        </div>
        <SignupForm place="story" />
      </section>

      <section style={{ marginTop: 72 }}>
        <h2 className="h-section" style={{ marginBottom: 28 }}>Keep reading</h2>
        <div className="edit-grid">{others.map((x) => <ArticleCard key={x.slug} a={x} />)}</div>
      </section>
    </div>
  );
}
