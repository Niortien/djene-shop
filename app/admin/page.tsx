"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { getProducts, getCategories, adminGetOrders } from "@/lib/api";
import { Package, Tag, ShoppingBag, TrendingUp } from "lucide-react";

interface Stats {
  products: number;
  categories: number;
  orders: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getProducts({ limit: 1 }),
      getCategories(),
      adminGetOrders(token).catch(() => []),
    ]).then(([products, categories, orders]) => {
      const revenue = Array.isArray(orders)
        ? orders.reduce((sum, o) => sum + Number(o.total), 0)
        : 0;
      setStats({
        products: products.meta.total,
        categories: categories.length,
        orders: Array.isArray(orders) ? orders.length : 0,
        revenue,
      });
    });
  }, [token]);

  const cards = [
    { label: "Produits", value: stats?.products ?? "—", icon: Package, href: "/admin/products", color: "text-blue-400" },
    { label: "Categories", value: stats?.categories ?? "—", icon: Tag, href: "/admin/categories", color: "text-purple-400" },
    { label: "Commandes", value: stats?.orders ?? "—", icon: ShoppingBag, href: "/admin/orders", color: "text-emerald-400" },
    {
      label: "Chiffre d'affaires",
      value: stats ? `${Number(stats.revenue).toLocaleString("fr-FR")} FCFA` : "—",
      icon: TrendingUp,
      href: "/admin/orders",
      color: "text-amber-400",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tighter text-white mb-1">Dashboard</h1>
      <p className="text-zinc-500 text-sm mb-8">Vue d'ensemble de la boutique</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-500 text-xs tracking-widest uppercase font-semibold">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/products/new" className="bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl p-5 flex items-center gap-3">
          <Package size={20} className="text-white" />
          <span className="text-white font-semibold text-sm">Nouveau produit</span>
        </Link>
        <Link href="/admin/categories/new" className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-xl p-5 flex items-center gap-3">
          <Tag size={20} className="text-white" />
          <span className="text-white font-semibold text-sm">Nouvelle categorie</span>
        </Link>
        <Link href="/admin/orders" className="bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-xl p-5 flex items-center gap-3">
          <ShoppingBag size={20} className="text-white" />
          <span className="text-white font-semibold text-sm">Voir les commandes</span>
        </Link>
      </div>
    </div>
  );
}
