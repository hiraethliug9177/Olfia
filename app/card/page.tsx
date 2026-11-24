import type { Metadata } from "next";
import { Suspense } from "react";
import { CardStudio } from "@/components/card/CardStudio";
import { CardSkeleton } from "@/components/card/CardSkeleton";

export const metadata: Metadata = { title: "Scent Card" };

export default function CardPage() {
  return (
    <div className="wrap page">
      {/* copy v1 (Tiffany 11/24, §3) in the compact studio head of the 11/24 handoff; her note (11/24 evening): the lead
          is one paragraph across the full width under the title */}
      <header className="studio-head">
        <h1 className="h-page">A little piece of your world, ready to share.</h1>
        <p className="lead">Give a scent memory or room design a visual form. Make a card to keep for yourself or share with someone.</p>
      </header>
      <Suspense fallback={<CardSkeleton />}>
        <CardStudio />
      </Suspense>
    </div>
  );
}
