"use client";

import { useEffect, type RefObject } from "react";

/**
 * On a phone the filter rows scroll sideways; this keeps each row's chosen tab in view, for example when
 * a link opens Picks or Gifts on a family further along the row. It moves the row only, never the page.
 */
export function useTabInView(ref: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(".np-tabs").forEach((row) => {
      const on = row.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!on || row.scrollWidth <= row.clientWidth) return;
      const left = on.getBoundingClientRect().left - row.getBoundingClientRect().left;
      if (left < 0 || left + on.offsetWidth > row.clientWidth) row.scrollLeft += left - 20;
    });
  }, [ref, key]);
}
