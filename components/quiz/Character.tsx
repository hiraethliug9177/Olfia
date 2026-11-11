/**
 * One of the sixteen quiz characters: Tiffany's own figures (2026-11-10), cut out of their backgrounds by
 * scripts/cutout_characters.py (transparent, one shared scale, neutral ground shadow).
 */
export function Character({ code, alt = "", className, eager = false }: { code: string; alt?: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/archetypes/${code.toLowerCase()}.webp`}
      alt={alt}
      width={400}
      height={480}
      loading={eager ? "eager" : "lazy"}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}
