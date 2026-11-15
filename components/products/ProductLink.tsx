"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** Where on the site a link sits, from the page path: "/rooms/…" → "rooms", "/" → "home". */
export function placeFromPath(path: string | null): string {
  return (path ?? "/").split("/").filter(Boolean)[0] ?? "home";
}

type Props = {
  href: string;
  product: { id: string; brand?: string; family?: string; tier?: string };
  /** Overrides the place read from the page path. */
  place?: string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
};

/** An outbound product link that reports product_click: which product, its family, and where on the site. */
export function ProductLink({ href, product, place, className, style, ariaLabel, children }: Props) {
  const path = usePathname();
  const send = () =>
    track("product_click", {
      product_id: product.id,
      place: place ?? placeFromPath(path),
      ...(product.brand ? { brand: product.brand } : {}),
      ...(product.family ? { family: product.family } : {}),
      ...(product.tier ? { tier: product.tier } : {}),
    });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={send}
      onAuxClick={(e) => { if (e.button === 1) send(); }}
    >
      {children}
    </a>
  );
}
