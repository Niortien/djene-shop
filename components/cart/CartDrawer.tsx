"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartTotal, cartItemCount } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } =
    useCartStore();
  const total = cartTotal(items);
  const count = cartItemCount(items);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-white/10 flex flex-col"
            aria-label="Panier"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-blue-500" />
                <h2 className="text-white font-bold tracking-wide">
                  Mon Panier
                </h2>
                {count > 0 && (
                  <span className="text-[11px] bg-blue-600 text-white rounded-full px-2 py-0.5 font-semibold">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Fermer le panier"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <ShoppingBag size={52} className="text-zinc-800 mb-5" />
                  <p className="text-zinc-300 font-semibold mb-2">
                    Votre panier est vide
                  </p>
                  <p className="text-zinc-600 text-sm mb-8 max-w-xs">
                    Découvrez nos collections streetwear et ajoutez vos pièces
                    préférées.
                  </p>
                  <Button variant="outline" size="sm" onClick={closeCart} asChild>
                    <Link href="/shop">Voir la boutique</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 py-4 border-b border-white/5 last:border-0"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                      <Image
                        src={item.product.images.find((i) => i.isPrimary)?.url ?? item.product.images[0]?.url ?? ""}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-zinc-500 text-xs mt-1">
                        Taille: {item.size}{item.color ? ` · ${item.color}` : ""}
                      </p>
                      <p className="text-blue-400 font-bold text-sm mt-1.5">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm font-semibold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={12} />
                        </button>

                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.size,
                              item.color
                            )
                          }
                          className="ml-auto p-1.5 text-zinc-700 hover:text-red-400 transition-colors"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4 shrink-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Sous-total</span>
                  <span className="text-white font-black text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Livraison</span>
                  <span className="text-emerald-400 font-medium">
                    Calculée à la commande
                  </span>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Commander — {formatPrice(total)}
                  </Link>
                </Button>
                <p className="text-center text-[11px] text-zinc-700">
                  Paiement sécurisé · Wave · MTN MoMo · CinetPay
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
