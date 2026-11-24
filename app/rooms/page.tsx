import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomEditor } from "@/components/rooms/RoomEditor";

export const metadata: Metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <div className="wrap page">
      {/* copy v1 (Tiffany 11/24, §4.1): a compact intro above the editor, outside its working canvas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        <h1 className="h-page">Imagine a room, down to its scent.</h1>
        <p className="lead">A room changes with its light, objects, and fragrance. Arrange a space and experiment with the atmosphere you would like to create.</p>
      </div>
      <Suspense fallback={null}>
        <RoomEditor />
      </Suspense>
    </div>
  );
}
