"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FAMILIES, familyById } from "@/lib/catalog";
import { FAMILY_WASH } from "@/lib/colors";
import { giftsFor } from "@/lib/gifts";
import { loadQuiz } from "@/lib/quiz";
import { track } from "@/lib/analytics";
import { ProductCard } from "@/components/products/ProductCards";
import { useTabInView } from "@/components/picks/useTabInView";
import type { FamilyId } from "@/lib/types";

/**
 * Gifts by scent family, one gift per price tier (Tiffany 11/17). Someone who has taken the quiz opens on
 * their own family, marked "you"; no quiz characters are shown (her 11/10 rule). ?family= picks a family.
 */
const isFamily = (v: string | null): v is FamilyId => FAMILIES.some((f) => f.id === v);

export function GiftGuide() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [mine, setMine] = useState<FamilyId | null>(null);

  useEffect(() => {
    setMine(loadQuiz()?.family ?? null);
  }, []);

  const asked = params.get("family");
  const family: FamilyId = isFamily(asked) ? asked : (mine ?? FAMILIES[0].id);
  const f = familyById(family);
  const tabs = useRef<HTMLDivElement>(null);
  useTabInView(tabs, family);

  const choose = (id: FamilyId) => {
    router.replace(`${path}?family=${id}`, { scroll: false });
    track("gift_family", { family: id });
  };

  return (
    <div className="gifts" ref={tabs}>
      <div className="np-tabs" role="group" aria-label="Scent family">
        {FAMILIES.map((x) => (
          <button key={x.id} type="button" className="np-tab np-tab--dot" aria-pressed={family === x.id} onClick={() => choose(x.id)}>
            <span className="chip__dot" style={{ background: x.hex }} aria-hidden="true" />
            {x.label}
            {mine === x.id ? <span className="hand gifts__you">you</span> : null}
          </button>
        ))}
      </div>

      <section className="gifts__panel" style={{ background: FAMILY_WASH[family] }} aria-labelledby="gifts-family">
        <div className="gifts__head">
          <span className="gifts__dot" style={{ background: f.hex }} aria-hidden="true" />
          <h2 id="gifts-family">{f.label}</h2>
        </div>
        <p className="gifts__what">{f.what}</p>
        <div className="pcard-grid">
          {giftsFor(family).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        <Link href={`/picks?family=${family}`} className="hero__link" style={{ alignSelf: "flex-start" }}>More {f.label} picks</Link>
      </section>
    </div>
  );
}
