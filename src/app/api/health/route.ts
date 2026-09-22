import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, hasDatabaseUrl } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { ok: false, databaseConfigured: false, error: "DATABASE_URL غير مضبوط" },
      { status: 503 },
    );
  }

  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true, databaseConfigured: true });
  } catch (error) {
    console.error("[health] database error", error);
    return NextResponse.json(
      { ok: false, databaseConfigured: true, error: "تعذر الاتصال بقاعدة البيانات" },
      { status: 503 },
    );
  }
}
