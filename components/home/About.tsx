"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { strings } from "@/lib/strings";
import { CONCEPT, CREATOR_LETTER, HOW_IT_WORKS } from "@/lib/copy/about";
import { ResearchNotes } from "@/components/ui/Sources";

/**
 * 04 About Olfia, all on Home (v2, Tiffany's Notion 11/23; her answer 5 "全部放首页"; /about is gone, answer 19).
 * Told in order, like a small booklet: The Concept, How it Works, The Creator. Her five devices are all here:
 * the long scroll, a contents list that lights the part being read (a narrow column on a computer, a row of tabs
 * under the header on a phone, shown only inside this section), links to each part (/#concept, /#how-it-works,
 * /#creator) and research notes that fold open.
 * Copy v1 (Tiffany 11/24, docs/copy/olfia-site-copy-v1.md §1.6, data in lib/copy/about.ts): The Concept has four
 * editorial sections; How it Works is five independent entry points with their own links, in no set order (the loop,
 * its centre, arrows and step numbers are gone); The Creator is her four-paragraph letter.
 */

const PARTS = [
  { id: "concept", label: "The Concept" },
  { id: "how-it-works", label: "How it Works" },
  { id: "creator", label: "The Creator" },
] as const;

/**
 * How it Works: each entry has its own picture from the site's collage materials, its own line and its own link.
 * The feature names, titles, lines and links are Tiffany's (§1.6); the pictures and paths are the site's.
 */
const ENTRY_LOOK: Record<string, { icon: IconName; href: string; img: string }> = {
  Discover: { icon: "compass", href: "/scentpedia", img: "/assets/furniture/books-old.webp" },
  Rooms: { icon: "doorOpen", href: "/rooms", img: "/assets/furniture/seat-armchair.webp" },
  Capture: { icon: "penLine", href: "/capture", img: "/assets/sources/source-candle.webp" },
  Share: { icon: "share", href: "/card", img: "/assets/furniture/postcards.webp" },
  "Scent Atlas": { icon: "map", href: "/atlas", img: "/assets/furniture/letters.webp" },
};

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
            <h3 id="concept-h" className="about__h" tabIndex={-1}>The Concept</h3>
            <div className="about__concept about__concept--long">
              {CONCEPT.map((c) => (
                <article key={c.theme} className="about__idea" aria-label={c.theme}>
                  <h4 className="about__big">{c.title}</h4>
                  {c.paragraphs.map((t) => <p key={t.slice(0, 32)}>{t}</p>)}
                  <ResearchNotes ids={c.sources} note={c.note || undefined} />
                </article>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="about__part" aria-labelledby="how-h">
            <h3 id="how-h" className="about__h" tabIndex={-1}>How it Works</h3>
            <h4 className="about__h4">{HOW_IT_WORKS.title}</h4>
            <p className="lead">{HOW_IT_WORKS.lead}</p>
            <div className="ways">
              {HOW_IT_WORKS.entries.map((e) => {
                const look = ENTRY_LOOK[e.feature];
                return (
                  <article key={e.feature} className="way">
                    <figure className="way__pic" aria-hidden="true"><img src={look.img} alt="" loading="lazy" /></figure>
                    <div className="way__text">
                      <span className="way__feature"><Icon name={look.icon} size={20} />{e.feature}</span>
                      <h4 className="way__title">{e.title}</h4>
                      <p>{e.body}</p>
                      <Link href={look.href} className="hero__link">{e.cta}</Link>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="about__more">
              <div className="about__note">
                <h4 className="about__h4">{HOW_IT_WORKS.families.title}</h4>
                <p>{HOW_IT_WORKS.families.body}</p>
                <p className="about__cite">
                  <a href="https://fragrancesoftheworld.com/" target="_blank" rel="noopener noreferrer">Fragrances of the World<Icon name="external" size={18} /></a>
                  <Link href="/scentpedia" className="hero__link">Explore Scentpedia</Link>
                </p>
                <ResearchNotes ids={HOW_IT_WORKS.families.sources} />
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
            <h3 id="creator-h" className="about__h" tabIndex={-1}>The Creator</h3>
            <div className="about__creator">
              {/* TODO(Tiffany): her photo (public/assets/about/creator.webp, 4:5) replaces the blank frame */}
              <figure className="about__photo" aria-hidden="true">
                <span className="about__photo-blank"><Icon name="user" size={40} /></span>
              </figure>
              <article className="letter about__letter">
                <span className="tape tape--a" aria-hidden="true" />
                <div className="letter__body">
                  {CREATOR_LETTER.map((t) => <p key={t.slice(0, 32)}>{t}</p>)}
                </div>
                <div className="letter__sign">
                  <span className="hand" style={{ fontSize: 34 }}>Tiffany Liu</span>
                  <a href="mailto:tliu3694@usc.edu" className="hero__link" style={{ fontSize: 16 }}>Say hello</a>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
