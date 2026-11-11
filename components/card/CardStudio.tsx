"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { FAMILIES, SEASON_OPTIONS, familyById, roomLabel, sceneName, texture, uid } from "@/lib/catalog";
import { FAMILY_FILL, FAMILY_WASH } from "@/lib/colors";
import { useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { hourStamp } from "@/lib/dates";
import { CutDefs } from "@/components/scene/Cutout";
import { ScenePage } from "@/components/scene/ScenePage";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { Stamp } from "@/components/scene/Stamp";
import { CaptureScene } from "@/components/capture/CaptureScene";
import { Icon } from "@/components/ui/Icon";
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

const STAR = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
const SHAPES: Shape[] = ["circle", "star", "drop", "spiral"];
const CARD_W = 360;
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

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} className="switch" onClick={() => onChange(!on)}>
      {label}
      <span className="switch__track"><span className="switch__knob" /></span>
    </button>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function CardStudio() {
  const params = useSearchParams();
  const fromId = params.get("from");
  const mounted = useMounted();
  const entries = useAtlas((s) => s.entries);
  const hydrated = useAtlas((s) => s.hydrated);
  const show = useToast((s) => s.show);
  const source = entries.find((e) => e.id === fromId);

  const [families, setFamilies] = useState<FamilyId[]>(["woody", "spicy"]);
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
  const [stickers, setStickers] = useState<Sticker[]>(() => defaultStickers(["woody", "spicy"]));
  const [selected, setSelected] = useState<string | null>(null);
  const [when, setWhen] = useState<Date | null>(null);
  const [showStamp, setShowStamp] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [busy, setBusy] = useState(false);
  const loaded = useRef(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ uid: string; dx: number; dy: number } | null>(null);

  useEffect(() => {
    if (!mounted || !hydrated || loaded.current) return;
    loaded.current = true;
    const d = fromEntry(source);
    setWhen(source ? new Date(source.createdAt) : new Date());
    if (!d) return;
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
    const node = cardRef.current;
    if (!node) return null;
    const { toBlob } = await import("html-to-image");
    const pixelRatio = 1080 / node.offsetWidth;
    const opts = { pixelRatio, cacheBust: true, backgroundColor: "#ffffff" };
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
    await new Promise((r) => setTimeout(r, 60));
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
        show(prefer === "share" ? "Image saved — post it from your app" : "Scent Card saved");
      }
    } catch {
      show("Couldn’t make the image. Try again?");
    } finally {
      setBusy(false);
    }
  };

  const fam = familyById(base);
  const sel = stickers.find((s) => s.uid === selected);
  const mats = families.flatMap((f) => familyById(f).materials);
  const tIndex = TEMPLATES.findIndex((t) => t.id === template);
  const stamp = when ? hourStamp(when) : "";
  const monthDay = when ? `${pad(when.getMonth() + 1)} · ${pad(when.getDate())}` : undefined;
  const imprint = when ? `’${String(when.getFullYear()).slice(2)} ${pad(when.getMonth() + 1)} ${pad(when.getDate())}` : "";
  const frameNo = when ? when.getDate() : 1;
  const where = `${place}${showCity && city ? ` · ${city}` : ""}`;
  const signedBy = showName && name.trim() ? name.trim() : "";
  const cardStyle: CSSProperties = { aspectRatio: ratio === "9:16" ? "9 / 16" : "3 / 4" };
  const holes = Array.from({ length: ratio === "9:16" ? 21 : 16 }, (_, i) => i);

  /** The picture frame every template shares: the room or moment, then the stickers on top. */
  const frame = (cls: string, extra?: ReactNode) => (
    <div
      ref={photoRef}
      className={`sc__frame ${cls}`}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerDown={(e) => { if (!(e.target as HTMLElement).closest(".sticker")) setSelected(null); }}
    >
      <Picture entry={source} show={showPhoto && !!source} base={base} families={families} atmosphere={showAtmosphere} />
      <div className="polaroid__film" />
      {stickers.map((s) => (
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
      ))}
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

  let card: ReactNode;
  if (template === "film") {
    card = (
      <div ref={cardRef} className="sc sc-film" style={cardStyle}>
        <CutDefs prefix="card" />
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
  } else if (template === "instant") {
    card = (
      <div ref={cardRef} className="sc sc-instant" style={{ ...cardStyle, background: FAMILY_WASH[base] }}>
        <CutDefs prefix="card" />
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
  } else {
    card = (
      <div ref={cardRef} className="sc sc-post" style={{ ...cardStyle, "--stripe-a": fam.hex } as CSSProperties}>
        <CutDefs prefix="card" />
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
  }

  return (
    <div className="editor" style={{ alignItems: "flex-start" }}>
      <div className="editor__tray" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="fieldset" style={{ padding: 20 }}>
          <span className="legend" style={{ marginBottom: 0 }}>Template</span>
          <div role="radiogroup" aria-label="Template" className="seg">
            <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${tIndex / 3})`, width: "calc((100% - 10px) / 3)" }} />
            {TEMPLATES.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={template === t.id} className="seg__opt" style={{ padding: 0 }} onClick={() => setTemplate(t.id)}>{t.label}</button>
            ))}
          </div>
          <span className="legend" style={{ marginBottom: 0, marginTop: 6 }}>Size</span>
          <div role="radiogroup" aria-label="Size" className="seg">
            <span className="seg__thumb" aria-hidden="true" style={{ left: ratio === "9:16" ? 5 : "50%", width: "calc(50% - 5px)" }} />
            <button type="button" role="radio" aria-checked={ratio === "9:16"} className="seg__opt" onClick={() => setRatio("9:16")}>9:16</button>
            <button type="button" role="radio" aria-checked={ratio === "3:4"} className="seg__opt" onClick={() => setRatio("3:4")}>3:4</button>
          </div>
        </div>
        <div className="fieldset" style={{ padding: 20 }}>
          <span className="legend" style={{ marginBottom: 0 }}>Color</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {FAMILIES.map((f) => (
              <button key={f.id} type="button" aria-label={f.label} aria-pressed={base === f.id} onClick={() => setBase(f.id)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: 0, background: f.hex, boxShadow: base === f.id ? "0 0 0 3px #fff, 0 0 0 5px #4C527A" : "0 0 0 1px rgba(41,42,49,0.1)" }} />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 6 }}>
            <Toggle label="Stamp" on={showStamp} onChange={setShowStamp} />
            <Toggle label="Atmosphere" on={showAtmosphere} onChange={setShowAtmosphere} />
          </div>
          <span className="legend" style={{ marginBottom: 0, marginTop: 6 }}>Families</span>
          <div className="chips">
            {FAMILIES.map((f) => (
              <button key={f.id} type="button" className="chip" aria-pressed={families.includes(f.id)} onClick={() => toggleFamily(f.id)} style={{ minHeight: 40, padding: "0 14px", fontSize: 15 }}>
                <span className="chip__dot" style={{ background: f.hex }} />{f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="fieldset" style={{ padding: 20 }}>
          <span className="legend" style={{ marginBottom: 0 }}>Stickers</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {mats.slice(0, 6).flatMap((m) => SHAPES.map((sh) => (
              <button key={`${m.id}-${sh}`} type="button" className="tray-item" aria-label={`Add ${m.label} ${sh}`} onClick={() => addSticker(sh, m.colors)} style={{ padding: 8, minHeight: 56, justifyContent: "center" }}>
                <StickerArt shape={sh} colors={m.colors} size={0.075} unit="px" />
              </button>
            )))}
          </div>
        </div>
      </div>

      <div className="editor__stage" style={{ alignItems: "center" }}>
        <div className="stage-box" style={{ width: "100%", padding: "32px 16px" }} onPointerDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          {card}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", minHeight: 44 }}>
          {sel ? (
            <>
              <button type="button" className="tool" aria-label="Rotate" onClick={() => patch((s) => ({ ...s, rot: (s.rot + 15) % 360 }))}><Icon name="rotateCw" /></button>
              <button type="button" className="tool" aria-label="Bigger" onClick={() => patch((s) => ({ ...s, size: Math.min(0.5, s.size * 1.15) }))}><Icon name="plus" /></button>
              <button type="button" className="tool" aria-label="Smaller" onClick={() => patch((s) => ({ ...s, size: Math.max(0.06, s.size / 1.15) }))}><Icon name="minus" /></button>
              <button type="button" className="tool" aria-label="Delete sticker" onClick={() => { setStickers((cur) => cur.filter((x) => x.uid !== selected)); setSelected(null); }}><Icon name="trash" /></button>
            </>
          ) : <span className="muted" style={{ fontSize: 15, alignSelf: "center" }}>Drag stickers to place them. Tap one to resize or rotate.</span>}
        </div>
      </div>

      <div className="editor__panel">
        <div className="fieldset" style={{ padding: 20 }}>
          <label className="field">Notes<input className="input" value={notes} maxLength={48} onChange={(e) => setNotes(e.target.value)} /></label>
          <label className="field">One line<input className="input" value={line} maxLength={60} placeholder="What was going on?" onChange={(e) => setLine(e.target.value)} /></label>
          <label className="field">Room<input className="input" value={place} maxLength={32} onChange={(e) => setPlace(e.target.value)} /></label>
          <Toggle label="Show name" on={showName} onChange={setShowName} />
          {showName ? <label className="field">Name<input className="input" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} /></label> : null}
          {source ? <Toggle label={source.type === "rooms" ? "Show room" : "Show moment"} on={showPhoto} onChange={setShowPhoto} /> : null}
          <Toggle label="Show city" on={showCity} onChange={setShowCity} />
          {showCity ? <label className="field">City<input className="input" value={city} maxLength={24} onChange={(e) => setCity(e.target.value)} /></label> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button type="button" className="btn btn--primary" disabled={busy} onClick={() => exportCard("download")}>{busy ? "Making image…" : `Save image · ${ratio}`}</button>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button type="button" className="tool" aria-label="Share to Instagram" title="Instagram" disabled={busy} onClick={() => exportCard("share")} style={{ borderRadius: "50%", width: 48, height: 48 }}>
              <Icon name="instagram" />
            </button>
            {[
              { id: "xhs", label: "小红书", d: "M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm3 5h8M8 12h8M8 15h5" },
              { id: "pin", label: "Pinterest", d: "M12 3a8 8 0 00-2.9 15.4c-.1-.7-.1-1.7 0-2.4l1-4.2s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.7 0 1.1.6 1.1 1.2 0 .8-.5 1.9-.7 2.9-.2.9.4 1.6 1.3 1.6 1.5 0 2.7-1.6 2.7-4 0-2.1-1.5-3.5-3.6-3.5-2.5 0-3.9 1.8-3.9 3.7 0 .7.3 1.5.6 2" },
              { id: "x", label: "X", d: "M4 4l16 16M20 4L4 20" },
            ].map((s) => (
              <button key={s.id} type="button" className="tool" aria-label={`Share to ${s.label}`} title={s.label} disabled={busy} onClick={() => exportCard("share")} style={{ borderRadius: "50%", width: 48, height: 48 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.d} /></svg>
              </button>
            ))}
          </div>
          <span className="muted" style={{ fontSize: 14, textAlign: "center" }}>1080 px wide PNG</span>
          {!source && mounted ? (
            <span style={{ fontSize: 15, textAlign: "center" }}>
              Start from a page: <Link href="/atlas">Scent Atlas</Link>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
