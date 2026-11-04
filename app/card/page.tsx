import type { Metadata } from "next";
import { Suspense } from "react";
import { CardStudio } from "@/components/card/CardStudio";

export const metadata: Metadata = { title: "Scent Card" };

export default function CardPage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ marginBottom: 32, fontSize: "clamp(36px, 4.6vw, 58px)", maxWidth: "16em" }}>
        A little piece of your world, <em>ready to share</em>.
      </h1>
      <Suspense fallback={<div className="card" style={{ minHeight: 520 }} />}>
        <CardStudio />
      </Suspense>
    </div>
  );
}
