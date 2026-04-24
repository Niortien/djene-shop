import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/api";
import ShopClient from "@/components/shop/ShopClient";
import { ApiCategory } from "@/types";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Decouvrez toute la collection Djenebou Shop - joggings, ensembles, hoodies et t-shirts streetwear premium.",
};

export default async function ShopPage() {
  let categories: ApiCategory[] = [];
  try {
    categories = await getCategories();
  } catch {
    // Backend may not be running; categories degrade to empty = no filter pills
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-3">
            Collection 2025
          </span>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white leading-none">
            BOUTIQUE
          </h1>
        </div>

        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient initialCategories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-3/4 rounded-xl bg-zinc-900 animate-pulse" />
      ))}
    </div>
  );
}
