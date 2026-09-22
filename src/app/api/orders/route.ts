import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products as productTable } from "@/db/schema";

const SHIPPING_COST = 60;
const OWNER_PHONE = "201143892505";
const EGYPTIAN_PHONE = /^(010|011|012|015)\d{8}$/;

async function sendWhatsApp(message: string) {
  const apiKey = process.env.WHATSAPP_API_KEY;
  if (!apiKey) return;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(OWNER_PHONE)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
    await fetch(url, { method: "GET", cache: "no-store" });
  } catch (error) {
    console.error("[orders] WhatsApp notification failed", error);
  }
}

async function sendToGoogleSheet(payload: Record<string, unknown>) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[orders] Google Sheets notification failed", error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = Number(body?.productId);
    const quantity = Number(body?.quantity ?? 1);
    const customerName = String(body?.customerName ?? "").trim();
    const phone = String(body?.phone ?? "").replace(/\D/g, "");
    const address = String(body?.address ?? "").trim();
    const notes = body?.notes ? String(body.notes).trim() : null;
    const requestedColor = body?.color ? String(body.color).trim() : null;
    const requestedSize = body?.size ? String(body.size).trim() : null;

    if (!Number.isInteger(productId) || productId <= 0) return NextResponse.json({ ok: false, error: "المنتج غير صحيح" }, { status: 400 });
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) return NextResponse.json({ ok: false, error: "الكمية غير صحيحة" }, { status: 400 });
    if (customerName.length < 2 || customerName.length > 128) return NextResponse.json({ ok: false, error: "الاسم غير صحيح" }, { status: 400 });
    if (!EGYPTIAN_PHONE.test(phone)) return NextResponse.json({ ok: false, error: "رقم الهاتف غير صحيح" }, { status: 400 });
    if (address.length < 5 || address.length > 2000) return NextResponse.json({ ok: false, error: "العنوان غير صحيح" }, { status: 400 });

    const result = await db.transaction(async (tx) => {
      const [product] = await tx.select().from(productTable).where(eq(productTable.id, productId)).limit(1);
      if (!product) throw new Error("PRODUCT_NOT_FOUND");

      const colors = Array.isArray(product.colors) ? product.colors : [];
      const sizes = Array.isArray(product.sizes) ? product.sizes : [];
      const color = requestedColor && colors.some((c) => c.name === requestedColor) ? requestedColor : null;
      const size = requestedSize && sizes.includes(requestedSize) ? requestedSize : null;

      const [stockUpdated] = await tx
        .update(productTable)
        .set({ stock: sql`${productTable.stock} - ${quantity}` })
        .where(and(eq(productTable.id, productId), gte(productTable.stock, quantity)))
        .returning({ id: productTable.id, stock: productTable.stock });

      if (!stockUpdated) throw new Error("OUT_OF_STOCK");

      const price = Number(product.price);
      const total = price * quantity + SHIPPING_COST;
      const [saved] = await tx.insert(orders).values({
        productId,
        productName: product.name,
        price,
        quantity,
        shipping: SHIPPING_COST,
        color,
        size,
        customerName,
        phone,
        address,
        notes,
        status: "جديد",
      }).returning();

      return { saved, product, price, total, color, size, stock: stockUpdated.stock };
    });

    const { saved, product, price, total, color, size, stock } = result;
    const message =
      `🛍️ *طلب جديد من HASSAN MAHMOUD*\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📦 المنتج: ${product.name}\n` +
      `🔢 الكمية: ${quantity}\n` +
      (color ? `🎨 اللون: ${color}\n` : "") +
      (size ? `📏 المقاس: ${size}\n` : "") +
      `💰 سعر المنتج: ${price} ج.م\n` +
      `📮 الشحن: ${SHIPPING_COST} ج.م\n` +
      `💵 الإجمالي: ${total} ج.م\n` +
      `👤 الاسم: ${customerName}\n📱 الهاتف: ${phone}\n📍 العنوان: ${address}\n` +
      (notes ? `📝 ملاحظات: ${notes}\n` : "") +
      `🆔 رقم الطلب: #${saved.id}`;

    void sendWhatsApp(message);
    void sendToGoogleSheet({
      orderId: saved.id,
      createdAt: new Date().toISOString(),
      productId,
      productName: product.name,
      price,
      quantity,
      shipping: SHIPPING_COST,
      productTotal: price * quantity,
      total,
      color: color ?? "",
      size: size ?? "",
      customerName,
      phone,
      address,
      notes: notes ?? "",
      status: "جديد",
    });

    return NextResponse.json({ ok: true, orderId: saved.id, shipping: SHIPPING_COST, total, remainingStock: stock });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") return NextResponse.json({ ok: false, error: "المنتج غير موجود" }, { status: 404 });
    if (error instanceof Error && error.message === "OUT_OF_STOCK") return NextResponse.json({ ok: false, error: "الكمية المطلوبة غير متوفرة في المخزون" }, { status: 409 });
    console.error("[orders] error", error);
    return NextResponse.json({ ok: false, error: "تعذّر إرسال الطلب، حاول مرة أخرى" }, { status: 500 });
  }
}
