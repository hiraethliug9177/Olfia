import { Fragment } from "react";
import { RESEARCH, type ResearchId } from "@/lib/copy/research";

/** Markdown links ([title](https://…)) in a line of text become links that open in a new tab. */
export function Linked({ md }: { md: string }) {
  const parts = md.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return m ? (
          <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        );
      })}
    </>
  );
}

/**
 * Research notes (copy v1, 11/24, §13): a fold-out list of the sources behind a piece of copy, shown by title and
 * author. The R numbers in Tiffany's document are internal and never shown.
 */
export function ResearchNotes({ ids, label = "Research notes", note }: { ids: readonly ResearchId[]; label?: string; note?: string }) {
  if (!ids.length) return null;
  return (
    <details className="sources">
      <summary>{label}</summary>
      <ul>
        {ids.map((id) => <li key={id}><Linked md={RESEARCH[id].cite} /></li>)}
      </ul>
      {note ? <p className="sources__note">{note}</p> : null}
    </details>
  );
}
