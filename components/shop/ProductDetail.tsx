"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { ApiProduct } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn, formatPrice } from "@/lib/utils";

export default function ProductDetail({ product }: { product: ApiProduct }) {
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const [selectedSize, setSelectedSize] = useState(sizes[Math.floor(sizes.length / 2)] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const primaryIndex = product.images.findIndex((i) => i.isPrimary);
  const orderedImages =
    primaryIndex > 0
      ? [product.images[primaryIndex], ...product.images.filter((_, idx) => idx !== primaryIndex)]
      : product.images;

  const displayPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({ product, quantity: 1, size: selectedSize, color: selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const prevImage = () => setActiveImage((i) => (i === 0 ? orderedImages.length - 1 : i - 1));
  const nextImage = () => setActiveImage((i) => (i === orderedImages.length - 1 ? 0 : i + 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
      {/* Image gallery */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square sm:aspect-4/5 rounded-2xl overflow-hidden bg-zinc-900 group">
          {orderedImages.length > 0 ? (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={orderedImages[activeImage].url}
                alt={orderedImages[activeImage].altText ?? `${product.name} - vue ${activeImage + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-sm">
              Aucune image
            </div>
          )}

          {orderedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Image precedente"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Image suivante"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && <Badge variant="sale">-{discount}%</Badge>}
          </div>
        </div>

        {orderedImages.length > 1 && (
          <div className="flex gap-2">
            {orderedImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                  activeImage === i
                    ? "border-blue-500"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `Miniature ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col py-2">
        <p className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold mb-3 capitalize">
          {product.category?.name ?? "Streetwear"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-tight mb-4">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-black text-white">{formatPrice(displayPrice)}</span>
          {product.salePrice && (
            <span className="text-lg text-zinc-500 line-through">{formatPrice(product.price)}</span>
          )}
          {discount && <Badge variant="sale">-{discount}%</Badge>}
        </div>

        {product.description && (
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            {product.description}
          </p>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-3">
              Couleur — <span className="text-white">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "px-4 py-2 rounded-sm text-sm font-semibold border transition-all duration-200",
                    selectedColor === color
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-zinc-500 tracking-widest uppercase font-semibold mb-3">
              Taille — <span className="text-white">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 rounded-sm text-sm font-semibold border transition-all duration-200",
                    selectedSize === size
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock */}
        <p className="text-xs text-zinc-600 mb-6">
          {product.stock > 10
            ? "En stock"
            : product.stock > 0
            ? `Plus que ${product.stock} en stock`
            : "Rupture de stock"}
        </p>

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          size="lg"
          className="w-full gap-3"
        >
          {added ? (
            <>
              <Check size={18} />
              Ajouté au panier
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              Ajouter au panier
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
