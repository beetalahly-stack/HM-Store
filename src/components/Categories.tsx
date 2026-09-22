"use client";

import { CATEGORIES } from "@/lib/products";

type Props = {
  value: string;
  onChange: (c: string) => void;
};

const ICONS: Record<string, string> = {
  "الكل": "✦",
  "تيشيرتات": "👕",
  "هوديز": "🧥",
  "جاكيتات": "🧥",
  "بناطيل": "👖",
  "أحذية": "👟",
  "إكسسوارات": "⌚",
};

export default function Categories({ value, onChange }: Props) {
  return (
    <section id="categories" className="pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-black mb-5">تسوّق حسب الفئة</h2>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {CATEGORIES.map((c) => {
            const active = value === c;
            return (
              <button
                key={c}
                onClick={() => onChange(c)}
                className={`shrink-0 group relative flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[#d4af37] text-black border-[#d4af37] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.7)]"
                    : "bg-white/[0.03] text-white/80 border-white/10 hover:border-[#d4af37]/60 hover:text-[#d4af37]"
                }`}
              >
                <span className="text-base">{ICONS[c] ?? "✦"}</span>
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
