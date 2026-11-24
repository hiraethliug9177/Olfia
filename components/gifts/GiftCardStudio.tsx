"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { giftEntry, giftScenes, giftsFor, seasonFamily } from "@/lib/gifts";
import { productById } from "@/lib/products";
import { SITE_URL } from "@/lib/share";
import { useAtlas } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { sourceLabel } from "@/lib/catalog";
import { CutDefs } from "@/components/scene/Cutout";
import { ScenePage } from "@/components/scene/ScenePage";
import { ProductLink } from "@/components/products/ProductLink";
import { Icon } from "@/components/ui/Icon";
import { readDraft, writeDraft } from "@/components/gifts/GiftsView";

/**
 * The gift card (Tiffany 11/18): the pick's room on a scene page titled "For <name>", in a white frame with a
 * handwritten line, to download, share, send as a link or keep in the Scent Atlas. The product travels in the
 * address (?p=); the name, note and sender stay in this tab, and go into a shared link only after the # (which
 * analytics never reads), and are taken off the address as soon as the page opens.
 */
export function GiftCardStudio() {
  const params = useSearchParams();
  const p = productById(params.get("p") ?? "") ?? giftsFor(seasonFamily())[1];
  const scene = useMemo(() => giftScenes([p])[0], [p]);
  const add = useAtlas((s) => s.add);
  const show = useToast((s) => s.show);
  const cardRef = useRef<HTMLElement>(null);
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.has("to") || hash.has("note") || hash.has("from")) {
      const shared = { to: hash.get("to") ?? "", note: hash.get("note") ?? "", from: hash.get("from") ?? "" };
      setTo(shared.to);
      setNote(shared.note);
      setFrom(shared.from);
      writeDraft(shared);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      const d = readDraft();
      setTo(d.to ?? "");
      setNote(d.note ?? "");
      setFrom(d.from ?? "");
    }
  }, []);

  const name = to.trim();
  const price = p.price ? [p.price, p.size].filter(Boolean).join(" · ") : null;
  const link = () => {
    const h = new URLSearchParams();
    if (name) h.set("to", name);
    if (note.trim()) h.set("note", note.trim());
    if (from.trim()) h.set("from", from.trim());
    const tail = h.toString();
    return `${SITE_URL}/gifts/card?p=${p.id}${tail ? `#${tail}` : ""}`;
  };

  const render = async (): Promise<Blob | null> => {
    const node = cardRef.current;
    if (!node) return null;
    const { toBlob } = await import("html-to-image");
    const opts = { pixelRatio: 1080 / node.offsetWidth, cacheBust: true, backgroundColor: "#ffffff" };
    try {
      return await toBlob(node, opts);
    } catch {
      return await toBlob(node, { ...opts, skipFonts: true });
    }
  };

  const download = async (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const fileName = `olfia-gift-card-${p.id}.png`;

  const onDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await render();
      if (!blob) throw new Error("no image");
      await download(blob, fileName);
      track("gift_card", { action: "download", product: p.id });
      show("Gift card saved");
    } catch {
      show("Couldn’t create the image. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const onShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await render();
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      const file = blob ? new File([blob], fileName, { type: "image/png" }) : null;
      if (file && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: name ? `For ${name}` : "A gift card", url: link() });
      } else {
        await nav.share({ title: name ? `For ${name}` : "A gift card", url: link() });
      }
      track("gift_card", { action: "share", product: p.id });
    } catch {
      // closed the share sheet
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(link());
      track("gift_card", { action: "link", product: p.id });
      show("Link copied");
    } catch {
      show("Couldn’t copy the link. Try again.");
    }
  };

  const onSave = () => {
    add(giftEntry(scene, name ? `For ${name} · ${p.name}` : p.name));
    setSaved(true);
    track("gift_card", { action: "save", product: p.id });
    show("Saved to your Scent Atlas", "/atlas", "Open");
  };

  return (
    <div className="wrap page gift-card-page">
      <Link href="/gifts?for=someone" className="article__back"><Icon name="arrowLeft" size={18} />Gifts</Link>

      <div className="gift-card-layout">
        <div className="gift-card-tilt">
          <figure ref={cardRef} className="gift-card">
            <CutDefs prefix="gc" />
            <ScenePage items={scene.items} families={p.families} title={name ? `For ${name}` : "For you"} time={scene.time} strength={75} showLabels={false} prefix="gc" />
            <figcaption className="gift-card__caption">
              {note.trim() ? <span className="gift-card__note">{note.trim()}</span> : null}
              {from.trim() ? <span className="gift-card__from">— {from.trim()}</span> : null}
              <span className="gift-card__meta"><span>{p.brand} · {p.name}</span><span>olfia.studio</span></span>
            </figcaption>
          </figure>
        </div>

        <section className="gift-card-panel" aria-labelledby="gift-card-h">
          <h1 id="gift-card-h" className="gift-card-panel__title">{name ? `For ${name}` : "Gift card"}</h1>
          <p className="gift-card-panel__lead">Make a personal card with a fragrance in mind, and add a few words for the person you’re thinking of.</p>
          <div className="gift-field">
            <label htmlFor="gc-to">To</label>
            <input id="gc-to" className="input" value={to} maxLength={40} autoComplete="off" placeholder="Their name" onChange={(e) => { setTo(e.target.value); writeDraft({ to: e.target.value }); }} />
          </div>
          <div className="gift-field">
            <label htmlFor="gc-note">Note</label>
            <textarea id="gc-note" className="input" rows={3} value={note} maxLength={120} onChange={(e) => { setNote(e.target.value); writeDraft({ note: e.target.value }); }} />
          </div>
          <div className="gift-field">
            <label htmlFor="gc-from">From</label>
            <input id="gc-from" className="input" value={from} maxLength={40} autoComplete="off" placeholder="Your name" onChange={(e) => { setFrom(e.target.value); writeDraft({ from: e.target.value }); }} />
          </div>

          <div className="gift-card-panel__product">
            <span>
              <span className="gift-pick__brand">{p.brand} · {sourceLabel(p.type)}</span>
              <span className="gift-card-panel__name">{p.name}</span>
              {price ? <span className="gift-pick__price">{price}</span> : null}
            </span>
            {p.url ? (
              <ProductLink href={p.url} product={{ id: p.id, brand: p.brand, family: p.families[0], tier: p.tier }} className="hero__link gift-card-panel__out">
                View on {p.brand}’s website<Icon name="external" size={18} />
              </ProductLink>
            ) : null}
          </div>

          <div className="gift-card-panel__actions">
            <button type="button" className="btn btn--primary" onClick={onDownload} disabled={busy}><Icon name="download" size={18} />Save image</button>
            {canShare ? <button type="button" className="btn btn--ghost" onClick={onShare} disabled={busy}><Icon name="share" size={18} />Share</button> : null}
            <button type="button" className="btn btn--ghost" onClick={onCopy}><Icon name="link" size={18} />Copy link</button>
            <button type="button" className="btn btn--ghost" onClick={onSave} disabled={saved}><Icon name={saved ? "bookmarkCheck" : "bookmark"} size={18} />{saved ? "Saved to Scent Atlas" : "Save to Scent Atlas"}</button>
          </div>
        </section>
      </div>
    </div>
  );
}
