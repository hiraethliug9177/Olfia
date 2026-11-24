"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { useToast } from "@/lib/toast";
import { Icon } from "@/components/ui/Icon";

/**
 * A story's share row (11/17, review item 9): copy the link, save to Pinterest with the story's picture, and,
 * where the device has one, its own share sheet (phones: Messages, Instagram, RedNote and the rest).
 * Links always point at the public site. Nothing is counted or shown about who shared.
 */
export function ShareRow({ url, title, image, slug }: { url: string; title: string; image: string; slug: string }) {
  const show = useToast((s) => s.show);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      show("Link copied");
      track("story_share", { method: "copy", slug });
    } catch {
      show("Couldn’t copy the link. Try again.");
    }
  };

  const native = async () => {
    try {
      await navigator.share({ title, url });
      track("story_share", { method: "native", slug });
    } catch {
      // closed without sharing
    }
  };

  const pin = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;

  return (
    <div className="share-row" role="group" aria-label="Share this story">
      <button type="button" className="btn btn--ghost btn--sm" onClick={copy}>
        <Icon name="link" size={18} />Copy link
      </button>
      <a
        className="btn btn--ghost btn--sm"
        href={pin}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("story_share", { method: "pinterest", slug })}
      >
        <Icon name="pin" size={18} />Pinterest
      </a>
      {canShare ? (
        <button type="button" className="btn btn--ghost btn--sm" onClick={native}>
          <Icon name="share" size={18} />Share
        </button>
      ) : null}
    </div>
  );
}
