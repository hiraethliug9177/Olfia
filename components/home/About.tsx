"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { strings } from "@/lib/strings";

/**
 * 04 About Olfia, all on Home (v2, Tiffany's Notion 11/23; her answer 5 "全部放首页"; /about is gone, answer 19).
 * Told in order, like a small booklet: The Concept, How it Works, The Creator. Her five devices are all here:
 * the long scroll, a contents list that lights the part being read (a narrow column on a computer, a row of tabs
 * under the header on a phone, shown only inside this section), links to each part (/#concept, /#how-it-works,
 * /#creator), a source for the family system, and the loop, which stays put while its steps change.
 */

const PARTS = [
  { id: "concept", label: "The Concept" },
  { id: "how-it-works", label: "How it Works" },
  { id: "creator", label: "The Creator" },
] as const;

/** Some brand lines are written without a closing mark; shown as a sentence, they get a full stop. */
const sentence = (s: string) => (/[.?!…]$/.test(s) ? s : `${s}.`);

type Step = { id: string; name: string; icon: IconName; line: string; does: string; href: string; cta: string };

/**
 * The Sensory Living Loop (her Notion drawing): Discover → Rooms → Capture → Share, with the Scent Atlas in the
 * middle. The large line of each step is one of her brand lines. The small lines for Rooms, Capture and the Atlas
 * are her 11/23 feature lines; the Discover and Share lines are Claude's drafts (11/23), hers to rewrite.
 */
const STEPS: Step[] = [
  { id: "discover", name: "Discover", icon: "compass", line: strings.brand.awareness, does: "Learn the seven scent families, take the quiz, and find a scent to give.", href: "/scentpedia", cta: "Open Scentpedia" },
  { id: "rooms", name: "Rooms", icon: "doorOpen", line: strings.brand.explore, does: "Design your space with the ideal scent in mind.", href: "/rooms", cta: "Design your space" },
  { id: "capture", name: "Capture", icon: "penLine", line: strings.brand.capture, does: "Keep a scent you noticed in the moment.", href: "/capture", cta: "Start the capture" },
  { id: "share", name: "Share", icon: "share", line: strings.brand.card, does: "Turn a scent you kept into a card you can send.", href: "/card", cta: "Make a Scent Card" },
  { id: "atlas", name: "Scent Atlas", icon: "map", line: strings.brand.atlas, does: "Your personal scent archive, full of memories.", href: "/atlas", cta: "Open your Scent Atlas" },
];

/**
 * The Creator, first person. Claude's draft (11/23) from her Notion notes, as she asked ("copywriting可以从我这个角度
 * 出发完善一下"); hers to rewrite. Her photo goes beside it when she sends one.
 */
const CREATOR = [
  "I’m a graduate student at USC Annenberg, and Olfia is my capstone project.",
  "It began with two habits of mine: paying attention to fragrance and how it shapes my wellbeing, and planning and looking back on the small rituals that make up my days.",
  "Having lived in both China and the United States, I noticed how differently people scent their homes, their ceremonies and their seasons.",
  "I’m drawn to aesthetics, modern art and cultural anthropology, and to botany, the environment, and what cultures around the world, including Indigenous communities, know about plants. They all lead me back to one question: how do we remember a place through its smell? Olfia is my answer in progress.",
];

/**
 * Spokes from the Atlas to the four outer steps (top, right, bottom, left), and four arrowheads on the ring
 * (clockwise). Each spoke runs from the edge of the middle circle to the edge of the outer one; the one going down
 * starts below the "Scent Atlas" name.
 */
const SPOKES = [[0, -1, 46], [1, 0, 46], [0, 1, 88], [-1, 0, 46]].map(([dx, dy, from]) => ({
  x1: 200 + dx * from, y1: 200 + dy * from, x2: 200 + dx * 118, y2: 200 + dy * 118,
}));
const ARROWS = [-45, 45, 135, 225].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: 200 + 150 * Math.cos(a), y: 200 + 150 * Math.sin(a), turn: deg + 90 };
});

/** The loop stays on screen while its five steps pass, one lit node and one line at a time. */
function Loop() {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  useEffect(() => {
    const el = box.current;
    const stage = el?.querySelector<HTMLElement>(".loop__stage");
    if (!el || !stage) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const room = r.height - stage.offsetHeight;
      const p = room > 0 ? Math.min(1, Math.max(0, (top - r.top) / room)) : 0;
      setOn(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => {
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const atlas = on === STEPS.length - 1;
  return (
    <div ref={box} className="loop">
      <div className="loop__stage">
        <div className="loop__ring" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="loop__svg">
            <circle cx="200" cy="200" r="150" className="loop__track" />
            {SPOKES.map((l, i) => (
              <line key={i} {...l} className="loop__spoke" data-on={atlas || i === on || undefined} />
            ))}
            {ARROWS.map((a, i) => (
              <path key={i} d="M -5 -6 L 3 0 L -5 6" className="loop__arrow" transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${a.turn})`} />
            ))}
          </svg>
          {STEPS.map((s, i) => (
            <span key={s.id} className={`loop__node loop__node--${s.id}`} data-on={i === on || undefined}>
              <span className="loop__dot"><Icon name={s.icon} size={s.id === "atlas" ? 28 : 24} /></span>
              <span className="loop__name">{s.name}</span>
            </span>
          ))}
        </div>
        <ol className="loop__steps">
          {STEPS.map((s, i) => (
            <li key={s.id} className="loop__step" data-on={i === on || undefined}>
              <span className="sr-only">{s.name}: </span>
              <p className="loop__line">{sentence(s.line)}</p>
              <p className="loop__does">{s.does}</p>
              <Link href={s.href} className="hero__link" tabIndex={i === on ? undefined : -1}>{s.cta}</Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
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
            <div className="about__concept">
              <div className="about__idea">
                <p className="about__big">Scent is an afterimage.</p>
                <p>Like the soft shape that lingers after you look away, a scent outlasts its moment in a room and comes back as an impression. Olfia keeps that impression, so you can return to it.</p>
              </div>
              <div className="about__idea about__idea--name">
                <p className="about__big">Olfactory, and utopia.</p>
                <p>Utopia holds two old Greek words: <em>eu-topos</em>, a good place, and <em>ou-topos</em>, no place. Olfia is for both: the rooms you live in and the ones you only imagine.</p>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="about__part" aria-labelledby="how-h">
            <h3 id="how-h" className="about__h" tabIndex={-1}>How it Works</h3>
            <Loop />
            <div className="about__more">
              <div className="about__note">
                {/* her Notion note, put into English by Claude (11/23); hers to check */}
                <h4 className="about__h4">Where the seven families come from</h4>
                <p>Olfia’s seven families start from Michael Edwards’ Fragrance Wheel. Its four main families, Fresh, Floral, Amber and Woody, are the frame; Citrus &amp; Fruit and Gourmand are split out the way home-fragrance shelves sort them.</p>
                <p className="about__cite">
                  <a href="https://fragrancesoftheworld.com/" target="_blank" rel="noopener noreferrer">Fragrances of the World<Icon name="external" size={18} /></a>
                </p>
              </div>
              <div className="about__note">
                <h4 className="about__h4">Where new ideas come from</h4>
                <div className="about__tiles">
                  <Link href="/edit" className="about__tile">
                    <Icon name="newspaper" size={24} />
                    <span className="about__tile-name">The Olfia Edit</span>
                    <span className="about__tile-line">Culture, fragrance, and the art of living.</span>
                  </Link>
                  <Link href="/gifts" className="about__tile">
                    <Icon name="gift" size={24} />
                    <span className="about__tile-name">Olfia · Gifts</span>
                    <span className="about__tile-line">A scent for your room, or someone else’s.</span>
                  </Link>
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
                <p className="letter__first">{CREATOR[0]}</p>
                <div className="letter__body">
                  {CREATOR.slice(1).map((p) => <p key={p}>{p}</p>)}
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
