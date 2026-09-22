"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useCheckout } from "@/context/CheckoutContext";
import type { Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const { open } = useCheckout();
  const fav = isWishlisted(p.id);

  return (
    <article className="product-card group relative rounded-2xl bg-[#141414] border border-white/5 transition-all duration-500 overflow-hidden">
      {/* Image */}
      <Link href={`/product/${p.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#0b0b0b]">
        <img
          src={p.images[0]}
          alt={p.name}
          loading="lazy"
          className="product-img w-full h-full object-cover transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {p.badge && (
          <span
            className={`absolute top-3 right-3 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full ${
              p.badge === "NEW"
                ? "bg-[#d4af37] text-black"
                : p.badge === "HOT"
                ? "bg-red-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {p.badge}
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(p.id);
          }}
          aria-label="إضافة للمفضلة"
          className={`absolute top-3 left-3 w-9 h-9 grid place-items-center rounded-full backdrop-blur border border-white/20 transition-all duration-300 ${
            fav
              ? "bg-[#d4af37] text-black border-[#d4af37]"
              : "bg-black/40 text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37]"
          }`}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={fav ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Direct BUY (no cart) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            open({
              product: p,
              color: p.colors[0]?.name,
              size: p.sizes[0],
              quantity: 1,
            });
          }}
          className="absolute bottom-3 inset-x-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-[#d4af37] text-black font-bold text-sm py-3 rounded-full hover:bg-[#e8c968]"
        >
          شراء الآن
        </button>
      </Link>

      {/* Info */}
      <Link href={`/product/${p.id}`} className="block p-4 sm:p-5">
        <div className="mb-1">
          <span className="text-[10px] tracking-[0.25em] text-[#d4af37] font-semibold">
            {p.category.toUpperCase()}
          </span>
        </div>
        <h3 className="font-bold text-base sm:text-lg mb-2 group-hover:text-[#d4af37] transition-colors">
          {p.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black gold-text">{p.price} ج.م</span>
          {p.oldPrice && (
            <span className="text-xs text-white/40 line-through">{p.oldPrice} ج.م</span>
          )}
        </div>
      </Link>
    </article>
  );
}
