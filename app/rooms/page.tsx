import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomEditor } from "@/components/rooms/RoomEditor";
import { RoomsSkeleton } from "@/components/rooms/RoomsSkeleton";

export const metadata: Metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <div className="wrap page">
      {/* copy v1 (Tiffany 11/24, §4.1) in the compact studio head of the 11/24 handoff; her note (11/24 evening): the lead
          is one paragraph across the full width under the title */}
      <header className="studio-head">
        <h1 className="h-page">Imagine a room, down to its scent.</h1>
        <p className="lead">A room changes with its light, objects, and fragrance. Arrange a space and experiment with the atmosphere you would like to create.</p>
      </header>
      <Suspense fallback={<RoomsSkeleton />}>
        <RoomEditor />
      </Suspense>
    </div>
  );
}
