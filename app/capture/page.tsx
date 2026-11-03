import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Capture" };

export default function CapturePage() {
  return (
    <ComingSoon
      eyebrow="Capture"
      title="That scent you loved? Save it for later"
      line="Capture opens this week: the room, the scent source, and one sentence worth keeping. Fragrance-free counts too."
    />
  );
}
