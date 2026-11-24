import type { Metadata } from "next";
import { Suspense } from "react";
import { EditList } from "@/components/edit/EditList";
import { LibraryBlock } from "@/components/edit/LibraryBlock";
import { TodayDate } from "@/components/edit/TodayDate";

export const metadata: Metadata = { title: "The Olfia Edit" };

export default function EditPage() {
  return (
    <div className="wrap page">
      <header className="np-mast">
        {/* 11/18 (Tiffany): the line sits on the date's row. Later on 11/18: the date is today's, like a newspaper's,
            not the newest story's */}
        <div className="np-mast__line">
          <TodayDate className="np-mast__date" />
          <span className="np-mast__tag">Culture, fragrance,<br className="np-mast__br" /> and the art of living.</span>
        </div>
        <h1 className="np-mast__title">The Olfia Edit</h1>
        <p className="np-mast__lead">An ongoing collection of stories about fragrance and the worlds it opens up. We explore familiar materials, the cultural meanings of scent, and the ways people use fragrance to shape their surroundings and express themselves.</p>
      </header>

      <LibraryBlock />

      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <EditList />
      </Suspense>
    </div>
  );
}
