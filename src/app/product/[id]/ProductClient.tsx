"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useCheckout } from "@/context/CheckoutContext";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ImageSlider from "@/components/ImageSlider";

export default function ProductClient({ product, related = [] }: { product: Product; related?: Product[] }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const { open } = useCheckout();
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const fav = isWishlisted(product.id);


  const handleBuyNow = () => {
    open({ product, color, size, quantity: qty });
  };

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-white/50 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4af37] transition">الرئيسية</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-white/80">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* ============ Gallery (ImageSlider) ============ */}
            <div className="anim-fade-up">
              <ImageSlider
                images={product.images}
                alt={product.name}
                badges={product.badge ? [{ type: product.badge }] : undefined}
              />
            </div>

            {/* ============ Details ============ */}
            <div className="anim-fade-up" style={{ animationDelay: "120ms" }}>
              {/* CHANGE: category / name / price / oldPrice in src/lib/products.ts */}
              <div className="text-xs tracking-[0.35em] text-[#d4af37] font-bold mb-2">
                {product.category.toUpperCase()}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black gold-text">{product.price} ج.م</span>
                {product.oldPrice && (
                  <>
                    <span className="text-lg text-white/40 line-through">{product.oldPrice} ج.م</span>
                    <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                      خصم {Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {/* CHANGE: description in src/lib/products.ts → product.description */}
              <p className="text-white/70 leading-8 mb-8">{product.description}</p>

              {/* Colors */}
              {/* CHANGE: colors in src/lib/products.ts → product.colors[] */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold">اللون: <span className="text-[#d4af37]">{color}</span></span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      title={c.name}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        color === c.name
                          ? "border-[#d4af37] scale-110"
                          : "border-white/20 hover:border-white/50"
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              {/* CHANGE: sizes in src/lib/products.ts → product.sizes[] */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold">المقاس: <span className="text-[#d4af37]">{size}</span></span>
                  <a href="#" className="text-xs text-white/60 underline hover:text-[#d4af37]">دليل المقاسات</a>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[52px] h-11 px-4 rounded-xl border text-sm font-bold transition-all ${
                        size === s
                          ? "bg-[#d4af37] text-black border-[#d4af37]"
                          : "bg-white/[0.03] border-white/10 hover:border-[#d4af37]/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <div className="text-sm font-bold mb-3">الكمية</div>
                <div className="inline-flex items-center gap-0 rounded-full bg-white/[0.03] border border-white/10">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 grid place-items-center text-white/80 hover:text-[#d4af37] transition"
                    aria-label="تقليل"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-11 h-11 grid place-items-center text-white/80 hover:text-[#d4af37] transition"
                    aria-label="زيادة"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-white/50 ms-3">
                  {product.stock > 10 ? "متوفر" : `متبقي ${product.stock} فقط`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button onClick={handleBuyNow} className="btn-gold flex-1">
                  شراء الآن
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="المفضلة"
                  className={`w-12 h-12 shrink-0 grid place-items-center rounded-full border transition ${
                    fav
                      ? "bg-[#d4af37] text-black border-[#d4af37]"
                      : "border-white/10 hover:border-[#d4af37] hover:text-[#d4af37]"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs tracking-[0.4em] text-[#d4af37] mb-2">YOU MAY ALSO LIKE</div>
              <h3 className="text-2xl sm:text-3xl font-black">منتجات مشابهة</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
