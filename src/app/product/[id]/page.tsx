import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { findProduct, listProducts } from "@/lib/catalog";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await findProduct(Number(id));
  if (!p) return { title: "المنتج غير موجود" };
  return { title: `${p.name} — HASSAN MAHMOUD`, description: p.description.slice(0, 150), openGraph: { images: p.images[0] ? [p.images[0]] : [] } };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await findProduct(Number(id));
  if (!product) notFound();
  const all = await listProducts();
  const related = all.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  return <ProductClient product={product} related={related} />;
}
