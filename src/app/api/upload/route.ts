import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Map([["image/jpeg", ".jpg"], ["image/png", ".png"], ["image/webp", ".webp"], ["image/gif", ".gif"]]);

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  try {
    const data = await req.formData();
    const file = data.get("file");
    if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "لم يتم اختيار صورة" }, { status: 400 });
    const ext = ALLOWED.get(file.type);
    if (!ext) return NextResponse.json({ ok: false, error: "صيغة الصورة غير مدعومة" }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت" }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error("[upload] error", error);
    return NextResponse.json({ ok: false, error: "فشل في رفع الصورة" }, { status: 500 });
  }
}
