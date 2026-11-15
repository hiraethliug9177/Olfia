"use client";

/**
 * GA4 events. The loader is components/Analytics.tsx (gtag.js with consent defaults).
 * Events fired before the loader has run wait in a small queue and are sent once it is ready,
 * so events fired as a page opens are not lost. Events carry codes only (a family, a product id,
 * a place on the site), never what someone types.
 */

type Mode = "capture" | "rooms";

type EventMap = {
  mode_entered: { mode: Mode };
  creation_complete: { mode: Mode; scene_id?: string };
  scent_card_export: { mode: Mode | "none"; method: "download" | "share"; ratio: "9:16" | "3:4" };
  entry_deleted: { mode: Mode };
  /** The first answer of a quiz run. */
  quiz_start: Record<string, never>;
  quiz_complete: { code: string; family: string };
  quiz_share: { method: "download" | "share" };
  shelf_link_read: { from: "page" | "address"; matched: 0 | 1 };
  shelf_item_added: { mode: "photo" | "link" };
  /** A recommended product link opens: which product, its family, and where on the site. */
  product_click: { product_id: string; place: string; brand?: string; family?: string; tier?: string };
  /** The sign-up form is sent (wired when the Kit form lands). */
  email_signup: { place: string; found?: string };
  /** The partner contact is used (wired when the partners page lands). */
  partner_inquiry: { place: string };
};

type Command = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __olfiaGaQueue?: Command[];
  }
}

/** A browser marked "this is me" (?me=on) sends events in debug mode, which GA4's developer-traffic filter keeps out of reports. */
export const ME_KEY = "olfia.analytics.me";

const enabled = Boolean(process.env.NEXT_PUBLIC_GA_ID);

export function track<K extends keyof EventMap>(name: K, params: EventMap[K]): void {
  if (!enabled || typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    else (window.__olfiaGaQueue ??= []).push(["event", name, params]);
  } catch {
    // analytics must never break the product
  }
}
