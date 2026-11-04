import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomEditor } from "@/components/rooms/RoomEditor";

export const metadata: Metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <div className="wrap page">
      <h1 className="sr-only">Rooms</h1>
      <Suspense fallback={null}>
        <RoomEditor />
      </Suspense>
    </div>
  );
}
