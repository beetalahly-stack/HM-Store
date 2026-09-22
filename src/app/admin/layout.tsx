"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { readJson } from "@/lib/client-json";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "لوحة التحكم",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "الطلبات",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "المنتجات",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate the HttpOnly server session on mount.
  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((res) => {
        setAuthed(res.ok);
      })
      .catch(() => setAuthed(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simple password check — change ADMIN_PASSWORD in .env to your password
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await readJson(res);
    setLoading(false);
    if (data.ok) {
      setAuthed(true);
    } else {
      setError(data.error || "كلمة المرور غير صحيحة");
    }
  };

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#141414] border border-white/10 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl grid place-items-center bg-gradient-to-br from-[#e8c968] via-[#d4af37] to-[#a9861e] text-black font-black text-lg">
            HM
          </div>
          <h1 className="text-2xl font-black mb-1">لوحة تحكم HASSAN MAHMOUD</h1>
          <p className="text-sm text-white/50 mb-6">أدخل كلمة المرور للمتابعة</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              autoFocus
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-center text-sm outline-none focus:border-[#d4af37] transition"
            />
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full disabled:opacity-60"
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0d0d0d] border-l border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg grid place-items-center bg-gradient-to-br from-[#e8c968] via-[#d4af37] to-[#a9861e] text-black font-black text-[10px] italic tracking-tighter">
              HM
            </span>
            <div>
              <div className="text-xs font-black tracking-[0.18em] gold-text">HASSAN MAHMOUD</div>
              <div className="text-[10px] text-white/40">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout + back to site */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            العودة للموقع
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" });
              setAuthed(false);
              setPassword("");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
