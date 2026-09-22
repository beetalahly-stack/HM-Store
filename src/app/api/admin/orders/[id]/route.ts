import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const VALID_STATUSES = [
  "جديد",
  "تم التواصل",
  "قيد التجهيز",
  "تم الشحن",
  "تم التوصيل",
  "ملغي",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صحيح" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const status = String(body.status ?? "").trim();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "حالة الطلب غير صالحة" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    console.error("[admin/orders/id] error", error);
    return NextResponse.json(
      { ok: false, error: "فشل في تحديث حالة الطلب" },
      { status: 500 },
    );
  }
}
