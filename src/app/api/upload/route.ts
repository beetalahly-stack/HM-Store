import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "لم يتم اختيار ملف" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "الملف يجب أن يكون صورة" },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop() || "jpg";
    const filename = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "فشل في رفع الصورة",
      },
      { status: 500 }
    );
  }
}