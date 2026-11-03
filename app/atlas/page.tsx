import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Scent Atlas" };

export default function AtlasPage() {
  return (
    <ComingSoon
      eyebrow="Scent Atlas"
      title="Your rooms, ideas, and scent notes, all in one place"
      line="The Atlas opens this week, together with Scene Card export."
    />
  );
}
