"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { FAMILIES, SEASON_OPTIONS, familyById, methodLabel, roomLabel, sceneName, sourceLabel, texture, uid } from "@/lib/catalog";
import { FAMILY_FILL, FAMILY_WASH } from "@/lib/colors";
import { useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { hourStamp, shortDate } from "@/lib/dates";
import { CutDefs } from "@/components/scene/Cutout";
import { ScenePage } from "@/components/scene/ScenePage";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { Stamp } from "@/components/scene/Stamp";
import { CaptureScene } from "@/components/capture/CaptureScene";
import { Icon } from "@/components/ui/Icon";
import { onTabKeys } from "@/components/ui/tabKeys";
import type { Entry, FamilyId } from "@/lib/types";

type Shape = "circle" | "star" | "drop" | "spiral";
type Ratio = "9:16" | "3:4";
type Template = "film" | "instant" | "postcard";

interface Sticker {
  uid: string;
  shape: Shape;
  colors: [string, string, string];
  x: number;
  y: number;
  size: number;
  rot: number;
}

/**
 * Scent Card templates, redone 11/10 (Tiffany: "Scent Card 模板重做").
 * The picture is the real thing: a saved room (its stage, cropped to fill the frame) or a
 * captured moment (the same picture as the Capture postcard). Without one, the family colour.
 * Film: a strip of 35 mm film with the picture as one frame and the words as the next.
 * Instant: an instant-film print in the family's colour. Postcard: an airmail card with stamp and postmark.
 */
const TEMPLATES: Array<{ id: Template; label: string }> = [
  { id: "film", label: "Film" },
  { id: "instant", label: "Instant" },
  { id: "postcard", label: "Postcard" },
];
const RATIOS: Ratio[] = ["9:16", "3:4"];

/**
 * The desk's settings in three tabs (11/24 handoff, §2.5): Style is the card's look, Decorate its families and
 * stickers, Details the words on it. Every control is the one that was there before, regrouped.
 */
type Tab = "style" | "decorate" | "details";
const TABS: Array<{ id: Tab; label: string }> = [
  { id: "style", label: "Style" },
  { id: "decorate", label: "Decorate" },
  { id: "details", label: "Details" },
];

const STAR = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
const SHAPES: Shape[] = ["circle", "star", "drop", "spiral"];
const DEFAULT_FAMS: FamilyId[] = ["woody", "spicy"];
const CARD_W = 360;
/** height of the template thumbnails; each template is drawn at the card's own 360px width and scaled down to it */
const THUMB_H = 120;
/** width / height of the stage inside a scene page (.scene-stage: 94% × 78% of a 360 × 520 sheet) */
const STAGE = 338.4 / 405.6;
/** width / height of the Capture picture */
const MOMENT = 340 / 490;

function StickerArt({ shape, colors, size, unit = "cqw" }: { shape: Shape; colors: [string, string, string]; size: number; unit?: "cqw" | "px" }) {
  const L = (f: number) => (unit === "px" ? `${Math.round(f * CARD_W)}px` : `${(f * 100).toFixed(2)}cqw`);
  if (shape === "spiral") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true" style={{ display: "block", width: L(size), height: L(size) }}>
        <path d="M20 20m0 0c2 0 3 1.6 3 3.2 0 2.6-2.6 4.2-5 4.2-3.6 0-6-3-6-6.4 0-4.6 3.8-8 8.4-8 5.6 0 9.6 4.6 9.6 10 0 6.4-5.4 11.4-11.8 11.4" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        <path d="M20 20m0 0c2 0 3 1.6 3 3.2 0 2.6-2.6 4.2-5 4.2-3.6 0-6-3-6-6.4 0-4.6 3.8-8 8.4-8 5.6 0 9.6 4.6 9.6 10 0 6.4-5.4 11.4-11.8 11.4" fill="none" stroke={colors[0]} strokeWidth="3.6" strokeLinecap="round" />
      </svg>
    );
  }
  const base: CSSProperties = { display: "block", width: L(size), height: L(shape === "drop" ? size * 1.25 : size), background: texture(colors) };
  if (shape === "circle") return <span style={{ ...base, borderRadius: "50%", boxShadow: "0 0 0 3px #fff, 0 4px 10px rgba(41,42,49,0.25)" }} />;
  if (shape === "drop") return <span style={{ ...base, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", boxShadow: "0 0 0 3px #fff, 0 4px 10px rgba(41,42,49,0.25)" }} />;
  return (
    <span style={{ display: "block", filter: "drop-shadow(0 4px 6px rgba(41,42,49,0.25))" }}>
      <span style={{ display: "block", width: L(size * 1.1), height: L(size * 1.1), background: "#fff", clipPath: STAR, position: "relative" }}>
        <span style={{ position: "absolute", inset: "9%", background: texture(colors), clipPath: STAR }} />
      </span>
    </span>
  );
}

function defaultStickers(families: FamilyId[]): Sticker[] {
  const spots = [
    { x: 0.24, y: 0.2, size: 0.26, shape: "circle" as Shape },
    { x: 0.78, y: 0.32, size: 0.16, shape: "star" as Shape },
    { x: 0.36, y: 0.52, size: 0.14, shape: "drop" as Shape },
  ];
  const mats = families.flatMap((f) => familyById(f).materials);
  return spots.map((s, i) => ({ uid: uid(), shape: s.shape, colors: (mats[i] ?? mats[0] ?? FAMILIES[0].materials[0]).colors, x: s.x, y: s.y, size: s.size, rot: 0 }));
}

function fromEntry(e: Entry | undefined) {
  if (!e) return null;
  const notes = e.families.length
    ? e.families.slice(0, 3).map((f) => familyById(f).materials[0].label).map((s) => s.replace(/^\w/, (c) => c.toUpperCase())).join(" · ")
    : "";
  if (e.type === "rooms") {
    return { families: e.families, notes, line: e.nickname || "", place: sceneName(e.sceneId) };
  }
  const product = e.what.mode === "product" ? e.what.scentName || e.what.productName : "";
  return { families: e.families, notes: product || notes, line: e.sentence || e.situation || "", place: roomLabel(e.room) };
}

/** An entry's name in the source list, as Scent Atlas writes it, with the day it was made. */
function entryLabel(e: Entry): string {
  let title: string;
  if (e.type === "rooms") title = e.nickname ? `${sceneName(e.sceneId)} · ${e.nickname}` : sceneName(e.sceneId);
  else if (e.what.mode === "product") title = e.what.productName || e.what.scentName || sourceLabel(e.source);
  else title = e.what.text || methodLabel(e.what.method);
  return `${title} · ${shortDate(new Date(e.createdAt))}`;
}

/** Holds a picture of a fixed shape and crops it to fill whatever frame it is in. */
function Crop({ aspect, children }: { aspect: number; children: ReactNode }) {
  return (
    <div className="sc__pic">
      <div className="sc__crop" style={{ width: `max(100cqw, ${(aspect * 100).toFixed(2)}cqh)`, aspectRatio: `${aspect}` }}>{children}</div>
    </div>
  );
}

function Picture({ entry, show, base, families, atmosphere }: { entry: Entry | undefined; show: boolean; base: FamilyId; families: FamilyId[]; atmosphere: boolean }) {
  if (show && entry?.type === "rooms") {
    return (
      <Crop aspect={STAGE}>
        <ScenePage
          items={entry.items}
          families={entry.families}
          title=""
          date={new Date(entry.updatedAt)}
          time={entry.time}
          strength={entry.strength}
          windowOpen={entry.windowOpen}
          showLabels={false}
          atmosphere={atmosphere}
          prefix="card"
          style={{ position: "absolute", width: "106.38%", left: "-3.19%", top: "-16.03%", filter: "none" }}
        />
      </Crop>
    );
  }
  if (show && entry?.type === "capture") {
    const paper = SEASON_OPTIONS.find((s) => s.id === entry.season)?.paper ?? "#F5EEE1";
    return (
      <Crop aspect={MOMENT}>
        <div style={{ position: "absolute", inset: 0, background: paper }}>
          <CaptureScene room={entry.room} daypart={entry.daypart ?? null} families={entry.families} source={entry.source} prefix="card" atmosphere={atmosphere} />
        </div>
      </Crop>
    );
  }
  const fam = familyById(base);
  return (
    <div className="sc__pic" style={{ background: `radial-gradient(circle at 30% 20%, ${fam.glow}, rgba(255,255,255,0) 60%), ${fam.hex}` }}>
      {atmosphere ? <Atmosphere families={[base, ...families.filter((f) => f !== base)].slice(0, 2)} intensity={0.85} /> : null}
    </div>
  );
}

function Toggle({ label, on, onChange, row = false }: { label: string; on: boolean; onChange: (v: boolean) => void; row?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} className={`switch switch--sm${row ? " switch--row" : ""}`} onClick={() => onChange(!on)}>
      {label}
      <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
    </button>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function CardStudio() {
  const router = useRouter();
  const params = useSearchParams();
  const fromId = params.get("from");
  const mounted = useMounted();
  const entries = useAtlas((s) => s.entries);
  const hydrated = useAtlas((s) => s.hydrated);
  const show = useToast((s) => s.show);
  const source = entries.find((e) => e.id === fromId);

  const [families, setFamilies] = useState<FamilyId[]>(DEFAULT_FAMS);
  const [base, setBase] = useState<FamilyId>("woody");
  const [template, setTemplate] = useState<Template>("film");
  const [ratio, setRatio] = useState<Ratio>("9:16");
  const [notes, setNotes] = useState("Cedar · Clove · Vanilla");
  const [line, setLine] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("Reading Corner");
  const [showName, setShowName] = useState(true);
  const [showPhoto, setShowPhoto] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>(() => defaultStickers(DEFAULT_FAMS));
  const [selected, setSelected] = useState<string | null>(null);
  const [when, setWhen] = useState<Date | null>(null);
  const [showStamp, setShowStamp] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [busy, setBusy] = useState(false);
  /** while saving: the off-screen card the image is drawn from */
  const [exporting, setExporting] = useState(false);
  const [tab, setTab] = useState<Tab>("style");
  /** phones: the settings are a sheet under the card, closed to its tabs until one is chosen */
  const [sheet, setSheet] = useState(false);
  /** the entry the card's words and picture came from (undefined until the first load; null for a blank card) */
  const imported = useRef<string | null | undefined>(undefined);
  const photoRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  /** the card is always laid out at the templates' own 360 px width and scaled to the space on the desk, so the preview
   *  looks exactly like the saved image at any size (the type's 13 px minimum never reshapes a small preview) */
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const drag = useRef<{ uid: string; dx: number; dy: number } | null>(null);

  // The card starts from the entry in ?from= (a saved room or a captured moment), or blank. Choosing another entry or
  // "Start from scratch" in the source row changes ?from= and the card takes that entry's words and picture; its
  // template, ratio, stamp, atmosphere, name and city stay as they were.
  useEffect(() => {
    if (!mounted || !hydrated) return;
    const key = source?.id ?? null;
    if (imported.current === key) return;
    const first = imported.current === undefined;
    imported.current = key;
    setSelected(null);
    setWhen(source ? new Date(source.createdAt) : new Date());
    const d = fromEntry(source);
    if (!d) {
      if (!first) {
        // back to a blank card: the same start as opening /card on its own
        setFamilies(DEFAULT_FAMS); setBase("woody"); setNotes("Cedar · Clove · Vanilla"); setLine(""); setPlace("Reading Corner");
        setShowPhoto(false); setStickers(defaultStickers(DEFAULT_FAMS));
      }
      return;
    }
    const fams = d.families.length ? d.families : (["woody"] as FamilyId[]);
    setFamilies(fams);
    setBase(fams[0]);
    setNotes(d.notes);
    setLine(d.line);
    setPlace(d.place);
    // the room or the moment is the picture now, so it starts without extra stickers
    setShowPhoto(true);
    setStickers([]);
  }, [mounted, hydrated, source]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.getBoundingClientRect().width / CARD_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggleFamily = (f: FamilyId) => {
    setFamilies((cur) => {
      if (cur.includes(f)) return cur.length > 1 ? cur.filter((x) => x !== f) : cur;
      return cur.length >= 3 ? cur : [...cur, f];
    });
  };

  const addSticker = (shape: Shape, colors: [string, string, string]) => {
    const s: Sticker = { uid: uid(), shape, colors, x: 0.5 + (Math.random() - 0.5) * 0.3, y: 0.4 + (Math.random() - 0.5) * 0.2, size: shape === "circle" ? 0.22 : 0.16, rot: 0 };
    setStickers((cur) => [...cur, s]);
    setSelected(s.uid);
  };
  const patch = (fn: (s: Sticker) => Sticker) => setStickers((cur) => cur.map((s) => (s.uid === selected ? fn(s) : s)));

  const onDown = (id: string, e: ReactPointerEvent<HTMLButtonElement>) => {
    const box = photoRef.current?.getBoundingClientRect();
    const s = stickers.find((x) => x.uid === id);
    if (!box || !s) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelected(id);
    drag.current = { uid: id, dx: (e.clientX - box.left) / box.width - s.x, dy: (e.clientY - box.top) / box.height - s.y };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const box = photoRef.current?.getBoundingClientRect();
    if (!d || !box) return;
    const x = Math.min(0.98, Math.max(0.02, (e.clientX - box.left) / box.width - d.dx));
    const y = Math.min(0.98, Math.max(0.02, (e.clientY - box.top) / box.height - d.dy));
    setStickers((cur) => cur.map((s) => (s.uid === d.uid ? { ...s, x, y } : s)));
  };
  const onUp = () => { drag.current = null; };

  const render = async (): Promise<Blob | null> => {
    const node = exportRef.current;
    if (!node) return null;
    const { toBlob } = await import("html-to-image");
    // the off-screen card's pictures are the preview's, already loaded; make sure they are decoded before drawing
    await Promise.all(Array.from(node.querySelectorAll("img")).map((img) => img.decode().catch(() => undefined)));
    // the image is always 1080 × 1920 (9:16) or 1080 × 1440 (3:4): the 360 px card drawn three times larger.
    // No backgroundColor: html-to-image paints it over the card's own background, which turned the Film template's
    // charcoal strip and the Instant template's colour white in saved images.
    const opts = { pixelRatio: 1, canvasWidth: 1080, canvasHeight: ratio === "9:16" ? 1920 : 1440, cacheBust: true };
    try {
      return await toBlob(node, opts);
    } catch {
      return await toBlob(node, { ...opts, skipFonts: true });
    }
  };

  const exportCard = async (prefer: "share" | "download") => {
    if (busy) return;
    setBusy(true);
    setSelected(null);
    setExporting(true);
    // let the off-screen card render and settle for two frames
    await new Promise((r) => setTimeout(r, 60));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const blob = await render();
      if (!blob) throw new Error("no image");
      const file = new File([blob], `olfia-scent-card-${template}-${ratio.replace(":", "x")}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      const mode = source ? source.type : "none";
      if (prefer === "share" && nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: "My Scent Card" });
          track("scent_card_export", { mode, method: "share", ratio });
        } catch {
          // closed the share sheet
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        track("scent_card_export", { mode, method: "download", ratio });
        show(prefer === "share" ? "Image saved. Open your social app to share it." : "Scent Card saved");
      }
    } catch {
      show("Couldn’t create the image. Please try again.");
    } finally {
      setBusy(false);
      setExporting(false);
    }
  };

  const fam = familyById(base);
  const sel = stickers.find((s) => s.uid === selected);
  const mats = families.flatMap((f) => familyById(f).materials);
  const stamp = when ? hourStamp(when) : "";
  const monthDay = when ? `${pad(when.getMonth() + 1)} · ${pad(when.getDate())}` : undefined;
  const imprint = when ? `’${String(when.getFullYear()).slice(2)} ${pad(when.getMonth() + 1)} ${pad(when.getDate())}` : "";
  const frameNo = when ? when.getDate() : 1;
  const where = `${place}${showCity && city ? ` · ${city}` : ""}`;
  const signedBy = showName && name.trim() ? name.trim() : "";
  const cardStyle: CSSProperties = { aspectRatio: ratio === "9:16" ? "9 / 16" : "3 / 4" };
  const holes = Array.from({ length: ratio === "9:16" ? 21 : 16 }, (_, i) => i);

  /**
   * One card in one template. "live" is the card in the middle of the desk, which stickers are dragged on; "export" is
   * the same card at 360 px, off screen, that the saved image is drawn from; "thumb" is a still copy for the template
   * thumbnails (no atmosphere layer, no SVG definitions of its own).
   */
  const face = (t: Template, mode: "live" | "export" | "thumb"): ReactNode => {
    const live = mode === "live";
    /** The picture frame every template shares: the room or moment, then the stickers on top. */
    const frame = (cls: string, extra?: ReactNode) => (
      <div
        ref={live ? photoRef : undefined}
        className={`sc__frame ${cls}`}
        onPointerMove={live ? onMove : undefined}
        onPointerUp={live ? onUp : undefined}
        onPointerCancel={live ? onUp : undefined}
        onPointerDown={live ? (e) => { if (!(e.target as HTMLElement).closest(".sticker")) setSelected(null); } : undefined}
      >
        <Picture entry={source} show={showPhoto && !!source} base={base} families={families} atmosphere={mode !== "thumb" && showAtmosphere} />
        <div className="polaroid__film" />
        {stickers.map((s) =>
          live ? (
            <button
              key={s.uid}
              type="button"
              className="sticker"
              aria-label={`${s.shape} sticker`}
              aria-pressed={s.uid === selected}
              onPointerDown={(e) => onDown(s.uid, e)}
              onKeyDown={(e) => {
                const k = e.key;
                const step = 0.02;
                if (k === "Delete" || k === "Backspace") { setStickers((cur) => cur.filter((x) => x.uid !== s.uid)); setSelected(null); return; }
                const dx = k === "ArrowLeft" ? -step : k === "ArrowRight" ? step : 0;
                const dy = k === "ArrowUp" ? -step : k === "ArrowDown" ? step : 0;
                if (dx || dy) { e.preventDefault(); setStickers((cur) => cur.map((x) => (x.uid === s.uid ? { ...x, x: x.x + dx, y: x.y + dy } : x))); }
              }}
              style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, rotate: `${s.rot}deg`, outline: s.uid === selected ? "2px dashed #4C527A" : undefined, outlineOffset: 6 }}
            >
              <StickerArt shape={s.shape} colors={s.colors} size={s.size} />
            </button>
          ) : (
            <span key={s.uid} className="sticker" style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, rotate: `${s.rot}deg` }}>
              <StickerArt shape={s.shape} colors={s.colors} size={s.size} />
            </span>
          ),
        )}
        <div className="polaroid__grain" />
        {extra}
      </div>
    );

    const meta = (
      <span className="sc__meta">
        {where ? <span>{where}</span> : null}
        <span>{stamp}</span>
        {signedBy ? <span>— {signedBy}</span> : null}
      </span>
    );
    const ref = mode === "export" ? exportRef : undefined;
    const defs = mode === "thumb" ? null : <CutDefs prefix="card" />;

    if (t === "film") {
      return (
        <div ref={ref} className="sc sc-film" style={cardStyle}>
          {defs}
          {(["l", "r"] as const).map((side) => (
            <div key={side} className={`sc-film__holes sc-film__holes--${side}`} aria-hidden="true">
              {holes.map((i) => <span key={i} style={{ top: `${i * 8.6 + 1.6}cqw` }} />)}
            </div>
          ))}
          <span className="sc-film__edge sc-film__edge--l" style={{ top: "24cqw" }} aria-hidden="true">olfia 400</span>
          <span className="sc-film__edge sc-film__edge--l" style={{ bottom: "20cqw" }} aria-hidden="true">olfia 400</span>
          <span className="sc-film__edge sc-film__edge--r" style={{ top: "16cqw" }} aria-hidden="true">{frameNo} ▸</span>
          <span className="sc-film__edge sc-film__edge--r" style={{ bottom: "24cqw" }} aria-hidden="true">{frameNo}A</span>
          <div className="sc-film__strip">
            <div className="sc-film__prev" style={{ backgroundImage: `url(${fam.texture})`, backgroundColor: fam.hex }} aria-hidden="true" />
            {frame("sc-film__frame", showStamp ? <span className="sc__date">{imprint}</span> : null)}
            <div className="sc-film__note" style={{ background: FAMILY_WASH[base] }}>
              <span className="sc__notes">{notes}</span>
              {line ? <span className="sc__line">{line}</span> : null}
              <div className="sc__foot">{meta}<span className="sc__sig">Olfia</span></div>
            </div>
          </div>
        </div>
      );
    }
    if (t === "instant") {
      return (
        <div ref={ref} className="sc sc-instant" style={{ ...cardStyle, background: FAMILY_WASH[base] }}>
          {defs}
          {frame("sc-instant__frame")}
          <div className="sc-instant__foot">
            {line ? <span className="sc__line">{line}</span> : null}
            <span className="sc__notes">{notes}</span>
            <div className="sc__foot">{meta}<span className="sc__sig">Olfia</span></div>
          </div>
          {showStamp ? (
            <div className="sc__postmark sc-instant__stamp" aria-hidden="true">
              <Stamp family={base} size={96} rot={10} date={monthDay} />
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div ref={ref} className="sc sc-post" style={{ ...cardStyle, "--stripe-a": fam.hex } as CSSProperties}>
        {defs}
        <div className="sc-post__inner">
          <div className="sc-post__photo">
            <span className="tape tape--a" aria-hidden="true" />
            <span className="tape tape--b" aria-hidden="true" />
            {frame("sc-post__frame", place ? <span className="sc-post__place">{place}</span> : null)}
          </div>
          <div className="sc-post__back">
            <div className="sc-post__msg">
              {line ? <span className="sc__line">{line}</span> : null}
              {signedBy ? <span className="sc-post__from">— {signedBy}</span> : null}
            </div>
            <div className="sc-post__corner">
              <span className="sc-post__stamp" style={{ backgroundColor: FAMILY_FILL[base].bg }}>
                <span className="sc-post__stamp-img" style={{ backgroundImage: `url(${fam.texture})` }} />
                <span className="sc-post__stamp-name" style={{ color: FAMILY_FILL[base].fg }}>{fam.label.split(" ")[0]}</span>
              </span>
              {showStamp ? (
                <span className="sc__postmark sc-post__postmark" aria-hidden="true">
                  <Stamp family={base} size={96} rot={-12} date={monthDay} />
                </span>
              ) : null}
            </div>
            <div className="sc-post__lines">
              <span className="sc-post__line sc-post__line--notes">{notes}</span>
              <span className="sc-post__line">{where}</span>
              <span className="sc-post__line">{stamp}</span>
            </div>
            <span className="sc__sig sc-post__sig">Olfia</span>
          </div>
        </div>
      </div>
    );
  };

  /* ---------- the source row: what this card is made from (11/24 handoff, §2.3) ---------- */

  const saved = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const savedRooms = saved.filter((e) => e.type === "rooms");
  const savedMoments = saved.filter((e) => e.type === "capture");
  const sourceRow = (
    <div className="desk__source">
      <span className="ws-label" id="desk-source">Start with</span>
      {!hydrated || saved.length ? (
        <span className="ws-pick__box">
          <select
            className="ws-pick__select"
            aria-labelledby="desk-source"
            value={source?.id ?? ""}
            disabled={!hydrated}
            onChange={(e) => { if (e.target.value) router.replace(`/card?from=${e.target.value}`, { scroll: false }); }}
          >
            <option value="" disabled hidden>Choose from Scent Atlas</option>
            {savedRooms.length ? (
              <optgroup label="Rooms">
                {savedRooms.map((e) => <option key={e.id} value={e.id}>{entryLabel(e)}</option>)}
              </optgroup>
            ) : null}
            {savedMoments.length ? (
              <optgroup label="Capture">
                {savedMoments.map((e) => <option key={e.id} value={e.id}>{entryLabel(e)}</option>)}
              </optgroup>
            ) : null}
          </select>
          <Icon name="chevronDown" size={18} className="ws-pick__chev" />
        </span>
      ) : (
        <Link href="/atlas" className="desk__atlas">Choose from Scent Atlas<Icon name="arrowRight" size={18} /></Link>
      )}
      {source ? (
        <button type="button" className="desk__scratch" onClick={() => router.replace("/card", { scroll: false })}>Start from scratch</button>
      ) : (
        <p className="desk__or">or start from scratch</p>
      )}
    </div>
  );

  /* ---------- the three tabs ---------- */

  const styleTab = (
    <>
      <div className="ws-group">
        <span className="ws-label" id="desk-template">Template</span>
        <div role="radiogroup" aria-labelledby="desk-template" className="tpl-row">
          {TEMPLATES.map((t) => {
            const h0 = ratio === "9:16" ? (CARD_W * 16) / 9 : (CARD_W * 4) / 3;
            const s = THUMB_H / h0;
            return (
              <button key={t.id} type="button" role="radio" aria-checked={template === t.id} className="tpl" onClick={() => setTemplate(t.id)}>
                <span className="tpl__thumb" aria-hidden="true">
                  <span className="tpl__mini" style={{ width: Math.round(CARD_W * s), height: THUMB_H }}>
                    <span className="tpl__scale" style={{ transform: `scale(${s})` }}>{face(t.id, "thumb")}</span>
                  </span>
                </span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="ws-group">
        <span className="ws-label" id="desk-ratio">Aspect ratio</span>
        <div role="radiogroup" aria-labelledby="desk-ratio" className="seg seg--soft">
          {RATIOS.map((r) => (
            <button key={r} type="button" role="radio" aria-checked={ratio === r} className="seg__opt" onClick={() => setRatio(r)}>{r}</button>
          ))}
        </div>
      </div>
      <div className="ws-group">
        <span className="ws-label" id="desk-color">Color</span>
        <div role="radiogroup" aria-labelledby="desk-color" className="desk-swatches">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={base === f.id} aria-label={f.label} title={f.label} className="desk-swatch" style={{ background: f.hex }} onClick={() => setBase(f.id)} />
          ))}
        </div>
      </div>
      <div className="desk__switches">
        <Toggle label="Stamp" on={showStamp} onChange={setShowStamp} />
        <Toggle label="Atmosphere" on={showAtmosphere} onChange={setShowAtmosphere} />
      </div>
    </>
  );

  const decorateTab = (
    <>
      <div className="ws-group">
        <span className="ws-label">Families</span>
        <div className="chips">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={families.includes(f.id)} onClick={() => toggleFamily(f.id)}>
              <span className="chip__dot" style={{ background: f.hex }} />{f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="ws-group">
        <span className="ws-label">Stickers</span>
        <p className="ws-note">Drag a sticker to place it. Select it to resize or rotate.</p>
        <div className="desk-stickers">
          {mats.slice(0, 6).flatMap((m) => SHAPES.map((sh) => (
            <button key={`${m.id}-${sh}`} type="button" className="desk-sticker" aria-label={`Add ${m.label} ${sh}`} title={`${m.label}`} onClick={() => addSticker(sh, m.colors)}>
              <StickerArt shape={sh} colors={m.colors} size={0.075} unit="px" />
            </button>
          )))}
        </div>
      </div>
    </>
  );

  const detailsTab = (
    <div className="desk__fields">
      <label className="ws-field">Notes<input className="input" value={notes} maxLength={48} onChange={(e) => setNotes(e.target.value)} /></label>
      <label className="ws-field">One line<input className="input" value={line} maxLength={60} placeholder="What do you remember about this moment?" onChange={(e) => setLine(e.target.value)} /></label>
      <label className="ws-field">Room<input className="input" value={place} maxLength={32} onChange={(e) => setPlace(e.target.value)} /></label>
      <Toggle label="Show name" on={showName} onChange={setShowName} row />
      {showName ? <label className="ws-field">Name<input className="input" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} /></label> : null}
      {source ? <Toggle label={source.type === "rooms" ? "Show room" : "Show moment"} on={showPhoto} onChange={setShowPhoto} row /> : null}
      <Toggle label="Show city" on={showCity} onChange={setShowCity} row />
      {showCity ? <label className="ws-field">City<input className="input" value={city} maxLength={24} onChange={(e) => setCity(e.target.value)} /></label> : null}
    </div>
  );

  const tabIndex = TABS.findIndex((t) => t.id === tab);
  const openTab = (t: Tab) => { setTab(t); setSheet(true); };

  return (
    <section className="desk" aria-label="Scent Card studio">
      {sourceRow}

      <div
        className="desk__canvas"
        onPointerDown={(e) => { const t = e.target as HTMLElement; if (!t.closest(".sc") && !t.closest(".ws-rail")) setSelected(null); }}
      >
        <div className="desk__stage" style={{ "--ar": ratio === "9:16" ? 0.5625 : 0.75 } as CSSProperties}>
          <div ref={frameRef} className="desk__frame">
            {/* a new template settles in (about 0.4 s); words, families, source and stickers stay as they are */}
            <div key={template} className="desk__swap" style={{ transform: `scale(${scale})` }}>{face(template, "live")}</div>
            {sel ? (
              <div role="toolbar" aria-label="Selected sticker" aria-orientation="vertical" className="ws-rail ws-rail--r">
                <button type="button" className="ws-tool" aria-label="Rotate" title="Rotate" onClick={() => patch((s) => ({ ...s, rot: (s.rot + 15) % 360 }))}><Icon name="rotateCw" /></button>
                <button type="button" className="ws-tool" aria-label="Bigger" title="Bigger" onClick={() => patch((s) => ({ ...s, size: Math.min(0.5, s.size * 1.15) }))}><Icon name="plus" /></button>
                <button type="button" className="ws-tool" aria-label="Smaller" title="Smaller" onClick={() => patch((s) => ({ ...s, size: Math.max(0.06, s.size / 1.15) }))}><Icon name="minus" /></button>
                <span className="ws-rail__sep" aria-hidden="true" />
                <button type="button" className="ws-tool" aria-label="Delete sticker" title="Delete sticker" onClick={() => { setStickers((cur) => cur.filter((x) => x.uid !== selected)); setSelected(null); }}><Icon name="trash" /></button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={`desk__insp${sheet ? " is-open" : ""}`}>
        <div className="desk__insp-in">
          <button type="button" className="ws__handle" aria-expanded={sheet} aria-controls="desk-panel" aria-label={sheet ? "Close the settings" : "Open the settings"} onClick={() => setSheet((v) => !v)}>
            <span aria-hidden="true" />
          </button>
          <div role="tablist" aria-label="Customize your card" className="ws-tabs" onKeyDown={(e) => onTabKeys(e, TABS.length, tabIndex, (i) => openTab(TABS[i].id))}>
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" id={`desk-tab-${t.id}`} aria-controls="desk-panel" aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} className="ws-tab" onClick={() => openTab(t.id)}>{t.label}</button>
            ))}
          </div>
          <div id="desk-panel" role="tabpanel" aria-labelledby={`desk-tab-${tab}`} className="desk__panel">
            {tab === "style" ? styleTab : tab === "decorate" ? decorateTab : detailsTab}
          </div>
        </div>
      </div>

      {exporting ? <div className="desk__export" aria-hidden="true">{face(template, "export")}</div> : null}

      {/* 11/24 handoff (§2.7): one Share (the phone's share sheet, else a download) and Save image */}
      <div className="desk__bar">
        <div className="ws__status">
          <span className="ws__status-name">Your card</span>
          <span className="ws__status-line">PNG · 1080 px wide</span>
        </div>
        <div className="ws__actions">
          <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => exportCard("share")}><Icon name="share" size={18} />Share</button>
          <button type="button" className="btn btn--primary" disabled={busy} onClick={() => exportCard("download")}><Icon name="download" size={18} />{busy ? "Creating image…" : <>Save image<span className="desk__ratio"> · {ratio}</span></>}</button>
        </div>
      </div>
    </section>
  );
}
