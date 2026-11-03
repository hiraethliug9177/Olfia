import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <ComingSoon
      eyebrow="Privacy"
      title="Your entries stay in your browser."
      line="Olfia has no accounts. Entries are stored only in this browser; anonymous usage analytics help improve the site. The full note is coming with the MVP."
    />
  );
}
