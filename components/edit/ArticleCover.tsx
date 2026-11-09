"use client";

import { familyById } from "@/lib/catalog";
import type { FamilyId } from "@/lib/types";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { ItemArt } from "@/components/scene/Cutout";
import { Stamp } from "@/components/scene/Stamp";

/** Cover for an Olfia Edit article: paper, atmosphere of its families, two material cut-outs, a stamp. */
export function ArticleCover({ families, big = false }: { families: FamilyId[]; big?: boolean }) {
  const a = familyById(families[0]);
  const b = families[1] ? familyById(families[1]) : null;
  return (
    <div className="edit-card__cover" style={{ aspectRatio: big ? "16 / 7" : "4 / 3", background: `linear-gradient(160deg, ${a.hex}26, var(--paper) 70%)` }}>
      <Atmosphere families={families} intensity={0.9} />
      <div className="scene-sheet__grain" aria-hidden="true" />
      <div aria-hidden="true" style={{ position: "absolute", left: "10%", bottom: "8%", width: big ? "16%" : "30%", aspectRatio: "1", rotate: "-8deg" }}>
        <ItemArt kind={a.materials[0].id} prefix="ed" />
      </div>
      {b ? (
        <div aria-hidden="true" style={{ position: "absolute", left: big ? "30%" : "42%", bottom: "16%", width: big ? "14%" : "26%", aspectRatio: "1", rotate: "7deg" }}>
          <ItemArt kind={b.materials[1].id} prefix="ed" />
        </div>
      ) : null}
      <div style={{ position: "absolute", right: "6%", top: "8%" }}>
        <Stamp family={a.id} size={big ? 110 : 84} rot={8} />
      </div>
    </div>
  );
}
