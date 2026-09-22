"use client";

import { readJson } from "@/lib/client-json";
import { useEffect, useRef, useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";

// =====================================================================
// Two-step checkout modal (no cart).
// Step 1: Customer fills name, phone, address → clicks "متابعة"
// Step 2: Review summary → clicks "تأكيد الشراء"
// Then success screen. Order is silently POSTed to /api/orders.
//
// Validation rules:
// - All fields except notes are required
// - Phone: exactly 11 digits, must start with 010/011/012/015
// - Name: at least 2 Arabic or English characters
// - Address: at least 5 characters
// =====================================================================

type Step = "form" | "review" | "success" | "error";

type FieldErrors = {
  name?: string;
  phone?: string;
  address?: string;
};

// Egyptian mobile prefixes
const EGYPTIAN_PREFIXES = ["010", "011", "012", "015"];
const PHONE_LENGTH = 11;

function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "رقم الهاتف مطلوب";
  }
  if (digits.length < PHONE_LENGTH) {
    return `رقم الهاتف قصير جدًا — يجب أن يكون ${PHONE_LENGTH} أرقام`;
  }
  if (digits.length > PHONE_LENGTH) {
    return `رقم الهاتف طويل جدًا — يجب أن يكون ${PHONE_LENGTH} أرقام`;
  }
  if (!EGYPTIAN_PREFIXES.some((p) => digits.startsWith(p))) {
    return "رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015";
  }
  return undefined;
}

function validateName(value: string): string | undefined {
  if (!value.trim()) return "الاسم مطلوب";
  if (value.trim().length < 2) return "الاسم قصير جدًا — أدخل الاسم كاملاً";
  return undefined;
}

function validateAddress(value: string): string | undefined {
  if (!value.trim()) return "العنوان مطلوب";
  if (value.trim().length < 5)
    return "العنوان قصير جدًا — اكتبه بالتفصيل من أجل التوصيل";
  return undefined;
}

export default function CheckoutModal() {
  const { intent, close } = useCheckout();
  const open = !!intent;

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Per-field errors
  const [errors, setErrors] = useState<FieldErrors>({});
  // General error
  const [generalError, setGeneralError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Refs for focus management
  const firstErrorRef = useRef<HTMLInputElement | null>(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep("form");
      setErrors({});
      setGeneralError("");
      setOrderId(null);
      setName("");
      setPhone("");
      setAddress("");
      setNotes("");
    }
  }, [open]);

  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!open || !intent) return null;

  const { product, color, size, quantity } = intent;
  const SHIPPING = 60;
  const productTotal = product.price * quantity;
  const total = productTotal + SHIPPING;

  // ─── Real-time per-field validation ───
  const touchName = () => {
    setErrors((prev) => ({ ...prev, name: validateName(name) }));
  };
  const touchPhone = () => {
    setErrors((prev) => ({ ...prev, phone: validatePhone(phone) }));
  };
  const touchAddress = () => {
    setErrors((prev) => ({ ...prev, address: validateAddress(address) }));
  };

  // ─── On change: clear the error as user types ───
  const handleNameChange = (v: string) => {
    setName(v);
    if (errors.name) {
      const err = validateName(v);
      setErrors((prev) => ({ ...prev, name: err }));
    }
  };

  const handlePhoneChange = (v: string) => {
    // Only allow digits
    const digits = v.replace(/\D/g, "").slice(0, PHONE_LENGTH);
    setPhone(digits);
    if (errors.phone) {
      const err = validatePhone(digits);
      setErrors((prev) => ({ ...prev, phone: err }));
    }
  };

  const handleAddressChange = (v: string) => {
    setAddress(v);
    if (errors.address) {
      const err = validateAddress(v);
      setErrors((prev) => ({ ...prev, address: err }));
    }
  };

  // ─── Go to review step ───
  const goReview = () => {
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const addressErr = validateAddress(address);

    const newErrors: FieldErrors = {
      ...(nameErr ? { name: nameErr } : {}),
      ...(phoneErr ? { phone: phoneErr } : {}),
      ...(addressErr ? { address: addressErr } : {}),
    };

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field
      if (nameErr) firstErrorRef.current?.focus();
      else if (phoneErr) {
        document.getElementById("phone-input")?.focus();
      } else if (addressErr) {
        document.getElementById("address-input")?.focus();
      }
      return;
    }

    setErrors({});
    setGeneralError("");
    setStep("review");
  };

  // ─── Confirm order ───
  const confirm = async () => {
    setSubmitting(true);
    setGeneralError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          color,
          size,
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim() || null,
        }),
      });
      const data = await readJson(res);
      if (data.ok) {
        setOrderId(data.orderId);
        setStep("success");
      } else {
        setGeneralError(data.error || "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
        setStep("error");
      }
    } catch {
      setGeneralError("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md anim-fade-in"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] grid place-items-center p-4 pointer-events-none">
        <div className="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto anim-scale-in max-h-[92vh] flex flex-col">

          {/* Header */}
          <div className="relative p-5 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg grid place-items-center bg-gradient-to-br from-[#e8c968] via-[#d4af37] to-[#a9861e] text-black font-black text-[11px] italic">
                HM
              </span>
              <div>
                <div className="text-[10px] tracking-[0.3em] text-[#d4af37]">HASSAN MAHMOUD CHECKOUT</div>
                <div className="font-black text-sm">
                  {step === "success"
                    ? "تم إرسال الطلب ✓"
                    : step === "review"
                    ? "مراجعة الطلب"
                    : step === "error"
                    ? "فشل الإرسال"
                    : "أكمل بيانات الشراء"}
                </div>
              </div>
            </div>
            <button
              onClick={close}
              aria-label="إغلاق"
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-white/5 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Product summary */}
          {step !== "success" && (
            <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-white/[0.02] shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-14 h-18 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{product.name}</div>
                <div className="text-xs text-white/50 mt-0.5 flex items-center gap-2 flex-wrap">
                  {color && <span>اللون: {color}</span>}
                  {size && <span>المقاس: {size}</span>}
                  <span>الكمية: {quantity}</span>
                </div>
                <div className="mt-1 font-black gold-text text-sm">{total} ج.م</div>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-5 flex-1 overflow-y-auto">

            {/* ── Step: Form ── */}
            {step === "form" && (
              <div className="space-y-5">

                {/* Name */}
                <FieldInput
                  id="name-input"
                  label="الاسم الكامل *"
                  icon="👤"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={touchName}
                  error={errors.name}
                  placeholder="مثال: أحمد محمد علي"
                  autoFocus
                  ref={firstErrorRef}
                />

                {/* Phone */}
                <FieldPhone
                  id="phone-input"
                  label="رقم الهاتف *"
                  icon="📱"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={touchPhone}
                  error={errors.phone}
                />

                {/* Address */}
                <FieldTextarea
                  id="address-input"
                  label="العنوان بالتفصيل *"
                  icon="📍"
                  value={address}
                  onChange={handleAddressChange}
                  onBlur={touchAddress}
                  error={errors.address}
                  placeholder="المدينة، الحي، الشارع، رقم المبنى..."
                  rows={3}
                />

                {/* Notes */}
                <FieldTextarea
                  label="ملاحظات إضافية (اختياري)"
                  icon="📝"
                  value={notes}
                  onChange={setNotes}
                  placeholder="أي تفاصيل إضافية عن الطلب أو التوصيل..."
                  rows={2}
                />

                {/* General error */}
                {generalError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {generalError}
                  </div>
                )}

                <button onClick={goReview} className="btn-gold w-full">
                  متابعة
                  <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>

                <p className="text-[11px] text-white/40 text-center">
                  * حقول إلزامية — لن نشارك بياناتك مع أي طرف ثالث
                </p>
              </div>
            )}

            {/* ── Step: Review ── */}
            {step === "review" && (
              <div className="space-y-4">
                <ReviewRow label="الاسم" value={name} />
                <ReviewRow label="الهاتف" value={phone} />
                <ReviewRow label="العنوان" value={address} />
                {notes.trim() && <ReviewRow label="ملاحظات" value={notes} />}

                <div className="h-px bg-white/10" />

                <ReviewRow label="سعر المنتج" value={`${product.price} ج.م`} />
                <ReviewRow label="الكمية" value={String(quantity)} />
                <ReviewRow label="تكلفة الشحن" value={`${SHIPPING} ج.م`} />
                <div className="h-px bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-2xl font-black gold-text">{total} ج.م</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { setStep("form"); setErrors({}); }}
                    className="btn-outline flex-1 !py-3"
                    disabled={submitting}
                  >
                    رجوع
                  </button>
                  <button
                    onClick={confirm}
                    disabled={submitting}
                    className="btn-gold flex-1 !py-3 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        جاري الإرسال...
                      </span>
                    ) : (
                      "تأكيد الشراء"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step: Success ── */}
            {step === "success" && (
              <div className="text-center py-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#e8c968] to-[#a9861e] grid place-items-center mb-5 anim-scale-in">
                  <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black mb-2">تم الشراء بنجاح 🎉</h3>
                <p className="text-sm text-white/70 leading-7 mb-1">
                  شكراً لثقتك في{" "}
                  <span className="gold-text font-bold">HASSAN MAHMOUD</span>
                </p>
                <p className="text-sm text-white/70 leading-7">
                  استلمنا طلبك. سيتم التواصل معك على رقم{" "}
                  <span dir="ltr" className="font-bold text-white">{phone}</span>{" "}
                  لتأكيد التوصيل.
                </p>
                {orderId && (
                  <div className="mt-5 inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-5 py-2 text-sm">
                    رقم الطلب:{" "}
                    <span className="font-black gold-text">#{orderId}</span>
                  </div>
                )}
                <button onClick={close} className="btn-gold w-full mt-6">
                  متابعة التسوق
                </button>
              </div>
            )}

            {/* ── Step: Error ── */}
            {step === "error" && (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/15 text-red-400 grid place-items-center mb-4 text-3xl">
                  !
                </div>
                <h3 className="text-lg font-black mb-1">تعذّر إرسال الطلب</h3>
                <p className="text-sm text-white/70 mb-5">{generalError}</p>
                <div className="flex gap-2">
                  <button onClick={close} className="btn-outline flex-1 !py-3">
                    إغلاق
                  </button>
                  <button
                    onClick={() => { setStep("review"); setGeneralError(""); }}
                    className="btn-gold flex-1 !py-3"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}

const FieldInput = ({
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoFocus,
  ref,
}: FieldProps & { id: string; ref?: React.Ref<HTMLInputElement> }) => (
  <div>
    <label className="block" htmlFor={id}>
      <span className="text-xs text-white/70 font-semibold mb-1.5 flex items-center gap-1.5">
        {icon && <span>{icon}</span>} {label}
      </span>
      <input
        ref={ref}
        id={id}
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-500/60 bg-red-500/5 text-white"
            : "border-white/10 focus:border-[#d4af37] text-white"
        }`}
      />
    </label>
    {error && (
      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

// Special phone field with live character counter
const FieldPhone = ({
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
}: FieldProps & { id: string }) => {
  const digits = value.replace(/\D/g, "");
  const isComplete = digits.length === PHONE_LENGTH;
  const isOverLength = digits.length > PHONE_LENGTH;

  return (
    <div>
      <label className="block" htmlFor={id}>
        <span className="text-xs text-white/70 font-semibold mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            {icon && <span>{icon}</span>} {label}
          </span>
          <span
            className={`text-[10px] font-bold rounded-full px-2 py-0.5 transition ${
              isComplete
                ? "bg-green-500/20 text-green-400"
                : isOverLength
                ? "bg-red-500/20 text-red-400"
                : "bg-white/10 text-white/40"
            }`}
          >
            {digits.length}/{PHONE_LENGTH}
          </span>
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="01xxxxxxxxx"
          className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm outline-none transition ${
            error
              ? "border-red-500/60 bg-red-500/5 text-white"
              : isComplete
              ? "border-green-500/40 focus:border-[#d4af37] text-white"
              : "border-white/10 focus:border-[#d4af37] text-white"
          }`}
          dir="ltr"
        />
      </label>
      {/* Valid prefixes hint */}
      {!error && !isComplete && (
        <p className="text-[10px] text-white/35 mt-1">
          يجب أن يبدأ بـ: 010 · 011 · 012 · 015
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

const FieldTextarea = ({
  id,
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  rows = 3,
}: FieldProps & { id?: string; rows?: number }) => (
  <div>
    <label className="block" htmlFor={id}>
      <span className="text-xs text-white/70 font-semibold mb-1.5 flex items-center gap-1.5">
        {icon && <span>{icon}</span>} {label}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm outline-none transition resize-none ${
          error
            ? "border-red-500/60 bg-red-500/5 text-white"
            : "border-white/10 focus:border-[#d4af37] text-white"
        }`}
      />
    </label>
    {error && (
      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

const ReviewRow = ({
  label,
  value,
  gold,
}: {
  label: string;
  value: string;
  gold?: boolean;
}) => (
  <div className="flex items-start justify-between gap-3 text-sm">
    <span className="text-white/60 shrink-0">{label}</span>
    <span
      className={`font-bold text-left break-words ${gold ? "text-[#d4af37]" : "text-white"}`}
      dir="auto"
    >
      {value}
    </span>
  </div>
);
