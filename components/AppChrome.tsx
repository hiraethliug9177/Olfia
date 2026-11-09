"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRehydrateAtlas } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { strings } from "@/lib/strings";

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11l8-6 8 6v9H4z" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
      <path d="M5 15.5h14" />
    </svg>
  );
}

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

export function Header() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  useRehydrateAtlas();
  useEffect(() => setOpen(false), [path]);
  const cur = (href: string) => (isActive(path, href) ? "page" : undefined);

  return (
    <header className="hd">
      <div className="wrap hd__row">
        <Link href="/" className="hd__logo">Olfia</Link>

        <nav aria-label="Main" className="glass-pill hd__full">
          <Link href="/" className="hd__link hd__link--icon" aria-label="Home" aria-current={cur("/")}><HomeIcon /></Link>
          <Link href="/capture" className="hd__link" aria-current={cur("/capture")}>Capture</Link>
          <Link href="/rooms" className="hd__link" aria-current={cur("/rooms")}>Rooms</Link>
          <Link href="/atlas" className="hd__link" aria-current={cur("/atlas")}>Scent Atlas</Link>
          <Link href="/edit" className="hd__link" aria-current={cur("/edit")}>The Edit</Link>
          <Link href="/account" className="hd__link hd__link--icon" aria-label="My account" aria-current={cur("/account")}><AccountIcon /></Link>
        </nav>

        <Link href="/card" className="btn btn--primary btn--sm hd__full" aria-current={cur("/card")}>
          <CardIcon />
          Make a Scent Card
        </Link>

        <div className="glass-pill hd__mob">
          <Link href="/capture" className="hd__link" aria-current={cur("/capture")}>Capture</Link>
          <Link href="/rooms" className="hd__link" aria-current={cur("/rooms")}>Rooms</Link>
          <Link href="/account" className="hd__link hd__link--icon" aria-label="My account" aria-current={cur("/account")}><AccountIcon /></Link>
          <button type="button" className="hd__link hd__link--icon" aria-label="More pages" aria-expanded={open} onClick={() => setOpen((o) => !o)} style={{ border: 0, background: "transparent" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 8h14M5 16h14" /></svg>
          </button>
        </div>
      </div>
      {open ? (
        <div className="hd__menu hd__mob">
          <Link href="/" aria-current={cur("/")}>Home</Link>
          <Link href="/atlas" aria-current={cur("/atlas")}>Scent Atlas</Link>
          <Link href="/quiz" aria-current={cur("/quiz")}>Scent quiz</Link>
          <Link href="/edit" aria-current={cur("/edit")}>The Olfia Edit</Link>
          <Link href="/card" aria-current={cur("/card")}>Make a Scent Card</Link>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft__grid">
        <div className="ft__col" style={{ flex: "2 1 280px", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 36, lineHeight: 1 }}>Olfia</span>
          <span className="muted" style={{ fontSize: 18, maxWidth: "22em" }}>{strings.brand.invitation}</span>
          <span className="muted" style={{ fontSize: 15 }}>{strings.common.persistenceNotice}</span>
        </div>
        <nav aria-label="Explore" className="ft__col">
          <span className="label-mono" style={{ fontSize: 13 }}>EXPLORE</span>
          <Link href="/">Home</Link>
          <Link href="/capture">Capture</Link>
          <Link href="/rooms">Rooms</Link>
          <Link href="/atlas">Scent Atlas</Link>
          <Link href="/card">Scent Card</Link>
          <Link href="/quiz">Scent quiz</Link>
        </nav>
        <nav aria-label="More" className="ft__col">
          <span className="label-mono" style={{ fontSize: 13 }}>MORE</span>
          <Link href="/edit">The Olfia Edit</Link>
          <Link href="/library">Scent Library</Link>
          <Link href="/about">About Olfia</Link>
          <Link href="/account">My account</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <div className="ft__col" style={{ flex: "1 1 200px" }}>
          <span className="label-mono" style={{ fontSize: 13 }}>CONTACT</span>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="#" className="ft__icon" aria-label="Instagram (coming soon)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" className="ft__icon" aria-label="小红书 (coming soon)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3.5h9l3 3v14H6z" /><path d="M9 10h6M9 14h6M9 18h3" /></svg>
            </a>
          </div>
          <a href="mailto:tliu3694@usc.edu">tliu3694@usc.edu</a>
        </div>
      </div>
      <div className="wrap ft__base">
        <span>© 2026 Olfia</span>
        <span>A USC DSM596 capstone project</span>
      </div>
    </footer>
  );
}

export function Toaster() {
  const toast = useToast((s) => s.toast);
  const hide = useToast((s) => s.hide);
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{toast.text}</span>
      {toast.href ? (
        <Link href={toast.href} onClick={hide}>{toast.linkText ?? "Open"}</Link>
      ) : null}
    </div>
  );
}
