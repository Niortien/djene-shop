import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProduct, getProducts } from "@/lib/api";
import ProductDetail from "@/components/shop/ProductDetail";
import ProductCard from "@/components/common/ProductCard";
import { ApiProduct } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return { title: product.name, description: product.description ?? undefined };
  } catch {
    return { title: "Produit introuvable" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product: ApiProduct | undefined;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  if (!product) notFound();

  let related: ApiProduct[] = [];
  try {
    const res = await getProducts({
      ...(product.category ? { categoryId: product.category.id } : {}),
      limit: 5,
    });
    related = res.data.filter((p) => p.id !== product!.id).slice(0, 4);
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav
          aria-label="Fil d ariane"
          className="flex items-center gap-2 text-xs text-zinc-600 mb-10"
        >
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Accueil
          </Link>
          <ChevronRight size={13} />
          <Link href="/shop" className="hover:text-zinc-300 transition-colors">
            Boutique
          </Link>
          <ChevronRight size={13} />
          {product.category && (
            <>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-zinc-300 transition-colors capitalize"
              >
                {product.category.name}
              </Link>
              <ChevronRight size={13} />
            </>
          )}
          <span className="text-zinc-300 truncate max-w-[180px]">
            {product.name}
          </span>
        </nav>

        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20 pt-14 border-t border-white/5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white mb-8">
              VOUS AIMEREZ AUSSI
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
