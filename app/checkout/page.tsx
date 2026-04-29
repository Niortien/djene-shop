"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle,
  Loader2,
  Lock,
  Calendar,
} from "lucide-react";
import { useCartStore, cartTotal } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { createOrder, addCartItem } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ApiOrder } from "@/types";

// ─── Form fields ─────────────────────────────────────────────────────────────

interface ShippingForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  notes: string;
  estimatedDeliveryDate: string;
}

const INITIAL: ShippingForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  country: "Sénégal",
  postalCode: "",
  notes: "",
  estimatedDeliveryDate: "",
};

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  required,
  ...props
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    as?: "textarea";
  }) {
  const { as: As = "input", ...inputProps } = props as { as?: "textarea" } & React.InputHTMLAttributes<HTMLInputElement>;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-400 tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
        />
        {As === "textarea" ? (
          <textarea
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={3}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
          />
        ) : (
          <input
            {...inputProps}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const total = cartTotal(items);

  const [form, setForm] = useState<ShippingForm>({
    ...INITIAL,
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.phone ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<ApiOrder | null>(null);

  // Empty cart guard
  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={56} className="text-zinc-800 mb-6" />
        <h1 className="text-white text-2xl font-black mb-2">
          Votre panier est vide
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Ajoutez des articles avant de passer commande.
        </p>
        <Button asChild>
          <Link href="/shop">Voir la boutique</Link>
        </Button>
      </div>
    );
  }

  // Success screen
  if (placed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
            <CheckCircle size={36} className="text-green-400" />
          </div>
          <h1 className="text-white text-3xl font-black mb-2">
            Commande confirmée !
          </h1>
          <p className="text-zinc-400 text-sm mb-1">
            N° de commande :{" "}
            <span className="text-white font-mono font-semibold">
              {placed.orderNumber}
            </span>
          </p>
          <p className="text-zinc-500 text-sm mb-10">
            Vous recevrez une confirmation dès que votre commande est traitée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href="/account">Voir mes commandes</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">Continuer les achats</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Unauthenticated guard
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
          <Lock size={28} className="text-blue-400" />
        </div>
        <h1 className="text-white text-2xl font-black mb-2">
          Connexion requise
        </h1>
        <p className="text-zinc-400 text-sm mb-8 max-w-xs">
          Connectez-vous pour finaliser votre commande. Votre panier est
          conservé.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href={`/account?redirect=/checkout`}>Se connecter</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">
              <ArrowLeft size={14} className="mr-1.5" />
              Retour boutique
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { fullName, address, city, country } = form;
    // Normalize phone: strip all spaces and dashes
    const phone = form.phone.replace(/[\s\-().]/g, "");

    if (!fullName.trim() || !phone || !address.trim() || !city.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Basic phone validation: must start with + or digit, min 8 digits
    if (!/^\+?[0-9]{8,15}$/.test(phone)) {
      setError("Numéro de téléphone invalide. Ex : +221771234567");
      return;
    }

    setLoading(true);
    try {
      // Step 1 — Push each local cart item to the server cart
      setLoadingStep("Synchronisation du panier…");
      for (const item of items) {
        await addCartItem(token!, {
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.size || undefined,
          selectedColor: item.color || undefined,
        });
      }

      // Step 2 — Place the order (server uses its own cart)
      setLoadingStep("Confirmation de la commande…");
      const { postalCode, notes, estimatedDeliveryDate } = form;
      const order = await createOrder(token!, {
        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          country,
          postalCode: postalCode.trim() || undefined,
        },
        notes: notes.trim() || undefined,
        estimatedDeliveryDate: estimatedDeliveryDate || undefined,
      });
      clearCart();
      setPlaced(order);
    } catch (err) {
      setError((err as Error).message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-white/8 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-white font-black tracking-tight text-lg">
            Finaliser la commande
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* ── Left: shipping form ── */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold flex items-center gap-2.5">
                <MapPin size={16} className="text-blue-500" />
                Adresse de livraison
              </h2>

              <Field
                label="Nom complet"
                icon={User}
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="Prénom et nom"
              />
              <Field
                label="Téléphone"
                icon={Phone}
                name="phone"
                required
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+221771234567"
              />
              <Field
                label="Adresse"
                icon={MapPin}
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                placeholder="Rue, quartier, numéro..."
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Ville"
                  icon={MapPin}
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Dakar"
                />
                <Field
                  label="Pays"
                  icon={MapPin}
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Sénégal"
                />
              </div>
              <Field
                label="Code postal"
                icon={MapPin}
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="12000"
              />
            </div>

            {/* Notes + date souhaitée */}
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold flex items-center gap-2.5">
                <FileText size={16} className="text-blue-500" />
                Instructions spéciales{" "}
                <span className="text-zinc-600 font-normal text-sm">
                  (optionnel)
                </span>
              </h2>
              <div className="relative">
                <FileText
                  size={14}
                  className="absolute left-3.5 top-3.5 text-zinc-600 pointer-events-none"
                />
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Précisions pour la livraison, taille souhaitée..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
                />
              </div>
              <Field
                label="Date de livraison souhaitée"
                icon={Calendar}
                name="estimatedDeliveryDate"
                type="date"
                value={form.estimatedDeliveryDate}
                onChange={handleChange}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
            </div>

          </div>

          {/* ── Right: order summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 border border-white/8 rounded-2xl p-6 space-y-5 sticky top-24">
              <h2 className="text-white font-bold flex items-center gap-2.5">
                <ShoppingBag size={16} className="text-blue-500" />
                Récapitulatif ({items.length} article
                {items.length > 1 ? "s" : ""})
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {items.map((item) => {
                  const imgUrl =
                    item.product.images.find((i) => i.isPrimary)?.url ??
                    item.product.images[0]?.url ??
                    "";
                  const price =
                    (item.product.salePrice ?? item.product.price) *
                    item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex gap-3 items-start"
                    >
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                        {imgUrl && (
                          <Image
                            src={imgUrl}
                            alt={item.product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                        <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
                          {item.product.name}
                        </p>
                        {item.size && (
                          <p className="text-zinc-600 text-xs mt-0.5">
                            {item.size}
                            {item.color ? ` · ${item.color}` : ""}
                          </p>
                        )}
                        <p className="text-blue-400 text-xs font-bold mt-1">
                          {formatPrice(price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-white/8 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Sous-total</span>
                  <span className="text-white font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Livraison</span>
                  <span className="text-emerald-400 text-xs font-medium">
                    Calculée à la confirmation
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white border-t border-white/8 pt-3 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Error — visible right above the button */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl py-3.5 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {loadingStep || "Traitement…"}
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Confirmer la commande — {formatPrice(total)}
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-700 leading-relaxed">
                Paiement sécurisé · Wave · MTN MoMo · CinetPay
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
