"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, Ref } from "react";
import { familyById, findMaterial, itemById } from "@/lib/catalog";
import type { FamilyId, PlacedItem, TimeOfDay } from "@/lib/types";
import { dayName, dotDate } from "@/lib/dates";
import { ItemArt } from "@/components/scene/Cutout";

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
}

const TINTS: Record<TimeOfDay, string> = {
  morning: "rgba(255, 226, 170, 0.16)",
  afternoon: "rgba(255, 255, 255, 0)",
  night: "rgba(38, 42, 78, 0.24)",
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
}: ScenePageProps) {
  const fams = families.slice(0, 3).map(familyById);
  const source = [...items].reverse().find((i) => itemById(i.kind)?.category === "source");
  const sourceDef = source ? itemById(source.kind) : undefined;
  const shift = windowOpen ? 0.1 : 0;
  const aura = source && sourceDef && fams.length > 0
    ? {
        x: source.x + shift,
        y: source.y - sourceDef.w * source.scale * sourceDef.aspect * STAGE_ASPECT * 0.6 - shift * 0.6,
        size: 0.45 + (strength / 100) * 0.75,
        opacity: 0.45 + strength / 220,
      }
    : null;
  const lamp = items.find((i) => i.kind === "arc-lamp");
  const d = date ?? new Date();
  const sorted = [...items].sort((a, b) => a.z - b.z);

  return (
    <div className={`scene-sheet ${className ?? ""}`} style={style}>
      <div className="scene-sheet__paper">
        <div className="scene-sheet__grain" aria-hidden="true" />
        <div className="scene-sheet__head">
          <span>{dayName(d)}</span>
          <span>{dotDate(d)}</span>
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
            const boxStyle: CSSProperties = {
              left: `${it.x * 100}%`,
              top: `${it.y * 100}%`,
              width: `${def.w * it.scale * 100}%`,
              aspectRatio: `${1 / def.aspect}`,
              zIndex: it.z,
              transform: `translate(-50%, -100%) rotate(${it.rot}deg) scaleX(${it.flip})`,
            };
            const label = isMat ? findMaterial(it.kind)?.label : undefined;
            const inner = (
              <>
                <ItemArt kind={it.kind} prefix={prefix} />
                {isMat && showLabels && label ? <span className="scene-item__label">{label}</span> : null}
                {selected === it.uid ? <span className="scene-item__sel" aria-hidden="true" /> : null}
              </>
            );
            return interactive ? (
              <button
                key={it.uid}
                type="button"
                className={`scene-item scene-item--btn${isMat ? " anim-pin" : ""}`}
                aria-label={def.label}
                aria-pressed={selected === it.uid}
                style={boxStyle}
                onPointerDown={(e) => onItemPointerDown?.(it.uid, e)}
              >
                {inner}
              </button>
            ) : (
              <div key={it.uid} className={`scene-item${isMat ? " anim-pin" : ""}`} style={boxStyle} aria-hidden="true">
                {inner}
              </div>
            );
          })}

          {time === "night" && lamp ? (
            <span
              className="scene-lampglow"
              aria-hidden="true"
              style={{ left: `${(lamp.x + 0.12 * lamp.flip) * 100}%`, top: `${(lamp.y - 0.52) * 100}%` }}
            />
          ) : null}
          <div className="scene-tint" aria-hidden="true" style={{ background: TINTS[time] }} />
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
      </div>
    </div>
  );
}
