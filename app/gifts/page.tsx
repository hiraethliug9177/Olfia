import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GiftGuide } from "@/components/picks/GiftGuide";

export const metadata: Metadata = { title: "Gifts" };

/** Gifts (11/17): three gifts per scent family, one per price tier. Copy is limited to labels and each family's own description. */
export default function GiftsPage() {
  return (
    <div className="wrap page">
      <header className="picks-head">
        <h1 className="h-page">Gifts</h1>
        <Link href="/picks" className="hero__link">All picks</Link>
      </header>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <GiftGuide />
      </Suspense>
      <p className="muted" style={{ fontSize: 14, marginTop: 32 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </div>
  );
}
