"use client";

import { Fragment } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, Ref } from "react";
import { familyById, findMaterial, itemById } from "@/lib/catalog";
import { SCENT_MID, boxOf, type ItemNote } from "@/lib/roomScent";
import type { FamilyId, PlacedItem, TimeOfDay } from "@/lib/types";
import { dayName, dotDate } from "@/lib/dates";
import { ItemArt } from "@/components/scene/Cutout";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { useMounted } from "@/lib/store";

export interface ScenePageProps {
  items: PlacedItem[];
  families: FamilyId[];
  title: string;
  nickname?: string;
  note?: string;
  date?: Date;
  strength?: number;
  time?: TimeOfDay;
  windowOpen?: boolean;
  showLabels?: boolean;
  bloomKey?: string;
  selected?: string | null;
  interactive?: boolean;
  prefix?: string;
  stageRef?: Ref<HTMLDivElement>;
  onItemPointerDown?: (uid: string, e: ReactPointerEvent<HTMLButtonElement>) => void;
  onStagePointerMove?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onStagePointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onStageBackgroundDown?: () => void;
  className?: string;
  style?: CSSProperties;
  /** ambient motion layer for the first two families (default on) */
  atmosphere?: boolean;
  /** Rooms v2 (11/23): "scent" dims the furniture, lifts the fragrance products and leaves the air to the overlay */
  view?: "room" | "scent";
  /** Rooms v2: a soft, breathing halo behind each fragrance product (Room View) */
  emphasizeScent?: boolean;
  /** Rooms v2: the notes tag of each fragrance product */
  notes?: ItemNote[];
  /** the stage's width in px, so the notes tags can keep out of each other's way */
  stagePx?: number;
  onNoteClick?: (uid: string) => void;
  /** drawn inside the stage, above the furniture and below the fragrance products in Scent View */
  overlay?: ReactNode;
  /** Scent View: the product brought forward */
  focusUid?: string | null;
  onItemHover?: (uid: string | null) => void;
}

/** Notes tags sit above their product; a tag that would cover another one moves up a row. */
function layoutTags(list: Array<{ uid: string; x: number; top: number; text: string }>, stagePx: number) {
  // the tag's type is max(15px, 3.3cqw) of the sheet; Caveat runs about a third of an em per character
  const font = Math.max(15, (0.033 * stagePx) / 0.94);
  const perChar = (0.36 * font) / stagePx;
  const rowH = (font * 1.25 + 10) / (stagePx / 0.83);
  const placed: Array<{ x0: number; x1: number; y: number }> = [];
  const out = new Map<string, { x: number; y: number }>();
  for (const t of [...list].sort((a, b) => a.top - b.top)) {
    const w = Math.min(0.62, t.text.length * perChar + 40 / stagePx);
    const x = Math.min(1 - w / 2 - 0.01, Math.max(w / 2 + 0.01, t.x));
    let y = t.top - 0.012;
    for (let guard = 0; guard < 8; guard += 1) {
      const hit = placed.find((p) => x + w / 2 > p.x0 && x - w / 2 < p.x1 && Math.abs(p.y - y) < rowH);
      if (!hit) break;
      y = hit.y - rowH;
    }
    y = Math.max(rowH + 0.005, y);
    placed.push({ x0: x - w / 2, x1: x + w / 2, y });
    out.set(t.uid, { x, y });
  }
  return out;
}

const TINTS: Record<TimeOfDay, string> = {
  morning: "rgba(255, 214, 150, 0.14)",
  afternoon: "rgba(255, 255, 255, 0)",
  night: "rgba(70, 74, 120, 0.13)",
};

/** Stage aspect: width / height of the area items live in. */
export const STAGE_ASPECT = 0.83;

export function ScenePage({
  items,
  families,
  title,
  nickname,
  note,
  date,
  strength = 70,
  time = "afternoon",
  windowOpen = false,
  showLabels = true,
  bloomKey,
  selected,
  interactive = false,
  prefix = "olfia",
  stageRef,
  onItemPointerDown,
  onStagePointerMove,
  onStagePointerUp,
  onStageBackgroundDown,
  className,
  style,
  atmosphere = true,
  view = "room",
  emphasizeScent = false,
  notes,
  stagePx = 560,
  onNoteClick,
  overlay,
  focusUid,
  onItemHover,
}: ScenePageProps) {
  const fams = families.slice(0, 3).map(familyById);
  const source = [...items].reverse().find((i) => itemById(i.kind)?.category === "source");
  const sourceDef = source ? itemById(source.kind) : undefined;
  const shift = windowOpen ? 0.1 : 0;
  const aura = view === "room" && source && sourceDef && fams.length > 0
    ? {
        x: source.x + shift,
        y: source.y - sourceDef.w * source.scale * sourceDef.aspect * STAGE_ASPECT * 0.6 - shift * 0.6,
        size: 0.45 + (strength / 100) * 0.75,
        opacity: 0.45 + strength / 220,
      }
    : null;
  const lamp = items.find((i) => i.kind === "arc-lamp");
  const mounted = useMounted();
  const d = date ?? (mounted ? new Date() : null);
  const sorted = [...items].sort((a, b) => a.z - b.z);
  const noteOf = new Map((notes ?? []).map((n) => [n.uid, n]));
  const tags = notes
    ? (() => {
        const shown = notes.filter((n) => n.text);
        const anchors = shown.flatMap((n) => {
          const it = items.find((i) => i.uid === n.uid);
          const def = it ? itemById(it.kind) : undefined;
          return it && def ? [{ uid: n.uid, x: it.x, top: boxOf(it, def).top, text: n.text, note: n }] : [];
        });
        const pos = layoutTags(anchors, stagePx);
        return anchors.map((a) => ({ ...a, px: a.x, ...(pos.get(a.uid) ?? { x: a.x, y: a.top }) }));
      })()
    : [];

  return (
    <div className={`scene-sheet ${className ?? ""}`} style={style}>
      <div className="scene-sheet__paper">
        <div className="scene-sheet__grain" aria-hidden="true" />
        {atmosphere ? <Atmosphere families={families} intensity={0.35 + (strength / 100) * 0.65} /> : null}
        <div className="scene-sheet__head">
          <span>{d ? dayName(d) : "\u00a0"}</span>
          <span>{d ? dotDate(d) : ""}</span>
        </div>
        <div className="scene-sheet__title">{title}</div>

        <div
          ref={stageRef}
          className={`scene-stage${interactive ? " scene-stage--interactive" : ""}`}
          onPointerMove={onStagePointerMove}
          onPointerUp={onStagePointerUp}
          onPointerCancel={onStagePointerUp}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onStageBackgroundDown?.();
          }}
        >
          {aura ? (
            <div key={bloomKey} className="scene-aura" aria-hidden="true" style={{ left: `${aura.x * 100}%`, top: `${aura.y * 100}%`, width: `${aura.size * 100}%`, opacity: aura.opacity }}>
              {fams.map((f, i) => (
                <span
                  key={f.id}
                  className="scene-aura__blob anim-bloom"
                  style={{
                    background: `radial-gradient(circle, ${f.glow} 0%, rgba(255,255,255,0) 68%)`,
                    transform: `translate(${[-50, -78, -22][i]}%, ${[-50, -30, -70][i]}%)`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          ) : null}

          {sorted.map((it) => {
            const def = itemById(it.kind);
            if (!def) return null;
            const isMat = def.category === "material";
            const isScent = def.category === "source";
            const boxStyle: CSSProperties = {
              left: `${it.x * 100}%`,
              top: `${it.y * 100}%`,
              width: `${def.w * it.scale * 100}%`,
              aspectRatio: `${1 / def.aspect}`,
              zIndex: view === "scent" && isScent ? 2000 + it.z : it.z,
              transform: `translate(-50%, -100%) rotate(${it.rot}deg) scaleX(${it.flip})`,
            };
            const label = isMat ? findMaterial(it.kind)?.label : undefined;
            const fam = noteOf.get(it.uid)?.family ?? families[0];
            const cls = [
              isScent && (emphasizeScent || view === "scent") ? " scene-item--scent" : "",
              view === "scent" && !isScent ? (isMat ? " scene-item--soft" : " scene-item--dim") : "",
              view === "scent" && focusUid && isScent && focusUid !== it.uid ? " scene-item--back" : "",
            ].join("");
            const inner = (
              <>
                {isScent && emphasizeScent && view === "room" && fam ? (
                  <span className="scene-item__halo" aria-hidden="true" style={{ background: `radial-gradient(closest-side, ${familyById(fam).glow} 0%, ${SCENT_MID[fam]}b3 42%, rgba(255,255,255,0) 100%)` }} />
                ) : null}
                <ItemArt kind={it.kind} prefix={prefix} />
                {isMat && showLabels && label ? <span className="scene-item__label">{label}</span> : null}
                {selected === it.uid ? <span className="scene-item__sel" aria-hidden="true" /> : null}
              </>
            );
            return interactive ? (
              <button
                key={it.uid}
                type="button"
                className={`scene-item scene-item--btn${isMat ? " anim-pin" : ""}${cls}`}
                aria-label={def.label}
                aria-pressed={selected === it.uid}
                style={boxStyle}
                onPointerDown={(e) => onItemPointerDown?.(it.uid, e)}
                onPointerEnter={isScent && onItemHover ? () => onItemHover(it.uid) : undefined}
                onPointerLeave={isScent && onItemHover ? () => onItemHover(null) : undefined}
              >
                {inner}
              </button>
            ) : (
              <div key={it.uid} className={`scene-item${isMat ? " anim-pin" : ""}${cls}`} style={boxStyle} aria-hidden="true">
                {inner}
              </div>
            );
          })}

          {overlay}

          {tags.map((t) => {
            const fam = familyById(t.note.family);
            const lift = t.top - t.y;
            const body = (
              <>
                <span className="note-tag__dot" style={{ background: fam.hex }} aria-hidden="true" />
                <span className="note-tag__text">{t.text}</span>
              </>
            );
            return (
              <Fragment key={`tag-${t.uid}`}>
                {lift > 0.03 ? <span className="note-tag__string" aria-hidden="true" style={{ left: `${t.px * 100}%`, top: `${t.y * 100}%`, height: `${lift * 100}%` }} /> : null}
                {onNoteClick ? (
                  <button
                    type="button"
                    className={`note-tag${t.note.suggested ? " note-tag--suggested" : ""}${focusUid === t.uid || selected === t.uid ? " is-on" : ""}`}
                    style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}
                    aria-label={`Notes: ${t.text}`}
                    onClick={() => onNoteClick(t.uid)}
                  >
                    {body}
                  </button>
                ) : (
                  <span className={`note-tag${t.note.suggested ? " note-tag--suggested" : ""}`} style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}>
                    {body}
                  </span>
                )}
              </Fragment>
            );
          })}

          {time === "night" && lamp ? (
            <span
              className="scene-lampglow"
              aria-hidden="true"
              style={{ left: `${(lamp.x + 0.12 * lamp.flip) * 100}%`, top: `${(lamp.y - 0.52) * 100}%` }}
            />
          ) : null}
        </div>

        <div className="scene-sheet__foot">
          <span className="scene-sheet__dots">
            {fams.map((f) => (
              <span key={f.id} style={{ background: f.hex }} />
            ))}
            <em>{fams.map((f) => f.label.split(" ")[0].toLowerCase()).join(" · ") || "no scent yet"}</em>
          </span>
          {note || nickname ? <span className="scene-sheet__note">{note || nickname}</span> : null}
        </div>
        <div className="scene-tint" aria-hidden="true" style={{ background: TINTS[time] }} />
      </div>
    </div>
  );
}
