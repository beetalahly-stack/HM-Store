"use client";

import { useEffect, useMemo, useState } from "react";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import HeroImage from "@/components/HeroImage";
import { CATEGORIES, type Product } from "@/lib/products";
import { readJson } from "@/lib/client-json";

export default function HomePage() {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products", { cache: "no-store" })
      .then(async (res) => {
        const data = await readJson(res);
        if (!res.ok || !data.ok) throw new Error(data.error || "فشل في تحميل المنتجات");
        if (!cancelled) setProducts(data.products);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "فشل في تحميل المنتجات");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (category === "الكل") return products;
    return products.filter((p) => p.category === category);
  }, [category, products]);

  return (
    <>
      <section className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full h-[70vh] sm:h-[78vh] min-h-[480px] rounded-3xl overflow-hidden border border-white/10">
            <HeroImage />
          </div>
        </div>
      </section>

      <Categories value={category} onChange={setCategory} />

      {loading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl shimmer" />)}
          </div>
        </section>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-400">{error}</div>
      ) : (
        <ProductGrid items={filtered} />
      )}
    </>
  );
}
