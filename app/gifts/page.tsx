import type { Metadata } from "next";
import { Suspense } from "react";
import { GiftsView } from "@/components/gifts/GiftsView";

export const metadata: Metadata = { title: "Gifts" };

/**
 * Gifts (rebuilt 11/18 from Tiffany's sketch review): For me and For someone, three picks drawn into rooms, each
 * with a gift card, a save and the brand's page. The 11/17 guide and the "All gifts" list (the old Picks) are gone.
 */
export default function GiftsPage() {
  return (
    <Suspense fallback={<div className="wrap page" style={{ minHeight: 900 }} />}>
      <GiftsView />
    </Suspense>
  );
}
