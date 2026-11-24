"use client";

import { useEffect, useMemo, useState } from "react";
import { familyById, sourceLabel } from "@/lib/catalog";
import { matchProducts, type Product } from "@/lib/products";
import { SCENT_MID, artFor, sameNote, splitNotes } from "@/lib/roomScent";
import type { Daypart, FamilyId, Season, SourceKind } from "@/lib/types";
import { loadShelf, saveShelf, shelfItemFor } from "@/lib/shelf";
import { useToast } from "@/lib/toast";
import { Icon } from "@/components/ui/Icon";
import { ProductLink } from "@/components/products/ProductLink";

/**
 * Recommended products (B tier). 11/9 feedback 10: larger cards, less text, one line saying why
 * it fits this room, one combined "when" filter.
 * 11/10: instead of product photos, every card carries the same Olfia name tile. Brand logos are the brands'
 * own trademark artwork, so they are not redrawn here.
 * Design round (11/24), her answer 10 of 11/23: the tile shows a cut-out of the same kind of product (from her
 * 01_objects set) and the brand name, over the family's mid tone. Types without a cut-out keep the name label.
 */

export function NameTile({ brand, kind, type, seed, family, height }: { brand: string; kind: string; type?: SourceKind; seed?: string; family: FamilyId; height?: number }) {
  const f = familyById(family);
  const art = type ? artFor(type, seed ?? brand) : undefined;
  if (art?.asset) {
    return (
      <span className="ptile ptile--art" style={{ backgroundColor: SCENT_MID[family], height }} aria-hidden="true">
        <span className="ptile__tex" style={{ backgroundImage: `url(${f.texture})` }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ptile__art" src={art.asset} alt="" />
        <span className="ptile__label ptile__label--corner">
          <span className="ptile__brand">{brand}</span>
        </span>
      </span>
    );
  }
  return (
    <span className="ptile" style={{ backgroundColor: f.hex, height }} aria-hidden="true">
      <span className="ptile__tex" style={{ backgroundImage: `url(${f.texture})` }} />
      <span className="ptile__label">
        <span className="ptile__brand">{brand}</span>
        <span className="ptile__rule" />
        <span className="ptile__type">{kind}</span>
      </span>
    </span>
  );
}

type When = "any" | "mornings" | "evenings" | "warm" | "cold";
const WHEN: Array<{ id: When; label: string }> = [
  { id: "any", label: "Any time" },
  { id: "mornings", label: "Mornings" },
  { id: "evenings", label: "Evenings" },
  { id: "warm", label: "Warm months" },
  { id: "cold", label: "Cold months" },
];
const WHEN_FILTER: Record<When, { season?: Season; daypart?: Daypart }> = {
  any: {},
  mornings: { daypart: "morning" },
  evenings: { daypart: "evening" },
  warm: { season: "summer" },
  cold: { season: "winter" },
};

/** Copy v1 (Tiffany 11/24, §4.3): "Shares the {family} scent family with your design." */
function sharesLine(shared: FamilyId[]): string {
  const names = shared.map((id) => familyById(id).label);
  return names.length === 1
    ? `Shares the ${names[0]} scent family with your design.`
    : `Shares the ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} scent families with your design.`;
}

export function ProductCard({ p, match, onSimilar, place }: { p: Product; match?: FamilyId[]; onSimilar?: (id: string) => void; place?: string }) {
  const f = familyById(p.families[0]);
  const shared = (match ?? []).filter((id) => p.families.includes(id));
  const why = shared.length ? sharesLine(shared) : p.families.map((id) => familyById(id).label).join(" and ");
  const body = (
    <>
      <NameTile brand={p.brand} kind={sourceLabel(p.type)} type={p.type} seed={p.id} family={f.id} />
      <span className="pcard__body">
        <span className="pcard__brand">{p.brand} · {sourceLabel(p.type)} · {p.tier}</span>
        <span className="pcard__name">{p.name}</span>
        <span className="pcard__why"><span className="chip__dot" style={{ background: f.hex }} />{why}</span>
        <span className="muted" style={{ fontSize: 15 }}>{p.notes}</span>
      </span>
    </>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {p.url ? (
        <ProductLink className="pcard" href={p.url} place={place} product={{ id: p.id, brand: p.brand, family: p.families[0], tier: p.tier }} ariaLabel={`${p.brand} ${p.name}, opens the brand’s website`}>
          {body}
          <span className="pcard__out"><Icon name="external" size={18} /></span>
        </ProductLink>
      ) : (
        <div className="pcard">{body}</div>
      )}
      {onSimilar ? <button type="button" className="hero__link" onClick={() => onSimilar(p.id)} style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 15 }}>Explore similar fragrances</button> : null}
    </div>
  );
}

const DAYPART_ORDER: Daypart[] = ["morning", "afternoon", "evening", "night"];
const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const joinAnd = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}` : xs[0] ?? "");

/** "Evening and night", "Any time of day" */
export function dayText(d: Daypart[]): string {
  const list = DAYPART_ORDER.filter((x) => d.includes(x));
  return list.length === 4 ? "Any time of day" : cap(joinAnd(list));
}

/** "Autumn and winter", "All year" */
export function seasonText(s: Season[]): string {
  const list = SEASON_ORDER.filter((x) => s.includes(x));
  return list.length === 4 ? "All year" : cap(joinAnd(list));
}

/** One word for the air of a room by family, used when no feeling has been chosen in Scent View (Claude's words). */
const FAMILY_MOOD: Record<FamilyId, string> = {
  floral: "soft",
  gourmand: "cozy",
  spicy: "warm",
  woody: "grounded",
  green: "green",
  citrus: "bright",
  fresh: "clean",
};

/**
 * "Why it fits your room", after the sentence in Tiffany's card sketch (11/24): the notes the product shares with the
 * room's tags (or its own first notes), the room's atmosphere, and the room.
 */
function whyFits(p: Product, roomNotes: string[], moods: string[], room: string): string {
  const own = splitNotes(p.notes);
  const shared = own.filter((n) => roomNotes.some((r) => sameNote(n, r)));
  const notes = (shared.length ? shared : own).slice(0, 2);
  const mood = moods.slice(0, 2).join(", ");
  return `${cap(joinAnd(notes))} ${notes.length > 1 ? "echo" : "echoes"} the ${mood} atmosphere you have created for your ${room}.`;
}

/**
 * Rooms' Fragrance Matches, second design (Tiffany's card sketch, 11/24): a wide card with the product's cut-out, its
 * name, families, why it fits the room and when it suits, then three actions: add it to the room, save it to the
 * Scent Atlas (the Fragrance Shelf), or open the brand's page.
 */
export function ProductMatchCard({ p, roomNotes = [], moods, room, onAdd, onSimilar }: { p: Product; roomNotes?: string[]; moods: string[]; room: string; onAdd?: (p: Product) => void; onSimilar?: (id: string) => void }) {
  const show = useToast((st) => st.show);
  const [onShelf, setOnShelf] = useState(false);
  useEffect(() => {
    setOnShelf(loadShelf().some((x) => x.productId === p.id));
  }, [p.id]);
  const price = p.price ? [p.price, p.size].filter(Boolean).join(" · ") : p.url ? null : "Available in stores only";
  const save = () => {
    if (onShelf) return;
    if (!saveShelf([shelfItemFor(p), ...loadShelf()])) {
      show("Couldn’t save this entry in your browser. Try freeing up storage and saving again.");
      return;
    }
    setOnShelf(true);
    show("Added to your Fragrance Shelf", "/atlas?tab=shelf", "Open");
  };
  return (
    <div className="pmatch-wrap">
      <article className="pmatch" aria-label={`${p.brand} ${p.name}`}>
        <div className="pmatch__top">
          <div className="pmatch__pic">
            <NameTile brand={p.brand} kind={sourceLabel(p.type)} type={p.type} seed={p.id} family={p.families[0]} />
          </div>
          <div className="pmatch__body">
            <h3 className="pmatch__name">{p.name}</h3>
            <span className="pmatch__meta">{p.brand} · {sourceLabel(p.type)}{price ? ` · ${price}` : ""}</span>
            <span className="pmatch__fams">
              {p.families.map((id) => (
                <span key={id} className="pmatch__fam"><span className="chip__dot" style={{ background: familyById(id).hex }} aria-hidden="true" />{familyById(id).label}</span>
              ))}
            </span>
            <span className="pmatch__h">Why it fits your room</span>
            <p className="pmatch__why">{whyFits(p, roomNotes, moods, room)}</p>
            <span className="pmatch__chips">
              <span className="pmatch__chip">{dayText(p.dayparts)}</span>
              <span className="pmatch__chip">{seasonText(p.seasons)}</span>
            </span>
          </div>
        </div>
        <div className="pmatch__actions">
          {onAdd ? <button type="button" className="pmatch__act" onClick={() => onAdd(p)}>Add to room</button> : null}
          <button type="button" className="pmatch__act" onClick={save} disabled={onShelf} aria-pressed={onShelf}>
            {onShelf ? <Icon name="check" size={16} /> : null}Save to Atlas
          </button>
          {p.url ? (
            <ProductLink className="pmatch__act" href={p.url} product={{ id: p.id, brand: p.brand, family: p.families[0], tier: p.tier }} ariaLabel={`Explore ${p.brand} ${p.name} on the brand’s website`}>
              Explore fragrance<Icon name="external" size={15} />
            </ProductLink>
          ) : null}
        </div>
      </article>
      {onSimilar ? <button type="button" className="hero__link" onClick={() => onSimilar(p.id)} style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 15 }}>Explore similar fragrances</button> : null}
    </div>
  );
}

export function ProductCards({
  families,
  roomNotes = [],
  feelings = [],
  room = "room",
  onAdd,
  title = "Recreate this at home",
  lead,
  limit = 4,
  compact = false,
}: {
  families: FamilyId[];
  roomNotes?: string[];
  /** the feelings chosen in Scent View, as words ("calm"); without any, the room's families give the atmosphere */
  feelings?: string[];
  /** what the room is ("reading corner", "bedroom") */
  room?: string;
  onAdd?: (p: Product) => void;
  title?: string;
  lead?: string;
  limit?: number;
  compact?: boolean;
}) {
  const moods = feelings.length ? feelings : families.length ? families.map((f) => FAMILY_MOOD[f]) : ["quiet"];
  const [when, setWhen] = useState<When>("any");
  const [similar, setSimilar] = useState<string | null>(null);

  // Rooms v2: among the family matches, products that share notes with the room's notes tags come first
  const noteKey = roomNotes.join("|");
  const list = useMemo(() => {
    const words = noteKey ? noteKey.split("|") : [];
    const pool = matchProducts({ families, ...WHEN_FILTER[when], similarTo: similar ?? undefined }, words.length ? limit * 3 : limit);
    if (!words.length) return pool;
    const shared = (p: Product) => splitNotes(p.notes).filter((n) => words.some((w) => sameNote(n, w))).length;
    return pool
      .map((p, i) => ({ p, i, s: shared(p) }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .slice(0, limit)
      .map((x) => x.p);
  }, [families, when, similar, limit, noteKey]);

  return (
    <section aria-label={title} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ fontSize: compact ? 26 : 30 }}>{title}</h2>
        {similar ? <button type="button" className="chip" onClick={() => setSimilar(null)}>Back to this room</button> : null}
      </div>
      {/* her note (11/24 evening): one paragraph across the full width */}
      {lead ? <p className="lead page-lead" style={{ margin: 0 }}>{lead}</p> : null}
      {!compact ? (
        <div className="chips" role="group" aria-label="When">
          {WHEN.map((w) => (
            <button key={w.id} type="button" className="chip chip--solid" aria-pressed={when === w.id} onClick={() => setWhen(w.id)}>{w.label}</button>
          ))}
        </div>
      ) : null}
      {list.length ? (
        <div className="pmatch-grid">
          {list.map((p) => <ProductMatchCard key={p.id} p={p} roomNotes={roomNotes} moods={moods} room={room} onAdd={onAdd} onSimilar={compact ? undefined : setSimilar} />)}
        </div>
      ) : (
        <p className="muted">No fragrances match these selections yet. Try another time filter or scent family.</p>
      )}
      <p className="muted" style={{ fontSize: 14 }}>Product links take you to the brand’s website. Olfia does not sell fragrances.</p>
    </section>
  );
}
