"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth-store";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/api";
import { ApiOrder, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Loader2, ChevronDown } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirme",
  processing: "En preparation",
  shipped: "Expedie",
  delivered: "Livre",
  cancelled: "Annule",
  refunded: "Rembourse",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-cyan-500/20 text-cyan-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
  refunded: "bg-zinc-700 text-zinc-400",
};

const ALL_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
];

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminGetOrders(token);
      setOrders(Array.isArray(res) ? res : []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(order: ApiOrder, status: OrderStatus) {
    if (!token) return;
    try {
      const updated = await adminUpdateOrderStatus(token, order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tighter text-white mb-0.5">Commandes</h1>
        <p className="text-zinc-500 text-sm">{orders.length} commande{orders.length !== 1 ? "s" : ""}</p>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* Header row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="text-left flex-1 min-w-0"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-white font-mono font-bold text-sm">{order.orderNumber}</p>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {order.user && (
                      <span className="text-zinc-500 text-xs">{order.user.firstName} {order.user.lastName}</span>
                    )}
                    <span className="text-zinc-600 text-xs">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span>
                    <span className="text-white text-xs font-semibold">{formatPrice(Number(order.total))}</span>
                  </div>
                </button>

                {/* Status select */}
                <div className="relative shrink-0">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                    className="appearance-none bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-3 py-2 pr-8 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-zinc-800 px-5 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {order.shippingAddress && (
                      <div>
                        <p className="text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-1">Livraison</p>
                        <p className="text-white text-sm">{order.shippingAddress.fullName}</p>
                        <p className="text-zinc-400 text-xs">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        <p className="text-zinc-400 text-xs">{order.shippingAddress.phone}</p>
                      </div>
                    )}
                    {order.notes && (
                      <div>
                        <p className="text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-1">Note</p>
                        <p className="text-zinc-300 text-sm">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <p className="text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-2">Articles</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-zinc-400">×{item.quantity}</span>
                          <span className="text-white truncate">{item.product?.name ?? "Produit supprime"}</span>
                          {item.selectedSize && <span className="text-zinc-600 text-xs">Taille: {item.selectedSize}</span>}
                          {item.selectedColor && <span className="text-zinc-600 text-xs">Couleur: {item.selectedColor}</span>}
                        </div>
                        <span className="text-zinc-300 shrink-0 ml-2">{formatPrice(Number(item.totalPrice))}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>Sous-total</span>
                      <span>{formatPrice(Number(order.subtotal))}</span>
                    </div>
                    {Number(order.shippingFee) > 0 && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Livraison</span>
                        <span>{formatPrice(Number(order.shippingFee))}</span>
                      </div>
                    )}
                    {Number(order.discount) > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Reduction</span>
                        <span>-{formatPrice(Number(order.discount))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold pt-1">
                      <span>Total</span>
                      <span>{formatPrice(Number(order.total))}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="py-20 text-center text-zinc-600 text-sm">
              Aucune commande
            </div>
          )}
        </div>
      )}
    </div>
  );
}
