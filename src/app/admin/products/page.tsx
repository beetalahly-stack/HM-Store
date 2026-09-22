"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, type Product } from "@/lib/products";
import { readJson } from "@/lib/client-json";

type ProductForm = {
  name: string;
  price: string;
  oldPrice: string;
  category: string;
  images: string;
  badge: string;
  stock: string;
  description: string;
  colors: string;
  sizes: string;
};

const emptyForm: ProductForm = {
  name: "", price: "", oldPrice: "", category: "تيشيرتات", images: "", badge: "", stock: "20", description: "", colors: "أسود,#0b0b0b\nأبيض,#ffffff", sizes: "S,M,L,XL",
};

function ProductModal({ product, onSave, onClose }: { product?: Product; onSave: (p: Product) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState<ProductForm>(() => product ? {
    name: product.name, price: String(product.price), oldPrice: product.oldPrice ? String(product.oldPrice) : "", category: product.category,
    images: product.images.join("\n"), badge: product.badge ?? "", stock: String(product.stock), description: product.description,
    colors: product.colors.map((c) => `${c.name},${c.hex}`).join("\n"), sizes: product.sizes.join(","),
  } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key: keyof ProductForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function uploadImage(file: File) {
    const fd = new FormData(); fd.append("file", file); setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "فشل رفع الصورة");
      set("images", form.images ? `${form.images}\n${data.url}` : data.url);
    } catch (e) { alert(e instanceof Error ? e.message : "فشل رفع الصورة"); }
    finally { setUploading(false); }
  }

  async function save() {
    const name = form.name.trim(); const price = Number(form.price); const stock = Number(form.stock);
    const images = form.images.split("\n").map((x) => x.trim()).filter(Boolean);
    if (!name) return alert("أدخل اسم المنتج");
    if (!Number.isInteger(price) || price <= 0) return alert("أدخل سعرًا صحيحًا");
    if (!Number.isInteger(stock) || stock < 0) return alert("أدخل مخزونًا صحيحًا");
    if (!images.length) return alert("أضف صورة واحدة على الأقل");
    const colors = form.colors.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => { const [n, h = "#000000"] = line.split(","); return { name: n.trim(), hex: h.trim() }; }).filter((x) => x.name);
    const sizes = form.sizes.split(",").map((x) => x.trim()).filter(Boolean);
    const p: Product = {
      id: product?.id ?? 0, slug: product?.slug ?? `product-${Date.now()}`, name, price,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined, category: form.category as Product["category"], images, colors, sizes,
      rating: product?.rating ?? 5, reviewsCount: product?.reviewsCount ?? 0, badge: (form.badge || undefined) as Product["badge"], stock,
      description: form.description.trim(), specs: product?.specs ?? [], reviews: product?.reviews ?? [],
    };
    setSaving(true); try { await onSave(p); } finally { setSaving(false); }
  }

  return <>
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md" onClick={onClose} />
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 overflow-auto">
      <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/5"><h2 className="font-black text-lg">{product ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}</h2><button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-white/5">✕</button></div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <Field label="اسم المنتج *"><input className="admin-input" value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4"><Field label="السعر *"><input className="admin-input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field><Field label="السعر القديم"><input className="admin-input" type="number" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} /></Field></div>
          <Field label="الفئة"><select className="admin-input" value={form.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.filter((x) => x !== "الكل").map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="صور المنتج"><textarea className="admin-input" rows={3} value={form.images} onChange={(e) => set("images", e.target.value)} placeholder="رابط صورة في كل سطر" /><label className="inline-flex mt-2 cursor-pointer btn-outline !py-2 !px-4 text-xs">{uploading ? "جاري الرفع..." : "📷 رفع صورة من الجهاز"}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f); e.currentTarget.value = ""; }} /></label></Field>
          <div className="grid grid-cols-2 gap-4"><Field label="المخزون"><input className="admin-input" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></Field><Field label="الشارة"><select className="admin-input" value={form.badge} onChange={(e) => set("badge", e.target.value)}><option value="">بدون</option><option value="NEW">NEW</option><option value="HOT">HOT</option><option value="LIMITED">LIMITED</option></select></Field></div>
          <Field label="الألوان — اسم,#HEX"><textarea className="admin-input" rows={3} value={form.colors} onChange={(e) => set("colors", e.target.value)} /></Field>
          <Field label="المقاسات — بفواصل"><input className="admin-input" value={form.sizes} onChange={(e) => set("sizes", e.target.value)} /></Field>
          <Field label="وصف المنتج"><textarea className="admin-input" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        </div>
        <div className="p-5 border-t border-white/5 flex gap-3"><button onClick={onClose} className="btn-outline flex-1">إلغاء</button><button onClick={() => void save()} disabled={saving || uploading} className="btn-gold flex-1 disabled:opacity-50">{saving ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}</button></div>
      </div>
    </div>
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="block text-xs text-white/60 font-semibold mb-1.5">{label}</label>{children}</div>; }

export default function AdminProducts() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalProduct, setModalProduct] = useState<Product>();
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("الكل");

  const load = async () => {
    setLoading(true); setError("");
    try { const r = await fetch("/api/admin/products", { cache: "no-store" }); const d = await readJson(r); if (!r.ok || !d.ok) throw new Error(d.error || "فشل في جلب المنتجات"); setProductList(d.products); }
    catch (e) { setError(e instanceof Error ? e.message : "فشل في جلب المنتجات"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const save = async (p: Product) => {
    const r = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: p }) });
    const d = await readJson(r); if (!r.ok || !d.ok) throw new Error(d.error || "فشل في حفظ المنتج");
    setProductList((prev) => p.id ? prev.map((x) => x.id === p.id ? d.product : x) : [...prev, d.product]); setShowModal(false); setModalProduct(undefined);
  };
  const remove = async (id: number) => { const r = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" }); const d = await readJson(r); if (!r.ok || !d.ok) return alert(d.error || "فشل الحذف"); setProductList((prev) => prev.filter((p) => p.id !== id)); setDeleteConfirm(null); };

  const filtered = productList.filter((p) => (filterCat === "الكل" || p.category === filterCat) && (!search || `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())));

  return <div className="min-h-screen p-4 sm:p-6 lg:p-8">
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6 bg-[#0b0b0b]/95 backdrop-blur border-b border-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1600px] mx-auto">
        <div><h1 className="text-2xl sm:text-3xl font-black">إدارة المنتجات</h1><p className="text-sm text-white/50 mt-1">{productList.length} منتج محفوظ في Neon</p></div>
        <button type="button" onClick={() => { setModalProduct(undefined); setShowModal(true); }} className="btn-gold !px-5 whitespace-nowrap">＋ إضافة منتج</button>
      </div>
    </div>

    {error && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 p-4 text-sm flex items-center justify-between"><span>{error}</span><button onClick={() => void load()} className="underline">إعادة المحاولة</button></div>}
    <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto no-scrollbar">{["الكل", ...CATEGORIES.filter((x) => x !== "الكل")].map((c) => <button key={c} onClick={() => setFilterCat(c)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${filterCat === c ? "bg-[#d4af37] text-black" : "bg-white/5 text-white/60 border border-white/10"}`}>{c} ({c === "الكل" ? productList.length : productList.filter((p) => p.category === c).length})</button>)}</div>
    <div className="relative mb-6"><input className="admin-input !py-3 !pr-4" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث عن منتج..." /></div>

    {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl shimmer" />)}</div> : filtered.length === 0 ? <div className="text-center py-20 text-white/40">لا توجد منتجات</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{filtered.map((p) => <div key={p.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group"><div className="relative aspect-[4/3] bg-[#0b0b0b]"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = "0.25"; }} />{p.badge && <span className="absolute top-2 right-2 text-[9px] font-black px-2 py-1 rounded-full bg-[#d4af37] text-black">{p.badge}</span>}<div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2"><button onClick={() => { setModalProduct(p); setShowModal(true); }} className="bg-[#d4af37] text-black text-xs font-bold px-4 py-2 rounded-full">✏️ تعديل</button><button onClick={() => setDeleteConfirm(p.id)} className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full">🗑️ حذف</button></div></div><div className="p-4"><div className="text-[10px] text-[#d4af37] font-bold mb-1">{p.category}</div><h3 className="font-bold text-sm mb-1 truncate">{p.name}</h3><div className="font-black gold-text">{p.price} ج.م</div><div className="text-[10px] text-white/40 mt-2">المخزون: {p.stock} · المقاسات: {p.sizes.join(" · ") || "غير محدد"}</div></div>{deleteConfirm === p.id && <div className="p-4 border-t border-red-500/20 bg-red-500/5"><p className="text-xs text-red-300 mb-3 text-center">تأكيد حذف المنتج؟</p><div className="flex gap-2"><button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1 !py-2">إلغاء</button><button onClick={() => void remove(p.id)} className="flex-1 py-2 rounded-full bg-red-600 text-white text-xs font-bold">حذف</button></div></div>}</div>)}</div>}

    {showModal && <ProductModal product={modalProduct} onSave={save} onClose={() => { setShowModal(false); setModalProduct(undefined); }} />}
  </div>;
}
