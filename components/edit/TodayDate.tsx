"use client";

import { useEffect, useState } from "react";

/**
 * Today's date for The Olfia Edit masthead, like a newspaper's (Tiffany 11/18: the date at the top was out of step).
 * The page is built ahead of time, so the date is read in the visitor's browser, in their own time zone, and checked
 * again whenever the tab comes back into view (a tab left open overnight moves to the new day).
 */
const FORMAT: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };

function today(): { text: string; iso: string } {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { text: d.toLocaleDateString("en-US", FORMAT), iso };
}

export function TodayDate({ className }: { className?: string }) {
  const [now, setNow] = useState<{ text: string; iso: string } | null>(null);
  useEffect(() => {
    const update = () => setNow(today());
    update();
    const onVisible = () => { if (document.visibilityState === "visible") update(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);
  return (
    <time className={className} dateTime={now?.iso}>
      {now ? now.text : " "}
    </time>
  );
}
