"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Joggings",
    description: "Confort premium pour le quotidien",
    href: "/shop?category=jogger",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    accent: "#3B82F6",
  },
  {
    name: "Ensembles",
    description: "Look complet, style assuré",
    href: "/shop?category=ensemble",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    accent: "#F97316",
  },
  {
    name: "Hoodies",
    description: "Oversize & streetwear attitude",
    href: "/shop?category=hoodie",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    accent: "#8B5CF6",
  },
];

export default function CategoryBanner() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-3">
            Explorez
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
            NOS CATÉGORIES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={cat.href}
                className="relative block aspect-3/4 sm:aspect-2/3 rounded-xl overflow-hidden group"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                {/* Accent color overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                  style={{ backgroundColor: cat.accent }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-2xl sm:text-3xl font-black tracking-tighter leading-none">
                        {cat.name}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1.5">
                        {cat.description}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
