import type { Metadata } from "next";
import { Suspense } from "react";
import { GiftCardStudio } from "@/components/gifts/GiftCardStudio";

export const metadata: Metadata = { title: "Gift card", robots: { index: false } };

export default function GiftCardPage() {
  return (
    <Suspense fallback={<div className="wrap page" style={{ minHeight: 900 }} />}>
      <GiftCardStudio />
    </Suspense>
  );
}
