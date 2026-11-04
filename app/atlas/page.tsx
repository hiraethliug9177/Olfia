import type { Metadata } from "next";
import { AtlasView } from "@/components/atlas/AtlasView";

export const metadata: Metadata = { title: "Scent Atlas" };

export default function AtlasPage() {
  return (
    <div className="wrap page">
      <AtlasView />
    </div>
  );
}
