import type { Metadata } from "next";
import { CaptureForm } from "@/components/capture/CaptureForm";
import { strings } from "@/lib/strings";

export const metadata: Metadata = { title: "Capture" };

export default function CapturePage() {
  return (
    <div className="wrap page">
      <h1 className="h-page">{strings.brand.capture}.</h1>
      {/* her note (11/24 evening): this line belongs to the page, not to the first question, so it sits under the title,
          above the progress bar, across the full width */}
      <p className="lead page-lead" style={{ marginBottom: 32 }}>Record a scent from today or a moment you still remember. Use Skip when you’re unsure about a detail.</p>
      <CaptureForm />
    </div>
  );
}
