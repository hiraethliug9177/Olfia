import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FamilyWheel } from "@/components/home/FamilyWheel";
import { QuizInvite } from "@/components/home/QuizInvite";
import { ScenePage } from "@/components/scene/ScenePage";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { ARTICLES } from "@/lib/edit";
import { ROOM_PRESETS } from "@/lib/presets";
import { strings } from "@/lib/strings";

export default function HomePage() {
  return (
    <div style={{ overflowX: "clip" }}>
      <Hero />

      <section className="wrap section">
        <QuizInvite />
      </section>

      <section className="wrap section">
        <h2 className="h-section" style={{ marginBottom: 12 }}>Seven scent families</h2>
        <p className="lead" style={{ marginBottom: 36 }}>Turn the dial. Each family changes the light, the materials and the air of a room.</p>
        <FamilyWheel />
      </section>

      <section className="wrap section">
        <div className="section__head">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 className="h-section">{strings.brand.explore}</h2>
            <p className="lead">Start from a room that is already set, then make it yours.</p>
          </div>
          <Link href="/rooms" className="hero__link">Open Rooms</Link>
        </div>
        <div className="preset-grid">
          {ROOM_PRESETS.map((r) => (
            <Link key={r.id} href={`/rooms?family=${r.families.join(",")}`} className="preset">
              <ScenePage items={r.items} families={r.families} title={r.name} time={r.time} showLabels={false} prefix={`pre-${r.id}`} />
              <span className="preset__name">{r.name}</span>
              {r.line.startsWith("TODO(") ? null : <span className="muted" style={{ fontSize: 15 }}>{r.line}</span>}
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section__head">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 className="h-section">The Olfia Edit</h2>
            <p className="lead">Scent in films, places and seasons.</p>
          </div>
          <Link href="/edit" className="hero__link">Read the Edit</Link>
        </div>
        <div className="edit-grid">
          {ARTICLES.map((a) => <ArticleCard key={a.slug} a={a} />)}
        </div>
      </section>

      <section className="wrap section" style={{ paddingBottom: 120 }}>
        <div className="invite">
          <p style={{ maxWidth: "18em", fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.15 }}>{strings.brand.capture}.</p>
          <Link href="/capture" className="btn btn--primary">Capture a scent</Link>
        </div>
      </section>
    </div>
  );
}
