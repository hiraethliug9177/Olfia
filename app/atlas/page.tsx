import type { Metadata } from "next";
import { Suspense } from "react";
import { AtlasView } from "@/components/atlas/AtlasView";

export const metadata: Metadata = { title: "Scent Atlas" };

export default function AtlasPage() {
  return (
    <div className="wrap page">
      <Suspense fallback={<div className="card" style={{ minHeight: 420 }} />}>
        <AtlasView />
      </Suspense>
    </div>
  );
}
