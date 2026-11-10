import type { Metadata } from "next";
import { CaptureForm } from "@/components/capture/CaptureForm";
import { strings } from "@/lib/strings";

export const metadata: Metadata = { title: "Capture" };

export default function CapturePage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ marginBottom: 32 }}>{strings.brand.capture}.</h1>
      <CaptureForm />
    </div>
  );
}
