"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MousePointerClick, Truck, Package, Sparkles } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: MousePointerClick,
    num: "01",
    title: "Choisis ta pièce",
    text: "Explore notre catalogue de joggings, hoodies et ensembles. Chaque article est photographié sous tous les angles pour que tu voies exactement ce que tu reçois.",
    color: "#3b82f6",
    cta: { label: "Voir la boutique", href: "/shop" },
  },
  {
    icon: Sparkles,
    num: "02",
    title: "Sélectionne ta taille",
    text: "Utilise notre guide des tailles détaillé pour trouver ton fit idéal. Slim, regular ou relax — chaque coupe a son tableau de mesures.",
    color: "#8b5cf6",
    cta: { label: "Guide des tailles", href: "/size-guide" },
  },
  {
    icon: Package,
    num: "03",
    title: "On prépare ta commande",
    text: "Dès validation, notre équipe à Dakar prépare ton colis avec soin. Emballage premium, pièce vérifiée et scellée avant expédition.",
    color: "#f97316",
    cta: null,
  },
  {
    icon: Truck,
    num: "04",
    title: "Livraison rapide",
    text: "24–48h pour Dakar et la banlieue. 3–7 jours pour le reste du Sénégal et la diaspora. Suivi en temps réel par WhatsApp.",
    color: "#10b981",
    cta: null,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-28 sm:py-36 bg-zinc-950 overflow-hidden relative"
    >
      {/* BG texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-4">
              Simple & rapide
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-none">
              COMMANDER EN
              <br />
              <span className="text-blue-500">4 ÉTAPES</span>
            </h2>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-13 left-[12.5%] right-[12.5%] h-px bg-white/5 z-0">
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-500 to-emerald-500 origin-left"
              style={{ scaleX: lineScale }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex flex-col"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div
                      className="w-26 h-26 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: `${step.color}12`, border: `1px solid ${step.color}25` }}
                    >
                      {/* Glow on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${step.color}20, transparent 70%)`,
                        }}
                      />
                      <Icon size={36} style={{ color: step.color }} />
                    </div>

                    {/* Step number badge */}
                    <div
                      className="absolute -top-2 -right-2 sm:right-[calc(50%-52px-8px)] w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-zinc-950"
                      style={{ backgroundColor: step.color, color: "#fff" }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-lg mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-4">
                      {step.text}
                    </p>
                    {step.cta && (
                      <Link
                        href={step.cta.href}
                        className="inline-flex items-center justify-center gap-1 text-xs font-semibold transition-colors duration-200 mt-auto"
                        style={{ color: step.color }}
                      >
                        {step.cta.label}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom guarantee bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5 border border-white/5 rounded-2xl overflow-hidden"
        >
          {[
            { emoji: "🔒", title: "Paiement sécurisé", sub: "Mobile Money & carte" },
            { emoji: "↩️", title: "Retours 7 jours", sub: "Si le produit ne convient pas" },
            { emoji: "💬", title: "Support WhatsApp", sub: "Réponse en moins d'1h" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-5 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors duration-300"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <div className="text-white text-sm font-semibold">{item.title}</div>
                <div className="text-zinc-500 text-xs">{item.sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
