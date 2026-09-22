"use client";

import { readJson } from "@/lib/client-json";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["جديد", "تم التواصل", "قيد التجهيز", "تم الشحن", "تم التوصيل", "ملغي"];

const STATUS_COLORS: Record<string, string> = {
  "جديد": "bg-[#d4af37]/20 text-[#d4af37]",
  "تم التواصل": "bg-blue-500/20 text-blue-400",
  "قيد التجهيز": "bg-orange-500/20 text-orange-400",
  "تم الشحن": "bg-purple-500/20 text-purple-400",
  "تم التوصيل": "bg-green-500/20 text-green-400",
  "ملغي": "bg-red-500/20 text-red-400",
};

type Order = {
  id: number;
  productName: string;
  productId: number;
  price: number;
  quantity: number;
  shipping: number;
  color: string;
  size: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
  createdAt: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState("الكل");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((r) => readJson(r))
      .then((d) => {
        if (d.ok) setOrders(d.orders ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "الكل" || o.status === filter;
    const matchSearch =
      !search ||
      o.customerName.includes(search) ||
      o.phone.includes(search) ||
      o.productName.includes(search) ||
      String(o.id).includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">إدارة الطلبات</h1>
          <p className="text-sm text-white/50 mt-1">
            {orders.length} طلب — اضغط على الطلب لعرض التفاصيل
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn-outline !py-2 !px-4 text-xs"
        >
          🔄 تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("الكل")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition ${
            filter === "الكل"
              ? "bg-[#d4af37] text-black"
              : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
          }`}
        >
          الكل ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          if (!count) return null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                filter === s
                  ? "bg-[#d4af37] text-black"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الهاتف أو رقم الطلب..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm outline-none focus:border-[#d4af37]/50 transition"
        />
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <div className="text-4xl mb-3">📦</div>
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition"
            >
              {/* Order header */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/5 text-white/50">
                    #{order.id}
                  </span>
                  <span className="font-bold text-sm">{order.productName}</span>
                  {order.color && (
                    <span className="text-xs text-white/50">| {order.color} | {order.size}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black gold-text text-sm">
                    {(Number(order.price) * Number(order.quantity) + Number(order.shipping ?? 60)).toLocaleString()} ج.م
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-white/10"}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-white/40">{order.createdAt}</span>
                  <svg
                    className={`w-4 h-4 text-white/40 transition ${expandedId === order.id ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-white/5 p-4 bg-white/[0.01]">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <InfoItem label="العميل" value={order.customerName} />
                    <InfoItem label="الهاتف" value={order.phone} />
                    <InfoItem label="العنوان" value={order.address} />
                    <InfoItem label="الكمية" value={String(order.quantity)} />
                    <InfoItem label="سعر المنتج" value={`${Number(order.price).toLocaleString()} ج.م`} />
                    <InfoItem label="الشحن" value={`${Number(order.shipping ?? 60).toLocaleString()} ج.م`} />
                    <InfoItem label="الإجمالي" value={`${(Number(order.price) * Number(order.quantity) + Number(order.shipping ?? 60)).toLocaleString()} ج.م`} bold gold />
                    {order.notes && <InfoItem label="ملاحظات" value={order.notes} />}
                  </div>

                  {/* Status update */}
                  <div>
                    <div className="text-xs text-white/50 mb-2">تغيير الحالة:</div>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (s !== order.status) updateStatus(order.id, s);
                          }}
                          disabled={updating === order.id}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                            s === order.status
                              ? `${STATUS_COLORS[s]} ring-2 ring-current`
                              : "bg-white/5 text-white/50 border border-white/10 hover:border-white/30"
                          } disabled:opacity-50`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  bold,
  gold,
}: {
  label: string;
  value: string;
  bold?: boolean;
  gold?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm ${bold ? "font-black" : "font-semibold"} ${gold ? "text-[#d4af37]" : "text-white"}`}>
        {value || "—"}
      </div>
    </div>
  );
}
