"use client";

import { useId, useState } from "react";

/**
 * A family guide on Scentpedia (copy v1, §7.2): the first paragraph shows, the rest opens below it.
 * "Continue reading" is her note's wording (继续阅读入口); "Show less" is from her link list.
 */
export function GuideText({ paragraphs }: { paragraphs: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const [first, ...rest] = paragraphs;
  return (
    <div className="guide-text">
      <p>{first}</p>
      {rest.length ? (
        <>
          <div id={id} hidden={!open} className="guide-text__more">
            {rest.map((t) => <p key={t.slice(0, 40)}>{t}</p>)}
          </div>
          <button type="button" className="guide-text__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : "Continue reading"}
          </button>
        </>
      ) : null}
    </div>
  );
}
