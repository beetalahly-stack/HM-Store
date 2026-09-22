import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function normalizeStatus(status: string | null | undefined) {
  return !status || status === "new" || status === "pending" ? "جديد" : status;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

    return NextResponse.json(
      {
        ok: true,
        orders: allOrders.map((order) => ({
          ...order,
          status: normalizeStatus(order.status),
          createdAt: order.createdAt
            ? new Date(order.createdAt).toLocaleString("ar-EG", {
                timeZone: "Africa/Cairo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[admin/orders] error", error);
    return NextResponse.json(
      { ok: false, error: "فشل في جلب الطلبات" },
      { status: 500 },
    );
  }
}
