import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <ComingSoon
      eyebrow="About"
      title="Olfia connects scent, space, and the experiences worth keeping."
      line="A USC DSM596 capstone project by Tiffany Liu. A fuller note is coming with the MVP."
    />
  );
}
