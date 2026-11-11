"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ARTICLES, IN_SEASON, TOPICS, articleMonth, byDate, byViews, reads, type Topic } from "@/lib/edit";
import { ArticleCard } from "@/components/edit/ArticleCard";
import Link from "next/link";

/**
 * The Olfia Edit as a newspaper section front (Tiffany 11/10, after the New York Times):
 * the wide column runs by date or by what is being read, with topic and month tabs on top;
 * the narrow column keeps the most-read list, what is in season, and a few experiments to try,
 * and scrolls on its own.
 */
type Sort = "latest" | "trending";

export function EditList() {
  const params = useSearchParams();
  const initialTopic = params.get("topic");
  const [topic, setTopic] = useState<Topic | "All">(TOPICS.includes(initialTopic as Topic) ? (initialTopic as Topic) : "All");
  const [month, setMonth] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("latest");

  useEffect(() => {
    const t = params.get("topic");
    if (t && TOPICS.includes(t as Topic)) setTopic(t as Topic);
  }, [params]);

  const months = useMemo(() => [...new Set(byDate().map((a) => articleMonth(a.date)))], []);
  const topics = TOPICS.filter((t) => ARTICLES.some((a) => a.topic === t));

  const list = useMemo(() => {
    const base = ARTICLES.filter((a) => (topic === "All" || a.topic === topic) && (month === "All" || articleMonth(a.date) === month));
    return sort === "latest" ? byDate(base) : byViews(base);
  }, [topic, month, sort]);
  const [lead, ...rest] = list;

  const mostRead = byViews().slice(0, 5);
  const inSeason = byDate(ARTICLES.filter((a) => IN_SEASON.includes(a.slug)));
  const tryThis = byDate().slice(0, 4);

  return (
    <div className="np-grid">
      <div className="np-main">
        <div id="topics" className="np-filters">
          <div className="np-tabs" role="group" aria-label="Topic">
            {(["All", ...topics] as const).map((t) => (
              <button key={t} type="button" className="np-tab" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t === "All" ? "All topics" : t}</button>
            ))}
          </div>
          <div className="np-tabs np-tabs--quiet" role="group" aria-label="Month">
            {["All", ...months].map((m) => (
              <button key={m} type="button" className="np-tab" aria-pressed={month === m} onClick={() => setMonth(m)}>{m === "All" ? "All dates" : m}</button>
            ))}
          </div>
        </div>

        <section id="latest" aria-label="Stories">
          <div className="np-head">
            <h2 className="np-h">{sort === "latest" ? "Latest" : "Trending"}</h2>
            <div role="tablist" aria-label="Order" className="seg np-sort">
              <span className="seg__thumb" aria-hidden="true" style={{ left: sort === "latest" ? 5 : "50%", width: "calc(50% - 5px)" }} />
              <button type="button" role="tab" aria-selected={sort === "latest"} className="seg__opt" onClick={() => setSort("latest")}>Latest</button>
              <button type="button" role="tab" aria-selected={sort === "trending"} className="seg__opt" onClick={() => setSort("trending")}>Trending</button>
            </div>
          </div>
          {lead ? (
            <div className="np-stories">
              <ArticleCard a={lead} variant="lead" />
              {rest.map((a) => <ArticleCard key={a.slug} a={a} variant="row" />)}
            </div>
          ) : (
            <p className="muted" style={{ padding: "24px 0" }}>No stories for this topic and month yet.</p>
          )}
        </section>
      </div>

      <aside className="np-rail" aria-label="More from The Edit">
        <section id="most-read" className="np-box np-box--honey">
          <h2 className="np-h">Most read</h2>
          <ol className="np-rank">
            {mostRead.map((a, i) => (
              <li key={a.slug}>
                <span className="np-rank__n" aria-hidden="true">{i + 1}</span>
                <Link href={`/edit/${a.slug}`}>
                  <span className="np-rank__title">{a.title}</span>
                  <span className="edit-card__foot">{a.topic} · {reads(a.views)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="np-box np-box--rose">
          <h2 className="np-h">In season</h2>
          <div className="np-mini-list">
            {inSeason.map((a) => <ArticleCard key={a.slug} a={a} variant="mini" />)}
          </div>
        </section>

        <section className="np-box np-box--sea">
          <h2 className="np-h">Try this</h2>
          <ul className="np-coming">
            {tryThis.map((a) => (
              <li key={a.slug}>
                <Link href={`/edit/${a.slug}#try`} className="np-try">
                  <span className="edit-card__meta">{a.topic}</span>
                  <span className="np-coming__title">{a.tryThis.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
