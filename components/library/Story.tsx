"use client";

import { useId, useState } from "react";
import type { LibraryStory } from "@/lib/library";
import type { Pair } from "@/lib/colors";
import { Rich } from "@/components/edit/Rich";
import { Icon } from "@/components/ui/Icon";

/**
 * A family's little story (Tiffany's implementation notes, 11/10): the title and the first lines
 * show by default; "Read the little story" opens the full text, with the research links below in
 * smaller, lower-contrast type.
 */
export function Story({ story, fill }: { story: LibraryStory; fill: Pair }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="story">
      <h3 className="story__title">{story.title}</h3>
      <p id={id} className={`story__text${open ? "" : " story__text--clamp"}`}><Rich text={story.text} /></p>
      {open ? (
        <div className="story__sources">
          <span className="story__sources-h">Research sources</span>
          <ul>
            {story.sources.map((s) => (
              <li key={s.href + s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        className="btn btn--sm story__toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        style={{ background: fill.bg, color: fill.fg }}
      >
        {open ? "Show less" : "Read the little story"}
        <span className="story__chev" data-open={open}><Icon name="chevronDown" size={18} /></span>
      </button>
    </div>
  );
}
