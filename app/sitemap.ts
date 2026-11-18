import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/edit";

const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.olfia.studio").replace(/\/$/, "");

/** Public pages for search engines. My Account, the Scent Atlas and the card studio hold a visitor's own pages, so they stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/quiz", "/rooms", "/capture", "/edit", "/gifts", "/library", "/about", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${site}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...ARTICLES.map((a) => ({ url: `${site}/edit/${a.slug}`, lastModified: a.date, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
