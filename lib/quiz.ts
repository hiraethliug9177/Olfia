import { FAMILIES, areNeighbours, familyById } from "@/lib/catalog";
import type { FamilyId } from "@/lib/types";

/**
 * Scent quiz (2026-11-09). Spec: claude/olfia-scent-quiz.md in the Capstone project.
 * Two layers: 12 personality questions (3 per axis) pick one of 16 archetypes; 8 scent questions
 * score the 7 families. The archetype's home family gets a +2 bonus; the scent score decides.
 * Archetype names and the 16 voices are Tiffany's (final, 11/8). Question wording is a draft she can edit.
 */

export type Letter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface QuizOption {
  label: string;
  letter?: Letter;
  /** family points: +1 from a personality question, +2 (and +1 to a second) from a scent question */
  fam?: Partial<Record<FamilyId, number>>;
  /** colour swatch option (question 18): no label is shown */
  swatch?: string;
}

export interface QuizQuestion {
  id: string;
  layer: "who" | "reach";
  axis?: "EI" | "SN" | "TF" | "JP";
  prompt: string;
  /** the word to set in italics inside the prompt */
  em?: string;
  options: QuizOption[];
}

const q = (id: string, layer: QuizQuestion["layer"], prompt: string, em: string, options: QuizOption[], axis?: QuizQuestion["axis"]): QuizQuestion => ({ id, layer, axis, prompt, em, options });

export const QUESTIONS: QuizQuestion[] = [
  // Energy
  q("q1", "who", "After a long week, you recharge with…", "recharge", [
    { label: "A night out", letter: "E", fam: { citrus: 1 } },
    { label: "A quiet evening alone", letter: "I", fam: { woody: 1 } },
    { label: "One close friend, one couch", letter: "I", fam: { gourmand: 1 } },
  ], "EI"),
  q("q2", "who", "In a new city, you…", "new city", [
    { label: "Ask strangers for tips", letter: "E", fam: { citrus: 1 } },
    { label: "Wander alone with headphones", letter: "I", fam: { fresh: 1 } },
    { label: "Plan the day around one good meal", letter: "E", fam: { gourmand: 1 } },
  ], "EI"),
  q("q3", "who", "Your phone is…", "phone", [
    { label: "Always buzzing", letter: "E", fam: { spicy: 1 } },
    { label: "On silent since forever", letter: "I", fam: { green: 1 } },
  ], "EI"),
  // Noticing
  q("q4", "who", "Walking into a room, you notice first…", "notice", [
    { label: "How it looks", letter: "S", fam: { floral: 1 } },
    { label: "How it feels", letter: "N", fam: { woody: 1 } },
  ], "SN"),
  q("q5", "who", "The stories you love are…", "stories", [
    { label: "About real people", letter: "S", fam: { gourmand: 1 } },
    { label: "About worlds that don’t exist", letter: "N", fam: { fresh: 1 } },
  ], "SN"),
  q("q6", "who", "Instructions: you…", "Instructions", [
    { label: "Read every step", letter: "S", fam: { green: 1 } },
    { label: "Skim, then figure it out", letter: "N", fam: { citrus: 1 } },
  ], "SN"),
  // Deciding
  q("q7", "who", "A friend is upset. You first…", "first", [
    { label: "Ask what happened", letter: "F", fam: { floral: 1 } },
    { label: "Suggest what to do", letter: "T", fam: { fresh: 1 } },
  ], "TF"),
  q("q8", "who", "Big choices come from…", "Big choices", [
    { label: "Your head", letter: "T", fam: { woody: 1 } },
    { label: "Your gut", letter: "F", fam: { spicy: 1 } },
  ], "TF"),
  q("q9", "who", "The compliment you keep…", "keep", [
    { label: "“You’re so sharp”", letter: "T", fam: { citrus: 1 } },
    { label: "“You’re so kind”", letter: "F", fam: { gourmand: 1 } },
  ], "TF"),
  // Planning
  q("q10", "who", "Your weekend is…", "weekend", [
    { label: "Planned by Thursday", letter: "J", fam: { green: 1 } },
    { label: "Decided Saturday morning", letter: "P", fam: { citrus: 1 } },
  ], "JP"),
  q("q11", "who", "Your desk is…", "desk", [
    { label: "A clear surface", letter: "J", fam: { fresh: 1 } },
    { label: "A creative mess", letter: "P", fam: { woody: 1 } },
  ], "JP"),
  q("q12", "who", "Deadlines…", "Deadlines", [
    { label: "Done early", letter: "J", fam: { spicy: 1 } },
    { label: "Done in the last hour, brilliantly", letter: "P", fam: { gourmand: 1 } },
  ], "JP"),
  // What you reach for
  q("q13", "reach", "Pick a weather", "weather", [
    { label: "First warm day of spring", fam: { floral: 2 } },
    { label: "Rain on the window", fam: { fresh: 2 } },
    { label: "Golden autumn afternoon", fam: { spicy: 2 } },
    { label: "Clear cold morning", fam: { green: 2 } },
  ]),
  q("q14", "reach", "Pick a texture", "texture", [
    { label: "Linen", fam: { fresh: 2 } },
    { label: "Worn leather", fam: { woody: 2 } },
    { label: "Velvet", fam: { spicy: 2 } },
    { label: "Fresh-cut grass", fam: { green: 2 } },
  ]),
  q("q15", "reach", "Your comfort drink", "comfort", [
    { label: "Black coffee", fam: { gourmand: 2 } },
    { label: "Herbal tea", fam: { green: 2 } },
    { label: "Hot chocolate", fam: { gourmand: 2, spicy: 1 } },
    { label: "Sparkling water with lemon", fam: { citrus: 2 } },
  ]),
  q("q16", "reach", "Your ideal window view", "window", [
    { label: "The sea", fam: { fresh: 2 } },
    { label: "A forest", fam: { woody: 2 } },
    { label: "A garden", fam: { floral: 2 } },
    { label: "An orchard", fam: { citrus: 2 } },
  ]),
  q("q17", "reach", "A smell that takes you back", "takes you back", [
    { label: "A bakery", fam: { gourmand: 2 } },
    { label: "Fresh laundry", fam: { fresh: 2 } },
    { label: "A bonfire", fam: { woody: 2, spicy: 1 } },
    { label: "Flowers at a market", fam: { floral: 2 } },
  ]),
  q("q18", "reach", "Pick a colour", "colour", [
    { label: "Deep green", swatch: "#4E5A2A", fam: { green: 2 } },
    { label: "Warm brown", swatch: "#8A5A33", fam: { woody: 2 } },
    { label: "Pale blue", swatch: "#B7D3D6", fam: { fresh: 2 } },
    { label: "Blush pink", swatch: "#E3A6A9", fam: { floral: 2 } },
    { label: "Bright orange", swatch: "#E8952F", fam: { citrus: 2 } },
    { label: "Amber", swatch: "#B4552E", fam: { spicy: 2 } },
    { label: "Caramel", swatch: "#D4A26A", fam: { gourmand: 2 } },
  ]),
  q("q19", "reach", "Your idea of luxury", "luxury", [
    { label: "A quiet morning", fam: { fresh: 2 } },
    { label: "A long dinner", fam: { gourmand: 2 } },
    { label: "Flowers delivered", fam: { floral: 2 } },
    { label: "A fireplace", fam: { woody: 2, spicy: 1 } },
  ]),
  // Seasonal question: swap each season (winter version below).
  q("q20", "reach", "Christmas smells like…", "Christmas", [
    { label: "Pine", fam: { woody: 2 } },
    { label: "Cinnamon", fam: { spicy: 2 } },
    { label: "Gingerbread", fam: { gourmand: 2 } },
    { label: "Oranges and cloves", fam: { citrus: 2, spicy: 1 } },
  ]),
];

export interface Archetype {
  code: string;
  name: string;
  home: FamilyId;
  association: string;
  /** Tiffany's line, final 11/8, used verbatim */
  voice: string;
}

export const ARCHETYPES: Archetype[] = [
  { code: "ESFJ", name: "The Nurturer", home: "floral", association: "soft florals, musk", voice: "You always find a way to make people feel at home." },
  { code: "INFJ", name: "The Empath", home: "floral", association: "rose, iris, powdery notes", voice: "You notice when someone gets quiet, even in a crowded room." },
  { code: "ISFJ", name: "The Devotee", home: "spicy", association: "amber, vanilla, warm woods", voice: "You hold on to the little things that remind you of someone." },
  { code: "ENFP", name: "The Romantic", home: "floral", association: "peony, rose, white florals", voice: "You remember places by the people you shared them with." },
  { code: "ESFP", name: "The Harmonist", home: "green", association: "tea, lavender, clean musk", voice: "You know how to make a room feel a little more peaceful." },
  { code: "ISFP", name: "The Muse", home: "floral", association: "violet, iris, delicate florals", voice: "You see beauty in things other people might overlook." },
  { code: "ISTJ", name: "The Guardian", home: "woody", association: "sandalwood, cedar, amber", voice: "People feel a little safer knowing you’re there." },
  { code: "ENFJ", name: "The Altruist", home: "citrus", association: "neroli, green florals", voice: "You think about what others might need before they ask." },
  { code: "INFP", name: "The Idealist", home: "green", association: "fig, soft woods, iris", voice: "You can picture a better world, even in the smallest things." },
  { code: "INTJ", name: "The Strategist", home: "woody", association: "vetiver, oakmoss, dry cedar", voice: "You notice the details that make everything fall into place." },
  { code: "INTP", name: "The Thinker", home: "fresh", association: "incense, paper, green tea", voice: "You enjoy the kind of quiet that gives your thoughts room to wander." },
  { code: "ENTJ", name: "The Director", home: "spicy", association: "saffron, leather, amber", voice: "You have a way of knowing what needs to happen next." },
  { code: "ENTP", name: "The Spark", home: "citrus", association: "bergamot, pink pepper, bright woods", voice: "You make ordinary days feel a little less ordinary." },
  { code: "ESTJ", name: "The Steward", home: "green", association: "lavender, nutmeg, fougère", voice: "You take care of things because you believe they’re worth keeping." },
  { code: "ISTP", name: "The Maker", home: "gourmand", association: "coffee, smoke, leather", voice: "You like leaving things a little better than you found them." },
  { code: "ESTP", name: "The Adventurer", home: "spicy", association: "clove, pink pepper, fireplace", voice: "You feel most like yourself when there’s something new to discover." },
];

export interface QuizResult {
  code: string;
  archetype: Archetype;
  family: FamilyId;
  second: FamilyId | null;
  scores: Record<FamilyId, number>;
  takenAt: string;
}

export const QUIZ_KEY = "olfia.quiz.v1";

/** answers: question id → option index */
export function scoreQuiz(answers: Record<string, number>, now: Date = new Date()): QuizResult {
  const letters: Record<Letter, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const scores = Object.fromEntries(FAMILIES.map((f) => [f.id, 0])) as Record<FamilyId, number>;
  const reach = { ...scores };
  for (const qq of QUESTIONS) {
    const idx = answers[qq.id];
    if (idx === undefined) continue;
    const o = qq.options[idx];
    if (!o) continue;
    if (o.letter) letters[o.letter] += 1;
    if (o.fam) {
      for (const [k, v] of Object.entries(o.fam)) {
        scores[k as FamilyId] += v ?? 0;
        if (qq.layer === "reach") reach[k as FamilyId] += v ?? 0;
      }
    }
  }
  const code =
    (letters.E >= letters.I ? "E" : "I") +
    (letters.S > letters.N ? "S" : "N") +
    (letters.T > letters.F ? "T" : "F") +
    (letters.J >= letters.P ? "J" : "P");
  const archetype = ARCHETYPES.find((a) => a.code === code) ?? ARCHETYPES[0];
  scores[archetype.home] += 2;
  const ranked = (Object.keys(scores) as FamilyId[]).sort((a, b) => scores[b] - scores[a] || reach[b] - reach[a]);
  return { code, archetype, family: ranked[0], second: ranked[1] ?? null, scores, takenAt: now.toISOString() };
}

export function blendsWith(id: FamilyId): FamilyId[] {
  return FAMILIES.filter((f) => f.id !== id && areNeighbours(id, f.id)).map((f) => f.id);
}

export function loadQuiz(): QuizResult | null {
  try {
    const raw = window.localStorage.getItem(QUIZ_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuizResult;
    const archetype = ARCHETYPES.find((a) => a.code === parsed.code);
    if (!archetype || !familyById(parsed.family)) return null;
    return { ...parsed, archetype };
  } catch {
    return null;
  }
}

export function saveQuiz(r: QuizResult): void {
  try {
    window.localStorage.setItem(QUIZ_KEY, JSON.stringify(r));
  } catch {
    // storage unavailable
  }
}
