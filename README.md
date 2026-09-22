# HASSAN MAHMOUD Store

نسخة المتجر مربوطة بقاعدة PostgreSQL عبر Neon، والمنتجات والطلبات محفوظة في قاعدة البيانات بدل التخزين في الذاكرة.

## التشغيل

1. انسخ رابط Neon إلى `.env` في `DATABASE_URL`.
2. ضع كلمة مرور قوية في `ADMIN_PASSWORD`.
3. شغّل:

```bash
npm install
npm run db:push
npm run dev
```

افتح `http://localhost:3000`.

- المتجر: `/`
- لوحة التحكم: `/admin`
- المنتجات: `/admin/products`
- الطلبات: `/admin/orders`

عند أول طلب للمنتجات، إذا كان جدول `products` فارغًا، يتم إدخال المنتجات الافتراضية تلقائيًا.

## متغيرات البيئة

- `DATABASE_URL` — رابط Neon الكامل ويُفضّل أن يحتوي `sslmode=require`.
- `ADMIN_PASSWORD` — كلمة مرور لوحة التحكم.
- `WHATSAPP_API_KEY` — اختياري.
- `GOOGLE_SHEET_WEBHOOK_URL` — اختياري.

لا تضع الأسرار داخل الكود ولا ترسل `DATABASE_URL` في المحادثات.
