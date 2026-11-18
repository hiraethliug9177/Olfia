import type { Metadata } from "next";
import { Suspense } from "react";
import { EditList } from "@/components/edit/EditList";
import { LibraryBlock } from "@/components/edit/LibraryBlock";
import { byDate } from "@/lib/edit";

export const metadata: Metadata = { title: "The Olfia Edit" };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Tuesday, November 10, 2026" — the date of the newest story. */
function dateline(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[day]}, ${MONTHS[m - 1]} ${d}, ${y}`;
}

export default function EditPage() {
  const newest = byDate()[0];
  return (
    <div className="wrap page">
      <header className="np-mast">
        {/* 11/18 (Tiffany): the line sits on the date's row */}
        <div className="np-mast__line">
          {newest ? <span className="np-mast__date">{dateline(newest.date)}</span> : null}
          <span className="np-mast__tag">Culture, fragrance,<br className="np-mast__br" /> and the art of living.</span>
        </div>
        <h1 className="np-mast__title">The Olfia Edit</h1>
      </header>

      <LibraryBlock />

      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <EditList />
      </Suspense>
    </div>
  );
}
