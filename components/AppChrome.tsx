"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRehydrateAtlas } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { strings } from "@/lib/strings";
import { Icon, MenuMorph } from "@/components/ui/Icon";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

const NAV = [
  { href: "/", label: "Home" },
  { href: "/capture", label: "Capture" },
  { href: "/rooms", label: "Rooms" },
  { href: "/atlas", label: "Scent Atlas" },
  { href: "/edit", label: "The Edit" },
];

/** Pages that are mostly white work surfaces get a quieter backdrop. */
const SOFT = ["/capture", "/rooms", "/card", "/atlas"];

export function Backdrop() {
  const path = usePathname() ?? "/";
  const soft = SOFT.some((p) => path === p || path.startsWith(`${p}/`)) || path.startsWith("/edit/");
  return (
    <div className={`backdrop${soft ? " backdrop--soft" : ""}`} aria-hidden="true">
      <span className="backdrop__a" />
      <span className="backdrop__b" />
      <span className="backdrop__c" />
    </div>
  );
}

export function Header() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  useRehydrateAtlas();
  useEffect(() => setOpen(false), [path]);
  const cur = (href: string) => (isActive(path, href) ? "page" : undefined);

  return (
    <header className="hd">
      <div className="wrap hd__row">
        <Link href="/" className="hd__logo" aria-label="Olfia, home">Olfia</Link>

        <nav aria-label="Main" className="glass-pill hd__full">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hd__link" aria-current={cur(n.href)}>{n.label}</Link>
          ))}
        </nav>

        <Link href="/account" className="hd__profile hd__full" aria-current={cur("/account")}>
          <Icon name="user" />
          My profile
        </Link>

        <button type="button" className="hd__burger hd__mob" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <MenuMorph open={open} />
        </button>
      </div>
      {open ? (
        <nav aria-label="Menu" className="hd__menu hd__mob">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</Link>
          ))}
          <Link href="/quiz" aria-current={cur("/quiz")}>Scent quiz</Link>
          <Link href="/library" aria-current={cur("/library")}>Scent Library</Link>
          <Link href="/account" aria-current={cur("/account")}>My profile</Link>
        </nav>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft__grid">
        <div className="ft__col" style={{ flex: "2 1 280px", gap: 12 }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 34, lineHeight: 1 }}>Olfia</Link>
          <span className="muted" style={{ maxWidth: "24em" }}>{strings.brand.invitation}</span>
          <span className="muted" style={{ fontSize: 14 }}>{strings.common.persistenceNotice}</span>
        </div>
        <nav aria-label="Make" className="ft__col">
          <span className="ft__h">Make</span>
          <Link href="/capture">Capture</Link>
          <Link href="/rooms">Rooms</Link>
          <Link href="/atlas">Scent Atlas</Link>
          <Link href="/card">Scent Card</Link>
        </nav>
        <nav aria-label="Read" className="ft__col">
          <span className="ft__h">Read</span>
          <Link href="/quiz">Scent quiz</Link>
          <Link href="/edit">The Olfia Edit</Link>
          <Link href="/library">Scent Library</Link>
          <Link href="/about">About Olfia</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <div className="ft__col" style={{ flex: "1 1 200px" }}>
          <span className="ft__h">Contact</span>
          <a href="mailto:tliu3694@usc.edu">tliu3694@usc.edu</a>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="#" className="ft__icon" aria-label="Instagram (coming soon)"><Icon name="instagram" /></a>
            <a href="#" className="ft__icon" aria-label="小红书 (coming soon)"><Icon name="bookOpen" /></a>
          </div>
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
