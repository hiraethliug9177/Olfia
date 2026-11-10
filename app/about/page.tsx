import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

/** Tiffany's About text (2026-11-10), unchanged. */
const LETTER = [
  "Olfia began as a capstone project at USC, but grew from a simple curiosity: why do certain places stay with us, even long after we've left?",
  "I've always been drawn to the little details that give a place its character. The afternoon light through a window, a familiar corner of a room, or a scent that unexpectedly brings back a memory. I think scent has a particularly quiet way of making a space our own. Sometimes it reminds us of somewhere we've been. Other times, something unfamiliar slowly becomes part of our everyday lives, until one day it simply smells like home.",
  "Through Olfia, I wanted to explore how people connect with their spaces through scent, and how something so intangible can become deeply personal. It's a place to follow your curiosity, learn about the stories behind different fragrances, and discover what feels right for you.",
  "More than finding a fragrance that smells good, I hope Olfia encourages you to notice the little things that make a space feel like yours, in whatever form home takes.",
];

const BELIEFS = [
  { t: "A sense of place", d: "A scent belongs to a room and a moment, not only to a bottle.", c: "#A0A6C8", bg: "var(--peri-soft)" },
  { t: "Self-expression", d: "A familiar fragrance can be a routine; an imagined room can be a beginning.", c: "#E7B49F", bg: "var(--apricot-soft)" },
  { t: "Memory and ritual", d: "Keep the detail worth remembering, with as little effort as possible.", c: "#9DB28A", bg: "var(--moss-soft)" },
];

export default function AboutPage() {
  const [first, ...rest] = LETTER;
  return (
    <div className="wrap page" style={{ display: "flex", flexDirection: "column", gap: 64 }}>
      <header className="split-head" style={{ marginBottom: 0 }}>
        <h1 className="h-page">About Olfia</h1>
        <p className="lead">Make your scent, create your rooms.</p>
      </header>

      <article className="letter">
        <span className="tape tape--a" aria-hidden="true" />
        <span className="tape tape--b" aria-hidden="true" />
        <p className="letter__first">{first}</p>
        <div className="letter__body">
          {rest.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="letter__sign">
          <span className="hand" style={{ fontSize: 34 }}>Tiffany Liu</span>
          <a href="mailto:tliu3694@usc.edu" className="hero__link" style={{ fontSize: 16 }}>Say hello</a>
        </div>
      </article>

      <section style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
        <div className="card" style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: 10, background: "var(--peri-soft)" }}>
          <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>the name</span>
          <h2 className="h-section" style={{ fontSize: 34 }}>Olfactory, and utopia.</h2>
          <p style={{ margin: 0 }}>Utopia holds two old Greek words: <em>eu-topos</em>, a good place, and <em>ou-topos</em>, no place. Olfia is for both: the rooms you live in and the ones you only imagine.</p>
        </div>
        <div className="card" style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: 10, background: "var(--apricot-soft)" }}>
          <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>the idea</span>
          <h2 className="h-section" style={{ fontSize: 34 }}>Scent is an afterimage.</h2>
          <p style={{ margin: 0 }}>Like the soft shape that lingers after you look away, a scent outlasts its moment in a room and comes back as an impression. Olfia keeps that impression, so you can return to it.</p>
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <h2 className="h-section">What we believe</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {BELIEFS.map((b) => (
            <div key={b.t} className="card" style={{ display: "flex", flexDirection: "column", gap: 10, background: b.bg }}>
              <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: "50%", background: b.c, boxShadow: "0 0 0 4px #fff" }} />
              <h3 style={{ margin: 0, fontSize: 24 }}>{b.t}</h3>
              <p style={{ margin: 0 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <p style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Link href="/library" className="btn btn--moss">Scent Library</Link>
        <Link href="/edit" className="btn btn--ghost">The Olfia Edit</Link>
      </p>
    </div>
  );
}
