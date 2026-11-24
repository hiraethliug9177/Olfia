import type { Metadata } from "next";
import { Suspense } from "react";
import { EditList } from "@/components/edit/EditList";
import { LibraryBlock } from "@/components/edit/LibraryBlock";
import { Masthead } from "@/components/edit/Masthead";

export const metadata: Metadata = { title: "The Olfia Edit" };

export default function EditPage() {
  return (
    <div className="wrap page">
      {/* her mockup and mood board (11/24 evening): a newspaper masthead with a date stamp wheel, today's family, the
          day's motto and the week's edition (components/edit/Masthead.tsx); the page's description follows, one
          paragraph across the full width */}
      <Masthead />
      <p className="lead page-lead np-mast__lead">An ongoing collection of stories about fragrance and the worlds it opens up. We explore familiar materials, the cultural meanings of scent, and the ways people use fragrance to shape their surroundings and express themselves.</p>

      <LibraryBlock />

      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <EditList />
      </Suspense>
    </div>
  );
}
