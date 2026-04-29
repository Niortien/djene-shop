"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { ApiProduct } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/Badge";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ApiProduct;
  className?: string;
  /** wide = landscape 4/3, default = portrait 3/4 */
  variant?: "default" | "wide";
}

function sortedImages(product: ApiProduct) {
  const imgs = [...product.images].sort((a, b) =>
    b.isPrimary ? 1 : a.isPrimary ? -1 : 0
  );
  if (imgs.length === 0) {
    return [{ url: "https://images.unsplash.com/photo-1556906781-9a412961a28b?w=600&q=80", isPrimary: true }];
  }
  return imgs;
}

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const NOW = Date.now();

export default function ProductCard({ product, className, variant = "default" }: ProductCardProps) {
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const defaultSize = sizes[Math.floor(sizes.length / 2)] ?? sizes[0] ?? "";
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const { addItem } = useCartStore();

  const images = sortedImages(product);
  const hasMultiple = images.length > 1;

  const isNew = useMemo(
    () => new Date(product.createdAt) > new Date(NOW - TWO_WEEKS_MS),
    [product.createdAt]
  );
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : null;
  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    addItem({ product, quantity: 1, size: selectedSize, color: colors[0] ?? "" });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const aspectClass = variant === "wide" ? "aspect-4/3" : "aspect-3/4";

  return (
    <motion.article
      className={cn(
        "group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500",
        className
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Image area ── */}
      <div
        className={cn("relative overflow-hidden bg-zinc-800", aspectClass)}
        onMouseEnter={() => hasMultiple && setImgIndex(1)}
        onMouseLeave={() => setImgIndex(0)}
      >
        {/* All images stacked, fade between them */}
        {images.map((img, i) => (
          <Image
            key={img.url + i}
            src={img.url}
            alt={i === 0 ? product.name : `${product.name} — vue ${i + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-500 ease-in-out",
              i === imgIndex ? "opacity-100" : "opacity-0"
            )}
            priority={i === 0}
          />
        ))}

        {/* Subtle dark gradient at bottom for readability */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isNew && <Badge variant="new">Nouveau</Badge>}
          {discount && <Badge variant="sale">-{discount}%</Badge>}
          {product.stock === 0 && <Badge variant="secondary">Épuisé</Badge>}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0",
            isWishlisted
              ? "bg-red-500 text-white opacity-100"
              : "bg-black/40 text-zinc-300 hover:bg-black/60 hover:text-white"
          )}
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Image dots — appear on hover, indicate multiple images */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, i) => (
              <button
                key={i}
                onMouseEnter={(e) => { e.stopPropagation(); setImgIndex(i); }}
                onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === imgIndex
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        )}

        {/* Image count badge (always visible if multiple) */}
        {hasMultiple && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full opacity-70 group-hover:opacity-0 transition-opacity duration-300">
            1/{images.length}
          </div>
        )}

        {/* Add to cart — slides up on hover (desktop) */}
        {product.stock > 0 && (
          <div className="hidden md:block absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              className={cn(
                "w-full py-3 text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors duration-200",
                addedToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-black hover:bg-zinc-100"
              )}
            >
              <ShoppingCart size={13} />
              {addedToCart ? "Ajouté ✓" : "Ajouter au panier"}
            </button>
          </div>
        )}
      </div>

      {/* ── Info area ── */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product.category && (
              <p className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase mb-1">
                {product.category.name}
              </p>
            )}
            <Link href={`/product/${product.id}`}>
              <h3 className="text-white font-semibold text-sm leading-snug hover:text-zinc-300 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-white font-black text-sm">{formatPrice(displayPrice)}</p>
            {product.salePrice && (
              <p className="text-zinc-600 text-[11px] line-through">{formatPrice(product.price)}</p>
            )}
          </div>
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {colors.slice(0, 5).map((color) => (
              <span
                key={color}
                className="text-[10px] text-zinc-500 border border-white/8 bg-white/4 px-2 py-0.5 rounded-full"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "text-[10px] px-2 py-1 rounded-lg border font-semibold tracking-wider transition-all duration-150",
                  selectedSize === size
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/8 text-zinc-600 hover:border-white/20 hover:text-zinc-400"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Mobile add to cart */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className={cn(
              "mt-3 w-full md:hidden py-2.5 rounded-xl text-[11px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors duration-200 border",
              addedToCart
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "bg-transparent border-white/10 text-zinc-400 hover:bg-white/8 hover:border-white/20 hover:text-white"
            )}
          >
            <ShoppingCart size={13} />
            {addedToCart ? "Ajouté ✓" : "Ajouter au panier"}
          </button>
        )}
      </div>
    </motion.article>
  );
}

