import { Icon, type IconName } from "@/components/ui/Icon";
import type { Topic } from "@/lib/edit";

/**
 * A story's tag: a small pill with its topic's icon (Tiffany 11/17: "文章标签换成类似icon的表达方式";
 * she chose icon plus words in a pill). Lists show the topic; a story page shows her label for that story.
 */
const TOPIC_ICON: Record<Topic, IconName> = {
  Culture: "drama",
  History: "scroll",
  Science: "flask",
  Design: "pencilRuler",
  Places: "mapPin",
  Rituals: "flame",
};

export function TopicTag({ topic, label }: { topic: Topic; label?: string }) {
  return (
    <span className="tag tag--story">
      <Icon name={TOPIC_ICON[topic]} size={15} />
      <span>{label ?? topic}</span>
    </span>
  );
}
