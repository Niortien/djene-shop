"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Aminata S.",
    city: "Dakar",
    avatar: "A",
    color: "#3b82f6",
    rating: 5,
    text: "Le jogging est incroyable. Qualité au-delà de mes attentes, la matière est douce et tient bien. J'ai déjà commandé 2 autres pièces !",
    product: "Jogging Premium Noir",
  },
  {
    name: "Ibrahima D.",
    city: "Thiès",
    avatar: "I",
    color: "#8b5cf6",
    rating: 5,
    text: "Livraison rapide à Thiès, packaging soigné. Le hoodie oversize est exactement comme sur les photos. Vraiment du 5 étoiles.",
    product: "Hoodie Oversize Gris",
  },
  {
    name: "Fatou K.",
    city: "Saint-Louis",
    avatar: "F",
    color: "#f97316",
    rating: 5,
    text: "Enfin une marque sénégalaise qui propose du streetwear de qualité internationale. Je recommande les yeux fermés.",
    product: "Ensemble Streetwear",
  },
  {
    name: "Moussa T.",
    city: "Paris",
    avatar: "M",
    color: "#10b981",
    rating: 5,
    text: "Commande depuis la France, reçue en 5 jours. Les tailles sont conformes au guide. Mon T-shirt a eu beaucoup de succès !",
    product: "T-Shirt Logo Drop",
  },
  {
    name: "Rokhaya B.",
    city: "Dakar",
    avatar: "R",
    color: "#ef4444",
    rating: 5,
    text: "Le service client est au top. J'avais une question sur les tailles, réponse en moins d'une heure sur WhatsApp. Merci Djenebou !",
    product: "Jogging Premium Blanc",
  },
  {
    name: "Seydou F.",
    city: "Abidjan",
    avatar: "S",
    color: "#eab308",
    rating: 5,
    text: "Livraison Abidjan parfaite. L'ensemble est une bombe, tout le monde me demande où j'ai trouvé ça. Fièrement made in Dakar.",
    product: "Ensemble Coordonné",
  },
];

const BRAND_LOGOS = [
  { name: "PREMIUM", sub: "QUALITY" },
  { name: "MADE IN", sub: "DAKAR" },
  { name: "FAST", sub: "DELIVERY" },
  { name: "500+", sub: "REVIEWS" },
  { name: "3 ANS", sub: "D'EXPÉRIENCE" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} fill="#f59e0b" className="text-amber-400" />
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="py-24 overflow-hidden bg-[#080808]">
      {/* ─── Heading ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-4">
            Ils nous font confiance
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-none">
            LA COMMUNAUTÉ
            <br />
            <span className="text-blue-500">PARLE</span>
          </h2>
        </motion.div>
      </div>

      {/* ─── Reviews marquee row 1 (→) ───────────────────────────── */}
      <div className="relative mb-5">
        <div className="flex gap-5 animate-[marquee_40s_linear_infinite] w-max">
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>

      {/* ─── Reviews marquee row 2 (←) ───────────────────────────── */}
      <div className="relative mb-20">
        <div className="flex gap-5 animate-[marquee-reverse_45s_linear_infinite] w-max">
          {[...REVIEWS.slice(3), ...REVIEWS, ...REVIEWS.slice(0, 3)].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>

      {/* ─── Trust bar ────────────────────────────────────────────── */}
      <div className="border-t border-b border-white/5 py-6">
        <div className="flex gap-0 overflow-hidden">
          <div className="flex gap-0 animate-[marquee_20s_linear_infinite] w-max">
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-8 px-10 border-r border-white/5"
              >
                <div className="text-center">
                  <div className="text-white font-black text-lg tracking-widest leading-none">
                    {item.name}
                  </div>
                  <div className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <div className="w-72 shrink-0 bg-zinc-900/60 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
      <Quote
        size={48}
        className="absolute -top-2 -right-2 opacity-5 rotate-180"
        style={{ color: review.color }}
      />
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
          style={{ backgroundColor: review.color }}
        >
          {review.avatar}
        </div>
        <div>
          <div className="text-white text-sm font-bold leading-none mb-0.5">
            {review.name}
          </div>
          <div className="text-zinc-500 text-xs">{review.city}</div>
        </div>
        <div className="ml-auto">
          <StarRating count={review.rating} />
        </div>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-3">
        &ldquo;{review.text}&rdquo;
      </p>
      <div
        className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
        style={{ color: review.color, backgroundColor: `${review.color}15` }}
      >
        {review.product}
      </div>
    </div>
  );
}
