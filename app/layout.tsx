import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Footer, Header, Toaster } from "@/components/AppChrome";
import { CutDefs } from "@/components/scene/Cutout";
import { strings } from "@/lib/strings";

/* Fonts load from the Google Fonts stylesheet; next/font failed on Vercel's loader earlier. */
const fontsHref =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500;1,6..72,600&family=Source+Sans+3:wght@400;600;700&display=swap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `Olfia — ${strings.brand.invitation}`, template: "%s · Olfia" },
  description: `${strings.brand.awareness} ${strings.brand.invitation}`,
  openGraph: { title: "Olfia", description: strings.brand.cover, type: "website", siteName: "Olfia" },
};

export const viewport: Viewport = { themeColor: "#F8F6F0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <a href="#main" className="sr-only">Skip to content</a>
        <CutDefs />
        <Header />
        <main id="main" style={{ flex: 1 }}>{children}</main>
        <Footer />
        <Toaster />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
