"use client";

import { sceneName } from "@/lib/catalog";
import { sourceLabel } from "@/lib/catalog";
import type { GiftScene } from "@/lib/gifts";
import { ScenePage } from "@/components/scene/ScenePage";

const LIGHT: Record<GiftScene["time"], string> = { morning: "in the morning", afternoon: "in the afternoon", night: "at night" };

/**
 * A pick drawn into its room (Tiffany 11/18: products live in the Rooms illustrations): the room's page from
 * Rooms, cropped to the stage so no page title or date shows.
 */
export function GiftRoom({ scene, prefix = "olfia" }: { scene: GiftScene; prefix?: string }) {
  const label = `${sourceLabel(scene.p.type)} in the ${sceneName(scene.sceneId).toLowerCase()} ${LIGHT[scene.time]}`;
  return (
    <div className="gift-room" role="img" aria-label={label}>
      <ScenePage items={scene.items} families={scene.p.families} title="" time={scene.time} strength={75} showLabels={false} prefix={prefix} emphasizeScent />
    </div>
  );
}
