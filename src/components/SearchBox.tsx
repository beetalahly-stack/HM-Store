"use client";

import { readJson } from "@/lib/client-json";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";

const TRENDING_KEYWORDS = ["تيشيرت", "هودي", "جاكيت", "أحذية", "بناطيل", "إكسسوارات"];

function normalize(s: string) {
  return s.toLowerCase().replace(/[\u064B-\u065F\u0670]/g, "").replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").trim();
}

function rankProducts(products: Product[], q: string) {
  const nq = normalize(q);
  if (!nq) return [];
  return products
    .map((p) => {
      const name = normalize(p.name), cat = normalize(p.category), slug = normalize(p.slug);
      let score = 0;
      if (name === nq) score = 100;
      else if (name.startsWith(nq)) score = 80;
      else if (name.includes(nq)) score = 60;
      else if (cat.includes(nq)) score = 40;
      else if (slug.includes(nq)) score = 30;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .slice(0, 8)
    .map((x) => x.p);
}

type Props = { autoFocus?: boolean; onNavigate?: () => void; compact?: boolean };

export default function SearchBox({ autoFocus, onNavigate, compact }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" }).then((r) => readJson(r)).then((d) => { if (d.ok) setProducts(d.products); }).catch(() => {});
  }, []);

  const results = useMemo(() => rankProducts(products, query), [products, query]);
  const hasQuery = query.trim().length > 0;
  const popular = useMemo(() => products.filter((p) => p.badge).slice(0, 6).concat(products.filter((p) => !p.badge)).slice(0, 6), [products]);
  const list = hasQuery ? results : popular;
  const noResults = hasQuery && results.length === 0;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  useEffect(() => setActive(0), [query, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); return; }
    if (!open) return;
    const nav = noResults ? popular : list;
    if (!nav.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % nav.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + nav.length) % nav.length); }
    else if (e.key === "Enter") { e.preventDefault(); window.location.href = `/product/${nav[active].id}`; }
  };

  const wrapperWidth = compact ? "w-full" : open || hasQuery ? "w-80" : "w-56";

  return (
    <div ref={boxRef} className={`relative ${compact ? "w-full" : ""}`}>
      <div className={`flex items-center gap-2 rounded-full border bg-black/50 px-4 py-2 transition-all duration-300 ${open ? "border-[#d4af37]/60" : "border-white/10"} ${wrapperWidth}`}>
        <svg className="w-4 h-4 text-white/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpen(true)} onKeyDown={onKeyDown} autoFocus={autoFocus} placeholder="ابحث عن منتج..." className="bg-transparent outline-none text-sm w-full placeholder:text-white/40" aria-label="بحث" />
        {query && <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="text-white/50 hover:text-white" aria-label="مسح">×</button>}
      </div>
      {open && (
        <div className={`absolute top-full mt-2 ${compact ? "left-0 right-0" : "left-0 right-0 min-w-[340px]"} bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50`}>
          <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between"><span className="text-[10px] tracking-[0.35em] text-[#d4af37] font-bold">{hasQuery ? (noResults ? "لا توجد نتائج" : `${results.length} نتيجة`) : "الأكثر رواجاً"}</span></div>
          {!hasQuery && <div className="px-4 pt-3 pb-1 flex flex-wrap gap-1.5">{TRENDING_KEYWORDS.map((k) => <button key={k} onClick={() => { setQuery(k); inputRef.current?.focus(); }} className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-white/70 hover:border-[#d4af37]/60 hover:text-[#d4af37]"># {k}</button>)}</div>}
          {noResults && <div className="px-4 py-3 text-center text-sm text-white/60">إليك بعض الاقتراحات</div>}
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {(noResults ? popular : list).map((p, i) => (
              <Link key={p.id} href={`/product/${p.id}`} onClick={() => { setOpen(false); setQuery(""); onNavigate?.(); }} onMouseEnter={() => setActive(i)} className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl transition ${active === i ? "bg-[#d4af37]/12 border border-[#d4af37]/40" : "border border-transparent hover:bg-white/5"}`}>
                <img src={p.images[0]} alt={p.name} className="w-12 h-14 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{p.name}</div><div className="text-[11px] text-white/50 mt-0.5">{p.category}</div></div>
                <div className="text-[#d4af37] font-black text-sm shrink-0">{p.price} ج.م</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
