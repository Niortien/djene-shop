"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { getProducts, adminDeleteProduct, adminUpdateProduct } from "@/lib/api";
import { ApiProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProducts({ limit: 100, sortBy: "createdAt", sortOrder: "DESC" });
      setProducts(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(product: ApiProduct) {
    if (!token) return;
    try {
      await adminUpdateProduct(token, product.id, { isActive: !product.isActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function handleDelete(product: ApiProduct) {
    if (!token) return;
    if (!confirm(`Desactiver "${product.name}" ?`)) return;
    try {
      await adminDeleteProduct(token, product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setTotal((t) => t - 1);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-0.5">Produits</h1>
          <p className="text-zinc-500 text-sm">{total} produit{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase">
                <th className="text-left px-4 py-3">Produit</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Categorie</th>
                <th className="text-right px-4 py-3">Prix</th>
                <th className="text-right px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="text-center px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
                return (
                  <tr key={product.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {img ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                            <Image src={img.url} alt={product.name} fill sizes="40px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[200px]">{product.name}</p>
                          {product.sku && <p className="text-zinc-600 text-xs">{product.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">
                      {product.category?.name ?? <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        <p className="text-white font-semibold">{formatPrice(product.salePrice ?? product.price)}</p>
                        {product.salePrice && (
                          <p className="text-zinc-600 text-xs line-through">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-400 hidden sm:table-cell">
                      <span className={product.stock === 0 ? "text-red-400" : product.stock < 10 ? "text-amber-400" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase ${product.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                        {product.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(product)}
                          title={product.isActive ? "Desactiver" : "Activer"}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-zinc-600 text-sm">
                    Aucun produit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
