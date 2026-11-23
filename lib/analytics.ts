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
  /** The quiz window at the bottom right (v2, 11/23): its button (take the quiz or see the result), or × to close it. */
  quiz_window: { action: "start" | "result" | "close" };
  /**
   * Join Olfia Plus is pressed (v2, 11/23; the Olfia Plus fake-door test): the plan, the billing shown ("none"
   * while prices are not set), and where (My Page plans, or the third-room window). Nothing personal.
   */
  plan_select: { plan: "plus"; billing: "monthly" | "yearly" | "none"; place: string };
  shelf_link_read: { from: "page" | "address"; matched: 0 | 1 };
  shelf_item_added: { mode: "photo" | "link" };
  /** A recommended product link opens: which product, its family, and where on the site. */
  product_click: { product_id: string; place: string; brand?: string; family?: string; tier?: string };
  /** The sample pages are loaded: from the Scent Atlas button, a ?sample=on link, or the class demo copy. */
  sample_loaded: { place: "atlas" | "link" | "demo" };
  /** The sign-up form is sent (components/SignupForm.tsx): where it sat, and the "found us" answer. */
  email_signup: { place: string; found?: string };
  /** A family is chosen in the Gifts guide (11/17). */
  gift_family: { family: string };
  /** Gifts switches between For me and For someone (11/18). */
  gift_mode: { mode: "me" | "someone" };
  /** A gift pick is kept (11/18): as a page in the Scent Atlas, or on My shelf. */
  gift_save: { to: "atlas" | "shelf"; product: string };
  /** The gift card (11/18): opened, downloaded, shared, its link copied, or saved to the Scent Atlas. */
  gift_card: { action: "open" | "download" | "share" | "link" | "save"; product: string };
  /** A story's share row is used (11/17): copy the link, save to Pinterest, or the phone's own share sheet. */
  story_share: { method: "copy" | "pinterest" | "native"; slug: string };
  /** The partner contact is used (wired when the partners page lands). */
  partner_inquiry: { place: string };
};

type Command = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __olfiaGaQueue?: Command[];
    __olfiaGaOff?: boolean;
  }
}

/** A browser marked "this is me" (?me=on) does not load Google Analytics, so its visits are not counted. */
export const ME_KEY = "olfia.analytics.me";

const enabled = Boolean(process.env.NEXT_PUBLIC_GA_ID);

export function track<K extends keyof EventMap>(name: K, params: EventMap[K]): void {
  if (!enabled || typeof window === "undefined" || window.__olfiaGaOff) return;
  try {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    else (window.__olfiaGaQueue ??= []).push(["event", name, params]);
  } catch {
    // analytics must never break the product
  }
}
