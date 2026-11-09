"use client";

import { productById } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCards";

export function ArticleProducts({ ids }: { ids: string[] }) {
  const list = ids.map(productById).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <section aria-label="Recreate this at home" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30 }}>Recreate this at home</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      <p className="muted" style={{ fontSize: 14 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </section>
  );
}
