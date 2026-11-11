/**
 * One of the sixteen quiz characters. Since 2026-11-10 these are Tiffany's own figures, cut out of their
 * backgrounds by scripts/cutout_characters.py (transparent, same scale, neutral ground shadow).
 * The two she has not supplied yet use the earlier drawn figures, also without a background.
 */
const DRAWN = new Set(["infj", "enfj"]);

export function Character({ code, alt = "", className, eager = false }: { code: string; alt?: string; className?: string; eager?: boolean }) {
  const c = code.toLowerCase();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/archetypes/${c}.${DRAWN.has(c) ? "svg" : "webp"}`}
      alt={alt}
      width={400}
      height={480}
      loading={eager ? "eager" : "lazy"}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}
