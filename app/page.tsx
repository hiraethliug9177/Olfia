import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FamilyWheel } from "@/components/home/FamilyWheel";
import { ScenePage } from "@/components/scene/ScenePage";
import { PolaroidMini } from "@/components/card/PolaroidMini";
import { MOODS, baseLayout, stickersFor } from "@/lib/catalog";
import { strings } from "@/lib/strings";
import { QuizInvite } from "@/components/home/QuizInvite";
import { ARTICLES } from "@/lib/edit";
import { ArticleCover } from "@/components/edit/ArticleCover";
import { familyById } from "@/lib/catalog";

const galleryRooms = [
  { mood: MOODS[0], rot: -1.2, name: "Reading Corner", nick: "rain, chapter three", desc: "Cedar candle on the side table, the arc lamp on low." },
  { photo: "rgba(226,162,59,0.55)", h: 420, rot: 0.8, name: "Morning Kitchen", nick: "window open", desc: "Lemon peel, basil on the sill, coffee still warm." },
  { photo: "rgba(143,181,184,0.6)", h: 300, rot: -0.6, name: "Sunday Bath", nick: "slow steam", desc: "Sea salt diffuser and clean towels." },
  { mood: MOODS[1], rot: 1, name: "Reading Corner", nick: "first coffee", desc: "Same chair, a bright citrus morning." },
  { photo: "rgba(160,166,200,0.6)", h: 360, rot: -1, name: "Desk at Night", nick: "one more page", desc: "Lavender spray and a single lamp." },
  { mood: MOODS[2], rot: -0.8, name: "Reading Corner", nick: "a slow sunday", desc: "Rose and jasmine, the window half open." },
];

const galleryCards = [
  { base: "#8A5A33", tall: true, rot: -1, stickers: ["#D8B386", "#B4552E", "#D4A26A"] as [string, string, string], notes: "Cedar · Clove · Vanilla", place: "Los Angeles, US", time: "2026/11/03 21:00", line: "rainy reading" },
  { base: "#E2A23B", tall: false, rot: 1.2, stickers: ["#F6C46A", "#7C8A4A", "#F8EBA0"] as [string, string, string], notes: "Bergamot · Basil", place: "Los Angeles, US", time: "2026/11/01 08:00", line: "first coffee" },
  { base: "#C98A8A", tall: false, rot: -0.6, stickers: ["#F3D6D6", "#D4A26A", "#FFFFFF"] as [string, string, string], notes: "Rose · Jasmine", place: "Pasadena, US", time: "2026/10/31 16:00", line: "slow sunday" },
  { base: "#8FB5B8", tall: true, rot: 0.8, stickers: ["#E8EEF0", "#FFFFFF", "#C9D6DA"] as [string, string, string], notes: "Sea salt · Cotton", place: "Santa Monica, US", time: "2026/10/30 10:00", line: "after the rain" },
  { base: "#7C8A4A", tall: false, rot: -1.2, stickers: ["#A6B46A", "#9A8FC0", "#CBD6A0"] as [string, string, string], notes: "Rosemary · Lavender", place: "Los Angeles, US", time: "2026/10/28 22:00", line: "desk, late" },
  { base: "#B4552E", tall: true, rot: 1, stickers: ["#C98A5A", "#F2C98E", "#D08A45"] as [string, string, string], notes: "Amber · Cinnamon", place: "Los Angeles, US", time: "2026/10/25 19:00", line: "first cold night" },
];

export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Hero />

      <section className="wrap" style={{ paddingTop: 24 }}>
        <QuizInvite />
      </section>

      <section className="wrap section">
        <h2 className="h-section" style={{ marginBottom: 12 }}>Seven families, one <em>shared</em> language</h2>
        <p className="lead" style={{ marginBottom: 40 }}>Neighbours on the wheel blend well. Tap a family to open it.</p>
        <FamilyWheel />
      </section>

      <section className="wrap" style={{ paddingTop: 72 }}>
        <div className="invite">
          <p style={{ maxWidth: "16em", fontFamily: "var(--font-display)", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: 1.1 }}>{strings.brand.capture}.</p>
          <Link href="/capture" className="btn btn--primary">Capture a scent</Link>
        </div>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 className="h-section">Imagine a room, down to its <em>scent</em></h2>
            <p className="lead">Compose the atmosphere of a room you live in or one you imagine.</p>
          </div>
          <Link href="/rooms" style={{ fontSize: 18, fontWeight: 600 }}>Open Rooms →</Link>
        </div>
        <div className="masonry">
          {galleryRooms.map((r, i) => (
            <Link key={i} href="/rooms" className="brick">
              {r.mood ? (
                <div style={{ maxWidth: 360, margin: "0 auto", rotate: `${r.rot}deg` }}>
                  <ScenePage items={[...baseLayout(r.mood.source), ...stickersFor(r.mood.families)]} families={r.mood.families} title={r.name} note={r.nick} time={r.mood.time} />
                </div>
              ) : (
                <div aria-hidden="true" style={{ position: "relative", height: r.h, borderRadius: 6, background: "var(--paper)", overflow: "hidden", rotate: `${r.rot}deg`, boxShadow: "0 10px 24px rgba(41,42,49,0.12)" }}>
                  <div style={{ position: "absolute", left: "10%", top: "12%", width: "80%", height: "70%", borderRadius: "50%", background: `radial-gradient(circle, ${r.photo} 0%, rgba(255,255,255,0) 70%)`, filter: "blur(16px)" }} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "16px 6px 0" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>{r.name}</span>
                <span className="hand" style={{ fontSize: 22, color: "var(--deep)" }}>{r.nick}</span>
                <span className="muted" style={{ fontSize: 17 }}>{r.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 className="h-section">The Olfia <em>Edit</em></h2>
            <p className="lead">Scent in films, hotels and seasons.</p>
          </div>
          <Link href="/edit" style={{ fontSize: 18, fontWeight: 600 }}>Read the Edit →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}>
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/edit/${a.slug}`} className="edit-card">
              <ArticleCover families={a.families} />
              <span className="label-mono" style={{ fontSize: 13 }}>{a.families.map((f) => familyById(f).label).join(" + ")}</span>
              <span className="edit-card__title">{a.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section" style={{ paddingBottom: 120 }}>
        <div className="section__head">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 className="h-section">Keep it as a <em>Scent Card</em></h2>
            <p className="lead">{strings.brand.card}.</p>
          </div>
          <Link href="/card" style={{ fontSize: 18, fontWeight: 600 }}>Make a Scent Card →</Link>
        </div>
        <div className="masonry--4">
          {galleryCards.map((c, i) => (
            <Link key={i} href="/card" className="brick">
              <PolaroidMini {...c} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
