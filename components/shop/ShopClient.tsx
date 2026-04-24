"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/common/ProductCard";
import Filters from "@/components/shop/Filters";
import { getProducts } from "@/lib/api";
import { ApiProduct, ApiCategory } from "@/types";
import { Loader2 } from "lucide-react";

interface ShopClientProps {
  initialCategories: ApiCategory[];
}

export default function ShopClient({ initialCategories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategorySlug = searchParams.get("category") ?? "all";
  const [activeSort, setActiveSort] = useState("default");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCategory =
    initialCategories.find((c) => c.slug === activeCategorySlug) ?? null;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sortMap: Record<string, { sortBy?: "price" | "createdAt"; sortOrder?: "ASC" | "DESC" }> = {
        "price-asc": { sortBy: "price", sortOrder: "ASC" },
        "price-desc": { sortBy: "price", sortOrder: "DESC" },
        "new": { sortBy: "createdAt", sortOrder: "DESC" },
        "default": {},
      };

      const res = await getProducts({
        ...(activeCategory ? { categoryId: activeCategory.id } : {}),
        ...sortMap[activeSort],
        limit: 50,
      });

      setProducts(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setActiveSort("default");
  };

  return (
    <>
      <Filters
        activeCategory={activeCategorySlug}
        activeSort={activeSort}
        onCategoryChange={handleCategoryChange}
        onSortChange={setActiveSort}
        total={total}
        categories={initialCategories}
      />

      {error && (
        <div className="py-12 text-center">
          <p className="text-red-400 text-sm mb-2">Impossible de charger les produits</p>
          <p className="text-zinc-600 text-xs">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Reessayer
          </button>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex justify-center items-center py-24">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
        </div>
      )}

      {!isLoading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategorySlug + activeSort}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <p className="text-zinc-600 text-sm tracking-widest uppercase">
                  Aucun article dans cette categorie
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
