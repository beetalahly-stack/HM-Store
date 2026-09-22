"use client";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductGrid({ items }: { items: Product[] }) {
  return (
    <section id="products" className="pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-black mb-6">الأكثر مبيعاً</h2>

        {items.length === 0 ? (
          <div className="text-center py-20 text-white/60">
            <div className="text-5xl mb-4 opacity-40">✦</div>
            <p>لا توجد منتجات مطابقة. جرّب فئة أخرى.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((p, i) => (
              <div
                key={p.id}
                className="anim-fade-up"
                style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
              >
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
