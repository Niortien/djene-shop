"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Zap } from "lucide-react";
import { ApiProduct } from "@/types";
import ProductCard from "@/components/common/ProductCard";

const TICKER_ITEMS = [
  "NOUVEAU DROP",
  "T-SHIRTS",
  "JOGGINGS",
  "VUS SUR LES RÉSEAUX",
  "NOUVELLE COLLECTION",
  "ÉDITION LIMITÉE",
  "TENDANCE DU MOMENT",
  "DJENE RECOMMANDE",
];

interface Props {
  products: ApiProduct[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Ajouté aujourd'hui";
  if (days === 1) return "Ajouté hier";
  if (days < 7) return `Ajouté il y a ${days} jours`;
  return "Récemment ajouté";
}

export default function NewArrivalsClient({ products }: Props) {
  const newestProduct = products[0];
  const recencyLabel = newestProduct ? timeAgo(newestProduct.createdAt) : null;

  return (
    <section className="relative overflow-hidden bg-[#080604]">
      {/* ── Ambient warm glow ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-225 h-125 bg-amber-500/8 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-20 w-100 h-100 bg-orange-600/6 rounded-full blur-[100px]" />
        {/* Giant watermark */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black tracking-tighter text-white/2 select-none pointer-events-none whitespace-nowrap"
        >
          NEW DROP
        </span>
      </div>

      {/* ── Ticker top bar ── */}
      <div className="relative w-full overflow-hidden border-t border-amber-500/15 bg-linear-to-r from-amber-500/7 to-orange-500/5 py-3">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "ticker 28s linear infinite" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 mr-10 text-amber-400/90 text-[10px] tracking-[0.35em] uppercase font-bold"
              >
                <Flame size={9} className="text-amber-500 shrink-0 fill-amber-500/40" />
                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 mb-5 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 text-[10px] font-bold tracking-[0.4em] uppercase">
                Nouvelles publications
              </span>
              {recencyLabel && (
                <>
                  <span className="text-red-500/40">·</span>
                  <span className="text-red-400/70 text-[10px] tracking-wide">{recencyLabel}</span>
                </>
              )}
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(3rem,8vw,6rem)] font-black tracking-tighter leading-none"
              >
                <span className="block text-white">NOUVEAU</span>
                <span className="block bg-linear-to-r from-amber-400 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                  DROP ✦
                </span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-5 text-zinc-400 text-sm leading-relaxed max-w-sm"
            >
              Djene vient de publier de nouveaux styles — t-shirts, joggings et plus.{" "}
              <span className="text-amber-400/90 font-semibold">
                Sois le premier à les découvrir.
              </span>
            </motion.p>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 flex items-center gap-5"
            >
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <Zap size={12} className="text-amber-500" />
                <span>{products.length} nouveaux articles</span>
              </div>
              <span className="w-px h-3 bg-zinc-700" />
              <div className="flex items-center gap-2 text-zinc-500 text-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                <span className="text-green-400/80">Stock limité</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/shop?sortBy=createdAt&sortOrder=DESC"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors duration-300 group border border-white/10 hover:border-amber-500/30 rounded-full px-5 py-2.5"
            >
              Voir tous les nouveaux
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* ── Product grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                delay: i * 0.07,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Subtle amber glow ring on first product */}
              {i === 0 && (
                <div className="absolute -inset-px rounded-xl bg-linear-to-br from-amber-500/30 to-orange-500/10 -z-10 blur-sm" />
              )}
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-14 rounded-2xl relative overflow-hidden border border-amber-500/20 bg-linear-to-r from-amber-500/10 via-orange-500/5 to-transparent p-8 sm:p-10"
        >
          {/* Inner glow */}
          <div className="absolute top-0 left-0 w-48 h-full bg-linear-to-r from-amber-500/10 to-transparent" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-amber-400 text-[10px] font-bold tracking-[0.5em] uppercase mb-2">
                Ne ratez rien
              </p>
              <p className="text-white text-xl sm:text-2xl font-black tracking-tight">
                Suivez Djene pour voir les{" "}
                <span className="text-amber-400">drops en premier</span>
              </p>
              <p className="text-zinc-500 text-sm mt-1.5">
                Chaque semaine, de nouveaux styles directement publiés sur la boutique.
              </p>
            </div>
            <Link
              href="/shop?sortBy=createdAt&sortOrder=DESC"
              className="shrink-0 inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full px-7 py-3 transition-colors duration-300 group"
            >
              Explorer la boutique
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Ticker bottom bar ── */}
      <div
        className="relative w-full overflow-hidden border-b border-amber-500/15 bg-linear-to-r from-amber-500/5 to-orange-500/3 py-3"
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "ticker 35s linear infinite reverse" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 mr-10 text-amber-500/40 text-[10px] tracking-[0.35em] uppercase font-bold"
              >
                <span>✦</span>
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
