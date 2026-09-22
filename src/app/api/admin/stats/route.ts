import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { count } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const VALID_STATUSES = [
  "جديد",
  "تم التواصل",
  "قيد التجهيز",
  "تم الشحن",
  "تم التوصيل",
  "ملغي",
] as const;

function normalizeStatus(status: string | null | undefined) {
  return !status || status === "new" || status === "pending" ? "جديد" : status;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const totalResult = await db.select({ count: count() }).from(orders);
    const totalOrders = Number(totalResult[0]?.count ?? 0);
    const allOrders = await db.select().from(orders);

    const normalized = allOrders.map((order) => ({
      ...order,
      status: normalizeStatus(order.status),
    }));

    const statusCounts: Record<string, number> = {};
    for (const status of VALID_STATUSES) statusCounts[status] = 0;
    for (const order of normalized) {
      statusCounts[order.status] = (statusCounts[order.status] ?? 0) + 1;
    }

    const newOrders = normalized.filter((o) => o.status === "جديد").length;

    const totalRevenue = normalized
      .filter((o) => o.status !== "ملغي")
      .reduce(
        (sum, o) =>
          sum +
          Number(o.price || 0) * Number(o.quantity || 1) +
          Number(o.shipping ?? 60),
        0,
      );

    const recentOrders = [...normalized]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt).toLocaleString("ar-EG", {
          timeZone: "Africa/Cairo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
    }).format(new Date());

    const todayOrders = normalized.filter(
      (o) =>
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Africa/Cairo",
        }).format(new Date(o.createdAt)) === today,
    ).length;

    return NextResponse.json({
      ok: true,
      stats: {
        totalOrders,
        newOrders,
        totalRevenue,
        todayOrders,
        statusCounts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("[admin/stats] error", error);
    return NextResponse.json(
      { ok: false, error: "فشل في جلب الإحصائيات" },
      { status: 500 },
    );
  }
}
