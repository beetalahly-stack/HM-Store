import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { count } from "drizzle-orm";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/admin-auth";

const VALID_STATUSES = [
  "جديد",
  "تم التواصل",
  "قيد التجهيز",
  "تم الشحن",
  "تم التوصيل",
  "ملغي",
] as const;

function normalizeStatus(status: string | null | undefined) {
  if (!status || status === "new" || status === "pending") return "جديد";
  return status;
}

async function getStats() {
  const totalResult = await db.select({ count: count() }).from(orders);
  const totalOrders = Number(totalResult[0]?.count ?? 0);

  const allOrders = await db.select().from(orders);

  const normalized = allOrders.map((order) => ({
    ...order,
    status: normalizeStatus(order.status),
  }));

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

  const statusCounts: Record<string, number> = {};
  for (const status of VALID_STATUSES) statusCounts[status] = 0;
  for (const order of normalized) {
    statusCounts[order.status] = (statusCounts[order.status] ?? 0) + 1;
  }

  const recentOrders = normalized
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((o) => ({
      ...o,
      createdAt: o.createdAt
        ? new Date(o.createdAt).toLocaleString("ar-EG", {
            timeZone: "Africa/Cairo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    }));

  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
  }).format(new Date());

  const todayOrders = normalized.filter((order) => {
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
    }).format(new Date(order.createdAt));
    return key === todayKey;
  }).length;

  return {
    totalOrders,
    newOrders,
    totalRevenue,
    todayOrders,
    statusCounts,
    recentOrders,
  };
}

export async function POST(req: Request) {
  try {
    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (!configuredPassword) {
      return NextResponse.json(
        { ok: false, error: "لم يتم إعداد كلمة مرور لوحة التحكم في الخادم" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const password = String(body.password ?? "");

    if (password !== configuredPassword) {
      return NextResponse.json(
        { ok: false, error: "كلمة المرور غير صحيحة" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    setAdminSession(response);
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "بيانات غير صالحة" },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminSession(response);
  return response;
}

// Kept temporarily for compatibility with old clients.
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    return NextResponse.json({ ok: true, stats: await getStats() });
  } catch (error) {
    console.error("[admin/login] stats error", error);
    return NextResponse.json(
      { ok: false, error: "فشل في جلب الإحصائيات" },
      { status: 500 },
    );
  }
}
