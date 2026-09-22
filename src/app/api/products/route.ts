import { NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(
      { ok: true, products },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("[products] GET error", error);
    return NextResponse.json(
      { ok: false, error: "فشل في جلب المنتجات من قاعدة البيانات" },
      { status: 500 },
    );
  }
}
