"use client";

import { readJson } from "@/lib/client-json";
import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totalOrders: number;
  newOrders: number;
  totalRevenue: number;
  statusCounts: Record<string, number>;
  todayOrders: number;
  recentOrders: any[];
};

const STATUS_COLORS: Record<string, string> = {
  "جديد": "bg-[#d4af37]/20 text-[#d4af37]",
  "تم التواصل": "bg-blue-500/20 text-blue-400",
  "قيد التجهيز": "bg-orange-500/20 text-orange-400",
  "تم الشحن": "bg-purple-500/20 text-purple-400",
  "تم التوصيل": "bg-green-500/20 text-green-400",
  "ملغي": "bg-red-500/20 text-red-400",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => readJson(r))
      .then((d) => {
        if (d.ok) setStats(d.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black">لوحة التحكم</h1>
        <p className="text-sm text-white/50 mt-1">مرحباً بك في لوحة تحكم HASSAN MAHMOUD</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="إجمالي الطلبات"
          value={stats.totalOrders}
          icon="📦"
          color="from-[#d4af37]/20 to-[#d4af37]/5"
        />
        <StatCard
          label="طلبات جديدة"
          value={stats.newOrders}
          icon="🆕"
          color="from-[#e8c968]/20 to-[#e8c968]/5"
        />
        <StatCard
          label="إجمالي الإيرادات"
          value={`${stats.totalRevenue.toLocaleString()} ج.م`}
          icon="💰"
          color="from-green-500/20 to-green-500/5"
        />
        <StatCard
          label="الطلبات اليوم"
          value={stats.todayOrders}
          icon="📅"
          color="from-blue-500/20 to-blue-500/5"
        />
      </div>

      {/* Orders by status */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 mb-8">
        <h2 className="font-black text-lg mb-4">حالات الطلبات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`rounded-xl border border-white/5 p-3 text-center ${STATUS_COLORS[status] ?? "bg-white/5 text-white/70"}`}
            >
              <div className="text-2xl font-black">{count}</div>
              <div className="text-[11px] mt-1 opacity/70">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-black text-lg">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-xs text-[#d4af37] hover:underline">
            عرض الكل ←
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-white/40 text-sm">
            لا توجد طلبات حتى الآن
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs">
                  <th className="text-right px-5 py-3 font-semibold">رقم</th>
                  <th className="text-right px-5 py-3 font-semibold">المنتج</th>
                  <th className="text-right px-5 py-3 font-semibold">العميل</th>
                  <th className="text-right px-5 py-3 font-semibold">الهاتف</th>
                  <th className="text-right px-5 py-3 font-semibold">الإجمالي</th>
                  <th className="text-right px-5 py-3 font-semibold">الحالة</th>
                  <th className="text-right px-5 py-3 font-semibold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition"
                  >
                    <td className="px-5 py-3 font-bold text-[#d4af37]">#{order.id}</td>
                    <td className="px-5 py-3">{order.productName}</td>
                    <td className="px-5 py-3">{order.customerName}</td>
                    <td className="px-5 py-3 font-mono text-xs">{order.phone}</td>
                    <td className="px-5 py-3 font-black">
                      {(Number(order.price) * Number(order.quantity) + Number(order.shipping ?? 60)).toLocaleString()} ج.م
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-white/10 text-white/70"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-white/50">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <Link
          href="/admin/orders"
          className="flex items-center gap-4 bg-[#141414] border border-white/5 rounded-2xl p-5 hover:border-[#d4af37]/40 transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 text-[#d4af37] grid place-items-center text-2xl">
            📋
          </div>
          <div>
            <div className="font-bold">إدارة الطلبات</div>
            <div className="text-xs text-white/50 mt-0.5">عرض وتعديل حالات الطلبات</div>
          </div>
          <svg className="w-5 h-5 text-white/30 mr-auto group-hover:text-[#d4af37] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-4 bg-[#141414] border border-white/5 rounded-2xl p-5 hover:border-[#d4af37]/40 transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 text-[#d4af37] grid place-items-center text-2xl">
            🛍️
          </div>
          <div>
            <div className="font-bold">إدارة المنتجات</div>
            <div className="text-xs text-white/50 mt-0.5">إضافة وتعديل وحذف المنتجات</div>
          </div>
          <svg className="w-5 h-5 text-white/30 mr-auto group-hover:text-[#d4af37] transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} border border-white/5 rounded-2xl p-5`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-black gold-text">{value}</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}
