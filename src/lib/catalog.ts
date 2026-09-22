import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productTable, type ProductRow } from "@/db/schema";
import { products as seedProducts, type Product } from "@/lib/products";

let seedPromise: Promise<void> | null = null;

function normalizeImageList(value: unknown, fallback?: string | null): string[] {
  let list: unknown[] = [];
  if (Array.isArray(value)) list = value;
  else if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = value.split("\n");
    }
  }
  const result = list.map((item) => String(item ?? "").trim()).filter(Boolean);
  const main = String(fallback ?? "").trim();
  if (main && !result.includes(main)) result.unshift(main);
  return Array.from(new Set(result));
}

export function mapProduct(row: ProductRow): Product {
  const images = normalizeImageList(row.images, row.image);
  return {
    id: row.id,
    slug: row.slug ?? `product-${row.id}`,
    name: row.name,
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    category: (row.category ?? "تيشيرتات") as Product["category"],
    images,
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    rating: Number(row.rating ?? 5),
    reviewsCount: Number(row.reviewsCount ?? 0),
    badge: row.badge ? (row.badge as Product["badge"]) : undefined,
    stock: Number(row.stock ?? 0),
    description: row.description ?? "",
    specs: Array.isArray(row.specs) ? row.specs : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
  };
}

export async function ensureProductsSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const [{ total }] = await db.select({ total: count() }).from(productTable);
    if (Number(total) > 0) return;

    await db.insert(productTable).values(
      seedProducts.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        category: p.category,
        image: p.images[0] ?? null,
        images: p.images,
        colors: p.colors,
        sizes: p.sizes,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        description: p.description,
        specs: p.specs,
        reviews: p.reviews,
        stock: p.stock,
        badge: p.badge ?? null,
      })),
    );
  })().catch((error) => {
    seedPromise = null;
    throw error;
  });
  return seedPromise;
}

export async function listProducts() {
  await ensureProductsSeeded();
  const rows = await db.select().from(productTable).orderBy(asc(productTable.id));
  return rows.map(mapProduct);
}

export async function findProduct(id: number) {
  await ensureProductsSeeded();
  const [row] = await db.select().from(productTable).where(eq(productTable.id, id)).limit(1);
  return row ? mapProduct(row) : null;
}

export async function createProduct(input: Omit<ProductRow, "id" | "createdAt">) {
  const [row] = await db.insert(productTable).values(input).returning();
  return mapProduct(row);
}

export async function updateProduct(id: number, input: Partial<Omit<ProductRow, "id" | "createdAt">>) {
  const [row] = await db.update(productTable).set(input).where(eq(productTable.id, id)).returning();
  return row ? mapProduct(row) : null;
}

export async function deleteProduct(id: number) {
  const [row] = await db.delete(productTable).where(eq(productTable.id, id)).returning({ id: productTable.id });
  return Boolean(row);
}

