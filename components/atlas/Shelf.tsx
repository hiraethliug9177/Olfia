"use client";

import { useEffect, useRef, useState } from "react";
import { FAMILIES, SOURCE_OPTIONS, familyById, sourceLabel } from "@/lib/catalog";
import { ROUTINES, loadShelf, readLink, saveShelf, shrinkPhoto, type LinkGuess, type Routine, type ShelfItem } from "@/lib/shelf";
import { newId } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import type { FamilyId, SourceKind } from "@/lib/types";
import { NameTile } from "@/components/products/ProductCards";
import { Icon } from "@/components/ui/Icon";

/**
 * My shelf (Tiffany 11/10): favourite products and everyday home fragrance. Paste a product link and
 * the page is read into a product card (name, brand, type, families, picture where the shop shares
 * one), or upload a photo of the bottle on your own shelf. Everything can be corrected before saving.
 */

type Mode = "link" | "photo";

interface Draft {
  name: string;
  brand: string;
  kind: SourceKind;
  families: FamilyId[];
  routine: Routine;
  note: string;
  url?: string;
  image?: string;
  imageFrom?: "upload" | "link";
  productId?: string;
}

const EMPTY: Draft = { name: "", brand: "", kind: "candle", families: [], routine: "daily", note: "" };

function ShelfPicture({ item, height = 180 }: { item: Pick<ShelfItem, "image" | "brand" | "kind" | "families">; height?: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [item.image]);
  if (item.image && !failed) {
    return (
      <span className="shelf-card__pic" style={{ height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      </span>
    );
  }
  return <NameTile brand={item.brand || "Your scent"} kind={sourceLabel(item.kind)} family={item.families[0] ?? "fresh"} height={height} />;
}

export function Shelf() {
  const show = useToast((s) => s.show);
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [mode, setMode] = useState<Mode>("link");
  const [link, setLink] = useState("");
  const [reading, setReading] = useState(false);
  const [guess, setGuess] = useState<LinkGuess | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setItems(loadShelf()), []);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const read = async () => {
    setError("");
    if (!link.trim()) return;
    setReading(true);
    const g = await readLink(link);
    setReading(false);
    if (!g) { setError("That doesn't look like a web address."); return; }
    setGuess(g);
    setDraft({ ...EMPTY, name: g.name, brand: g.brand, kind: g.kind, families: g.families, url: g.url, image: g.image, imageFrom: g.image ? "link" : undefined, productId: g.productId });
    track("shelf_link_read", { from: g.from, matched: g.productId ? 1 : 0 });
  };

  const onPhoto = async (file: File | undefined) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose a photo."); return; }
    try {
      const data = await shrinkPhoto(file);
      setDraft((d) => ({ ...(d ?? EMPTY), image: data, imageFrom: "upload" }));
    } catch {
      setError("That photo could not be opened. Try a JPEG or PNG.");
    }
  };

  const toggleFam = (id: FamilyId) =>
    set("families", draft?.families.includes(id) ? draft.families.filter((f) => f !== id) : [...(draft?.families ?? []), id].slice(-2));

  const reset = () => { setDraft(null); setGuess(null); setLink(""); setError(""); if (fileRef.current) fileRef.current.value = ""; };

  const add = () => {
    if (!draft || !draft.name.trim()) { setError("Give it a name first."); return; }
    const item: ShelfItem = {
      id: newId(),
      createdAt: new Date().toISOString(),
      name: draft.name.trim(),
      brand: draft.brand.trim(),
      kind: draft.kind,
      families: draft.families,
      routine: draft.routine,
      note: draft.note.trim(),
      url: draft.url,
      image: draft.image,
      imageFrom: draft.imageFrom,
      productId: draft.productId,
    };
    const next = [item, ...items];
    if (!saveShelf(next)) {
      // most likely the browser is out of room for photos; keep the item without its picture
      const lighter = [{ ...item, image: item.imageFrom === "link" ? item.image : undefined }, ...items];
      if (!saveShelf(lighter)) { setError("This browser is out of space. Remove an item and try again."); return; }
      setItems(lighter);
      show("Added to your shelf without the photo (the browser is full)");
    } else {
      setItems(next);
      show("Added to your shelf");
    }
    track("shelf_item_added", { mode: draft.imageFrom === "upload" ? "photo" : "link" });
    reset();
  };

  const remove = (id: string) => {
    if (!window.confirm("Remove this from your shelf?")) return;
    const next = items.filter((i) => i.id !== id);
    saveShelf(next);
    setItems(next);
  };

  return (
    <div className="shelf">
      <section className="shelf-add" aria-labelledby="shelf-add-h">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 id="shelf-add-h" style={{ fontSize: 30 }}>Add to my shelf</h2>
          <div role="tablist" aria-label="Add by" className="seg" style={{ width: 320, maxWidth: "100%" }}>
            <span className="seg__thumb" aria-hidden="true" style={{ left: mode === "link" ? 5 : "50%", width: "calc(50% - 5px)", background: "var(--moss)" }} />
            <button type="button" role="tab" aria-selected={mode === "link"} className="seg__opt" onClick={() => setMode("link")}>Paste a link</button>
            <button type="button" role="tab" aria-selected={mode === "photo"} className="seg__opt" onClick={() => setMode("photo")}>Upload a photo</button>
          </div>
        </div>

        {mode === "link" ? (
          <form className="shelf-row" onSubmit={(e) => { e.preventDefault(); void read(); }}>
            <label className="sr-only" htmlFor="shelf-link">Product link</label>
            <span className="shelf-input">
              <Icon name="link" />
              <input id="shelf-link" className="input" type="url" inputMode="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.diptyqueparis.com/…" />
            </span>
            <button type="submit" className="btn btn--moss" disabled={reading || !link.trim()}>{reading ? "Reading…" : "Make the card"}</button>
          </form>
        ) : (
          <div className="shelf-row">
            <label className="shelf-drop">
              <Icon name="imagePlus" size={24} />
              <span>{draft?.imageFrom === "upload" ? "Choose another photo" : "Choose a photo of your bottle, candle or diffuser"}</span>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void onPhoto(e.target.files?.[0])} />
            </label>
            {!draft ? <button type="button" className="btn btn--ghost" onClick={() => setDraft({ ...EMPTY })}>Skip the photo</button> : null}
          </div>
        )}
        {error ? <p className="error" role="alert">{error}</p> : null}
        {guess && mode === "link" ? (
          <p className="muted" style={{ fontSize: 15 }}>
            {guess.productId ? "Found it in Olfia's product list." : guess.from === "page" ? "Read from the product page. Check the details below." : "Read from the address. Check the details below."}
          </p>
        ) : null}

        {draft ? (
          <div className="shelf-draft">
            <div className="shelf-card shelf-card--preview" aria-label="Preview">
              <ShelfPicture item={draft} height={200} />
              <span className="shelf-card__body">
                <span className="pcard__brand">{draft.brand || "Brand"} · {sourceLabel(draft.kind)}</span>
                <span className="pcard__name">{draft.name || "Name"}</span>
                <span className="shelf-card__fams">
                  {draft.families.map((f) => <span key={f} className="tag" style={{ minHeight: 26, fontSize: 13 }}><span className="chip__dot" style={{ width: 10, height: 10, background: familyById(f).hex, marginRight: 6 }} />{familyById(f).label}</span>)}
                </span>
                <span className="hand" style={{ fontSize: 22 }}>{ROUTINES.find((r) => r.id === draft.routine)?.label.toLowerCase()}</span>
              </span>
            </div>

            <div className="shelf-fields">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <label className="field" style={{ flex: "1 1 220px" }}>Name<input className="input" value={draft.name} onChange={(e) => set("name", e.target.value)} maxLength={80} placeholder="Feu de Bois" /></label>
                <label className="field" style={{ flex: "1 1 180px" }}>Brand<input className="input" value={draft.brand} onChange={(e) => set("brand", e.target.value)} maxLength={40} placeholder="Diptyque" /></label>
              </div>
              <span className="label-mono">Type</span>
              <div className="chips">
                {SOURCE_OPTIONS.filter((o) => o.id !== "fragrance-free").map((o) => (
                  <button key={o.id} type="button" className="chip" aria-pressed={draft.kind === o.id} onClick={() => set("kind", o.id)}>{o.label}</button>
                ))}
              </div>
              <span className="label-mono">Families <span className="field__hint">(up to two)</span></span>
              <div className="chips">
                {FAMILIES.map((f) => (
                  <button key={f.id} type="button" className="chip" aria-pressed={draft.families.includes(f.id)} onClick={() => toggleFam(f.id)}>
                    <span className="chip__dot" style={{ background: f.hex }} />{f.label}
                  </button>
                ))}
              </div>
              <span className="label-mono">How you use it</span>
              <div className="chips">
                {ROUTINES.map((r) => (
                  <button key={r.id} type="button" className="chip" aria-pressed={draft.routine === r.id} onClick={() => set("routine", r.id)}>{r.label}</button>
                ))}
              </div>
              <label className="field"><span>A note <span className="field__hint">(optional)</span></span>
                <input className="input" value={draft.note} onChange={(e) => set("note", e.target.value)} maxLength={120} placeholder="Two sprays in the hallway before guests arrive" />
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button type="button" className="btn btn--moss" onClick={add}>Add to my shelf</button>
                <button type="button" className="btn btn--ghost" onClick={reset}>Cancel</button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {items.length ? (
        <div className="shelf-grid">
          {items.map((it) => (
            <article key={it.id} className="shelf-card">
              <ShelfPicture item={it} />
              <span className="shelf-card__body">
                <span className="pcard__brand">{it.brand || "—"} · {sourceLabel(it.kind)}</span>
                <span className="pcard__name" style={{ fontSize: 24 }}>{it.name}</span>
                {it.families.length ? (
                  <span className="shelf-card__fams">
                    {it.families.map((f) => <span key={f} className="tag" style={{ minHeight: 26, fontSize: 13 }}><span className="chip__dot" style={{ width: 10, height: 10, background: familyById(f).hex, marginRight: 6 }} />{familyById(f).label}</span>)}
                  </span>
                ) : null}
                <span className="hand" style={{ fontSize: 22 }}>{ROUTINES.find((r) => r.id === it.routine)?.label.toLowerCase()}{it.note ? ` · ${it.note}` : ""}</span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {it.url ? <a href={it.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm" style={{ height: 38 }}>Open link<Icon name="external" size={16} /></a> : null}
                  <button type="button" className="btn btn--ghost btn--sm" style={{ height: 38 }} onClick={() => remove(it.id)} aria-label={`Remove ${it.name}`}><Icon name="trash" size={16} />Remove</button>
                </span>
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className="hand" style={{ fontSize: 26, color: "var(--moss)" }}>nothing on your shelf yet</p>
      )}
    </div>
  );
}
