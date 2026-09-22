// =====================================================================
// HASSAN MAHMOUD — premium monogram logo
// Pure SVG so it scales cleanly and inherits gold gradient + glow
// =====================================================================

export default function Logo({
  size = 40,
  showName = true,
  direction = "row",
}: {
  size?: number;
  showName?: boolean;
  direction?: "row" | "stacked";
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        direction === "stacked" ? "flex-col" : ""
      }`}
    >
      {/* Monogram circle with HM in handwritten gold style */}
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 30% 30%, #1f1f1f 0%, #0b0b0b 60%, #0b0b0b 100%)",
          boxShadow:
            "0 0 0 1px rgba(212,175,55,0.35), 0 0 14px rgba(212,175,55,0.18)",
        }}
      >
        <svg
          viewBox="0 0 80 80"
          width={size * 0.78}
          height={size * 0.78}
          aria-label="HM monogram"
        >
          <defs>
            <linearGradient id="hmGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5d97a" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#a9861e" />
            </linearGradient>
            <filter id="hmGlow">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text
            x="40"
            y="52"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="44"
            fontWeight="700"
            fontStyle="italic"
            fill="url(#hmGold)"
            filter="url(#hmGlow)"
            letterSpacing="-3"
          >
            HM
          </text>
        </svg>
      </div>

      {/* Brand name */}
      {showName && (
        <div
          className={`flex ${
            direction === "stacked"
              ? "flex-col items-center leading-tight"
              : "flex-col leading-tight"
          }`}
        >
          <span
            className="font-black text-white tracking-[0.2em]"
            style={{ fontSize: size * 0.32 }}
          >
            HASSAN
          </span>
          <span
            className="gold-text font-black tracking-[0.32em]"
            style={{ fontSize: size * 0.22 }}
          >
            MAHMOUD
          </span>
        </div>
      )}
    </div>
  );
}
