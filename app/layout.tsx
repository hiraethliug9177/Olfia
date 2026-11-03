import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

/*
  Fonts: Lora (display), Newsreader (body, optical sizes), Source Sans 3 (UI).
  Loaded from the Google Fonts stylesheet for now; next/font failed on Vercel's first build
  (font file URL parse error in the loader). Revisit once the build is verified locally.
*/
const fontsHref =
  "https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Source+Sans+3:wght@400;600&display=swap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Olfia — For the rooms you live in, and the ones you imagine.",
    template: "%s · Olfia",
  },
  description:
    "Capture a scent experience from a real room, or compose the atmosphere of a room you imagine. There's more to a room than what you see.",
  openGraph: {
    title: "Olfia",
    description: "For the rooms you live in, and the ones you imagine.",
    type: "website",
    siteName: "Olfia",
  },
};

const nav = [
  { href: "/rooms", label: "Rooms" },
  { href: "/capture", label: "Capture" },
  { href: "/atlas", label: "Scent Atlas" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="ui sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-surface-1 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <header className="border-b border-hairline">
          <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="font-display text-2xl text-charcoal no-underline hover:text-charcoal">
              Olfia
            </Link>
            <nav aria-label="Primary">
              <ul className="ui flex items-center gap-5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-charcoal no-underline hover:text-interactive">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-hairline">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="font-display text-lg">Make your scent, create your rooms.</p>
            <ul className="caption flex flex-wrap gap-4">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li>
                {process.env.NEXT_PUBLIC_FEEDBACK_URL ? (
                  <a href={process.env.NEXT_PUBLIC_FEEDBACK_URL} target="_blank" rel="noreferrer">
                    Feedback
                  </a>
                ) : (
                  <span>Feedback (soon)</span>
                )}
              </li>
              <li><span>A USC DSM596 capstone project, 2026</span></li>
            </ul>
          </div>
        </footer>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
