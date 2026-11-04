import type { Metadata } from "next";
import { CaptureForm } from "@/components/capture/CaptureForm";
import { strings } from "@/lib/strings";

export const metadata: Metadata = { title: "Capture" };

export default function CapturePage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ maxWidth: "14em", marginBottom: 36, fontSize: "clamp(40px, 5vw, 64px)" }}>
        {strings.brand.capture.replace(/later$/, "")}<em>later</em>.
      </h1>
      <CaptureForm />
    </div>
  );
}
