"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Cards that scroll sideways (Tiffany 11/24: The Concept, How it Works and the Creator letter "改成横向滚动").
 * The track snaps card by card; the next card peeks in at the edge so it is clear there is more. Two round arrow
 * buttons sit at the end of the head row for mouse users; touch and trackpads swipe, the keyboard scrolls the track
 * once it has focus. With reduced motion the arrows jump instead of gliding.
 */
export function CardRail({ label, head, intro, aside, children, className }: {
  label: string;
  head?: ReactNode;
  /** a line or two between the head row and the cards */
  intro?: ReactNode;
  /** something that stays put beside the cards (the Creator's photo) */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setAtStart(t.scrollLeft <= 4);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const t = track.current;
    if (!t) return;
    const ro = new ResizeObserver(update);
    ro.observe(t);
    return () => ro.disconnect();
  }, [update]);

  const step = (dir: 1 | -1) => {
    const t = track.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={`rail ${className ?? ""}`}>
      <div className="rail__head">
        <div className="rail__title">{head}</div>
        <div className="rail__nav">
          <button type="button" className="rail__btn" aria-label="Previous" disabled={atStart} onClick={() => step(-1)}><Icon name="chevronLeft" size={20} /></button>
          <button type="button" className="rail__btn" aria-label="Next" disabled={atEnd} onClick={() => step(1)}><Icon name="chevronRight" size={20} /></button>
        </div>
      </div>
      {intro ? <div className="rail__intro">{intro}</div> : null}
      <div className={`rail__body${aside ? " rail__body--aside" : ""}`}>
        {aside}
        <div ref={track} className="rail__track" role="region" aria-label={label} tabIndex={0} onScroll={update}>
          {children}
        </div>
      </div>
    </div>
  );
}
