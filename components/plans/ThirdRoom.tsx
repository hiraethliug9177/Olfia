"use client";

import { useEffect, useState } from "react";
import { PlanCards } from "@/components/plans/Plans";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { sceneName } from "@/lib/catalog";
import { shortDate } from "@/lib/dates";
import { joinPlus } from "@/lib/mockAuth";
import { hasPrices } from "@/lib/plans";
import type { RoomsEntry } from "@/lib/types";

/**
 * Saving a third room on the free plan (v2, 11/23; Tiffany's Notion: the plans open "when a third Room is added").
 * Three ways out: Join Olfia Plus (the fake-door window), Replace a saved room (pick one; it is deleted and the new
 * room takes its place), or Not now (back to the room, nothing lost). Copy: Tiffany's v1, 11/24 (§0.5).
 */
export function ThirdRoom({ open, rooms, onClose, onReplace }: {
  open: boolean;
  rooms: RoomsEntry[];
  onClose: () => void;
  onReplace: (id: string) => void;
}) {
  const [step, setStep] = useState<"plans" | "replace">("plans");
  const [pick, setPick] = useState<string | null>(null);
  useEffect(() => { if (open) { setStep("plans"); setPick(null); } }, [open]);
  const join = () => { onClose(); joinPlus("third_room", hasPrices ? "monthly" : "none"); };
  const sorted = [...rooms].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <Dialog open={open} onClose={onClose} label="You can save up to two rooms on the free plan" className="dlg--wide">
      <div className="dlg__body">
        <button type="button" className="dlg__x" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
        {step === "plans" ? (
          <>
            <h2 className="dlg__title">You can save up to two rooms on the free plan.</h2>
            <PlanCards billing="monthly" onJoin={join} compact />
            <div className="dlg__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setStep("replace")}>Replace a saved room</button>
              <button type="button" className="dlg__link" onClick={onClose}>Not now</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="dlg__title">Which room should this one replace?</h2>
            <div role="radiogroup" aria-label="Saved rooms" className="dlg__rooms">
              {sorted.map((r) => (
                <label key={r.id} className="dlg__room">
                  <input type="radio" name="replace-room" value={r.id} checked={pick === r.id} onChange={() => setPick(r.id)} />
                  <span className="dlg__room-name">{r.nickname ? `${sceneName(r.sceneId)} · ${r.nickname}` : sceneName(r.sceneId)}</span>
                  <span className="dlg__room-date">{shortDate(new Date(r.updatedAt))}</span>
                </label>
              ))}
            </div>
            <p className="dlg__text">The selected room will be removed from this browser and replaced with your new room.</p>
            <div className="dlg__actions">
              <button type="button" className="btn btn--primary" disabled={!pick} onClick={() => { if (pick) onReplace(pick); }}>Replace this room</button>
              <button type="button" className="dlg__link" onClick={() => setStep("plans")}>Back</button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
