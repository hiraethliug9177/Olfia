"use client";

import { useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FAMILIES } from "@/lib/catalog";
import { PICK_ROOMS, TIERS, pickList, tierFromParam, tierParam } from "@/lib/picks";
import { ProductCard } from "@/components/products/ProductCards";
import { useTabInView } from "@/components/picks/useTabInView";
import type { FamilyId } from "@/lib/types";

/**
 * Every recommended product, filtered by scent family, room and price: the "All gifts" part of the Gifts page
 * (Picks until Tiffany folded it into Gifts on 11/17). The choice lives in the address
 * (?family=woody&room=kitchen&price=2), so a filtered list can be linked from a story or from a gift family.
 */
const isFamily = (v: string | null): v is FamilyId => FAMILIES.some((f) => f.id === v);

export function PicksList() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const fam = params.get("family");
  const family = isFamily(fam) ? fam : null;
  const room = PICK_ROOMS.find((r) => r.id === params.get("room")) ?? null;
  const tier = tierFromParam(params.get("price"));

  const set = (key: "family" | "room" | "price", value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const q = next.toString();
    router.replace(q ? `${path}?${q}` : path, { scroll: false });
  };

  const list = useMemo(() => pickList({ family, room, tier }), [family, room, tier]);
  const filters = useRef<HTMLDivElement>(null);
  useTabInView(filters, `${family}-${room?.id}-${tier}`);

  return (
    <div className="picks">
      <div className="np-filters" ref={filters}>
        <div className="np-tabs" role="group" aria-label="Scent family">
          <button type="button" className="np-tab" aria-pressed={!family} onClick={() => set("family", null)}>All families</button>
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" className="np-tab np-tab--dot" aria-pressed={family === f.id} onClick={() => set("family", f.id)}>
              <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />{f.label}
            </button>
          ))}
        </div>
        <div className="np-tabs np-tabs--quiet" role="group" aria-label="Room">
          <button type="button" className="np-tab" aria-pressed={!room} onClick={() => set("room", null)}>All rooms</button>
          {PICK_ROOMS.map((r) => (
            <button key={r.id} type="button" className="np-tab" aria-pressed={room?.id === r.id} onClick={() => set("room", r.id)}>{r.label}</button>
          ))}
        </div>
        <div className="np-tabs np-tabs--quiet" role="group" aria-label="Price">
          <button type="button" className="np-tab" aria-pressed={!tier} onClick={() => set("price", null)}>All prices</button>
          {TIERS.map((t) => (
            <button key={t} type="button" className="np-tab" aria-pressed={tier === t} onClick={() => set("price", tierParam(t))}>{t}</button>
          ))}
        </div>
      </div>

      {list.length ? (
        <div className="pcard-grid" aria-live="polite">
          {list.map((p) => <ProductCard key={p.id} p={p} place="gifts-all" />)}
        </div>
      ) : (
        <p className="muted">Nothing matches that combination yet.</p>
      )}
    </div>
  );
}
