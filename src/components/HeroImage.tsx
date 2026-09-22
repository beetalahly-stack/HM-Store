"use client";

// =====================================================================
// HeroImage — Premium creator branding overlay for the hero
// Uses local /hero.jpg image (replaceable from /public/hero.jpg)
// Places:
//   - HM monogram + brand name (top-right)
//   - signature + socials (bottom-left)
//   - Tagline statement (centered, fully responsive, professional)
// =====================================================================

import { HERO_IMAGE } from "@/lib/products";

const SOCIALS = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.75 8.44-4.91 8.44-9.93z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.74a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.17z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

// Inline SVG placeholder shown if /hero.jpg fails to load
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900' preserveAspectRatio='xMidYMid slice'>
  <defs>
    <radialGradient id='g' cx='50%' cy='50%' r='70%'>
      <stop offset='0%' stop-color='#1a1a1a'/>
      <stop offset='100%' stop-color='#0b0b0b'/>
    </radialGradient>
    <linearGradient id='gold' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#f5d97a'/>
      <stop offset='50%' stop-color='#d4af37'/>
      <stop offset='100%' stop-color='#a9861e'/>
    </linearGradient>
  </defs>
  <rect width='1600' height='900' fill='url(#g)'/>
  <text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'
    font-family='Georgia, serif' font-size='220' font-style='italic' font-weight='700'
    fill='url(#gold)' opacity='0.85'>HM</text>
  <text x='50%' y='70%' text-anchor='middle' font-family='sans-serif'
    font-size='28' letter-spacing='14' fill='#ffffff' opacity='0.6'>HASSAN MAHMOUD</text>
</svg>`);

export default function HeroImage() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0b0b0b]">
      <img
        src={HERO_IMAGE}
        alt="HASSAN MAHMOUD Luxury Fashion"
        className="w-full h-full object-cover"
        loading="eager"
        onError={(e) => {
          // Fallback to inline placeholder if /hero.jpg is missing
          const img = e.currentTarget as HTMLImageElement;
          if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
        }}
      />

      {/* Soft dark vignette to ensure logo + text readability on any background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/65" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-black/20" />

      {/* Centered tagline — the statement of the brand */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-6">
        <div className="anim-fade-up max-w-3xl">
          {/* Subtle gold accent above the text */}
          <div className="mb-4 sm:mb-5 flex items-center justify-center gap-2">
            <span className="block h-px w-8 sm:w-12 bg-gradient-to-l from-[#d4af37] to-transparent" />
            <span className="text-[10px] sm:text-xs tracking-[0.4em] text-[#d4af37] font-bold">
              LUXURY STREETWEAR
            </span>
            <span className="block h-px w-8 sm:w-12 bg-gradient-to-r from-[#d4af37] to-transparent" />
          </div>

          <h2
            className="font-black leading-tight text-white"
            style={{
              fontSize: "clamp(1.5rem, 4.2vw, 3.25rem)",
              textShadow:
                "0 2px 20px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)",
              letterSpacing: "0.01em",
            }}
          >
            لبسك بيحكي عنك…
            <br />
            <span className="gold-text inline-block mt-1 sm:mt-2">
              فخليه يحكي أحلى حكاية
            </span>
            <span className="inline-block ml-1.5 sm:ml-2 align-middle" aria-hidden="true">
              🤎😎
            </span>
          </h2>
        </div>
      </div>

      {/* Top-right: HM monogram + brand name */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2.5">
          <div className="text-left">
            <div
              className="font-black tracking-[0.2em] text-white text-sm sm:text-base"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
            >
              HASSAN
            </div>
            <div
              className="font-black tracking-[0.3em] gold-text text-[10px] sm:text-xs"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
            >
              MAHMOUD
            </div>
          </div>
          <div
            className="relative grid place-items-center rounded-full"
            style={{
              width: 48,
              height: 48,
              background:
                "radial-gradient(circle at 30% 30%, #1f1f1f 0%, #0b0b0b 60%, #0b0b0b 100%)",
              boxShadow:
                "0 0 0 1px rgba(212,175,55,0.5), 0 0 18px rgba(212,175,55,0.35)",
            }}
          >
            <svg viewBox="0 0 80 80" width="36" height="36" aria-label="HM monogram">
              <defs>
                <linearGradient id="imgHmGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f5d97a" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#a9861e" />
                </linearGradient>
                <filter id="imgHmGlow">
                  <feGaussianBlur stdDeviation="0.6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                x="40"
                y="54"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="46"
                fontWeight="700"
                fontStyle="italic"
                fill="url(#imgHmGold)"
                filter="url(#imgHmGlow)"
                letterSpacing="-3"
              >
                HM
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom-left: socials + signature */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className="w-7 h-7 grid place-items-center rounded-full border border-[#d4af37]/40 bg-black/30 backdrop-blur-sm text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
              style={{ boxShadow: "0 0 10px rgba(212,175,55,0.15)" }}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div
          className="text-white font-black tracking-[0.32em] text-[10px] sm:text-xs"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
        >
          HASSAN MAHMOUD
        </div>
      </div>
    </div>
  );
}
