"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "@/lib/api";
import { ApiProduct } from "@/types";
import ProductForm from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (!product) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tighter text-white mb-1">Modifier le produit</h1>
      <p className="text-zinc-500 text-sm mb-8 truncate max-w-lg">{product.name}</p>
      <ProductForm product={product} />
    </div>
  );
}
