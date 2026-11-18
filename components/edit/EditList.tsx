"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ARTICLES, EDITORS_PICKS, IN_SEASON, TOPICS, articleBySlug, articleMonth, byDate, type Article, type Topic } from "@/lib/edit";
import { ArticleCard } from "@/components/edit/ArticleCard";
import { TopicTag } from "@/components/edit/TopicTag";
import { StoryWhen } from "@/components/edit/StoryWhen";
import Link from "next/link";

/**
 * The Olfia Edit as a newspaper section front (Tiffany 11/10, after the New York Times):
 * the wide column runs by date, with topic and month tabs on top; the narrow column keeps the
 * editor's picks and what is in season, and scrolls on its own. No read counts: the old ones were
 * made up for the prototype and were removed on 11/17, with the Trending order that used them.
 * 11/18 (Tiffany): both rail boxes size their words to the box's own width, so a title takes the same share of the
 * box on a phone, a tablet or a computer; on tablets the two boxes sit side by side.
 */

export function EditList() {
  const params = useSearchParams();
  const initialTopic = params.get("topic");
  const [topic, setTopic] = useState<Topic | "All">(TOPICS.includes(initialTopic as Topic) ? (initialTopic as Topic) : "All");
  const [month, setMonth] = useState<string>("All");

  useEffect(() => {
    const t = params.get("topic");
    if (t && TOPICS.includes(t as Topic)) setTopic(t as Topic);
  }, [params]);

  const months = useMemo(() => [...new Set(byDate().map((a) => articleMonth(a.date)))], []);
  const topics = TOPICS.filter((t) => ARTICLES.some((a) => a.topic === t));

  const list = useMemo(() => {
    const base = ARTICLES.filter((a) => (topic === "All" || a.topic === topic) && (month === "All" || articleMonth(a.date) === month));
    return byDate(base);
  }, [topic, month]);
  const [lead, ...rest] = list;

  const picks = EDITORS_PICKS.map(articleBySlug).filter((a): a is Article => Boolean(a));
  const inSeason = byDate(ARTICLES.filter((a) => IN_SEASON.includes(a.slug)));

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

        {/* 11/18 (Tiffany): no "Latest" heading; the id stays for the menu's "Latest stories" link */}
        <section id="latest" aria-label="Stories">
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
        <section id="editors-picks" className="np-box">
          <h2 className="np-h">Editor’s Picks</h2>
          <ol className="np-rank">
            {picks.map((a, i) => (
              <li key={a.slug}>
                <span className="np-rank__n" aria-hidden="true">{i + 1}</span>
                <Link href={`/edit/${a.slug}`}>
                  <span className="np-rank__title">{a.title}</span>
                  <span className="edit-meta"><TopicTag topic={a.topic} /><StoryWhen a={a} /></span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="np-box">
          <h2 className="np-h">In Season</h2>
          <div className="np-mini-list">
            {inSeason.map((a) => <ArticleCard key={a.slug} a={a} variant="mini" />)}
          </div>
        </section>

      </aside>
    </div>
  );
}
