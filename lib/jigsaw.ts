/** Builds SVG paths for a month laid out as interlocking jigsaw pieces. */

export const PIECE_W = 150;
export const PIECE_H = 124;
const KNOB = 20;

function edge(ax: number, ay: number, bx: number, by: number, s: number): string {
  if (!s) return ` L${bx} ${by}`;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  const nx = dy / len;
  const ny = -dx / len;
  const P = (u: number, v: number) => `${(ax + dx * u + nx * v).toFixed(1)} ${(ay + dy * u + ny * v).toFixed(1)}`;
  return ` L${P(0.38, 0)} C${P(0.4, s * KNOB * 0.5)} ${P(0.26, s * KNOB)} ${P(0.5, s * KNOB)} C${P(0.74, s * KNOB)} ${P(0.6, s * KNOB * 0.5)} ${P(0.62, 0)} L${bx} ${by}`;
}

export interface PieceShape {
  day: number;
  row: number;
  col: number;
  d: string;
}

export function monthPieces(year: number, month: number): { pieces: PieceShape[]; rows: number } {
  const first = new Date(year, month, 1).getDay();
  const daysIn = new Date(year, month + 1, 0).getDate();
  const rows = Math.ceil((first + daysIn) / 7);
  const exists = (r: number, c: number) => {
    const d = r * 7 + c - first + 1;
    return r >= 0 && c >= 0 && c < 7 && d >= 1 && d <= daysIn;
  };
  const hv = (r: number, c: number) => ((r * 7 + c * 3) % 2 ? 1 : -1);
  const vv = (r: number, c: number) => ((r * 5 + c) % 2 ? 1 : -1);
  const W = PIECE_W;
  const H = PIECE_H;
  const pieces: PieceShape[] = [];
  for (let day = 1; day <= daysIn; day++) {
    const idx = first + day - 1;
    const row = Math.floor(idx / 7);
    const col = idx % 7;
    const top = exists(row - 1, col) ? -hv(row - 1, col) : 0;
    const bottom = exists(row + 1, col) ? hv(row, col) : 0;
    const right = exists(row, col + 1) ? vv(row, col) : 0;
    const left = exists(row, col - 1) ? -vv(row, col - 1) : 0;
    const d = `M0 0${edge(0, 0, W, 0, top)}${edge(W, 0, W, H, right)}${edge(W, H, 0, H, bottom)}${edge(0, H, 0, 0, left)} Z`;
    pieces.push({ day, row, col, d });
  }
  return { pieces, rows };
}
