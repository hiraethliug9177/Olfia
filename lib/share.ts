/**
 * What a shared link shows (11/17). The site-wide picture is the wordmark, Tiffany's "cover" line and the
 * seven scent materials on cream paper (public/og.png). A story shares its own cover when Olfia may show it
 * elsewhere: free-licence photos (Unsplash, the Met) and Olfia's own files. Other covers stay on the page
 * with their credit, and a shared link shows the Olfia picture instead.
 */
export const SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Olfia, with dried rose, orange, lavender, cedar, vanilla, cinnamon and linen on cream paper",
};

const SHAREABLE = /^(\/|https:\/\/images\.unsplash\.com\/|https:\/\/collectionapi\.metmuseum\.org\/)/;

export function shareImageFor(image: { src: string; alt: string } | null): Array<{ url: string; alt: string; width?: number; height?: number }> {
  return image && SHAREABLE.test(image.src) ? [{ url: image.src, alt: image.alt }] : [SHARE_IMAGE];
}
