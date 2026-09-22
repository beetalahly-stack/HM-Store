import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "HASSAN MAHMOUD — Luxury Streetwear Collection",
  description:
    "HASSAN MAHMOUD — علامة أزياء فاخرة تقدم أرقى تصاميم الستريت وير. تيشيرتات، هوديز، جاكيتات، بناطيل، أحذية وإكسسوارات.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="bg-[#0b0b0b] text-white antialiased font-[var(--font-tajawal)]">
        <StoreProvider>
          <CheckoutProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <CheckoutModal />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CheckoutProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
