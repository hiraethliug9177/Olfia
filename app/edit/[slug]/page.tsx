import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, articleBySlug, relatedTo } from "@/lib/edit";
import { FAMILY_WASH } from "@/lib/colors";
import type { FamilyId } from "@/lib/types";
import { ArticleCover } from "@/components/edit/ArticleCover";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { TopicTag } from "@/components/edit/TopicTag";
import { StoryWhen } from "@/components/edit/StoryWhen";
import { ObjectPhoto } from "@/components/edit/ObjectPhoto";
import { Rich } from "@/components/edit/Rich";
import { Icon } from "@/components/ui/Icon";
import { ProductLink } from "@/components/products/ProductLink";
import { SITE_URL, shareImageFor } from "@/lib/share";
import { ShareRow } from "@/components/edit/ShareRow";
import { StoryRelated } from "@/components/edit/StoryRelated";

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

/** The Try This card takes the colour of the story's scent: its families' washes, blended the way a scene's glow is. */
function scentWash(families: FamilyId[]): string {
  const washes = families.map((id) => FAMILY_WASH[id]);
  return washes.length > 1 ? `linear-gradient(135deg, ${washes.join(", ")})` : washes[0];
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const others = relatedTo(a);
  const pinImage = shareImageFor(a.image)[0].url;
  return (
    <div className="wrap page">
      {/* 11/18 (Tiffany): on a computer the story sits in the middle, Recreate This at Home on the left and Try This
          on the right, all in one page scroll. On narrower screens they stack: story, Try This, the rest, Recreate.
          Later on 11/18: on a computer the back link, title and line above the picture run the full page width. */}
      <article className="article">
        <header className="article__head">
          <Link href="/edit" className="article__back"><Icon name="arrowLeft" size={18} />The Olfia Edit</Link>
          <div className="article__meta">
            <TopicTag topic={a.topic} label={a.kicker} />
            <StoryWhen a={a} />
          </div>
          <h1 className="h-page article__title">{a.title}</h1>
          <p className="lead article__dek">{a.dek}</p>
        </header>

        <div className="article__body">
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
        </div>

        <aside id="try" className="story-side article__try anchor" aria-labelledby="try-h">
          <h2 id="try-h" className="story-side__h">Try This</h2>
          <div className="story-card" style={{ background: scentWash(a.families) }}>
            <h3 className="story-card__head">{a.tryThis.title}</h3>
            {a.tryThis.paras.map((p, i) => <p key={i}><Rich text={p} /></p>)}
            {/* 11/18 (Tiffany): the button says only this; the room still opens in the story's families */}
            <Link href={`/rooms?family=${a.families.join(",")}`} className="btn btn--primary btn--sm story-card__btn">Build This Room</Link>
          </div>
        </aside>

        <div className="article__end">
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
        </div>

        <StoryRelated families={a.families} />
      </article>

      <section style={{ marginTop: 72 }}>
        <h2 className="h-section" style={{ marginBottom: 28 }}>Keep reading</h2>
        <div className="edit-grid">{others.map((x) => <ArticleCard key={x.slug} a={x} />)}</div>
      </section>
    </div>
  );
}
