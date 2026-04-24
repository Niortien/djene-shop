import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/common/ProductCard";
import { ApiProduct } from "@/types";

export default async function FeaturedProducts() {
  let products: ApiProduct[] = [];
  try {
    const res = await getProducts({ isFeatured: true, limit: 4, sortBy: "createdAt", sortOrder: "DESC" });
    products = res.data;
  } catch {
    // Backend offline
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-3">Selection</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-none">PRODUITS VEDETTES</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
            Voir tout
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (<ProductCard key={product.id} product={product} />))}
        </div>
      </div>
    </section>
  );
}
