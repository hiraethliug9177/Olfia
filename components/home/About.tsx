"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CardDeck } from "@/components/ui/CardDeck";
import { Stamp } from "@/components/scene/Stamp";
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
 * Later the same day (her screenshots and "Tactile Card Deck Interaction System", modern skeuomorphic style):
 * - every part is a deck of cards leafed through with two buttons (components/ui/CardDeck): The Concept on landscape
 *   index cards (with drop caps and marked words, her note that night), How it Works in folders with tabs, The Creator's
 *   letter cards unchanged; The Science's two receipts sit side by side instead (her note that night);
 * - the two notes that sat under How it Works are now their own part, The Science (/#science), before The Creator;
 * - her photo is in the Creator's frame (public/assets/about/creator.webp, cut to 4:5, photo data removed).
 * The words are unchanged.
 */

const PARTS = [
  { id: "concept", label: "The Concept" },
  { id: "how-it-works", label: "How it Works" },
  { id: "science", label: "The Science" },
  { id: "creator", label: "The Creator" },
] as const;

/** Where each folder's tab sits along its top edge, as in a drawer of real folders (thirds, in turn). */
const TAB_AT = ["3%", "35%", "67%"] as const;

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

/**
 * Words marked on The Concept's index cards, per card and paragraph (her note of 11/24: "像 the creator 那里给段落增加更丰富
 * 的视觉元素"; the picks are Claude's, for her to change). Same four marks as the letter.
 */
const CONCEPT_MARKS: Mark[][][] = [
  [
    [{ text: "recognize before you remember", kind: "hl" }, { text: "an entire scene to mind", kind: "b" }],
    [{ text: "cues to personal experiences", kind: "hl2" }, { text: "The associations are individual", kind: "u" }, { text: "an impression of it remains", kind: "hl" }],
    [{ text: "a place to live in words and images", kind: "b" }],
  ],
  [
    [{ text: "olfactory, our sense of smell", kind: "hl" }, { text: "the ones we are still imagining", kind: "u" }],
    [{ text: "an atmosphere shaped by what happens in it", kind: "hl2" }, { text: "smellscape", kind: "b" }],
    [{ text: "often overlooked dimension of a space", kind: "hl" }, { text: "an invitation to imagine an atmosphere", kind: "u" }],
  ],
  [
    [{ text: "without much ceremony", kind: "u" }, { text: "Fragrance is already woven into these activities", kind: "hl" }],
    [{ text: "everyday aesthetics", kind: "b" }, { text: "Both are part of its character.", kind: "hl2" }],
    [{ text: "notice these changes and experiment with them", kind: "hl" }, { text: "Your own experiences are the starting point.", kind: "b" }],
  ],
  [
    [{ text: "tells us something about its inhabitants", kind: "hl" }, { text: "learned through particular places, families, and communities", kind: "u" }],
    [{ text: "the smell of historic libraries", kind: "hl2" }, { text: "walking through a place with attention to smell", kind: "b" }],
    [{ text: "the plants, ingredients, and traditions behind fragrance", kind: "hl" }, { text: "the many meanings people give them", kind: "u" }],
  ],
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
      {/* her note (11/24 evening): the line beside the title ("Make your scent, create your rooms.") is removed */}
      <div className="split-head">
        <h2 id="about-title" className="h-section">About Olfia</h2>
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
            <CardDeck
              label="The Concept"
              look="vocabulary-card"
              head={<h3 id="concept-h" className="about__h" tabIndex={-1}>The Concept</h3>}
              cards={CONCEPT.map((c, ci) => ({
                key: c.theme,
                label: c.theme,
                content: (
                  <article className="vocab" aria-label={c.theme}>
                    <h4 className="about__big vocab__title">{c.title}</h4>
                    <div className="vocab__lines">
                      {c.paragraphs.map((t, pi) => {
                        const marks = (CONCEPT_MARKS[ci]?.[pi] ?? []).filter((m) => !(pi === 0 && t.startsWith(m.text)));
                        return pi === 0 ? (
                          <p key={t.slice(0, 32)}><span className="dropcap" aria-hidden="true">{t[0]}</span><span className="sr-only">{t[0]}</span>{marked(t.slice(1), marks)}</p>
                        ) : (
                          <p key={t.slice(0, 32)}>{marked(t, marks)}</p>
                        );
                      })}
                    </div>
                  </article>
                ),
              }))}
            />
          </section>

          {/* her note (11/24 evening): no white panel behind How it Works (its cards are unchanged), and its two lines are
              one paragraph in the lead's style across the full width */}
          <section id="how-it-works" className="about__part" aria-labelledby="how-h">
            <CardDeck
              label="How it Works"
              look="file-folder"
              head={<h3 id="how-h" className="about__h" tabIndex={-1}>How it Works</h3>}
              intro={<p className="lead page-lead" style={{ margin: 0 }}>{HOW_IT_WORKS.title} {HOW_IT_WORKS.lead}</p>}
              cards={ways.map((pair, i) => ({
                key: pair.map((e) => e.feature).join("+"),
                label: pair.map((e) => e.feature).join(" and "),
                content: (
                  <div className="folder" style={{ "--tab-at": TAB_AT[i % TAB_AT.length] } as CSSProperties}>
                    <span className="folder__tab" aria-hidden="true">
                      {pair.map((e) => <Icon key={e.feature} name={ENTRY_LOOK[e.feature].icon} size={20} />)}
                    </span>
                    <article className={`folder__body ways-card${pair.length === 1 ? " ways-card--solo" : ""}`}>
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
                  </div>
                ),
              }))}
            />
          </section>

          {/* her screenshot (11/24): "还是在这个区域单开一个 The Science Section 来承载这些内容吧" — the two notes, unchanged */}
          <section id="science" className="about__part" aria-labelledby="science-h">
            {/* her note (11/24): "直接把两个卡片并排展示吧" — the two receipts side by side, same height */}
            <h3 id="science-h" className="about__h" tabIndex={-1}>The Science</h3>
            <div className="receipts">
              <div className="receipt-wrap">
              <article className="receipt" aria-labelledby="science-families">
                <h4 id="science-families" className="about__h4 receipt__h">{HOW_IT_WORKS.families.title}</h4>
                <p className="receipt__p">{HOW_IT_WORKS.families.body}</p>
                <div className="about__links receipt__foot">
                  <Link href="/scentpedia" className="btn btn--primary">Explore Scentpedia</Link>
                  <a href="https://fragrancesoftheworld.com/" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                    Fragrances of the World<Icon name="external" size={18} />
                  </a>
                </div>
              </article>
              </div>
              <div className="receipt-wrap receipt-wrap--b">
              <article className="receipt" aria-labelledby="science-ideas">
                <h4 id="science-ideas" className="about__h4 receipt__h">{HOW_IT_WORKS.ideasTitle}</h4>
                <div className="receipt__items">
                  {HOW_IT_WORKS.ideas.map((t) => (
                    <Link key={t.name} href={t.name === "The Olfia Edit" ? "/edit" : "/gifts"} className="receipt__item">
                      <Icon name={t.name === "The Olfia Edit" ? "newspaper" : "gift"} size={24} />
                      <span className="receipt__item-name">{t.name}</span>
                      <span className="receipt__item-line">{t.line}</span>
                    </Link>
                  ))}
                </div>
              </article>
              </div>
            </div>
          </section>

          <section id="creator" className="about__part" aria-labelledby="creator-h">
            <CardDeck
              label="A letter from the creator"
              look="existing-creator-card"
              head={<h3 id="creator-h" className="about__h" tabIndex={-1}>The Creator</h3>}
              aside={
                <figure className="about__photo">
                  <span className="tape tape--a" aria-hidden="true" />
                  <span className="tape tape--b" aria-hidden="true" />
                  {/* her photo (11/24), cut to the frame's 4:5 */}
                  <img className="about__photo-img" src="/assets/about/creator.webp" width={800} height={1000} alt="Tiffany Liu" />
                  <span className="sticker sticker--rose" aria-hidden="true"><img src="/assets/materials/floral-rose.webp" alt="" /></span>
                  <span className="sticker sticker--lavender" aria-hidden="true"><img src="/assets/materials/green-lavender.webp" alt="" /></span>
                  <span className="sticker sticker--orange" aria-hidden="true"><img src="/assets/materials/citrus-orange-slice.webp" alt="" /></span>
                  <span className="sticker sticker--stamp" aria-hidden="true"><Stamp family="woody" size={70} rot={-10} /></span>
                </figure>
              }
              cards={CREATOR_LETTER.map((t, i) => ({
                key: t.slice(0, 32),
                label: `${i + 1} / ${CREATOR_LETTER.length}`,
                content: (
                  <article className="letter-card">
                    {/* the first letter is its own span so "I’m" keeps its apostrophe at text size */}
                    <p><span className="dropcap" aria-hidden="true">{t[0]}</span><span className="sr-only">{t[0]}</span>{marked(t.slice(1), (LETTER_MARKS[i] ?? []).filter((m) => !t.startsWith(m.text)))}</p>
                    {i === CREATOR_LETTER.length - 1 ? (
                      <div className="letter__sign">
                        <span className="hand" style={{ fontSize: 34 }}>Tiffany Liu</span>
                        <a href="mailto:tliu3694@usc.edu" className="hero__link" style={{ fontSize: 16 }}>Say hello</a>
                      </div>
                    ) : null}
                  </article>
                ),
              }))}
            />
          </section>
        </div>
      </div>
    </section>
  );
}
