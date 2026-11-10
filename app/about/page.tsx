import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

const BELIEFS = [
  { t: "A sense of place", d: "A scent belongs to a room and a moment, not only to a bottle.", c: "#A0A6C8" },
  { t: "Self-expression", d: "A familiar fragrance can be a routine; an imagined room can be a beginning.", c: "#E7B49F" },
  { t: "Memory and ritual", d: "Keep the detail worth remembering, with as little effort as possible.", c: "#9DB28A" },
];

export default function AboutPage() {
  return (
    <div className="wrap page" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 className="h-page">About <em>Olfia</em></h1>
        <p className="lead">Make your scent, create your rooms.</p>
      </header>
      <section style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
        <div className="card" style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>the name</span>
          <h2 className="h-section" style={{ fontSize: 32 }}>Olfactory, and utopia.</h2>
          <p style={{ margin: 0 }}>Utopia holds two old Greek words: <em>eu-topos</em>, a good place, and <em>ou-topos</em>, no place. Olfia is for both: the rooms you live in and the ones you only imagine.</p>
        </div>
        <div className="card" style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>the idea</span>
          <h2 className="h-section" style={{ fontSize: 32 }}>Scent is an afterimage.</h2>
          <p style={{ margin: 0 }}>Like the soft shape that lingers after you look away, a scent outlasts its moment in a room and comes back as an impression. Olfia keeps that impression, so you can return to it.</p>
        </div>
      </section>
      <section style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <h2 className="h-section">What we <em>believe</em></h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {BELIEFS.map((b) => (
            <div key={b.t} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: "50%", background: b.c, boxShadow: "0 0 0 4px #fff" }} />
              <h3 style={{ margin: 0, fontSize: 22 }}>{b.t}</h3>
              <p style={{ margin: 0 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 760 }}>
        <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>the founder</span>
        <h2 className="h-section" style={{ fontSize: 32 }}>Tiffany Liu</h2>
        <p style={{ margin: 0 }}>Olfia started as a DSM596 capstone at USC, built from interviews and a survey of people who shape the scent of their homes. TODO(Tiffany): a few lines in your own words.</p>
        <a href="mailto:tliu3694@usc.edu" style={{ fontWeight: 600 }}>Say hello</a>
      </section>
      <p><Link href="/library" className="hero__link">Scent Library</Link></p>
    </div>
  );
}
