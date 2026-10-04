import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productRows = await db
    .select({
      id: products.id,
      createdAt: products.createdAt,
    })
    .from(products);

  const productUrls: MetadataRoute.Sitemap = productRows.map((product) => ({
    url: `https://www.hm2.shop/product/${product.id}`,
    lastModified: product.createdAt ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://www.hm2.shop/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...productUrls,
  ];
}