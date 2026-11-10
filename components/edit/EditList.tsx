"use client";

import { useState } from "react";
import { ARTICLES, TOPICS, type Topic } from "@/lib/edit";
import { ArticleCard } from "@/components/edit/ArticleCard";

/** One lead story with the rest beside it; topic chips filter the list (11/9 feedback 06). */
export function EditList() {
  const [topic, setTopic] = useState<Topic | "All">("All");
  const list = topic === "All" ? ARTICLES : ARTICLES.filter((a) => a.topic === topic);
  const [lead, ...rest] = list;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div className="chips" role="group" aria-label="Topic">
        {(["All", ...TOPICS] as const).map((t) => (
          <button key={t} type="button" className="chip chip--solid" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
        ))}
      </div>
      {lead ? (
        <div className={rest.length ? "edit-split" : undefined}>
          <ArticleCard a={lead} lead />
          {rest.length ? <div className="edit-split__side">{rest.map((a) => <ArticleCard key={a.slug} a={a} />)}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
