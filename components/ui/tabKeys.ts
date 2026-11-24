import type { KeyboardEvent } from "react";

/**
 * Arrow keys for a row of tabs (the ARIA tabs pattern): Left and Right move to the neighbouring tab and open it,
 * Home and End go to the first and last. Only the open tab is in the Tab order, so the row is one stop.
 * Used by the two studios (Rooms and Scent Card, 11/24 handoff).
 */
export function onTabKeys(e: KeyboardEvent<HTMLElement>, count: number, current: number, go: (index: number) => void) {
  let next = -1;
  if (e.key === "ArrowRight") next = (current + 1) % count;
  else if (e.key === "ArrowLeft") next = (current - 1 + count) % count;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = count - 1;
  if (next < 0) return;
  e.preventDefault();
  go(next);
  e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
}
