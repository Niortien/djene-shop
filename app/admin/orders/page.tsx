"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { adminGetOrders, adminUpdateOrderStatus } from "@/lib/api";
import { ApiOrder, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Loader2, X, Package, MapPin, Phone,
  User, Hash, CalendarDays, StickyNote, RefreshCw,
} from "lucide-react";

// ─── Config ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    "En attente",
  confirmed:  "Confirmée",
  processing: "En préparation",
  shipped:    "Expédiée",
  delivered:  "Livrée",
  cancelled:  "Annulée",
  refunded:   "Remboursée",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  confirmed:  "bg-blue-500/15 text-blue-400 border-blue-500/20",
  processing: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  shipped:    "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
  refunded:   "bg-zinc-700/50 text-zinc-400 border-zinc-600/20",
};

const ALL_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Detail panel ────────────────────────────────────────────────────────────

function OrderDetail({
  order,
  onClose,
  onStatusChange,
}: {
  order: ApiOrder;
  onClose: () => void;
  onStatusChange: (order: ApiOrder, s: OrderStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  async function handleStatus(s: OrderStatus) {
    setUpdating(true);
    await onStatusChange(order, s);
    setUpdating(false);
  }

  const addr = order.shippingAddress;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
        <div>
          <p className="text-white font-black tracking-tight text-base font-mono">
            #{order.orderNumber}
          </p>
          <p className="text-zinc-500 text-xs mt-0.5">{fmtDate(order.createdAt)}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status changer */}
        <div className="px-6 py-5 border-b border-zinc-800/60">
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-3">
            Statut de la commande
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                disabled={updating}
                onClick={() => handleStatus(s)}
                className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all ${
                  order.status === s
                    ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-offset-zinc-900 ring-current"
                    : "bg-zinc-800/50 text-zinc-500 border-zinc-700/50 hover:text-white hover:bg-zinc-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updating && order.status !== s ? (
                  <Loader2 size={10} className="animate-spin inline mr-1" />
                ) : null}
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div className="px-6 py-5 border-b border-zinc-800/60">
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-3 flex items-center gap-1.5">
            <User size={10} />Client
          </p>
          {order.user ? (
            <div className="space-y-1">
              <p className="text-white text-sm font-semibold">
                {order.user.firstName} {order.user.lastName}
              </p>
              <p className="text-zinc-400 text-xs">{order.user.email}</p>
              {order.user.phone && (
                <p className="text-zinc-400 text-xs">{order.user.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-zinc-600 text-sm">Client supprimé</p>
          )}
        </div>

        {/* Shipping address */}
        {addr && (
          <div className="px-6 py-5 border-b border-zinc-800/60">
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-3 flex items-center gap-1.5">
              <MapPin size={10} />Adresse de livraison
            </p>
            <div className="bg-zinc-800/40 rounded-xl p-4 space-y-1.5">
              <div className="flex items-start gap-2">
                <User size={12} className="text-zinc-600 mt-0.5 shrink-0" />
                <p className="text-white text-sm font-semibold">{addr.fullName}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={12} className="text-zinc-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-zinc-300 text-sm">{addr.address}</p>
                  <p className="text-zinc-400 text-xs">{addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ""} — {addr.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-zinc-600 shrink-0" />
                <p className="text-zinc-300 text-sm">{addr.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="px-6 py-5 border-b border-zinc-800/60">
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-3 flex items-center gap-1.5">
              <StickyNote size={10} />Note du client
            </p>
            <p className="text-zinc-300 text-sm bg-zinc-800/40 rounded-xl p-4 italic">
              &quot;{order.notes}&quot;
            </p>
          </div>
        )}

        {/* Estimated delivery date */}
        {order.estimatedDeliveryDate && (
          <div className="px-6 py-5 border-b border-zinc-800/60">
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-3 flex items-center gap-1.5">
              <CalendarDays size={10} />Date de livraison souhaitée
            </p>
            <div className="flex items-center gap-3 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
              <CalendarDays size={15} className="text-amber-400 shrink-0" />
              <p className="text-amber-300 text-sm font-semibold">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString("fr-FR", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="px-6 py-5 border-b border-zinc-800/60">
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-4 flex items-center gap-1.5">
            <Package size={10} />Articles ({order.items.length})
          </p>
          <div className="space-y-3">
            {order.items.map((item) => {
              const imgUrl =
                item.product?.images?.find((i) => i.isPrimary)?.url ??
                item.product?.images?.[0]?.url ??
                null;
              return (
                <div
                  key={item.id}
                  className="flex gap-3 items-center bg-zinc-800/30 rounded-xl p-3"
                >
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    {imgUrl ? (
                      <Image src={imgUrl} alt={item.product?.name ?? ""} fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-zinc-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
                      {item.product?.name ?? "Produit supprimé"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.selectedSize && (
                        <span className="text-[10px] text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded-full">
                          Taille : {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[10px] text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded-full">
                          {item.selectedColor}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">
                      {item.quantity} × {formatPrice(Number(item.unitPrice))}
                    </p>
                  </div>
                  <p className="text-white font-bold text-sm shrink-0">
                    {formatPrice(Number(item.totalPrice))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="px-6 py-5">
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-semibold mb-3 flex items-center gap-1.5">
            <Hash size={10} />Récapitulatif financier
          </p>
          <div className="bg-zinc-800/40 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Sous-total</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Frais de livraison</span>
              <span>{Number(order.shippingFee) > 0 ? formatPrice(Number(order.shippingFee)) : <span className="text-emerald-400 text-xs">Offerts</span>}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Réduction</span>
                <span>−{formatPrice(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-black text-base border-t border-zinc-700 pt-2 mt-1">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApiOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    if (!token) return;
    async function run() {
      setError(null);
      setIsLoading(true);
      try {
        const res = await adminGetOrders(token);
        setOrders(Array.isArray(res) ? res : []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [token]);

  async function handleStatusChange(order: ApiOrder, status: OrderStatus) {
    if (!token) return;
    try {
      const updated = await adminUpdateOrderStatus(token, order.id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o))
      );
      setSelected((prev) => (prev?.id === order.id ? { ...prev, status: updated.status } : prev));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="flex h-full min-h-0" style={{ height: "calc(100vh - 0px)" }}>
      {/* ── Left: list ── */}
      <div className={`flex flex-col ${selected ? "hidden lg:flex lg:w-105" : "w-full"} border-r border-zinc-800 shrink-0`}>
        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">Commandes</h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                {filtered.length} / {orders.length} commande{orders.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={load}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
          {/* Status filter tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterStatus("all")}
              className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all ${
                filterStatus === "all"
                  ? "bg-white/10 text-white border-white/15"
                  : "bg-transparent text-zinc-600 border-zinc-800 hover:text-zinc-300"
              }`}
            >
              Toutes
            </button>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all ${
                  filterStatus === s
                    ? STATUS_COLORS[s]
                    : "bg-transparent text-zinc-600 border-zinc-800 hover:text-zinc-300"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm px-5 py-3">{error}</p>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={24} className="text-blue-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-zinc-600 text-sm">
              Aucune commande
            </div>
          ) : (
            filtered.map((order) => {
              const isSelected = selected?.id === order.id;
              return (
                <button
                  key={order.id}
                  onClick={() => setSelected(isSelected ? null : order)}
                  className={`w-full text-left px-5 py-4 border-b border-zinc-800/60 transition-colors ${
                    isSelected
                      ? "bg-blue-600/10 border-l-2 border-l-blue-500"
                      : "hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-mono font-bold text-sm">
                          #{order.orderNumber}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      {order.user && (
                        <p className="text-zinc-400 text-xs mt-1 truncate">
                          {order.user.firstName} {order.user.lastName} · {order.user.email}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <CalendarDays size={10} />
                          {fmtDate(order.createdAt)}
                        </span>
                        <span className="text-zinc-500 text-xs">
                          {order.items.length} article{order.items.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-white font-black text-sm">{formatPrice(Number(order.total))}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right: detail panel ── */}
      {selected ? (
        <div className="flex-1 min-w-0 overflow-hidden">
          <OrderDetail
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-center">
          <div>
            <Package size={40} className="text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm">Sélectionnez une commande pour voir les détails</p>
          </div>
        </div>
      )}
    </div>
  );
}
