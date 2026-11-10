"use client";

import { useState } from "react";
import type { ArticleImage } from "@/lib/edit";

/** Product photograph for the take-home object; hides itself if the source will not serve it. */
export function ObjectPhoto({ image }: { image: ArticleImage }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <figure className="article__object-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      <figcaption>{image.credit}</figcaption>
    </figure>
  );
}
