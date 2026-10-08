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
  metadataBase: new URL("https://www.hm2.shop"),

  title: {
    default: "HASSAN MAHMOUD | ملابس ستريت وير فاخرة",
    template: "%s | HASSAN MAHMOUD",
  },

  description:
    "اكتشف مجموعة HASSAN MAHMOUD من الأزياء والملابس الستريت وير الفاخرة. تيشيرتات، هوديز، جاكيتات، بناطيل، أحذية وإكسسوارات بتصاميم مميزة.",

  keywords: [
    "HASSAN MAHMOUD",
    "HM Store",
    "ملابس ستريت وير",
    "ستريت وير",
    "ملابس رجالي",
    "تيشيرتات رجالي",
    "هوديز",
    "جاكيتات",
    "بناطيل رجالي",
    "أحذية",
    "إكسسوارات",
    "ملابس مصر",
    "ستريت وير مصر",
  ],

  applicationName: "HASSAN MAHMOUD",

  authors: [
    {
      name: "HASSAN MAHMOUD",
    },
  ],

  creator: "HASSAN MAHMOUD",
  publisher: "HASSAN MAHMOUD",

  alternates: {
    canonical: "https://www.hm2.shop/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://www.hm2.shop/",
    siteName: "HASSAN MAHMOUD",
    title: "HASSAN MAHMOUD | ملابس ستريت وير فاخرة",
    description:
      "اكتشف مجموعة HASSAN MAHMOUD من الأزياء والملابس الستريت وير الفاخرة.",
    images: [
      {
        url: "/hero.jpg",
        width: 1857,
        height: 847,
        alt: "HASSAN MAHMOUD Luxury Streetwear",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "HASSAN MAHMOUD | ملابس ستريت وير فاخرة",
    description:
      "اكتشف مجموعة HASSAN MAHMOUD من الأزياء والملابس الستريت وير الفاخرة.",
    images: ["/hero.jpg"],
  },

  icons: {
    icon: "/favicon.svg",
  },
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