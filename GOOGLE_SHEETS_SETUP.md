# 📊 ربط موقع VIOR بـ Google Sheets

هذا الدليل يشرح كيف تربط الموقع بجدول Google Sheets ليتم إضافة كل طلب جديد
تلقائياً كصف في الجدول — يمكنك متابعة الطلبات من هاتفك أو حاسوبك بسهولة.

كل شيء **مجاني بالكامل** ولا يحتاج بطاقة ائتمان.

---

## الخطوة 1️⃣ — إنشاء Google Sheet

1. اذهب إلى https://sheets.google.com
2. اضغط **+ Blank** لإنشاء جدول فارغ جديد
3. سمّه: **VIOR Orders**
4. في الصف الأول (Row 1) اكتب هذه العناوين بالترتيب:

   | A | B | C | D | E | F | G | H | I | J | K | L | M | N |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|
   | رقم الطلب | التاريخ | المنتج | الكمية | السعر | الإجمالي | اللون | المقاس | اسم العميل | الهاتف | العنوان | ملاحظات | الحالة | ID |

5. (اختياري) اجعل الصف الأول عريضاً وغامق اللون من شريط الأدوات

---

## الخطوة 2️⃣ — فتح محرر Apps Script

1. من نفس الجدول اضغط: **Extensions → Apps Script**
2. سيفتح تبويب جديد بمحرر أكواد
3. احذف الكود الموجود بالكامل
4. الصق الكود التالي:

```javascript
// ============================================================
// VIOR — Google Sheets order receiver
// ============================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Format date as Egypt local time
    var date = new Date(data.createdAt || new Date());
    var formattedDate = Utilities.formatDate(
      date,
      "Africa/Cairo",
      "yyyy-MM-dd HH:mm"
    );

    sheet.appendRow([
      "#" + (data.orderId || ""),   // A رقم الطلب
      formattedDate,                 // B التاريخ
      data.productName || "",        // C المنتج
      data.quantity || 1,            // D الكمية
      data.price || 0,               // E السعر
      data.total || 0,               // F الإجمالي
      data.color || "",              // G اللون
      data.size || "",               // H المقاس
      data.customerName || "",       // I اسم العميل
      "'" + (data.phone || ""),      // J الهاتف (as text to keep leading 0)
      data.address || "",            // K العنوان
      data.notes || "",              // L ملاحظات
      data.status || "جديد",         // M الحالة
      data.productId || "",          // N Product ID
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("VIOR webhook is live ✅");
}
```

5. اضغط أيقونة **💾 Save** (أو Ctrl+S)
6. سمّ المشروع: **VIOR Orders Receiver**

---

## الخطوة 3️⃣ — نشر السكربت (Deploy)

1. اضغط **Deploy → New deployment** (زر أزرق أعلى اليمين)
2. اضغط أيقونة الترس ⚙ بجوار **Select type** → اختر **Web app**
3. املأ الحقول:
   - **Description:** `VIOR Orders`
   - **Execute as:** `Me (email بريدك)`
   - **Who has access:** ⚠️ اختر **Anyone** (مهم جداً!)
4. اضغط **Deploy**
5. Google قد يطلب صلاحيات:
   - اضغط **Authorize access**
   - اختر حسابك
   - إذا ظهرت شاشة تحذير "Google hasn't verified this app":
     - اضغط **Advanced**
     - اضغط **Go to VIOR Orders Receiver (unsafe)**
     - اضغط **Allow**
6. ستظهر لك نافذة فيها **Web app URL** — انسخه!
   الرابط يبدأ بـ:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## الخطوة 4️⃣ — إضافة الرابط لموقعك

### إذا كنت تشغّل الموقع محلياً:

افتح ملف `.env` في جذر المشروع وأضف:

```env
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

ثم **أعد تشغيل السيرفر** (Ctrl+C ثم `npm run dev`).

### إذا نشرت الموقع على Vercel:

1. اذهب لمشروعك على vercel.com
2. **Settings → Environment Variables**
3. أضف:
   - **Name:** `GOOGLE_SHEET_WEBHOOK_URL`
   - **Value:** الرابط الذي نسخته
4. اضغط **Save**
5. اذهب لـ **Deployments** → اضغط النقاط الثلاث بجوار آخر نشر → **Redeploy**

---

## الخطوة 5️⃣ — اختبار

1. افتح موقعك واعمل طلب تجريبي
2. افتح الجدول على Google Sheets
3. ستجد الطلب أضيف كصف جديد خلال ثوانٍ ✅

---

## 🎯 نصائح مفيدة

### 📱 تطبيق Google Sheets للهاتف
حمّل تطبيق **Google Sheets** من App Store / Play Store لمتابعة الطلبات لحظياً.

### 🔔 تنبيهات على البريد لكل طلب جديد
1. من داخل الجدول: **Tools → Notification settings**
2. اختر **Any changes are made** + **Email - right away**
3. سيصلك إيميل مع كل طلب جديد.

### 🎨 تنسيق الجدول (اختياري)
- **حالة الطلب:** ضع Data Validation على العمود M بقيم: `جديد`، `تم التواصل`، `تم الشحن`، `تم التوصيل`، `ملغي`
- **تنسيق شرطي (Conditional Formatting):** لون مختلف لكل حالة
- **فرز تلقائي:** رتّب حسب التاريخ من الأحدث

### 🔒 هل الرابط آمن؟
- الرابط طويل جداً وعشوائي — لا يمكن تخمينه
- يستقبل بيانات فقط، لا يعرضها
- لا يحتاج تسجيل دخول للموقع

### 🔄 لتحديث السكربت لاحقاً
1. عدّل الكود في Apps Script
2. **Deploy → Manage deployments**
3. اضغط أيقونة القلم ✏
4. غيّر **Version** إلى **New version**
5. اضغط **Deploy**
6. الرابط يبقى نفسه ✅

---

## ❓ استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| لا تظهر الطلبات في الجدول | تحقق من أن **Who has access = Anyone** وليس "Only me" |
| السكربت أعطى خطأ 403 | لم تعطِ الصلاحيات الكاملة — أعد Deploy وامنح الأذونات |
| رقم الهاتف يظهر بدون الصفر الأول | هذا طبيعي بسبب Excel — الكود يضيف `'` قبل الرقم لحل ذلك |
| ملف `.env` لا يعمل | تأكد من إعادة تشغيل السيرفر بعد التعديل |

---

## ✅ ملخص

بعد إتمام هذه الخطوات، كل طلب جديد على الموقع سيتم:
1. حفظه في PostgreSQL
2. إرسال رسالة واتساب لك
3. إضافته كصف في Google Sheet 📊

كل ذلك يحدث تلقائياً في نفس اللحظة — والزائر لا يرى أي شيء من هذا.
