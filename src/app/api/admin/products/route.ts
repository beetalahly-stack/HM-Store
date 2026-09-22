import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createProduct, deleteProduct, listProducts, updateProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const CATEGORIES = ["تيشيرتات", "هوديز", "جاكيتات", "بناطيل", "أحذية", "إكسسوارات"];
const BADGES = ["NEW", "HOT", "LIMITED"];

function normalizeProduct(raw: Record<string, unknown>) {
  const name = String(raw.name ?? "").trim();
  const price = Number(raw.price);
  const stock = Number(raw.stock ?? 0);
  const oldPrice = raw.oldPrice === "" || raw.oldPrice == null ? null : Number(raw.oldPrice);
  const category = String(raw.category ?? "").trim();
  const images = Array.isArray(raw.images) ? raw.images.map(String).map((x) => x.trim()).filter(Boolean) : [];
  const colors = Array.isArray(raw.colors)
    ? raw.colors
        .filter((c) => c && typeof c === "object")
        .map((c) => {
          const item = c as Record<string, unknown>;
          return { name: String(item.name ?? "").trim(), hex: String(item.hex ?? "#000000").trim() };
        })
        .filter((c) => c.name)
    : [];
  const sizes = Array.isArray(raw.sizes) ? raw.sizes.map(String).map((x) => x.trim()).filter(Boolean) : [];
  const slug = String(raw.slug ?? `product-${Date.now()}`).trim();
  const badge = raw.badge ? String(raw.badge).trim() : null;

  if (!name || !Number.isInteger(price) || price <= 0) throw new Error("اسم المنتج والسعر مطلوبان");
  if (!Number.isInteger(stock) || stock < 0) throw new Error("المخزون غير صحيح");
  if (oldPrice !== null && (!Number.isInteger(oldPrice) || oldPrice <= 0)) throw new Error("السعر القديم غير صحيح");
  if (!CATEGORIES.includes(category)) throw new Error("الفئة غير صحيحة");
  if (!images.length) throw new Error("أضف صورة واحدة على الأقل");
  if (badge && !BADGES.includes(badge)) throw new Error("الشارة غير صحيحة");

  return {
    name,
    slug,
    price,
    oldPrice,
    category,
    image: images[0] ?? null,
    images,
    colors,
    sizes,
    rating: Number.isFinite(Number(raw.rating)) ? Math.max(0, Math.round(Number(raw.rating))) : 5,
    reviewsCount: Number.isFinite(Number(raw.reviewsCount)) ? Math.max(0, Math.round(Number(raw.reviewsCount))) : 0,
    description: String(raw.description ?? "").trim(),
    specs: Array.isArray(raw.specs) ? raw.specs : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    stock,
    badge,
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  try {
    const products = await listProducts();
    return NextResponse.json({ ok: true, products }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[admin/products] GET", error);
    return NextResponse.json({ ok: false, error: "فشل في جلب المنتجات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  try {
    const body = await req.json();
    const raw = (body?.product ?? body) as Record<string, unknown>;
    const data = normalizeProduct(raw);
    const candidateId = raw.id === undefined || raw.id === null || raw.id === "" ? null : Number(raw.id);
    const id = candidateId && Number.isInteger(candidateId) && candidateId > 0 ? candidateId : null;

    if (id !== null && (!Number.isInteger(id) || id <= 0)) {
      return NextResponse.json({ ok: false, error: "معرف المنتج غير صحيح" }, { status: 400 });
    }

    const product = id ? await updateProduct(id, data) : await createProduct(data);
    if (!product) return NextResponse.json({ ok: false, error: "المنتج غير موجود" }, { status: 404 });
    return NextResponse.json({ ok: true, product }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[admin/products] POST", error);
    const message = error instanceof Error ? error.message : "فشل في حفظ المنتج";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ ok: false, error: "معرف المنتج غير صحيح" }, { status: 400 });
    const deleted = await deleteProduct(id);
    if (!deleted) return NextResponse.json({ ok: false, error: "المنتج غير موجود" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/products] DELETE", error);
    return NextResponse.json({ ok: false, error: "فشل في حذف المنتج" }, { status: 500 });
  }
}
