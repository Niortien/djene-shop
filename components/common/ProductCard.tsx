"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { ApiProduct } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/Badge";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ApiProduct;
  className?: string;
}

function primaryImage(product: ApiProduct): string {
  const primary = product.images.find((i) => i.isPrimary);
  return (
    primary?.url ??
    product.images[0]?.url ??
    "https://images.unsplash.com/photo-1556906781-9a412961a28b?w=600&q=80"
  );
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const defaultSize = sizes[Math.floor(sizes.length / 2)] ?? sizes[0] ?? "";
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCartStore();

  const isNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : null;
  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    addItem({ product, quantity: 1, size: selectedSize, color: colors[0] ?? "" });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.article
      className={cn(
        "group relative bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-colors duration-500",
        className
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-800">
        <Image
          src={primaryImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isNew && <Badge variant="new">Nouveau</Badge>}
          {discount && <Badge variant="sale">-{discount}%</Badge>}
          {product.stock === 0 && <Badge variant="secondary">Epuise</Badge>}
        </div>

        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0",
            isWishlisted ? "bg-red-500 text-white opacity-100" : "bg-black/40 text-zinc-300 hover:bg-black/60 hover:text-white"
          )}
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase hover:bg-white/25 transition-colors border border-white/20"
          >
            <Eye size={14} />
            Voir le produit
          </Link>
        </div>

        {product.stock > 0 && (
          <div className="hidden md:block absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              className={cn(
                "w-full py-3.5 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors duration-200",
                addedToCart ? "bg-emerald-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
              )}
            >
              <ShoppingCart size={15} />
              {addedToCart ? "Ajoute au panier" : "Ajouter au panier"}
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase mb-1">
            {product.category.name}
          </p>
        )}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-white font-semibold text-sm leading-snug hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {colors.length > 0 && (
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {colors.slice(0, 4).map((color) => (
              <span key={color} className="text-[10px] text-zinc-600 border border-white/10 px-1.5 py-0.5 rounded">
                {color}
              </span>
            ))}
          </div>
        )}

        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "text-[10px] px-2 py-1 rounded border font-medium tracking-wider transition-all duration-150",
                  selectedSize === size
                    ? "border-blue-500 bg-blue-600/20 text-blue-400"
                    : "border-white/10 text-zinc-600 hover:border-white/30 hover:text-zinc-300"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-white font-black text-base">{formatPrice(displayPrice)}</span>
          {product.salePrice && (
            <span className="text-zinc-600 text-xs line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>

      {product.stock > 0 && (
        <div className="px-4 pb-4 md:hidden">
          <button
            onClick={handleAddToCart}
            className={cn(
              "w-full py-3 rounded-lg text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors duration-200 border",
              addedToCart
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "bg-transparent border-white/10 text-zinc-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
            )}
          >
            <ShoppingCart size={14} />
            {addedToCart ? "Ajoute" : "Ajouter au panier"}
          </button>
        </div>
      )}
    </motion.article>
  );
}
