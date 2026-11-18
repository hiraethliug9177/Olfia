import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PicksList } from "@/components/picks/PicksList";

export const metadata: Metadata = { title: "Picks" };

/** Picks (11/17): every recommended product on one page. Copy on this page is limited to labels; Tiffany's words can be added above the list. */
export default function PicksPage() {
  return (
    <div className="wrap page">
      <header className="picks-head">
        <h1 className="h-page">Picks</h1>
        <Link href="/gifts" className="hero__link">Gifts</Link>
      </header>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <PicksList />
      </Suspense>
      <p className="muted" style={{ fontSize: 14, marginTop: 32 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </div>
  );
}
