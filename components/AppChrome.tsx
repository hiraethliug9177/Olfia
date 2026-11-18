"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRehydrateAtlas } from "@/lib/store";
import { loadSample } from "@/lib/demo";
import { track } from "@/lib/analytics";
import { useToast } from "@/lib/toast";
import { strings } from "@/lib/strings";
import { SignupForm } from "@/components/SignupForm";
import { Icon, MenuMorph } from "@/components/ui/Icon";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

/** narrow: shown only where the header has no room for the "Make a Scent Card" button (≤1220px since the Gifts tab, not phones). */
type Sub = { href: string; label: string; dot: string; narrow?: boolean };
type NavItem = { href: string; label: string; icon?: "home" | "user"; sub: Sub[] };

/**
 * Main navigation (Tiffany 11/10): the house icon stands for Home again, My Page sits in the
 * middle row, and every tab opens a small menu of the sections on that page when hovered or focused.
 * 11/18 (Tiffany): menus trimmed to what is worth a click. Capture lost "Make a Scent Card" (the button on the
 * right does that), which left it one entry pointing at itself, so Capture has no menu where that button shows; where
 * the button has no room (≤1220px) the entry stays, and phones get the button at the foot of their menu. Rooms lost "Your rooms" and
 * "Room presets"; The Edit lost "Latest stories", "Editor's Picks" and "Browse by topic"; My Account is renamed
 * My Page and lost "Preferences" and "Personal info".
 * 11/18 (Tiffany): Gifts has its own tab, after Scent Atlas, with For me and For someone; it left The Edit's menu.
 */
const NAV: NavItem[] = [
  {
    href: "/", label: "Home", icon: "home", sub: [
      { href: "/#quiz", label: "Scent quiz", dot: "#E7B49F" },
      { href: "/#families", label: "Seven scent families", dot: "#A0A6C8" },
      { href: "/#presets", label: "Room presets", dot: "#4C527A" },
      { href: "/#gifts", label: "Gifts", dot: "#A0A6C8" },
      { href: "/#edit", label: "The Olfia Edit", dot: "#E7B49F" },
    ],
  },
  {
    href: "/capture", label: "Capture", sub: [
      { href: "/card", label: "Make a Scent Card", dot: "#4C527A", narrow: true },
    ],
  },
  {
    href: "/rooms", label: "Rooms", sub: [
      { href: "/rooms#editor", label: "Room editor", dot: "#E7B49F" },
      { href: "/rooms#products", label: "Matches this room", dot: "#A0A6C8" },
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
    href: "/gifts", label: "Gifts", sub: [
      { href: "/gifts?for=me", label: "For me", dot: "#A0A6C8" },
      { href: "/gifts?for=someone", label: "For someone", dot: "#E7B49F" },
    ],
  },
  {
    href: "/edit", label: "The Edit", sub: [
      { href: "/library", label: "Scent Library", dot: "#4C527A" },
    ],
  },
  {
    href: "/account", label: "My Page", icon: "user", sub: [
      { href: "/account#profile", label: "Your profile", dot: "#E7B49F" },
      { href: "/account#settings", label: "Settings", dot: "#A0A6C8" },
      { href: "/account#quiz", label: "Quiz result", dot: "#4C527A" },
      { href: "/about", label: "About Olfia", dot: "#E7B49F" },
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
  const showToast = useToast((s) => s.show);
  // ?sample=on loads the sample pages (the professor's link, lib/demo.ts); first visits otherwise start clean.
  // The class demo copy (11/18: the `demo` branch, built with NEXT_PUBLIC_DEMO=on) opens with them already in.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const asked = url.searchParams.get("sample") === "on";
      const demo = process.env.NEXT_PUBLIC_DEMO === "on";
      if (!asked && !demo) return;
      if (asked) {
        url.searchParams.delete("sample");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
      loadSample((added) => {
        if (!added) return;
        track("sample_loaded", { place: asked ? "link" : "demo" });
        if (asked) showToast("Sample pages added");
      });
    } catch {
      // storage blocked: nothing to load
    }
  }, [showToast]);
  useEffect(() => setOpen(false), [path]);
  // the Scent Library is part of The Edit since 11/10
  const cur = (href: string) => (isActive(path, href) || (href === "/edit" && isActive(path, "/library")) ? "page" : undefined);

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
                {n.sub.length ? (
                  <ul className={`hd__sub${n.sub.every((s) => s.narrow) ? " hd__sub--narrow" : ""}`} aria-label={`${n.label} sections`}>
                    {n.sub.map((s) => (
                      <li key={s.href + s.label} className={s.narrow ? "hd__sub-narrow" : undefined}>
                        <Link href={s.href}><span className="hd__dot" style={{ background: s.dot }} aria-hidden="true" />{s.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
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
              {n.sub.some((s) => !s.narrow) ? (
                <div className="hd__menu-sub">
                  {n.sub.filter((s) => !s.narrow).map((s) => (
                    <Link key={s.href + s.label} href={s.href}><span className="hd__dot" style={{ background: s.dot }} aria-hidden="true" />{s.label}</Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {/* the right-hand button of wide screens, for phones and tablets */}
          <Link href="/card" className="btn btn--ink btn--sm hd__menu-cta" aria-current={cur("/card")}>Make a Scent Card</Link>
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
        <div className="ft__col" style={{ flex: "1.6 1 240px", gap: 6 }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, lineHeight: 1 }}>Olfia</Link>
          <span className="muted" style={{ maxWidth: "24em" }}>{strings.brand.invitation}</span>
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
      <div className="ft__signup"><SignupForm place="footer" /></div>
      <div className="ft__base">
        <span className="ft__legal"><span>© 2026 Olfia</span><Link href="/privacy">Privacy</Link></span>
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
