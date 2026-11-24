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
 * - "This browser is me": open any page with ?me=on (?me=off undoes it). A marked browser does not
 *   load Google Analytics at all, so its visits are never counted. (Tested 11/15: gtag.js ignored a
 *   page-wide debug_mode, so debug mode could not be relied on to keep these visits out.)
 */

const COOKIELESS_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

const NO_ADS = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

function initScript(gaId: string): string {
  const config = { allow_google_signals: false, allow_ad_personalization_signals: false };
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
        show(mine ? "Visits from this browser are excluded from analytics." : "Visits from this browser are included in analytics again.");
      }
    } catch {
      // storage blocked: count as a visitor
    }
    if (mine) {
      window.__olfiaGaOff = true;
      window.__olfiaGaQueue = [];
    }
    setMe(mine);
  }, [show]);

  if (me === null || me) return null;
  return (
    <>
      <Script id="olfia-ga-init" strategy="afterInteractive">{initScript(gaId)}</Script>
      <Script id="olfia-ga" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
    </>
  );
}
