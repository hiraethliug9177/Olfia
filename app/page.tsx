import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FamilyWheel } from "@/components/home/FamilyWheel";
import { QuizInvite } from "@/components/home/QuizInvite";
import { ScenePage } from "@/components/scene/ScenePage";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { byDate } from "@/lib/edit";
import { ROOM_PRESETS } from "@/lib/presets";
import { familyById, sourceLabel } from "@/lib/catalog";
import { giftScenes, giftsFor, seasonFamily } from "@/lib/gifts";
import { GiftRoom } from "@/components/gifts/GiftRoom";
import { strings } from "@/lib/strings";

// The Gifts row follows the season, so Home is rebuilt once a day instead of only at deploy time.
export const revalidate = 86400;

/**
 * Home (11/10): sections take turns in the palette — periwinkle for the quiz, the dial's own metal,
 * apricot for the room presets, sage for The Edit, deep periwinkle for the closing invite — and each
 * opens with a large title on the left and a short line on the right.
 */
export default function HomePage() {
  const latest = byDate().slice(0, 3);
  // 11/18 (Tiffany): Gifts on Home, the season's family drawn into three rooms
  const giftFamily = seasonFamily();
  const gifts = giftScenes(giftsFor(giftFamily));
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
              <Link href="/rooms" className="btn btn--primary btn--sm">Open Rooms</Link>
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

      <section id="gifts" className="wrap section">
        <div className="row-head">
          <h2 className="h-section">Gifts</h2>
          <p className="lead">A scent for your room, or someone else’s.</p>
          <div className="row-head__cta home-gifts__ctas">
            <Link href="/gifts?for=me" className="btn btn--ghost btn--sm">For me</Link>
            <Link href="/gifts?for=someone" className="btn btn--primary btn--sm">For someone</Link>
          </div>
        </div>
        <div className="home-gifts">
          {gifts.map((g) => (
            <Link key={g.p.id} href={`/gifts?for=someone&family=${giftFamily}`} className="home-gift">
              <GiftRoom scene={g} />
              <span className="home-gift__body">
                <span className="gift-pick__brand">{g.p.brand} · {sourceLabel(g.p.type)}</span>
                <span className="home-gift__name">{g.p.name}</span>
                <span className="home-gift__row">
                  <span className="gift-pick__price">{g.p.price ? [g.p.price, g.p.size].filter(Boolean).join(" · ") : "In stores only"}</span>
                  <span className="home-gift__fams">
                    {g.p.families.map((id) => <span key={id} className="chip__dot" style={{ background: familyById(id).hex }} aria-hidden="true" />)}
                    {g.p.families.map((id) => familyById(id).label.split(" ")[0].toLowerCase()).join(" · ")}
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="edit" className="wrap section">
        <div className="panel panel--white">
          {/* 11/17 (Tiffany): the line sits beside the title on its baseline; the button goes to the right edge */}
          <div className="row-head">
            <h2 className="h-section">The Olfia Edit</h2>
            <p className="lead">Culture, fragrance, and the art of living.</p>
            <Link href="/edit" className="btn btn--primary btn--sm row-head__cta">Read the Edit</Link>
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
