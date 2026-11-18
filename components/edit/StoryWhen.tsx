import { articleDate, type Article } from "@/lib/edit";
import { Icon } from "@/components/ui/Icon";

/**
 * A story's date and reading time, always on one line (Tiffany 11/18). The date is bold and dark; the reading time is
 * lighter, in regular weight, behind a clock, so the two read as different things.
 */
export function StoryWhen({ a }: { a: Pick<Article, "date" | "readTime"> }) {
  return (
    <span className="edit-when">
      <time className="edit-when__date" dateTime={a.date}>{articleDate(a.date)}</time>
      <span className="edit-when__read"><Icon name="clock" size={14} />{a.readTime}</span>
    </span>
  );
}
