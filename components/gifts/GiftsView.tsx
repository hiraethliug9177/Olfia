"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FAMILIES, familyById } from "@/lib/catalog";
import { FAMILY_WASH } from "@/lib/colors";
import { giftScenes, giftsFor, picksForMe, seasonFamily, topFamilies } from "@/lib/gifts";
import { loadQuiz, type QuizResult } from "@/lib/quiz";
import { useAtlas } from "@/lib/store";
import { track } from "@/lib/analytics";
import { GiftPick } from "@/components/gifts/GiftPick";
import type { FamilyId } from "@/lib/types";

/** The name typed for a gift stays in this tab only (never in the address, so it never reaches analytics). */
export const GIFT_DRAFT_KEY = "olfia.gift.draft";
export type GiftDraft = { to?: string; note?: string; from?: string };
export function readDraft(): GiftDraft {
  try {
    return JSON.parse(window.sessionStorage.getItem(GIFT_DRAFT_KEY) ?? "{}") as GiftDraft;
  } catch {
    return {};
  }
}
export function writeDraft(patch: GiftDraft): void {
  try {
    window.sessionStorage.setItem(GIFT_DRAFT_KEY, JSON.stringify({ ...readDraft(), ...patch }));
  } catch {
    // storage blocked: the card simply opens without the name
  }
}

const isFamily = (v: string | null): v is FamilyId => FAMILIES.some((f) => f.id === v);

function FamilyChips({ value, onPick, label }: { value: FamilyId; onPick: (id: FamilyId) => void; label: string }) {
  return (
    <fieldset className="gift-choose__fams">
      <legend>{label}</legend>
      <div className="gift-choose__chips">
        {FAMILIES.map((f) => (
          <button key={f.id} type="button" className="gift-chip" aria-pressed={value === f.id} onClick={() => onPick(f.id)}>
            <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />
            {f.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function FamilyLine({ ids }: { ids: FamilyId[] }) {
  return (
    <span className="gift-me__fams">
      {ids.map((id) => (
        <span key={id}><span className="chip__dot" style={{ background: familyById(id).hex }} aria-hidden="true" />{familyById(id).label}</span>
      ))}
    </span>
  );
}

/**
 * Gifts (Tiffany 11/18): for the visitor ("For me") and for someone else ("For someone"). For someone: their
 * name and the family they like, then three picks from lower to higher price, each drawn in the room and light it
 * suits. For me: the visitor's quiz character and families (or their Scent Atlas), then three picks for them.
 * Mode and family travel in the address (?for=me|someone, ?family=); the 11/17 address ?for=<family> still works.
 */
export function GiftsView() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const entries = useAtlas((s) => s.entries);
  const [quiz, setQuiz] = useState<QuizResult | null>(null);
  const [to, setTo] = useState("");

  useEffect(() => {
    setQuiz(loadQuiz());
    setTo(readDraft().to ?? "");
  }, []);

  const forParam = params.get("for");
  const mode: "me" | "someone" = forParam === "me" ? "me" : "someone";
  const famParam = params.get("family") ?? (isFamily(forParam) ? forParam : null);
  const chosen: FamilyId | null = isFamily(famParam) ? famParam : null;

  const setParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    if (isFamily(next.get("for"))) next.set("for", "someone");
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    router.replace(`${path}?${next.toString()}`, { scroll: false });
  };
  const setMode = (m: "me" | "someone") => {
    setParams({ for: m });
    track("gift_mode", { mode: m });
  };
  const pickFamily = (id: FamilyId) => {
    setParams({ family: id });
    track("gift_family", { family: id });
  };

  // For me: the quiz first, then what the Scent Atlas holds most, then a family chosen here
  const atlasFams = topFamilies(entries);
  const mine: FamilyId[] = quiz ? [quiz.family, quiz.second].filter((f): f is FamilyId => Boolean(f)) : chosen ? [chosen] : atlasFams;
  const meFamilies: FamilyId[] = mine.length ? mine : [chosen ?? seasonFamily()];
  const someoneFamily: FamilyId = chosen ?? seasonFamily();
  const scenes = mode === "me" ? giftScenes(picksForMe(meFamilies, entries)) : giftScenes(giftsFor(someoneFamily));

  return (
    <div className="wrap page gifts-page">
      <div className="gifts-page__head">
        <h1 className="h-page">Gifts</h1>
        <div className="gift-toggle" role="group" aria-label="Who the gift is for">
          <button type="button" aria-pressed={mode === "me"} onClick={() => setMode("me")}>For me</button>
          <button type="button" aria-pressed={mode === "someone"} onClick={() => setMode("someone")}>For someone</button>
        </div>
      </div>

      {mode === "someone" ? (
        <div className="gift-choose">
          <div className="gift-choose__to">
            <label htmlFor="gift-to">For</label>
            <input
              id="gift-to"
              className="input"
              value={to}
              maxLength={40}
              autoComplete="off"
              placeholder="Their name"
              onChange={(e) => {
                setTo(e.target.value);
                writeDraft({ to: e.target.value });
              }}
            />
          </div>
          <FamilyChips value={someoneFamily} onPick={pickFamily} label="Their scent" />
        </div>
      ) : quiz ? (
        <div className="gift-me">
          <span className="gift-me__fig" style={{ background: FAMILY_WASH[quiz.family] }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/assets/archetypes/${quiz.code.toLowerCase()}.webp`} alt="" width={104} height={125} />
          </span>
          <div className="gift-me__text">
            <span className="gift-me__name">{quiz.archetype.name}</span>
            <span className="gift-me__voice">{quiz.archetype.voice}</span>
            <FamilyLine ids={meFamilies} />
          </div>
          <div className="gift-me__side">
            <span>{entries.length ? "From your quiz and your Scent Atlas" : "From your quiz"}</span>
            <Link href="/quiz">Retake the quiz</Link>
          </div>
        </div>
      ) : (
        <div className="gift-choose">
          <FamilyChips value={meFamilies[0]} onPick={pickFamily} label={atlasFams.length && !chosen ? "From your Scent Atlas" : "Your scent"} />
          <Link href="/quiz" className="btn btn--ghost btn--sm gift-choose__quiz">Take the quiz</Link>
        </div>
      )}

      <div className="gift-picks">
        {scenes.map((s) => <GiftPick key={`${mode}-${s.p.id}`} scene={s} mode={mode} to={to} />)}
      </div>

      <p className="muted" style={{ fontSize: 14, marginTop: 32 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </div>
  );
}
