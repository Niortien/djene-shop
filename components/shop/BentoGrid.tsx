"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { ApiProduct } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function primaryImageUrl(product: ApiProduct): string {
  const primary = product.images.find((i) => i.isPrimary);
  return (
    primary?.url ??
    product.images[0]?.url ??
    "https://images.unsplash.com/photo-1556906781-9a412961a28b?w=800&q=80"
  );
}

/**
 * Bento pattern — repeats every 7 cards on a 3-column desktop grid:
 *
 *  ┌──────────┬────┬────┐
 *  │  HERO    │  1 │  2 │
 *  │  (2×2)   ├────┴────┤
 *  │          │    3    │  ← wide (col-span-2)
 *  ├────┬─────┴──────── ┤
 *  │  4 │       5       │  ← wide (col-span-2)
 *  │  6 │  (dense fill) │
 *  └────┴───────────────┘
 *
 * Mobile / tablet: all cards revert to col-span-1.
 */
function getBento(index: number): { isHero: boolean; isWide: boolean } {
  const pos = index % 7;
  return { isHero: pos === 0, isWide: pos === 3 || pos === 5 };
}

// ─── BentoCard ────────────────────────────────────────────────────────────────

interface BentoCardProps {
  product: ApiProduct;
  index: number;
  isHero: boolean;
  isWide: boolean;
}

function BentoCard({ product, index, isHero, isWide }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  // ── 3D Tilt ─────────────────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 280, damping: 28 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [7, -7]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-7, 7]),
    springConfig
  );
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  }
  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // ── Product data ──────────────────────────────────────────────────────────
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const defaultSize = sizes[0] ?? "";
  const isNew =
    new Date(product.createdAt) > new Date(Date.now() - TWO_WEEKS_MS);
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : null;
  const displayPrice = product.salePrice ?? product.price;
  const imgSrc = primaryImageUrl(product);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ product, quantity: 1, size: defaultSize, color: colors[0] ?? "" });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // ── Grid span classes ─────────────────────────────────────────────────────
  const gridSpan = cn(
    isHero
      ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2"
      : isWide
      ? "col-span-1 sm:col-span-2 lg:col-span-2"
      : "col-span-1"
  );

  // ── Image aspect ratio ────────────────────────────────────────────────────
  const aspectClass = isHero
    ? "aspect-[3/4] sm:h-full sm:aspect-auto"
    : isWide
    ? "aspect-[16/9]"
    : "aspect-[3/4]";

  return (
    <motion.div
      className={cn(gridSpan, "group")}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 7) * 0.06,
      }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl w-full h-full",
          "bg-white/2.5 border border-white/8",
          "transition-[border-color,box-shadow] duration-500",
          "hover:border-blue-500/30",
          "hover:shadow-[0_0_40px_rgba(59,130,246,0.10),0_0_80px_rgba(59,130,246,0.05),inset_0_0_40px_rgba(59,130,246,0.03)]"
        )}
      >
        {/* Dynamic cursor glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(59,130,246,0.10) 0%, transparent 60%)`,
          }}
        />

        {/* ── Image block ───────────────────────────────────────────────── */}
        <div className={cn("relative w-full overflow-hidden", aspectClass)}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            priority={isHero}
            sizes={
              isHero || isWide
                ? "(max-width: 640px) 100vw, 66vw"
                : "(max-width: 640px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradient vignette */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />

          {/* ── Top badges ──────────────────────────────────────────────── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {isNew && (
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 backdrop-blur-sm">
                Nouveau
              </span>
            )}
            {discount && (
              <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 backdrop-blur-sm">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-zinc-700/40 border border-zinc-600/30 text-zinc-400 backdrop-blur-sm">
                Épuisé
              </span>
            )}
          </div>

          {/* ── Wishlist ─────────────────────────────────────────────────── */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted((v) => !v);
            }}
            className={cn(
              "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm border transition-all duration-200",
              "opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0",
              wishlisted
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : "bg-black/30 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
            )}
            aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
          </button>

          {/* ── Quick actions — slide up on hover ─────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            {product.stock > 0 ? (
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl",
                    "backdrop-blur-md border text-xs font-semibold tracking-wide uppercase",
                    "transition-all duration-200",
                    added
                      ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400"
                      : "bg-white/10 border-white/12 text-white hover:bg-blue-600/25 hover:border-blue-500/40 hover:text-blue-300"
                  )}
                >
                  <ShoppingCart size={12} />
                  {added ? "Ajouté ✓" : "Panier"}
                </button>
                <Link
                  href={`/product/${product.id}`}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl backdrop-blur-md bg-white/10 border border-white/12 text-white text-xs font-semibold tracking-wide uppercase hover:bg-white/18 transition-all duration-200"
                >
                  <Eye size={12} />
                  Voir
                </Link>
              </div>
            ) : (
              <Link
                href={`/product/${product.id}`}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl backdrop-blur-md bg-white/10 border border-white/12 text-white text-xs font-semibold tracking-wide uppercase hover:bg-white/18 transition-all duration-200"
              >
                <Eye size={12} />
                Voir le produit
              </Link>
            )}
          </div>
        </div>

        {/* ── Info section ─────────────────────────────────────────────── */}
        <Link href={`/product/${product.id}`} className="block p-4">
          {product.category && (
            <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-1 font-medium">
              {product.category.name}
            </p>
          )}
          <h3
            className={cn(
              "font-bold text-white leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-blue-300",
              isHero ? "text-lg" : "text-sm"
            )}
          >
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={cn(
                "font-black text-white",
                isHero ? "text-xl" : "text-base"
              )}
            >
              {formatPrice(displayPrice)}
            </span>
            {product.salePrice && (
              <span className="text-zinc-600 text-xs line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {sizes.slice(0, isHero ? 6 : 4).map((s) => (
                <span
                  key={s}
                  className="text-[9px] text-zinc-500 border border-white/8 px-1.5 py-0.5 rounded-md font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── BentoGrid (exported) ─────────────────────────────────────────────────────

interface BentoGridProps {
  products: ApiProduct[];
  animationKey?: string;
}

export function BentoGrid({ products, animationKey }: BentoGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-zinc-600 text-sm tracking-widest uppercase">
          Aucun article dans cette catégorie
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        style={{ gridAutoFlow: "dense" }}
      >
        {products.map((product, i) => {
          const { isHero, isWide } = getBento(i);
          return (
            <BentoCard
              key={product.id}
              product={product}
              index={i}
              isHero={isHero}
              isWide={isWide}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
