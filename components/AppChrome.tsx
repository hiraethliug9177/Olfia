"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRehydrateAtlas } from "@/lib/store";
import { seedDemo } from "@/lib/demo";
import { useToast } from "@/lib/toast";
import { strings } from "@/lib/strings";
import { Icon, MenuMorph } from "@/components/ui/Icon";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

type Sub = { href: string; label: string; dot: string };
type NavItem = { href: string; label: string; icon?: "home" | "user"; sub: Sub[] };

/**
 * Main navigation (Tiffany 11/10): the house icon stands for Home again, My Account sits in the
 * middle row, and every tab opens a small menu of the sections on that page when hovered or focused.
 */
const NAV: NavItem[] = [
  {
    href: "/", label: "Home", icon: "home", sub: [
      { href: "/#quiz", label: "Scent quiz", dot: "#E7B49F" },
      { href: "/#families", label: "Seven scent families", dot: "#A0A6C8" },
      { href: "/#presets", label: "Room presets", dot: "#4C527A" },
      { href: "/#edit", label: "The Olfia Edit", dot: "#E7B49F" },
    ],
  },
  {
    href: "/capture", label: "Capture", sub: [
      { href: "/capture", label: "Capture a scent", dot: "#A0A6C8" },
      { href: "/card", label: "Make a Scent Card", dot: "#4C527A" },
    ],
  },
  {
    href: "/rooms", label: "Rooms", sub: [
      { href: "/rooms#editor", label: "Room editor", dot: "#E7B49F" },
      { href: "/rooms#your-rooms", label: "Your rooms", dot: "#A0A6C8" },
      { href: "/rooms#products", label: "Matches this room", dot: "#4C527A" },
      { href: "/#presets", label: "Room presets", dot: "#E7B49F" },
    ],
  },
  {
    href: "/atlas", label: "Scent Atlas", sub: [
      { href: "/atlas?tab=calendar", label: "Calendar", dot: "#E7B49F" },
      { href: "/atlas?tab=favorites", label: "Favorites", dot: "#A0A6C8" },
      { href: "/atlas?tab=tags", label: "Tags & profile", dot: "#4C527A" },
      { href: "/atlas?tab=shelf", label: "My shelf", dot: "#E7B49F" },
    ],
  },
  {
    href: "/edit", label: "The Edit", sub: [
      { href: "/library", label: "Scent Library", dot: "#4C527A" },
      { href: "/edit#latest", label: "Latest stories", dot: "#E7B49F" },
      { href: "/edit#most-read", label: "Most read", dot: "#A0A6C8" },
      { href: "/edit#topics", label: "Browse by topic", dot: "#4C527A" },
    ],
  },
  {
    href: "/account", label: "My Account", icon: "user", sub: [
      { href: "/account#profile", label: "Your profile", dot: "#E7B49F" },
      { href: "/account#preferences", label: "Preferences", dot: "#A0A6C8" },
      { href: "/account#info", label: "Personal info", dot: "#4C527A" },
      { href: "/account#settings", label: "Settings", dot: "#E7B49F" },
      { href: "/account#quiz", label: "Quiz result", dot: "#A0A6C8" },
      { href: "/about", label: "About Olfia", dot: "#4C527A" },
    ],
  },
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
  // sample pages on a first visit, for the class review (lib/demo.ts)
  useEffect(() => { seedDemo(); }, []);
  useEffect(() => setOpen(false), [path]);
  // the Scent Library is part of The Edit since 11/10
  const cur = (href: string) => (isActive(path, href) || (href === "/edit" && path.startsWith("/library")) ? "page" : undefined);

  return (
    <header className="hd">
      <div className="wrap hd__row">
        <Link href="/" className="hd__logo" aria-label="Olfia, home">Olfia</Link>

        <nav aria-label="Main" className="hd__full">
          <ul className="glass-pill hd__list">
            {NAV.map((n) => (
              <li key={n.href} className="hd__item">
                <Link
                  href={n.href}
                  className={`hd__link${n.icon === "home" ? " hd__link--icon" : ""}`}
                  aria-current={cur(n.href)}
                  aria-label={n.icon === "home" ? "Home" : undefined}
                >
                  {n.icon === "home" ? <Icon name="home" size={24} /> : null}
                  {n.icon === "user" ? <Icon name="user" size={24} /> : null}
                  {n.icon === "home" ? null : n.label}
                </Link>
                <ul className="hd__sub" aria-label={`${n.label} sections`}>
                  {n.sub.map((s) => (
                    <li key={s.href + s.label}>
                      <Link href={s.href}><span className="hd__dot" style={{ background: s.dot }} aria-hidden="true" />{s.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hd__end hd__full">
          <Link href="/card" className="btn btn--ink btn--sm hd__cta" aria-current={cur("/card")}>Make a Scent Card</Link>
        </div>

        <button type="button" className="hd__burger hd__mob" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <MenuMorph open={open} />
        </button>
      </div>
      {open ? (
        <nav aria-label="Menu" className="hd__menu hd__mob">
          {NAV.map((n) => (
            <div key={n.href} className="hd__menu-group">
              <Link href={n.href} aria-current={cur(n.href)} className="hd__menu-main">{n.label}</Link>
              <div className="hd__menu-sub">
                {n.sub.map((s) => (
                  <Link key={s.href + s.label} href={s.href}><span className="hd__dot" style={{ background: s.dot }} aria-hidden="true" />{s.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap"><div className="ft__panel">
      <div className="ft__grid">
        <div className="ft__col" style={{ flex: "1.6 1 240px", gap: 10 }}>
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
      <div className="ft__base">
        <span>© 2026 Olfia</span>
        <span>A USC DSM596 capstone project</span>
      </div>
      </div></div>
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
