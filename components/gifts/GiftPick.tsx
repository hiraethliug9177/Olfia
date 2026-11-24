"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { familyById, sourceLabel } from "@/lib/catalog";
import { giftEntry, type GiftScene } from "@/lib/gifts";
import { loadShelf, saveShelf, shelfItemFor } from "@/lib/shelf";
import { useAtlas } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import type { Product } from "@/lib/products";
import { Icon } from "@/components/ui/Icon";
import { ProductLink } from "@/components/products/ProductLink";
import { dayText, seasonText } from "@/components/products/ProductCards";
import { GiftRoom } from "@/components/gifts/GiftRoom";

/**
 * One gift pick (Tiffany 11/18): its room, then what it is, its size and price, its notes, when it suits and its
 * families. For someone else: make a gift card, keep it in the Scent Atlas, or open the brand's page. For myself: put it
 * on the Fragrance Shelf, make a Scent Card from its room, or open the brand's page.
 */
export function GiftPick({ scene, mode, to = "" }: { scene: GiftScene; mode: "me" | "someone"; to?: string }) {
  const { p } = scene;
  const router = useRouter();
  const add = useAtlas((s) => s.add);
  const show = useToast((s) => s.show);
  const [saved, setSaved] = useState(false);
  const [onShelf, setOnShelf] = useState(false);

  useEffect(() => {
    if (mode === "me") setOnShelf(loadShelf().some((s) => s.productId === p.id));
  }, [mode, p.id]);

  const name = to.trim();
  const price = p.price ? [p.price, p.size].filter(Boolean).join(" · ") : p.url ? null : "Available in stores only";
  const brandLink = p.url ? (
    <ProductLink href={p.url} product={{ id: p.id, brand: p.brand, family: p.families[0], tier: p.tier }} className="gift-pick__icon" ariaLabel={`View on ${p.brand}’s website`}>
      <Icon name="external" size={18} />
    </ProductLink>
  ) : null;

  const saveToAtlas = () => {
    add(giftEntry(scene, name ? `For ${name} · ${p.name}` : p.name));
    setSaved(true);
    track("gift_save", { to: "atlas", product: p.id });
    show("Saved to your Scent Atlas", "/atlas", "Open");
  };

  const saveToShelf = () => {
    if (onShelf) return;
    if (!saveShelf([shelfItemFor(p), ...loadShelf()])) {
      show("Couldn’t save this entry in your browser. Try freeing up storage and saving again.");
      return;
    }
    setOnShelf(true);
    track("gift_save", { to: "shelf", product: p.id });
    show("Added to your Fragrance Shelf", "/atlas?tab=shelf", "Open");
  };

  const makeScentCard = () => {
    const entry = giftEntry(scene, p.name);
    add(entry);
    router.push(`/card?from=${entry.id}`);
  };

  return (
    <article className="gift-pick">
      <GiftRoom scene={scene} />
      <div className="gift-pick__body">
        <span className="gift-pick__brand">{p.brand} · {sourceLabel(p.type)}</span>
        <h3 className="gift-pick__name">{p.name}</h3>
        {price ? <span className="gift-pick__price">{price}</span> : null}
        <span className="gift-pick__notes">
          {p.notes.split(" · ").map((n) => <span key={n} className="pdetail__note">{n}</span>)}
        </span>
        <span className="gift-pick__when"><Icon name="clock" size={18} />{dayText(p.dayparts)} · {seasonText(p.seasons)}</span>
        <span className="gift-pick__fams">
          {p.families.map((id) => <span key={id} className="chip__dot" style={{ background: familyById(id).hex }} aria-hidden="true" />)}
          {p.families.map((id) => familyById(id).label).join(" and ")}
        </span>
        <div className="gift-pick__actions">
          {mode === "someone" ? (
            <>
              <Link
                href={`/gifts/card?p=${p.id}`}
                className="btn btn--primary btn--sm gift-pick__main"
                onClick={() => track("gift_card", { action: "open", product: p.id })}
              >
                <Icon name="gift" size={18} />Make a gift card
              </Link>
              <button type="button" className="gift-pick__icon" onClick={saveToAtlas} disabled={saved} aria-label={saved ? "Saved to Scent Atlas" : "Save to Scent Atlas"}>
                <Icon name={saved ? "bookmarkCheck" : "bookmark"} size={18} />
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn--primary btn--sm gift-pick__main" onClick={saveToShelf} disabled={onShelf}>
                <Icon name={onShelf ? "bookmarkCheck" : "bookmark"} size={18} />{onShelf ? "On your Fragrance Shelf" : "Save to Fragrance Shelf"}
              </button>
              <button type="button" className="gift-pick__icon" onClick={makeScentCard} aria-label="Make a Scent Card">
                <Icon name="image" size={18} />
              </button>
            </>
          )}
          {brandLink}
        </div>
      </div>
    </article>
  );
}
