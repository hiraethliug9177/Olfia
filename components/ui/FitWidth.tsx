"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scales a fixed-size block so its full width always fits (the Atlas calendar's seven columns).
 *  `max` above 1 lets it grow too, so the block fills a wide panel edge to edge. */
export function FitWidth({ width, height, max = 1, children }: { width: number; height: number; max?: number; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(max, el.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, max]);
  return (
    <div ref={box} style={{ width: "100%", height: height * scale, overflow: "hidden" }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
}
