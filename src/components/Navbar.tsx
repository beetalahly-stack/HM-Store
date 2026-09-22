"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import SearchBox from "@/components/SearchBox";
import Logo from "@/components/Logo";

export default function Navbar() {
  const { wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass py-2" : "bg-black/40 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo size={42} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 mr-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">
              الرئيسية
            </Link>
            <a href="/#categories" className="hover:text-[#d4af37] transition-colors">
              الفئات
            </a>
            <a href="/#products" className="hover:text-[#d4af37] transition-colors">
              المنتجات
            </a>
          </nav>

          <div className="flex-1" />

          {/* Desktop search */}
          <div className="hidden md:block">
            <SearchBox />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileSearchOpen((s) => !s)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-white/5 transition"
              aria-label="بحث"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <Link
              href="/#products"
              className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-white/5 transition"
              aria-label="المفضلة"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-[#d4af37] text-black rounded-full min-w-[16px] h-4 px-1 grid place-items-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-white/5 transition"
              aria-label="القائمة"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden glass border-t border-white/10 mt-2">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 text-sm">
              <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
              <a href="/#categories" onClick={() => setMenuOpen(false)}>الفئات</a>
              <a href="/#products" onClick={() => setMenuOpen(false)}>المنتجات</a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-x-0 top-[68px] z-40 px-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-3 shadow-2xl">
            <SearchBox autoFocus compact onNavigate={() => setMobileSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
