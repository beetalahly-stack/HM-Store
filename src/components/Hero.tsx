"use client";

import { HERO_IMAGE } from "@/lib/products";
import Logo from "@/components/Logo";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="HASSAN MAHMOUD Luxury Fashion"
          className="w-full h-full object-cover scale-105 anim-fade-in"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#0b0b0b]" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-transparent to-black/30" />
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        {/* Small badge */}
        <div className="anim-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-black/40 backdrop-blur px-4 py-1.5 text-xs tracking-[0.3em] text-[#d4af37] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] anim-floaty" />
            مجموعة 2026 الفاخرة
          </div>
        </div>

        {/* Large monogram with name */}
        <div
          className="anim-fade-up flex flex-col items-center"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Big HM monogram */}
          <div
            className="relative grid place-items-center rounded-full mb-4"
            style={{
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle at 30% 30%, #1f1f1f 0%, #0b0b0b 60%, #0b0b0b 100%)",
              boxShadow:
                "0 0 0 1px rgba(212,175,55,0.45), 0 0 60px rgba(212,175,55,0.25)",
            }}
          >
            <svg viewBox="0 0 80 80" width="160" height="160" aria-label="HM monogram">
              <defs>
                <linearGradient id="heroGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f5d97a" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#a9861e" />
                </linearGradient>
                <filter id="heroGlow">
                  <feGaussianBlur stdDeviation="0.8" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                x="40"
                y="58"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="48"
                fontWeight="700"
                fontStyle="italic"
                fill="url(#heroGold)"
                filter="url(#heroGlow)"
                letterSpacing="-3"
              >
                HM
              </text>
            </svg>
          </div>

          {/* Brand name — compact two lines */}
          <h1 className="font-black text-white tracking-[0.2em] text-2xl sm:text-3xl md:text-4xl">
            HASSAN
          </h1>
          <div className="gold-text font-black tracking-[0.3em] text-lg sm:text-xl md:text-2xl mt-1">
            MAHMOUD
          </div>
        </div>

        <p
          className="anim-fade-up mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl font-light tracking-wide"
          style={{ animationDelay: "0.5s" }}
        >
          Luxury Streetwear Collection
        </p>
        <p
          className="anim-fade-up mt-2 text-sm sm:text-base text-white/60 max-w-xl"
          style={{ animationDelay: "0.6s" }}
        >
          أزياء فاخرة تجمع بين بساطة الستريت وير ورقيّ التصميم
        </p>

        <div
          className="anim-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.75s" }}
        >
          <a href="#products" className="btn-gold">
            تسوق الآن
            <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a href="#categories" className="btn-outline">
            استكشف الفئات
          </a>
        </div>

        {/* Stats strip */}
        <div
          className="anim-fade-up mt-16 grid grid-cols-3 gap-6 sm:gap-12 max-w-xl w-full"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            { v: "+12K", l: "عميل سعيد" },
            { v: "4.9★", l: "تقييم عالمي" },
            { v: "شحن", l: "مجاني" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-lg sm:text-xl font-black gold-text">{s.v}</div>
              <div className="text-[11px] sm:text-xs text-white/60 mt-1 tracking-wide">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 anim-floaty">
        <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#d4af37] to-transparent" />
      </div>
    </section>
  );
}
