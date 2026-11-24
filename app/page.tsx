import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FamilyWheel } from "@/components/home/FamilyWheel";
import { About } from "@/components/home/About";
import { ScenePage } from "@/components/scene/ScenePage";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { byDate } from "@/lib/edit";
import { ROOM_PRESETS } from "@/lib/presets";
import { strings } from "@/lib/strings";

// The Edit row shows the latest dated stories, so Home is rebuilt once a day instead of only at deploy time.
export const revalidate = 86400;

/**
 * Home (11/10): sections take turns in the palette — the dial's own metal, white for The Edit, apricot for the room
 * presets, deep periwinkle for the closing invite — and each opens with a large title on the left and a short line
 * on the right. v2 (11/23, Tiffany's Notion): the hero's left text is new, the quiz moved to a window at the bottom
 * right, and About Olfia lives here in full. Copy v1 (Tiffany 11/24, docs/copy/olfia-site-copy-v1.md §1): the order
 * stays as it is; 03 "The same room, a different feeling" is outside this round.
 * Design round (Tiffany 11/24): the Gifts section and the closing invite are gone from Home (Gifts stays under Discover).
 * Later on 11/24 (her screenshots): About Olfia comes right after the family dial; the room presets ("太占地儿了") and
 * then The Olfia Edit ("跟着 Explore Rooms 一起到 About 后面去") follow it.
 */
// 11/18 (Tiffany): Home shows three of the six presets, in this order; Rooms keeps all six
const HOME_PRESET_IDS = ["living-night", "bedroom-morning", "study-afternoon"];
const HOME_PRESETS = HOME_PRESET_IDS.map((id) => ROOM_PRESETS.find((r) => r.id === id)).filter((r): r is (typeof ROOM_PRESETS)[number] => Boolean(r));

export default function HomePage() {
  const latest = byDate().slice(0, 3);
  return (
    <div style={{ overflowX: "clip" }}>
      <Hero />

      {/* v2 (11/23): the quiz section is now the small window at the bottom right of every page (components/QuizWindow) */}

      <section id="families" className="wrap section">
        <div className="split-head">
          {/* v2 (11/23): Tiffany's heading from her Notion */}
          <h2 className="h-section">Discover the Seven Scent Families</h2>
          {/* 11/18 (Tiffany): only the reminder stays, at the right */}
          <p className="lead split-head__end">Turn the dial, explore the fragrance wheel.</p>
        </div>
        <FamilyWheel />
      </section>

      <About />

      <section id="presets" className="wrap section">
        <div className="panel panel--apricot">
          {/* 11/18 (Tiffany): the same head as The Olfia Edit: the line beside the title, the button at the right edge */}
          {/* design round 11/24: the title takes its full line; the line and the button share the row below */}
          <div className="row-head row-head--stack">
            <h2 className="h-section">{strings.brand.explore}.</h2>
            <span className="row-head__break" aria-hidden="true" />
            <p className="lead">Begin with a room we’ve put together. Change its objects and fragrance to suit the way you want to live.</p>
            <Link href="/rooms" className="btn btn--primary btn--sm row-head__cta">Explore Rooms</Link>
          </div>
          <div className="preset-grid">
            {HOME_PRESETS.map((r) => (
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
        <div className="panel panel--white">
          {/* 11/17 (Tiffany): the line sits beside the title on its baseline; the button goes to the right edge */}
          <div className="row-head row-head--stack">
            {/* copy v1 (11/24, §1.3): the section is called The Olfia Edit again; one line about what the stories cover */}
            <h2 className="h-section">The Olfia Edit</h2>
            <span className="row-head__break" aria-hidden="true" />
            <p className="lead">Culture, fragrance, and the art of living.</p>
            <Link href="/edit" className="btn btn--primary btn--sm row-head__cta">Explore the Edit</Link>
            <p className="row-head__body">Stories about familiar ingredients, the places we inhabit, and the traditions and habits that shape our sensory lives.</p>
          </div>
          <div className="edit-grid">
            {latest.map((a) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        </div>
      </section>

    </div>
  );
}
