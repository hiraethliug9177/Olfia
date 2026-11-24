"use client";

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * A deck of cards you leaf through with two buttons (Tiffany 11/24, "Tactile Card Deck Interaction System"), used by
 * the four parts of About Olfia. One card sits in front and the next two peek out behind it. Next lifts the front
 * card, turns it a little and carries it off to the left while it fades, and the card behind rises into its place;
 * Previous brings the last card back on top. Every card keeps its shape the whole way.
 *
 * Motion and navigation live here; how a card looks lives in the four looks below (CSS `.deck--<look>`):
 * - vocabulary-card       The Concept: a landscape index card
 * - file-folder           How it Works: a folder with its tab
 * - existing-creator-card The Creator: the letter cards exactly as they were
 * - square-receipt        The Science: a near-square printed receipt
 *
 * - One spring for every deck (`--deck-ease` in globals.css, 560 ms, about 0.7% overshoot). CSS transitions pick up
 *   from wherever a card is, so quick clicks stay smooth.
 * - Stacking never jumps: the card leaving stays above the one arriving (z 51 over 50), the cards behind count down
 *   from 49, so the order on screen always matches the order in the deck.
 * - All cards share one grid cell, so the deck is as tall as its tallest card and nothing below moves.
 * - The cards behind are inert and hidden from screen readers; a polite live line says which card is in front.
 * - Reduced motion: the site-wide rule makes every change instant.
 */

export type DeckLook = "vocabulary-card" | "file-folder" | "existing-creator-card" | "square-receipt";

export interface DeckCard {
  key: string;
  /** the card's name for screen readers */
  label: string;
  content: ReactNode;
}

/** Where the cards behind peek out, per look (px per step, degrees per step, how much smaller per step). */
const STACK: Record<DeckLook, { x: number; y: number; rot: readonly number[]; shrink: number; shadow: boolean }> = {
  "vocabulary-card": { x: 16, y: 14, rot: [0, 1.4, -1.1, 0.6], shrink: 0.028, shadow: true },
  "file-folder": { x: 0, y: -15, rot: [0, 0, 0, 0], shrink: 0.022, shadow: true },
  "existing-creator-card": { x: 14, y: 14, rot: [0, -1.3, 1, -0.6], shrink: 0.028, shadow: false },
  "square-receipt": { x: -14, y: 16, rot: [0, 2.2, -1.7, 1.2], shrink: 0.028, shadow: true },
};
/** cards visible behind the front one */
const BEHIND = 2;

function shadow(depth: number): string {
  const lift = Math.max(0, 1 - depth * 0.38);
  return `drop-shadow(0 ${4 + 14 * lift}px ${8 + 18 * lift}px rgba(41, 42, 49, ${(0.08 + 0.1 * lift).toFixed(3)}))`;
}

function place(look: DeckLook, off: number): CSSProperties {
  const s = STACK[look];
  if (off < 0) {
    // gone: lifted, turned and carried off to the left as it fades (the newest one stays above the card arriving)
    return {
      transform: "translate3d(-44%, -5%, 0) rotate(-7deg) scale(0.97)",
      opacity: 0,
      zIndex: 52 + off,
      filter: s.shadow ? shadow(0.6) : undefined,
    };
  }
  const d = Math.min(off, BEHIND + 1);
  return {
    transform: `translate3d(${s.x * d}px, ${s.y * d}px, 0) rotate(${s.rot[d]}deg) scale(${(1 - s.shrink * d).toFixed(3)})`,
    opacity: off > BEHIND ? 0 : 1,
    zIndex: 50 - off,
    filter: s.shadow ? shadow(d) : undefined,
  };
}

export function CardDeck({ label, look, head, intro, aside, cards, className }: {
  label: string;
  look: DeckLook;
  /** the title row (the buttons sit at its end) */
  head?: ReactNode;
  /** a line or two between the title row and the deck */
  intro?: ReactNode;
  /** something that stays put beside the deck (the Creator's photo) */
  aside?: ReactNode;
  cards: DeckCard[];
  className?: string;
}) {
  const [front, setFront] = useState(0);
  const n = cards.length;
  const go = (dir: 1 | -1) => setFront((f) => Math.min(n - 1, Math.max(0, f + dir)));
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  return (
    <div className={`deck deck--${look} ${className ?? ""}`}>
      <div className="deck__head">
        <div className="deck__title">{head}</div>
        <div className="deck__nav">
          <button type="button" className="deck__btn" aria-label="Previous" disabled={front === 0} onClick={() => go(-1)}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <button type="button" className="deck__btn" aria-label="Next" disabled={front === n - 1} onClick={() => go(1)}>
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </div>
      {intro ? <div className="deck__intro">{intro}</div> : null}
      <div className={`deck__body${aside ? " deck__body--aside" : ""}`}>
        {aside}
        <div className="deck__stage" role="region" aria-label={label} tabIndex={0} onKeyDown={onKey}>
          {cards.map((c, i) => {
            const off = i - front;
            return (
              <div key={c.key} className={`deck__slot${off < 0 ? " is-gone" : ""}`} style={place(look, off)} aria-hidden={off !== 0} inert={off !== 0}>
                {c.content}
              </div>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{`${front + 1} / ${n}`}</p>
    </div>
  );
}
