"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";
import { useRehydrateAtlas } from "@/lib/store";
import { loadSample } from "@/lib/demo";
import { needsSignIn, useOverlays } from "@/lib/mockAuth";
import { track } from "@/lib/analytics";
import { useToast } from "@/lib/toast";
import { strings } from "@/lib/strings";
import { SignupForm } from "@/components/SignupForm";
import { Icon, MenuMorph } from "@/components/ui/Icon";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
const pathOf = (href: string) => href.split(/[?#]/)[0];

type Sub = { href: string; label: string };
/** `match`: the pages that mark this entry as the current one. `note`: an optional line at the top of its menu. */
type NavItem = { href: string; label: string; match: string[]; note?: string; sub: Sub[] };

/**
 * Main navigation, v2 (Tiffany's Notion "Capstone Draft", 11/23): the Olfia wordmark is the way home (the house
 * icon is gone), five entries, and one account icon on the right. Each entry opens its first page; its menu opens
 * on hover or keyboard focus. The Edit has no menu. The "Make a Scent Card" button left the header: Scent Cards
 * sits in the Capture menu. The one menu line is hers ("Your personal archive of scent."). Labels follow her copy
 * v1 (11/24, docs/copy/olfia-site-copy-v1.md §0.2): Capture a scent, Scent Cards, Fragrance Matches,
 * Fragrance Shelf, Scent Journal.
 * Old menus (11/10–11/21) are in git history.
 */
export const NAV: NavItem[] = [
  { href: "/capture", label: "Capture", match: ["/capture", "/card"], sub: [
    { href: "/capture", label: "Capture a scent" },
    { href: "/card", label: "Scent Cards" },
  ] },
  { href: "/rooms", label: "Rooms", match: ["/rooms"], sub: [
    { href: "/rooms#editor", label: "Create an atmosphere" },
    { href: "/rooms#products", label: "Fragrance Matches" },
  ] },
  { href: "/atlas?tab=shelf", label: "Scent Atlas", match: ["/atlas"], note: "Your personal archive of scent.", sub: [
    { href: "/atlas?tab=shelf", label: "Fragrance Shelf" },
    { href: "/atlas?tab=journal", label: "Scent Journal" },
  ] },
  { href: "/gifts", label: "Discover", match: ["/gifts", "/scentpedia"], sub: [
    { href: "/gifts", label: "Olfia · Gifts" },
    { href: "/scentpedia", label: "Scentpedia" },
  ] },
  { href: "/edit", label: "The Edit", match: ["/edit"], sub: [] },
];

/** The account icon (Lucide CircleUserRound). Saved joins its menu once it exists. */
export const ACCOUNT: NavItem = { href: "/account", label: "My Page", match: ["/account"], sub: [
  { href: "/account#profile", label: "Account" },
  { href: "/account#settings", label: "Settings" },
] };

/**
 * Q17 (Tiffany 11/23): while the sample content is loaded and nobody has signed in, the way into My Page opens the
 * mock sign-in first, then goes on to the page asked for. Otherwise the links work as usual.
 */
function guardAccount(e: MouseEvent<HTMLAnchorElement>, href: string): boolean {
  if (!href.startsWith("/account") || !needsSignIn()) return false;
  e.preventDefault();
  useOverlays.getState().openSignIn({ kind: "go", href });
  return true;
}

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

/**
 * One header entry. Its menu opens on hover or keyboard focus (CSS). Esc closes it and leaves focus on the entry;
 * it opens again once focus or the pointer leaves the entry and comes back.
 */
function Entry({ n, cur, here, icon }: { n: NavItem; cur: boolean; here: (s: Sub) => boolean; icon?: boolean }) {
  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => { guardAccount(e, href); };
  const [shut, setShut] = useState(false);
  const link = useRef<HTMLAnchorElement>(null);
  const onKey = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key !== "Escape" || !n.sub.length) return;
    setShut(true);
    link.current?.focus();
  };
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setShut(false);
  };
  return (
    <li className="hd__item" data-shut={shut || undefined} onKeyDown={onKey} onBlur={onBlur} onMouseLeave={() => setShut(false)}>
      <Link ref={link} href={n.href} onClick={go(n.href)} className={`hd__link${icon ? " hd__link--icon" : ""}`} aria-current={cur ? "page" : undefined} aria-label={icon ? n.label : undefined}>
        {icon ? <Icon name="user" size={24} /> : n.label}
      </Link>
      {n.sub.length ? (
        <div className={`hd__sub${icon ? " hd__sub--end" : ""}`}>
          {n.note ? <p className="hd__note">{n.note}</p> : null}
          <ul aria-label={`${n.label} pages`}>
            {n.sub.map((s) => (
              <li key={s.href}>
                <Link href={s.href} onClick={go(s.href)} aria-current={here(s) ? "page" : undefined}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

export function Header() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [search, setSearch] = useState("");
  const burger = useRef<HTMLButtonElement>(null);
  useRehydrateAtlas();
  const showToast = useToast((s) => s.show);
  // ?sample=on loads the sample pages (the professor's link, lib/demo.ts); first visits otherwise start clean.
  // The 11/18 class demo copy (the `demo` branch, built with NEXT_PUBLIC_DEMO=on) opens with them already in.
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
        if (asked) showToast("Sample pages added to your Scent Atlas", "/atlas", "Open Scent Atlas");
      });
    } catch {
      // storage blocked: nothing to load
    }
  }, [showToast]);
  useEffect(() => { setOpen(false); setSearch(window.location.search); }, [path]);
  // v2 (11/23): the header stays at the top and gets shorter once the page moves (72px → 56px, a hairline under it)
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // the phone menu covers the page: the page does not scroll under it, and Esc closes it
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); burger.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { root.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const cur = (n: NavItem) => n.match.some((m) => isActive(path, m));
  const here = (s: Sub) => {
    if (path !== pathOf(s.href)) return false;
    const q = s.href.includes("?") ? s.href.slice(s.href.indexOf("?")).split("#")[0] : "";
    return q ? search.includes(q.slice(1)) : !s.href.includes("#");
  };

  return (
    <header className={`hd${compact ? " hd--compact" : ""}${open ? " hd--open" : ""}`}>
      <div className="wrap hd__row">
        <Link href="/" className="hd__logo" aria-label="Olfia, home">Olfia</Link>

        <nav aria-label="Main" className="hd__full">
          <ul className="glass-pill hd__list">
            {NAV.map((n) => <Entry key={n.href} n={n} cur={cur(n)} here={here} />)}
          </ul>
        </nav>

        <div className="hd__end">
          <ul className="hd__list hd__list--end hd__full">
            <Entry n={ACCOUNT} cur={cur(ACCOUNT)} here={here} icon />
          </ul>
          <button ref={burger} type="button" className="hd__burger hd__mob" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="hd-menu" onClick={() => setOpen((o) => !o)}>
            <MenuMorph open={open} />
          </button>
        </div>
      </div>
      {open ? (
        <nav id="hd-menu" aria-label="Menu" className="hd__menu hd__mob">
          {[...NAV, ACCOUNT].map((n) => (
            <div key={n.href} className="hd__menu-group">
              <Link href={n.href} aria-current={cur(n) ? "page" : undefined} className="hd__menu-main" onClick={(e) => { guardAccount(e, n.href); setOpen(false); }}>{n.label}</Link>
              {n.sub.length ? (
                <div className="hd__menu-sub">
                  {n.sub.map((s) => (
                    <Link key={s.href} href={s.href} aria-current={here(s) ? "page" : undefined} onClick={(e) => { guardAccount(e, s.href); setOpen(false); }}>{s.label}</Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

/** The last footer column: About Olfia and its three parts, all on Home (v2, 11/23). */
const ABOUT: NavItem = {
  href: "/#about", label: "About Olfia", match: [],
  sub: [{ href: "/#concept", label: "The Concept" }, { href: "/#how-it-works", label: "How it Works" }, { href: "/#science", label: "The Science" }, { href: "/#creator", label: "The Creator" }],
};

/**
 * Footer, v2 (11/23): the wordmark block (invitation, contact) and then the same groups as the header, one column
 * each, with About Olfia last. The sign-up row and the halftone art stay; Privacy stays beside © in the bottom row
 * (Tiffany 11/17).
 */
export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap"><div className="ft__panel">
      <div className="ft__grid">
        <div className="ft__col ft__brand">
          <Link href="/" className="ft__mark">Olfia</Link>
          <span className="muted" style={{ maxWidth: "24em" }}>{strings.brand.invitation}</span>
        </div>
        {[...NAV, ABOUT].map((n) => (
          <nav key={n.href} aria-label={n.label} className="ft__col">
            <Link href={n.href} className="ft__h">{n.label}</Link>
            {n.sub.map((s) => <Link key={s.href} href={s.href}>{s.label}</Link>)}
          </nav>
        ))}
      </div>
      {/* Tiffany 11/24: the email address is no longer shown; the social icons sit on the sign-up row under "Contact us @" */}
      <div className="ft__signup">
        <SignupForm place="footer" />
        <div className="ft__contact">
          <span className="ft__contact-label">Contact us @</span>
          <div className="ft__icons">
            <a href="#" className="ft__icon" aria-label="Instagram (coming soon)"><Icon name="instagram" /></a>
            <a href="#" className="ft__icon" aria-label="小红书 (coming soon)"><Icon name="bookOpen" /></a>
          </div>
        </div>
      </div>
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
