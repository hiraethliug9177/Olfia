import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FamilyWheel } from "@/components/home/FamilyWheel";
import { QuizInvite } from "@/components/home/QuizInvite";
import { ScenePage } from "@/components/scene/ScenePage";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { byDate } from "@/lib/edit";
import { ROOM_PRESETS } from "@/lib/presets";
import { strings } from "@/lib/strings";

/**
 * Home (11/10): sections take turns in the palette — periwinkle for the quiz, the dial's own metal,
 * apricot for the room presets, sage for The Edit, deep periwinkle for the closing invite — and each
 * opens with a large title on the left and a short line on the right.
 */
export default function HomePage() {
  const latest = byDate().slice(0, 3);
  return (
    <div style={{ overflowX: "clip" }}>
      <Hero />

      <section id="quiz" className="wrap section">
        <QuizInvite />
      </section>

      <section id="families" className="wrap section">
        <div className="split-head">
          <h2 className="h-section">Seven scent families</h2>
          <p className="lead">Turn the dial. Each family changes the light, the materials and the air of a room.</p>
        </div>
        <FamilyWheel />
      </section>

      <section id="presets" className="wrap section">
        <div className="panel panel--apricot">
          <div className="split-head">
            <h2 className="h-section">{strings.brand.explore}</h2>
            <div className="split-head__side">
              <p className="lead">Start from a room that is already set, then make it yours.</p>
              <Link href="/rooms" className="btn btn--terra btn--sm">Open Rooms</Link>
            </div>
          </div>
          <div className="preset-grid">
            {ROOM_PRESETS.map((r) => (
              <Link key={r.id} href={`/rooms?preset=${r.id}`} className="preset">
                <ScenePage items={r.items} families={r.families} title={r.name} time={r.time} showLabels={false} prefix={`pre-${r.id}`} />
                <span className="preset__name">{r.name}</span>
                {r.line.startsWith("TODO(") ? null : <span className="preset__line">{r.line}</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="edit" className="wrap section">
        <div className="panel panel--moss">
          <div className="split-head">
            <h2 className="h-section">The Olfia Edit</h2>
            <div className="split-head__side">
              <p className="lead">Culture, fragrance, and the art of living.</p>
              <Link href="/edit" className="btn btn--moss btn--sm">Read the Edit</Link>
            </div>
          </div>
          <div className="edit-grid">
            {latest.map((a) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        </div>
      </section>

      <section id="capture" className="wrap section" style={{ paddingBottom: 120 }}>
        <div className="invite panel--deep">
          <p className="invite__line">{strings.brand.capture}.</p>
          <Link href="/capture" className="btn btn--apricot">Capture a scent</Link>
        </div>
      </section>
    </div>
  );
}
