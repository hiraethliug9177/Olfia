"use client";

import { Fragment } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, Ref } from "react";
import { familyById, findMaterial, itemById } from "@/lib/catalog";
import { SCENT_MID, boxOf, emitPoint, tagLines, type ItemNote } from "@/lib/roomScent";
import { FAMILY_INK } from "@/lib/colors";
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

interface TagAnchor { uid: string; x: number; top: number; mark: { x: number; y: number }; title: string; notes: string }

/**
 * Notes tags (Tiffany's tag sketch, 11/24): a small card above and to the side of its product, leaning toward the
 * middle of the room, with a leader line down to a ring on the spot the scent comes from. A tag that would cover
 * another one tries the other side, a place beside it, below the ring, then a row higher.
 */
function layoutTags(list: TagAnchor[], stagePx: number) {
  // the tag's type is max(14px, 2.6cqw) and max(13px, 2cqw) of the sheet, which is the stage's width / 0.94
  const sheet = stagePx / 0.94;
  const titleFont = Math.max(14, 0.026 * sheet);
  const notesFont = Math.max(13, 0.02 * sheet);
  const stageH = stagePx / STAGE_ASPECT;
  const tagH = (titleFont * 1.2 + notesFont * 1.35 + 14) / stageH;
  const rowH = tagH + 6 / stageH;
  const gapX = 8 / stagePx;
  const placed: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
  const out = new Map<string, { x: number; y: number; ax: number; ay: number }>();
  const lean = 0.03;
  for (const t of [...list].sort((a, b) => a.top - b.top)) {
    // Plex Mono is 0.6 em a character, less the narrowed word spaces; Newsreader averages about half an em
    const px = Math.max(t.title.length * 0.5 * titleFont, t.notes.length * 0.6 * notesFont - (t.notes.split(" ").length - 1) * 0.2 * notesFont) + 22;
    // on a phone-sized sheet a tag may take more of the width (the CSS matches: 82% under 560px of window)
    const w = Math.min(stagePx < 420 ? 0.82 : 0.64, px / stagePx);
    const toward = t.mark.x < 0.5 ? 1 : -1;
    const clampX = (x: number) => Math.min(1 - w / 2 - 0.005, Math.max(w / 2 + 0.005, x));
    const free = (x: number, y: number) => !placed.some((p) => x + w / 2 > p.x0 && x - w / 2 < p.x1 && y > p.y0 && y - tagH < p.y1);
    // where the tag may sit: leaning toward the middle, leaning out, or just beside a tag already placed
    const xs = [toward, -toward].map((d) => t.mark.x + d * (lean + 0.3 * w));
    for (const p of placed) xs.push(p.x0 - gapX - w / 2, p.x1 + gapX + w / 2);
    const above = Math.min(t.top, t.mark.y) - 0.035;
    const below = t.mark.y + 0.035 + tagH;
    // rows: just above the product, then just below its ring, then higher and higher above
    const ys = [above, below, ...Array.from({ length: 7 }, (_, k) => above - (k + 1) * rowH)].filter((y) => y - tagH > 0.004 && y < 0.995);
    let pick: { x: number; y: number; ax: number; ay: number } | null = null;
    for (const y of ys) {
      let bestD = Infinity;
      for (const raw of xs) {
        const x = clampX(raw);
        if (!free(x, y)) continue;
        const side = x >= t.mark.x ? 1 : -1;
        const ax = Math.min(x + w / 2 - 0.12 * w, Math.max(x - w / 2 + 0.12 * w, t.mark.x + side * lean));
        const ay = y <= t.mark.y ? y : y - tagH;
        const d = Math.hypot((ax - t.mark.x) * stagePx, (ay - t.mark.y) * stageH);
        if (d < bestD) {
          bestD = d;
          pick = { x, y, ax, ay };
        }
      }
      if (pick) break;
    }
    const fallback = Math.max(tagH + 0.005, above);
    const done = pick ?? { x: clampX(t.mark.x), y: fallback, ax: t.mark.x, ay: fallback };
    placed.push({ x0: done.x - w / 2, x1: done.x + w / 2, y0: done.y - tagH - 0.004, y1: done.y + 0.004 });
    out.set(t.uid, done);
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
          return it && def ? [{ uid: n.uid, x: it.x, top: boxOf(it, def).top, mark: emitPoint(it, def), note: n, ...tagLines(n, it.kind) }] : [];
        });
        const pos = layoutTags(anchors, stagePx);
        const stageH = stagePx / STAGE_ASPECT;
        return anchors.map((a) => {
          const p = pos.get(a.uid) ?? { x: a.x, y: a.top, ax: a.x, ay: a.top };
          // the leader stops at the ring's edge (8px from its centre)
          const dx = (p.ax - a.mark.x) * stagePx;
          const dy = (p.ay - a.mark.y) * stageH;
          const len = Math.hypot(dx, dy) || 1;
          return { ...a, ...p, ex: a.mark.x + (dx / len) * (8 / stagePx), ey: a.mark.y + (dy / len) * (8 / stageH) };
        });
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

          {tags.length ? (
            <svg className="note-leaders" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
              {tags.map((t) => (
                <line key={t.uid} x1={t.ax * 1000} y1={t.ay * 1000} x2={t.ex * 1000} y2={t.ey * 1000} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
          ) : null}
          {tags.map((t) => {
            const fam = t.note.family;
            const cls = `note-tag${t.note.suggested ? " note-tag--suggested" : ""}${onNoteClick && (focusUid === t.uid || selected === t.uid) ? " is-on" : ""}`;
            const pos: CSSProperties = { left: `${t.x * 100}%`, top: `${t.y * 100}%` };
            const body = (
              <>
                <span className="note-tag__title" style={{ color: FAMILY_INK[fam] }}>{t.title}</span>
                <span className="note-tag__notes">{t.notes}</span>
              </>
            );
            return (
              <Fragment key={`tag-${t.uid}`}>
                <span className="note-marker" aria-hidden="true" style={{ left: `${t.mark.x * 100}%`, top: `${t.mark.y * 100}%`, ["--ring" as string]: familyById(fam).hex }} />
                {onNoteClick ? (
                  <button type="button" className={cls} style={pos} aria-label={`Notes for ${t.title}: ${t.notes}`} onClick={() => onNoteClick(t.uid)}>
                    {body}
                  </button>
                ) : (
                  <span className={cls} style={pos}>
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
