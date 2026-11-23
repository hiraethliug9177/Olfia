/**
 * Olfia's plans (v2, 11/23): the 11/21 design Tiffany kept, now a section of My Page (/account#plans) that also
 * opens when someone saves a third room. Joining Olfia Plus is a fake-door test: nothing is charged and no account
 * is made; GA4 counts plan_select (plan, billing, place), and people can leave an email to hear when it opens.
 *
 * What is hers to fill in (answers 13 and 14: names, contents, price and the yearly discount follow her business
 * plan): the prices below are null until she sets them, and while they are null the page shows no price and no
 * Monthly / Yearly switch. The rows are Claude's draft (11/23) from her business notes ("the free version provides
 * the core utility and builds the user's archive; premium visualization and personalization...") and the 11/21
 * suggestions; recommendations and the monthly analysis stay in both plans (her 11/22 decision).
 */

export type Billing = "monthly" | "yearly";
export type PlanId = "free" | "plus";

/** Free keeps two rooms (her answer 13; the business plan's free release keeps two saved entries per person). */
export const FREE_ROOMS = 2;

/** USD. TODO(Tiffany): Olfia Plus monthly and yearly prices from the business plan. */
export const PLUS_PRICE: Record<Billing, number | null> = { monthly: null, yearly: null };

export const hasPrices = PLUS_PRICE.monthly !== null && PLUS_PRICE.yearly !== null;

export type PlanRow = { feature: string; free: boolean | string; plus: boolean | string };

/** One line per feature, one column per plan. A string is shown as written; true is a check, false a dash. */
export const PLAN_ROWS: PlanRow[] = [
  { feature: "Scent quiz", free: true, plus: true },
  { feature: "Capture and Scent Cards", free: true, plus: true },
  { feature: "Rooms you can keep", free: String(FREE_ROOMS), plus: "No limit" },
  { feature: "Scentpedia and The Olfia Edit", free: true, plus: true },
  { feature: "Recommendations, each with its reason", free: true, plus: true },
  { feature: "Monthly analysis and seasonal picks", free: true, plus: true },
  { feature: "Photo View: your room beside its collage", free: false, plus: true },
  { feature: "Saved Scent View settings", free: false, plus: true },
  { feature: "More Scent Card templates and stamps", free: false, plus: true },
];

/** The short list on each plan's card: what it adds. */
export const PLAN_CARDS: Record<PlanId, { name: string; points: string[] }> = {
  free: { name: "Free", points: ["Capture, Rooms and your Scent Atlas", `Keep ${FREE_ROOMS} rooms`, "Recommendations, each with its reason"] },
  plus: { name: "Olfia Plus", points: ["Everything in Free", "Keep as many rooms as you like", "Photo View and saved Scent View settings", "More Scent Card templates and stamps"] },
};

/** Claude's drafts (11/23), hers to rewrite. */
export const PLAN_FAQ: Array<{ q: string; a: string }> = [
  { q: "When does Olfia Plus open?", a: "It isn’t open yet. Leave your email and you’ll hear first." },
  { q: "Where is my Scent Atlas saved?", a: "In this browser only, for now. Nothing goes to a server, and Export my data in Settings makes a copy." },
  { q: "Can I cancel anytime?", a: "Nothing is charged today. When Olfia Plus opens, its terms will be shown before you join." },
];

const usd = (n: number) => `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;

/** What the Olfia Plus card shows as its price, or null while the price is not set. */
export function plusPrice(billing: Billing): { main: string; note: string | null } | null {
  const m = PLUS_PRICE.monthly;
  const y = PLUS_PRICE.yearly;
  if (m === null || y === null) return null;
  if (billing === "monthly") return { main: `${usd(m)} / month`, note: null };
  const saved = m * 12 - y;
  return { main: `${usd(y)} / year`, note: saved > 0 ? `Save ${usd(saved)} a year` : null };
}
