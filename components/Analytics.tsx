"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ME_KEY } from "@/lib/analytics";
import { useToast } from "@/lib/toast";

/**
 * Google Analytics 4, loaded with gtag.js (plan of 11/15, "Measuring visitors").
 * - Advertising features are off for everyone; the site has no ads tags.
 * - Visitors in the EEA, the UK and Switzerland, and browsers that send Global Privacy Control or
 *   Do Not Track, start with analytics cookies off: Google gets cookieless pings only, so no banner.
 * - "This browser is me": open any page with ?me=on (?me=off undoes it). A marked browser sends its
 *   events in debug mode: GA4's DebugView shows them, and the property's Developer-traffic filter
 *   keeps them out of the reports.
 */

const COOKIELESS_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

const NO_ADS = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

function initScript(gaId: string, me: boolean): string {
  const config: Record<string, unknown> = { allow_google_signals: false, allow_ad_personalization_signals: false };
  // GA4 treats any debug_mode value, even false, as debug, so the key is only set for a marked browser.
  if (me) config.debug_mode = true;
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var optOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1";
gtag("consent", "default", Object.assign(${JSON.stringify(NO_ADS)}, { analytics_storage: optOut ? "denied" : "granted" }));
gtag("consent", "default", Object.assign(${JSON.stringify(NO_ADS)}, { analytics_storage: "denied", region: ${JSON.stringify(COOKIELESS_REGIONS)} }));
gtag("js", new Date());
gtag("config", ${JSON.stringify(gaId)}, ${JSON.stringify(config)});
var queued = window.__olfiaGaQueue || [];
window.__olfiaGaQueue = [];
for (var i = 0; i < queued.length; i++) gtag.apply(null, queued[i]);
`;
}

export function Analytics({ gaId }: { gaId: string }) {
  const show = useToast((s) => s.show);
  const [me, setMe] = useState<boolean | null>(null);

  useEffect(() => {
    let mine = false;
    try {
      const url = new URL(window.location.href);
      const flag = url.searchParams.get("me");
      if (flag === "on") window.localStorage.setItem(ME_KEY, "1");
      if (flag === "off") window.localStorage.removeItem(ME_KEY);
      mine = window.localStorage.getItem(ME_KEY) === "1";
      if (flag === "on" || flag === "off") {
        url.searchParams.delete("me");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
        show(mine ? "This browser is marked as you. Its visits stay out of the reports." : "This browser counts as a visitor again.");
      }
    } catch {
      // storage blocked: count as a visitor
    }
    setMe(mine);
  }, [show]);

  if (me === null) return null;
  return (
    <>
      <Script id="olfia-ga-init" strategy="afterInteractive">{initScript(gaId, me)}</Script>
      <Script id="olfia-ga" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
    </>
  );
}
