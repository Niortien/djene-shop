"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Package, LogOut, Mail, Phone, MapPin, Shield,
  Clock, ChevronRight, ShoppingBag, CheckCircle,
  Truck, XCircle, RotateCcw, AlertCircle, Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getMyOrders } from "@/lib/api";
import { ApiOrder, OrderStatus } from "@/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pending:    { label: "En attente",      color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20",  Icon: Clock },
  confirmed:  { label: "Confirmée",       color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",      Icon: CheckCircle },
  processing: { label: "En préparation",  color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20",  Icon: Package },
  shipped:    { label: "Expédiée",        color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20",      Icon: Truck },
  delivered:  { label: "Livrée",          color: "text-green-400",   bg: "bg-green-500/10 border-green-500/20",    Icon: CheckCircle },
  cancelled:  { label: "Annulée",         color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",        Icon: XCircle },
  refunded:   { label: "Remboursée",      color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20",  Icon: RotateCcw },
};

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", Icon: AlertCircle };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
      <cfg.Icon size={11} />
      {cfg.label}
    </span>
  );
}

function OrderCard({ order }: { order: ApiOrder }) {
  const [expanded, setExpanded] = useState(false);
  const firstImage = order.items[0]?.product?.images?.[0]?.url;

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors duration-200">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          {firstImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={firstImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} className="text-zinc-600" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">
              Commande #{order.orderNumber}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="font-bold text-sm text-white">{formatPrice(order.total)}</p>
            <p className="text-xs text-zinc-600">{order.items.length} article{order.items.length > 1 ? "s" : ""}</p>
          </div>
          <StatusBadge status={order.status} />
          <ChevronRight
            size={16}
            className={`text-zinc-600 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/5 px-5 py-4 space-y-3"
        >
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 text-sm">
              {item.product?.images?.[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.product.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{item.product?.name ?? "Article supprimé"}</p>
                <p className="text-zinc-500 text-xs">
                  Qté {item.quantity}
                  {item.selectedSize && ` · ${item.selectedSize}`}
                  {item.selectedColor && ` · ${item.selectedColor}`}
                </p>
              </div>
              <p className="text-zinc-300 font-semibold shrink-0">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}

          <div className="border-t border-white/5 pt-3 flex justify-between text-sm">
            <div className="text-zinc-500 space-y-1">
              {order.shippingFee > 0 && <p>Livraison : {formatPrice(order.shippingFee)}</p>}
              {order.discount > 0 && <p className="text-green-400">Réduction : -{formatPrice(order.discount)}</p>}
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-xs mb-1">Total</p>
              <p className="font-black text-white text-lg">{formatPrice(order.total)}</p>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="flex items-start gap-2 text-xs text-zinc-500 bg-zinc-800/40 rounded-xl px-3 py-2.5">
              <MapPin size={13} className="shrink-0 mt-0.5" />
              <span>
                {order.shippingAddress.fullName} · {order.shippingAddress.address}, {order.shippingAddress.city}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user) {
      router.replace("/auth/login");
    }
  }, [token, user, router]);

  // Fetch orders
  useEffect(() => {
    if (!token) return;
    setOrdersLoading(true);
    getMyOrders(token)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [token]);

  if (!user) return null;

  // Resolve name from nested profile or root fields
  const firstName = user.profile?.firstName ?? user.firstName ?? "";
  const lastName = user.profile?.lastName ?? user.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Utilisateur";
  const city = user.profile?.city ?? "";
  const country = user.profile?.country ?? "";
  const location = [city, country].filter(Boolean).join(", ");

  const ROLE_LABEL: Record<string, string> = {
    client: "Client",
    seller: "Vendeur",
    admin: "Administrateur",
  };

  return (
    <main className="min-h-screen bg-[#080808] text-[#f8f8f8]">
      {/* ─── Header ────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-600 to-purple-700 flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-white">
                {(firstName[0] ?? user.email[0]).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-black tracking-tight">{fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <Mail size={13} /> {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                    <Phone size={13} /> {user.phone}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                    <MapPin size={13} /> {location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Shield size={11} />
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-zinc-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-200 text-sm font-medium"
            >
              <LogOut size={15} />
              Déconnexion
            </button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-white/5">
            {[
              { id: "orders" as const, label: "Mes commandes", Icon: Package },
              { id: "profile" as const, label: "Mon profil", Icon: User },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 -mb-px ${
                  activeTab === id
                    ? "border-blue-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon size={15} />
                {label}
                {id === "orders" && orders.length > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tab content ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        {activeTab === "orders" && (
          <div>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-24 gap-3 text-zinc-500">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Chargement des commandes…</span>
              </div>
            ) : orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-4 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <ShoppingBag size={32} className="text-zinc-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Aucune commande</h2>
                <p className="text-zinc-500 text-sm max-w-xs">
                  Vous n'avez pas encore passé de commande. Explorez la boutique pour trouver votre style.
                </p>
                <Link
                  href="/shop"
                  className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95"
                >
                  Découvrir la boutique <ChevronRight size={15} />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3 pt-2"
              >
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </motion.div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
          >
            {[
              { label: "Prénom", value: firstName || "—" },
              { label: "Nom", value: lastName || "—" },
              { label: "Email", value: user.email },
              { label: "Téléphone", value: user.phone || "—" },
              { label: "Ville", value: city || "—" },
              { label: "Pays", value: country || "—" },
              { label: "Rôle", value: ROLE_LABEL[user.role] ?? user.role },
              { label: "Membre depuis", value: formatDate(user.createdAt) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4"
              >
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}

            <div className="sm:col-span-2 bg-blue-600/10 border border-blue-500/20 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Modifier mes informations</p>
                <p className="text-xs text-zinc-500 mt-0.5">Pour mettre à jour votre profil, contactez notre support.</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
              >
                Contacter <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
