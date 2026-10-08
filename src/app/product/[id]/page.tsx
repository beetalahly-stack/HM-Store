import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { findProduct, listProducts } from "@/lib/catalog";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await findProduct(Number(id));

  if (!p) {
    return {
      title: "المنتج غير موجود | HASSAN MAHMOUD",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    p.description?.trim().slice(0, 160) ||
    `اكتشف ${p.name} من HASSAN MAHMOUD.`;

  const image = p.images?.[0];

  return {
    title: `${p.name} | HASSAN MAHMOUD`,
    description,

    keywords: [
      p.name,
      p.category,
      "HASSAN MAHMOUD",
      "HM Store",
      "ستريت وير",
      "ملابس مصر",
    ].filter(Boolean),

    alternates: {
      canonical: `https://www.hm2.shop/product/${p.id}`,
    },

    openGraph: {
      type: "website",
      locale: "ar_EG",
      url: `https://www.hm2.shop/product/${p.id}`,
      siteName: "HASSAN MAHMOUD",
      title: `${p.name} | HASSAN MAHMOUD`,
      description,
      images: image
        ? [
            {
              url: image,
              alt: p.name,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: `${p.name} | HASSAN MAHMOUD`,
      description,
      images: image ? [image] : [],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await findProduct(Number(id));

  if (!product) {
    notFound();
  }

  const all = await listProducts();

  const related = all
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category
    )
    .slice(0, 4);

  const image = product.images?.[0];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description?.trim() ||
      `منتج ${product.name} من HASSAN MAHMOUD`,
    image: product.images?.length
      ? product.images
      : image
        ? [image]
        : [],
    sku: String(product.id),
    brand: {
      "@type": "Brand",
      name: "HASSAN MAHMOUD",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.hm2.shop/product/${product.id}`,
      priceCurrency: "EGP",
      price: String(product.price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <ProductClient
        product={product}
        related={related}
      />
    </>
  );
}