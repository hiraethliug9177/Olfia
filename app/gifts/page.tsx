import type { Metadata } from "next";
import { Suspense } from "react";
import { GiftGuide } from "@/components/picks/GiftGuide";
import { PicksList } from "@/components/picks/PicksList";

export const metadata: Metadata = { title: "Gifts" };

/**
 * Gifts (11/17): three gifts per scent family, then every product with filters ("All gifts", which was the
 * Picks page until Tiffany folded it in on 11/17, so the menu no longer has "Picks" next to "Editor's Picks").
 * The line under the title was written by Claude at Tiffany's request ("你写就行"); hers to change.
 */
export default function GiftsPage() {
  return (
    <div className="wrap page">
      <header className="picks-head">
        <div>
          <h1 className="h-page">Gifts</h1>
          <p className="lead gifts-intro">A scent to leave in someone else’s room.</p>
        </div>
        <a href="#all" className="hero__link">All gifts</a>
      </header>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <GiftGuide />
      </Suspense>
      <section id="all" className="gifts-all anchor" aria-labelledby="all-gifts">
        <h2 id="all-gifts" className="h-section">All gifts</h2>
        <Suspense fallback={<div style={{ minHeight: 600 }} />}>
          <PicksList />
        </Suspense>
      </section>
      <p className="muted" style={{ fontSize: 14, marginTop: 32 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </div>
  );
}
