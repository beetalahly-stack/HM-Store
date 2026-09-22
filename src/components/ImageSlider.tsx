"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  alt?: string;
  rounded?: string;
  aspect?: string;
  className?: string;
  showCounter?: boolean;
  showDots?: boolean;
  badges?: { type: "NEW" | "HOT" | "LIMITED" }[];
};

const SWIPE_THRESHOLD = 40;

function cleanImages(images: string[]) {
  return Array.from(
    new Set(
      (Array.isArray(images) ? images : [])
        .map((src) => (typeof src === "string" ? src.trim() : ""))
        .filter(Boolean),
    ),
  );
}

/**
 * Stable product gallery.
 *
 * Important: this version deliberately does NOT move a flex track by a
 * percentage. A track's percentage width can become ambiguous when its
 * children overflow, which was the source of the black/empty slides in the
 * previous implementation. We render one image layer at a time instead.
 */
export default function ImageSlider({
  images,
  alt = "Product image",
  rounded = "rounded-3xl",
  aspect = "aspect-[4/5]",
  className = "",
  showCounter = true,
  showDots = true,
  badges,
}: Props) {
  const clean = useMemo(() => cleanImages(images), [images]);
  const total = clean.length;
  const multiple = total > 1;
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const dragDelta = useRef(0);

  useEffect(() => {
    setIndex((current) => (total === 0 ? 0 : Math.min(current, total - 1)));
    setFailed({});
  }, [total, images]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!total) return;
      setIndex(((nextIndex % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    if (!total) return;
    setIndex((current) => (current + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (!total) return;
    setIndex((current) => (current - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!multiple) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName)) return;
      if (event.key === "ArrowLeft") next();
      else if (event.key === "ArrowRight") prev();
      else if (event.key === "Home") goTo(0);
      else if (event.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [multiple, next, prev, goTo, total]);

  const onDragStart = (clientX: number, clientY: number) => {
    if (!multiple) return;
    setIsDragging(true);
    startX.current = clientX;
    startY.current = clientY;
    dragDelta.current = 0;
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (startX.current === null) return;
    const dx = clientX - startX.current;
    const dy = clientY - (startY.current ?? clientY);
    if (Math.abs(dx) > Math.abs(dy)) dragDelta.current = dx;
  };

  const onDragEnd = () => {
    if (startX.current === null) return;
    const dx = dragDelta.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
    startX.current = null;
    startY.current = null;
    dragDelta.current = 0;
    setIsDragging(false);
  };

  if (total === 0) return null;

  const currentSrc = clean[index];
  const fallbackSrc = clean[0];
  const currentFailed = failed[index];

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`relative ${rounded} overflow-hidden bg-[#141414] border border-white/5 ${aspect} soft-shadow select-none`}
        onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => isDragging && onDragMove(e.clientX, e.clientY)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={onDragEnd}
        style={{ cursor: multiple ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        {/* One image layer only: no moving overflow track, so no black slide. */}
        <div className="absolute inset-0">
          {!currentFailed ? (
            <img
              key={currentSrc}
              src={currentSrc}
              alt={`${alt} ${index + 1}`}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setFailed((old) => ({ ...old, [index]: true }))}
            />
          ) : index !== 0 && fallbackSrc ? (
            <img
              src={fallbackSrc}
              alt={alt}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[#111] text-white/40 text-sm">
              تعذر تحميل الصورة
            </div>
          )}
        </div>

        {badges?.[index] && (
          <span
            className={`absolute top-4 right-4 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full z-10 ${
              badges[index].type === "NEW"
                ? "bg-[#d4af37] text-black"
                : badges[index].type === "HOT"
                  ? "bg-red-600 text-white"
                  : "bg-white text-black"
            }`}
          >
            {badges[index].type}
          </span>
        )}

        {showCounter && multiple && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[11px] font-bold tracking-wider" aria-live="polite">
            <span className="text-white">{index + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/70">{total}</span>
          </div>
        )}

        {multiple && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="الصورة التالية" className="group absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full grid place-items-center bg-black/40 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] hover:bg-gradient-to-br hover:from-[#e8c968] hover:to-[#a9861e] hover:text-black hover:border-transparent transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="الصورة السابقة" className="group absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full grid place-items-center bg-black/40 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] hover:bg-gradient-to-br hover:from-[#e8c968] hover:to-[#a9861e] hover:text-black hover:border-transparent transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </>
        )}

        {showDots && multiple && total <= 8 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {clean.map((_, i) => (
              <button key={i} type="button" onClick={(e) => { e.stopPropagation(); goTo(i); }} aria-label={`الانتقال إلى الصورة ${i + 1}`} className={`transition-all duration-300 rounded-full ${i === index ? "w-6 h-1.5 bg-gradient-to-r from-[#e8c968] to-[#a9861e]" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`} />
            ))}
          </div>
        )}
      </div>

      {multiple && (
        <div className="grid grid-cols-4 gap-3 mt-3" role="tablist" aria-label="صور المنتج">
          {clean.map((src, i) => (
            <button key={`${src}-${i}`} type="button" onClick={() => goTo(i)} role="tab" aria-selected={i === index} aria-label={`الصورة ${i + 1}`} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === index ? "border-[#d4af37] shadow-[0_0_0_3px_rgba(212,175,55,0.25)]" : "border-white/10 hover:border-white/30 opacity-80 hover:opacity-100"}`}>
              <img src={src} alt={`${alt} ${i + 1}`} draggable={false} className="w-full h-full object-cover pointer-events-none" onError={() => setFailed((old) => ({ ...old, [i]: true }))} />
              {i === index && <span className="absolute inset-0 ring-2 ring-inset ring-[#d4af37]/40 pointer-events-none" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
