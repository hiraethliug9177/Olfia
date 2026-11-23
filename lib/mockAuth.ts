"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { track } from "@/lib/analytics";
import type { Billing } from "@/lib/plans";

/**
 * The mock sign-in (v2, 11/23). Tiffany's answer 17: it stands in front of My Page and Join only while the sample
 * content is loaded (the ?sample=on link, the Scent Atlas's See a sample, My Page's Load sample pages, the demo
 * copy); otherwise the account icon opens My Page directly, so nobody on the public site types a real email and
 * password into a form that only pretends. Signing in keeps one "signed in" mark in this browser: no email, no
 * password, nothing sent.
 */
export const SAMPLE_FLAG = "olfia.sample.v1";
export const SESSION_KEY = "olfia.signin.v1";
const CHANGED = "olfia:auth";

function read(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // storage blocked: the mark lasts until the page closes
  }
  window.dispatchEvent(new Event(CHANGED));
}

export const markSample = (on: boolean) => write(SAMPLE_FLAG, on ? "on" : null);
export const setSignedIn = (on: boolean) => write(SESSION_KEY, on ? "in" : null);
export const sampleOn = () => read(SAMPLE_FLAG) === "on";
export const signedIn = () => read(SESSION_KEY) === "in";
export const needsSignIn = () => sampleOn() && !signedIn();

export function useAuthState(): { sample: boolean; signedIn: boolean } {
  const [s, setS] = useState({ sample: false, signedIn: false });
  useEffect(() => {
    const sync = () => setS({ sample: sampleOn(), signedIn: signedIn() });
    sync();
    window.addEventListener(CHANGED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return s;
}

/** What happens after signing in: go to a page, or carry on to the Olfia Plus window. */
export type AfterSignIn = { kind: "go"; href: string } | { kind: "plus"; place: string };

type Overlays = {
  signIn: AfterSignIn | null;
  plus: string | null;
  openSignIn: (after: AfterSignIn) => void;
  closeSignIn: () => void;
  openPlus: (place: string) => void;
  closePlus: () => void;
};

/** The two site-wide windows (components/Overlays.tsx renders them once, in the layout). */
export const useOverlays = create<Overlays>()((set) => ({
  signIn: null,
  plus: null,
  openSignIn: (after) => set({ signIn: after }),
  closeSignIn: () => set({ signIn: null }),
  openPlus: (place) => set({ plus: place }),
  closePlus: () => set({ plus: null }),
}));

/**
 * Join Olfia Plus, from the plans or from the third-room window: GA4 counts the choice (plan, billing, place;
 * nothing personal), then the "not open yet" window opens, after the mock sign-in when that applies.
 */
export function joinPlus(place: string, billing: Billing | "none"): void {
  track("plan_select", { plan: "plus", billing, place });
  const o = useOverlays.getState();
  if (needsSignIn()) o.openSignIn({ kind: "plus", place });
  else o.openPlus(place);
}
