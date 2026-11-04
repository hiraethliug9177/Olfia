const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const pad = (n: number): string => String(n).padStart(2, "0");

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

export function dayName(d: Date): string {
  return DAYS[d.getDay()];
}

/** 2026 · 11 · 03 */
export function dotDate(d: Date): string {
  return `${d.getFullYear()} · ${pad(d.getMonth() + 1)} · ${pad(d.getDate())}`;
}

/** 2026/11/03 21:00 — rounded down to the full hour */
export function hourStamp(d: Date): string {
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:00`;
}

/** 21:00 */
export function hourOnly(d: Date): string {
  return `${pad(d.getHours())}:00`;
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function partOfDay(d: Date): "morning" | "afternoon" | "night" {
  const h = d.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  return "night";
}

export function shortDate(d: Date): string {
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}
