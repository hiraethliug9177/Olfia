/**
 * The Olfia Edit's daily motto (her note, 11/24 evening): a short line of poetry about flowers, plants, trees or
 * fragrance materials, in English or in an English translation, picked at random for each day.
 * Every line is in the public domain (published before 1929; translations too) and was checked against a published
 * text on 11/24: Poetry Foundation, poets.org, Wikisource, Project Gutenberg and the Representative Poetry Online
 * archive. Lines from the same poem are joined with " / ".
 */
export interface Motto {
  text: string;
  by: string;
  /** the translator, where the line is a translation */
  tr?: string;
}

export const MOTTOS: Motto[] = [
  { text: "There’s rosemary, that’s for remembrance.", by: "William Shakespeare" },
  { text: "I know a bank where the wild thyme blows", by: "William Shakespeare" },
  { text: "Odours, when sweet violets sicken, / Live within the sense they quicken.", by: "Percy Bysshe Shelley" },
  { text: "Where blossomed many an incense-bearing tree", by: "Samuel Taylor Coleridge" },
  { text: "I cannot see what flowers are at my feet, / Nor what soft incense hangs upon the boughs", by: "John Keats" },
  { text: "To see a World in a Grain of Sand / And a Heaven in a Wild Flower", by: "William Blake" },
  { text: "Gather ye rosebuds while ye may", by: "Robert Herrick" },
  { text: "O my Luve is like a red, red rose / That’s newly sprung in June", by: "Robert Burns" },
  { text: "And then my heart with pleasure fills, / And dances with the daffodils.", by: "William Wordsworth" },
  { text: "I believe a leaf of grass is no less than the journey-work of the stars", by: "Walt Whitman" },
  { text: "To make a prairie it takes a clover and one bee", by: "Emily Dickinson" },
  { text: "Annihilating all that’s made / To a green thought in a green shade.", by: "Andrew Marvell" },
  { text: "’Tis the last rose of summer", by: "Thomas Moore" },
  { text: "Pluck this little flower and take it, delay not!", by: "Rabindranath Tagore" },
  { text: "Each Morn a thousand Roses brings, you say: / Yes, but where leaves the Rose of Yesterday?", by: "Omar Khayyám", tr: "Edward FitzGerald" },
  { text: "Like the sweet apple which reddens upon the topmost bough", by: "Sappho", tr: "Dante Gabriel Rossetti" },
  { text: "I pluck chrysanthemums under the eastern hedge", by: "T’ao Ch’ien", tr: "Arthur Waley" },
];

/** A stable pick for a given day and purpose: the same for everyone on that day, different the next. */
export function dailyIndex(day: string, salt: string, n: number): number {
  let h = 2166136261;
  for (const c of `${salt}:${day}`) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % n;
}

/** ISO 8601 week number (weeks start on Monday; week 1 holds the year's first Thursday). */
export function isoWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - first.getTime()) / 86400000 + 1) / 7);
}

/** 1 → "st", 2 → "nd", 3 → "rd", 11 → "th", 22 → "nd"… */
export function ordinal(n: number): string {
  const ten = n % 100;
  if (ten >= 11 && ten <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10] ?? "th";
}
