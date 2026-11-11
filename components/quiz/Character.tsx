/**
 * One of the sixteen quiz characters (original illustrations drawn for Olfia on 2026-11-10 by
 * scripts/archetypes.py): big-head, short-body figures in a room corner tinted by their scent family.
 */
export function Character({ code, alt = "", className, eager = false }: { code: string; alt?: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/archetypes/${code.toLowerCase()}.svg`}
      alt={alt}
      width={400}
      height={480}
      loading={eager ? "eager" : "lazy"}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}
