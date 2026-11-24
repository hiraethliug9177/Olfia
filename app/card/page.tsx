import type { Metadata } from "next";
import { Suspense } from "react";
import { CardStudio } from "@/components/card/CardStudio";

export const metadata: Metadata = { title: "Scent Card" };

export default function CardPage() {
  return (
    <div className="wrap page">
      {/* copy v1 (Tiffany 11/24, §3): the brand line as the title, and a short lead above the editor */}
      <h1 className="h-page h-page--long" style={{ marginBottom: 12 }}>A little piece of your world, ready to share.</h1>
      <p className="lead" style={{ marginBottom: 32 }}>Give a scent memory or room design a visual form. Make a card to keep for yourself or share with someone.</p>
      <Suspense fallback={<div className="card" style={{ minHeight: 520 }} />}>
        <CardStudio />
      </Suspense>
    </div>
  );
}
