"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CardRail } from "@/components/ui/CardRail";
import { Stamp } from "@/components/scene/Stamp";
import { strings } from "@/lib/strings";
import { CONCEPT, CREATOR_LETTER, HOW_IT_WORKS } from "@/lib/copy/about";

/**
 * 04 About Olfia, all on Home (v2, Tiffany's Notion 11/23; her answer 5 "全部放首页"; /about is gone, answer 19).
 * Told in order, like a small booklet: The Concept, How it Works, The Creator, with a contents list that lights the
 * part being read (a narrow column on a computer, a row of tabs under the header on a phone) and links to each part
 * (/#concept, /#how-it-works, /#creator).
 * Copy v1 (Tiffany 11/24, lib/copy/about.ts). Design round (her annotated screenshots, 11/24):
 * - The Concept: the four parts are cards that scroll sideways, titles in bold, each part within one screen.
 * - How it Works: the whole part on white; the five entries sit two to a card, cards the size of The Concept's,
 *   pictures sized to their text.
 * - The two notes below it share one height; the two links are buttons. Research notes are gone everywhere.
 * - The Creator: tape and stickers on the photo; the letter's paragraphs are cards like The Concept's, each opening
 *   with a large first letter, with a few words marked as in a journal (highlighter, bold, a wavy underline).
 */

const PARTS = [
  { id: "concept", label: "The Concept" },
  { id: "how-it-works", label: "How it Works" },
  { id: "creator", label: "The Creator" },
] as const;

/** How it Works: each entry's picture (the site's collage materials), icon and link; the words are Tiffany's (§1.6). */
const ENTRY_LOOK: Record<string, { icon: IconName; href: string; img: string }> = {
  Discover: { icon: "compass", href: "/scentpedia", img: "/assets/furniture/books-old.webp" },
  Rooms: { icon: "doorOpen", href: "/rooms", img: "/assets/furniture/seat-armchair.webp" },
  Capture: { icon: "penLine", href: "/capture", img: "/assets/sources/source-candle.webp" },
  Share: { icon: "share", href: "/card", img: "/assets/furniture/postcards.webp" },
  "Scent Atlas": { icon: "map", href: "/atlas", img: "/assets/furniture/letters.webp" },
};

/**
 * Words marked in the Creator letter, per paragraph (Claude's picks for her to change). Each phrase is looked up in
 * her text as written; a phrase that is no longer there is simply not marked.
 * hl = apricot highlighter, hl2 = periwinkle highlighter, b = bold, u = wavy underline.
 */
type Mark = { text: string; kind: "hl" | "hl2" | "b" | "u" };
const LETTER_MARKS: Mark[][] = [
  [{ text: "two habits of mine", kind: "hl" }, { text: "paying attention to fragrance", kind: "b" }, { text: "document and reflect", kind: "hl2" }, { text: "personal and approachable", kind: "u" }],
  [{ text: "China and the United States", kind: "hl2" }, { text: "scent their homes, mark the seasons", kind: "hl" }, { text: "an entirely different association", kind: "b" }],
  [{ text: "aesthetics, modern art, and cultural anthropology", kind: "hl" }, { text: "a larger sensory experience", kind: "b" }, { text: "the stories they carry", kind: "u" }],
  [{ text: "making room for that curiosity", kind: "b" }, { text: "the atmosphere of their homes", kind: "hl2" }, { text: "keeping the experiences they want to remember", kind: "hl" }],
];

function marked(text: string, marks: Mark[]): ReactNode {
  const found = marks
    .map((m) => ({ ...m, at: text.indexOf(m.text) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: ReactNode[] = [];
  let i = 0;
  for (const m of found) {
    if (m.at < i) continue;
    out.push(text.slice(i, m.at));
    out.push(<span key={m.at} className={`mark-${m.kind}`}>{m.text}</span>);
    i = m.at + m.text.length;
  }
  out.push(text.slice(i));
  return out.map((n, k) => <Fragment key={k}>{n}</Fragment>);
}

function pairs<T>(xs: readonly T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += 2) out.push(xs.slice(i, i + 2));
  return out;
}

export function About() {
  const [cur, setCur] = useState<string>(PARTS[0].id);
  const toc = useRef<HTMLUListElement>(null);
  // on a phone the tabs scroll sideways: keep the lit one in view (sideways only, the page itself does not move)
  useEffect(() => {
    const ul = toc.current;
    const a = ul?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!ul || !a || ul.scrollWidth <= ul.clientWidth) return;
    const left = a.offsetLeft;
    if (left < ul.scrollLeft) ul.scrollLeft = left - 8;
    else if (left + a.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollLeft = left + a.offsetWidth - ul.clientWidth + 8;
  }, [cur]);
  // the contents list lights the part that crosses a band a third of the way down the screen
  useEffect(() => {
    const els = PARTS.map((p) => document.getElementById(p.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setCur(e.target.id); },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  // a click scrolls smoothly (at once with reduced motion), keeps the part's link in the address, and moves focus to it
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const part = document.getElementById(id);
    if (!part) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    part.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    part.querySelector<HTMLElement>(".about__h")?.focus({ preventScroll: true });
    setCur(id);
  };

  const ways = pairs(HOW_IT_WORKS.entries);

  return (
    <section id="about" className="wrap section" aria-labelledby="about-title">
      <div className="split-head">
        <h2 id="about-title" className="h-section">About Olfia</h2>
        <p className="lead split-head__end">{strings.brand.cover}</p>
      </div>
      <div className="about">
        <nav className="about__toc" aria-label="About Olfia">
          <ul ref={toc}>
            {PARTS.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} aria-current={cur === p.id ? "true" : undefined} onClick={(e) => go(e, p.id)}>{p.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="about__body">
          <section id="concept" className="about__part" aria-labelledby="concept-h">
            <CardRail label="The Concept" className="rail--concept" head={<h3 id="concept-h" className="about__h" tabIndex={-1}>The Concept</h3>}>
              {CONCEPT.map((c) => (
                <article key={c.theme} className="about__idea" aria-label={c.theme}>
                  <h4 className="about__big">{c.title}</h4>
                  {c.paragraphs.map((t) => <p key={t.slice(0, 32)}>{t}</p>)}
                </article>
              ))}
            </CardRail>
          </section>

          <section id="how-it-works" className="about__part about__part--white" aria-labelledby="how-h">
            <CardRail
              label="How it Works"
              className="rail--ways"
              head={<h3 id="how-h" className="about__h" tabIndex={-1}>How it Works</h3>}
              intro={<><h4 className="about__h4">{HOW_IT_WORKS.title}</h4><p className="lead" style={{ margin: 0 }}>{HOW_IT_WORKS.lead}</p></>}
            >
              {ways.map((pair) => (
                <article key={pair.map((e) => e.feature).join("+")} className={`ways-card${pair.length === 1 ? " ways-card--solo" : ""}`}>
                  {pair.map((e) => {
                    const look = ENTRY_LOOK[e.feature];
                    return (
                      <div key={e.feature} className="way">
                        <figure className="way__pic" aria-hidden="true"><img src={look.img} alt="" loading="lazy" /></figure>
                        <div className="way__text">
                          <span className="way__feature"><Icon name={look.icon} size={20} />{e.feature}</span>
                          <h4 className="way__title">{e.title}</h4>
                          <p>{e.body}</p>
                          <Link href={look.href} className="hero__link">{e.cta}</Link>
                        </div>
                      </div>
                    );
                  })}
                </article>
              ))}
            </CardRail>
            <div className="about__more">
              <div className="about__note">
                <h4 className="about__h4">{HOW_IT_WORKS.families.title}</h4>
                <p>{HOW_IT_WORKS.families.body}</p>
                <div className="about__links">
                  <Link href="/scentpedia" className="btn btn--primary">Explore Scentpedia</Link>
                  <a href="https://fragrancesoftheworld.com/" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                    Fragrances of the World<Icon name="external" size={18} />
                  </a>
                </div>
              </div>
              <div className="about__note">
                <h4 className="about__h4">{HOW_IT_WORKS.ideasTitle}</h4>
                <div className="about__tiles">
                  {HOW_IT_WORKS.ideas.map((t) => (
                    <Link key={t.name} href={t.name === "The Olfia Edit" ? "/edit" : "/gifts"} className="about__tile">
                      <Icon name={t.name === "The Olfia Edit" ? "newspaper" : "gift"} size={24} />
                      <span className="about__tile-name">{t.name}</span>
                      <span className="about__tile-line">{t.line}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="creator" className="about__part" aria-labelledby="creator-h">
            <CardRail
              label="A letter from the creator"
              className="rail--letter"
              head={<h3 id="creator-h" className="about__h" tabIndex={-1}>The Creator</h3>}
              aside={
                // TODO(Tiffany): her photo (public/assets/about/creator.webp, 4:5) replaces the blank frame
                <figure className="about__photo" aria-hidden="true">
                  <span className="tape tape--a" />
                  <span className="tape tape--b" />
                  <span className="about__photo-blank"><Icon name="user" size={40} /></span>
                  <span className="sticker sticker--rose"><img src="/assets/materials/floral-rose.webp" alt="" /></span>
                  <span className="sticker sticker--lavender"><img src="/assets/materials/green-lavender.webp" alt="" /></span>
                  <span className="sticker sticker--orange"><img src="/assets/materials/citrus-orange-slice.webp" alt="" /></span>
                  <span className="sticker sticker--stamp"><Stamp family="woody" size={70} rot={-10} /></span>
                </figure>
              }
            >
              {CREATOR_LETTER.map((t, i) => (
                <article key={t.slice(0, 32)} className="letter-card">
                  {/* the first letter is its own span so "I’m" keeps its apostrophe at text size */}
                  <p><span className="dropcap" aria-hidden="true">{t[0]}</span><span className="sr-only">{t[0]}</span>{marked(t.slice(1), (LETTER_MARKS[i] ?? []).filter((m) => !t.startsWith(m.text)))}</p>
                  {i === CREATOR_LETTER.length - 1 ? (
                    <div className="letter__sign">
                      <span className="hand" style={{ fontSize: 34 }}>Tiffany Liu</span>
                      <a href="mailto:tliu3694@usc.edu" className="hero__link" style={{ fontSize: 16 }}>Say hello</a>
                    </div>
                  ) : null}
                </article>
              ))}
            </CardRail>
          </section>
        </div>
      </div>
    </section>
  );
}
