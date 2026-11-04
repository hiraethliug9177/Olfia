import type { CSSProperties } from "react";

export interface PolaroidMiniProps {
  base: string;
  tall: boolean;
  stickers: [string, string, string];
  notes: string;
  place: string;
  time: string;
  line: string;
  rot: number;
}

const STAR = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

/** Static Scent Card thumbnail for galleries. */
export function PolaroidMini({ base, tall, stickers, notes, place, time, line, rot }: PolaroidMiniProps) {
  const dot = (style: CSSProperties) => <span aria-hidden="true" style={{ position: "absolute", ...style }} />;
  return (
    <div className="polaroid" style={{ rotate: `${rot}deg` }}>
      <div className="polaroid__photo" style={{ paddingTop: tall ? "177.78%" : "133.33%", background: base }}>
        <div className="polaroid__film" />
        {dot({ left: "18%", top: "16%", width: "34%", paddingTop: "34%", borderRadius: "50%", background: stickers[0], boxShadow: "0 0 0 3px #fff" })}
        {dot({ right: "14%", top: "34%", width: "24%", paddingTop: "24%", background: stickers[1], clipPath: STAR })}
        {dot({ left: "30%", top: "50%", width: "20%", paddingTop: "26%", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: stickers[2], boxShadow: "0 0 0 3px #fff" })}
        <div className="polaroid__grain" />
        <div className="polaroid__text">
          <span style={{ fontSize: 15, fontWeight: 600 }}>{notes}</span>
          <span style={{ fontSize: 13 }}>{place}</span>
          <span style={{ fontSize: 13 }}>{time}</span>
        </div>
      </div>
      <div className="polaroid__foot">
        <span className="hand" style={{ fontSize: 21 }}>{line}</span>
        <span className="hand" style={{ fontSize: 24, color: "var(--deep)", rotate: "-6deg" }}>Olfia</span>
      </div>
    </div>
  );
}
