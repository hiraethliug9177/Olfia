import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Rooms" };

export default function RoomsPage() {
  return (
    <ComingSoon
      eyebrow="Explore & Play"
      title="Imagine a room, down to its scent"
      line="Rooms opens this week: compose a reading corner from prepared elements, change the light, and save the concept to your Scent Atlas."
    />
  );
}
