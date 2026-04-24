"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

type Category = "joggings" | "tshirts" | "hoodies" | "ensembles";

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "joggings", label: "Joggings & Bas", emoji: "👟" },
  { id: "tshirts", label: "T-Shirts & Hauts", emoji: "👕" },
  { id: "hoodies", label: "Hoodies & Sweats", emoji: "🧥" },
  { id: "ensembles", label: "Ensembles", emoji: "✨" },
];

type SizeRow = {
  size: string;
  label: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  inseam?: string;
  shoulder?: string;
};

const SIZE_DATA: Record<Category, { headers: string[]; rows: SizeRow[] }> = {
  joggings: {
    headers: ["Taille", "Tour de taille", "Tour de hanches", "Longueur entrejambe", "Longueur totale"],
    rows: [
      { size: "XS", label: "Extra Small", waist: "70–74 cm", hips: "88–92 cm", inseam: "74 cm", length: "94 cm" },
      { size: "S",  label: "Small",       waist: "74–80 cm", hips: "92–96 cm", inseam: "76 cm", length: "96 cm" },
      { size: "M",  label: "Medium",      waist: "80–86 cm", hips: "96–102 cm", inseam: "78 cm", length: "98 cm" },
      { size: "L",  label: "Large",       waist: "86–94 cm", hips: "102–108 cm", inseam: "80 cm", length: "100 cm" },
      { size: "XL", label: "Extra Large", waist: "94–102 cm", hips: "108–116 cm", inseam: "81 cm", length: "102 cm" },
      { size: "2XL", label: "2X Large",   waist: "102–112 cm", hips: "116–124 cm", inseam: "82 cm", length: "104 cm" },
    ],
  },
  tshirts: {
    headers: ["Taille", "Tour de poitrine", "Tour de taille", "Largeur épaules", "Longueur"],
    rows: [
      { size: "XS",  label: "Extra Small", chest: "82–86 cm",   waist: "70–74 cm",   shoulder: "42 cm", length: "66 cm" },
      { size: "S",   label: "Small",       chest: "86–92 cm",   waist: "74–80 cm",   shoulder: "44 cm", length: "68 cm" },
      { size: "M",   label: "Medium",      chest: "92–98 cm",   waist: "80–86 cm",   shoulder: "46 cm", length: "71 cm" },
      { size: "L",   label: "Large",       chest: "98–106 cm",  waist: "86–94 cm",   shoulder: "48 cm", length: "74 cm" },
      { size: "XL",  label: "Extra Large", chest: "106–114 cm", waist: "94–102 cm",  shoulder: "50 cm", length: "76 cm" },
      { size: "2XL", label: "2X Large",    chest: "114–122 cm", waist: "102–110 cm", shoulder: "52 cm", length: "78 cm" },
    ],
  },
  hoodies: {
    headers: ["Taille", "Tour de poitrine", "Tour de taille", "Largeur épaules", "Longueur"],
    rows: [
      { size: "XS",  label: "Extra Small", chest: "84–88 cm",   waist: "72–76 cm",   shoulder: "43 cm", length: "64 cm" },
      { size: "S",   label: "Small",       chest: "88–94 cm",   waist: "76–82 cm",   shoulder: "45 cm", length: "66 cm" },
      { size: "M",   label: "Medium",      chest: "94–100 cm",  waist: "82–88 cm",   shoulder: "47 cm", length: "69 cm" },
      { size: "L",   label: "Large",       chest: "100–108 cm", waist: "88–96 cm",   shoulder: "49 cm", length: "72 cm" },
      { size: "XL",  label: "Extra Large", chest: "108–116 cm", waist: "96–104 cm",  shoulder: "51 cm", length: "74 cm" },
      { size: "2XL", label: "2X Large",    chest: "116–124 cm", waist: "104–112 cm", shoulder: "53 cm", length: "76 cm" },
    ],
  },
  ensembles: {
    headers: ["Taille", "Tour de poitrine", "Tour de taille", "Tour de hanches", "Longueur veste"],
    rows: [
      { size: "XS",  label: "Extra Small", chest: "82–86 cm",   waist: "70–74 cm",   hips: "88–92 cm",   length: "62 cm" },
      { size: "S",   label: "Small",       chest: "86–92 cm",   waist: "74–80 cm",   hips: "92–96 cm",   length: "64 cm" },
      { size: "M",   label: "Medium",      chest: "92–98 cm",   waist: "80–86 cm",   hips: "96–102 cm",  length: "66 cm" },
      { size: "L",   label: "Large",       chest: "98–106 cm",  waist: "86–94 cm",   hips: "102–108 cm", length: "68 cm" },
      { size: "XL",  label: "Extra Large", chest: "106–114 cm", waist: "94–102 cm",  hips: "108–116 cm", length: "70 cm" },
      { size: "2XL", label: "2X Large",    chest: "114–122 cm", waist: "102–110 cm", hips: "116–124 cm", length: "72 cm" },
    ],
  },
};

const HOW_TO = [
  {
    num: "01",
    title: "Tour de poitrine",
    text: "Passe le mètre ruban horizontalement autour de la partie la plus large de ta poitrine, sous les aisselles. Garde-le bien à plat.",
    color: "#3b82f6",
  },
  {
    num: "02",
    title: "Tour de taille",
    text: "Mesure autour de ta taille naturelle, soit la partie la plus étroite de ton torse. Le mètre doit être parallèle au sol.",
    color: "#8b5cf6",
  },
  {
    num: "03",
    title: "Tour de hanches",
    text: "Mesure autour de la partie la plus large de tes hanches et fesses. Reste debout, pieds joints.",
    color: "#f97316",
  },
  {
    num: "04",
    title: "Entrejambe",
    text: "Du haut de l'entrejambe jusqu'en bas de la cheville. Mesure l'intérieur de la jambe le long d'un pantalon bien ajusté.",
    color: "#ef4444",
  },
];

const TIPS = [
  "En cas de doute entre deux tailles, choisis la plus grande.",
  "Nos hoodies et t-shirts sont conçus avec une coupe oversized — taille habituelle recommandée.",
  "Les joggings comportent une taille élastique ajustable : la mesure de hanches est prépondérante.",
  "Toutes les mesures sont prises à plat sur le vêtement (+2–4 cm d'aisance prévus).",
];

function getFitBadge(size: string): { label: string; color: string } {
  if (size === "XS" || size === "S") return { label: "Slim", color: "#3b82f6" };
  if (size === "M" || size === "L") return { label: "Regular", color: "#10b981" };
  return { label: "Relax", color: "#f97316" };
}

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("joggings");
  const [openTip, setOpenTip] = useState<number | null>(null);

  const data = SIZE_DATA[activeCategory];

  function getRowValue(row: SizeRow, header: string): string {
    const map: Record<string, keyof SizeRow> = {
      "Tour de taille": "waist",
      "Tour de hanches": "hips",
      "Tour de poitrine": "chest",
      "Longueur entrejambe": "inseam",
      "Longueur totale": "length",
      "Longueur veste": "length",
      "Longueur": "length",
      "Largeur épaules": "shoulder",
    };
    const key = map[header];
    return key ? (row[key] as string) ?? "—" : "—";
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen overflow-x-hidden">
      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, #ffffff08 40px, #ffffff08 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #ffffff08 40px, #ffffff08 41px)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-2 mb-6">
              <Ruler size={14} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
                Guide des tailles
              </span>
            </div>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-6">
              TROUVE
              <br />
              <span className="text-blue-500">TA TAILLE</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              Chaque pièce Djenebou est pensée pour s'adapter à ton corps. Utilise ce guide pour
              trouver la coupe parfaite, du XS au 2XL.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── COMMENT MESURER ────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-3">
              Étape 1
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
              COMMENT SE MESURER
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_TO.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-zinc-900/60 border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-white/10 transition-all duration-300"
              >
                <div
                  className="absolute -top-4 -right-4 text-[80px] font-black opacity-5 select-none leading-none"
                  style={{ color: item.color }}
                >
                  {item.num}
                </div>
                <div
                  className="text-3xl font-black mb-4 tracking-tighter"
                  style={{ color: item.color }}
                >
                  {item.num}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TABLEAUX DE TAILLES ────────────────────────────────────── */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-3">
              Étape 2
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">
              TABLEAU DES TAILLES
            </h2>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="overflow-x-auto rounded-2xl border border-white/5"
            >
              <table className="w-full min-w-150">
                <thead>
                  <tr className="bg-zinc-900/80">
                    {data.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`px-6 py-4 text-left text-xs font-bold tracking-widest uppercase ${
                          i === 0 ? "text-blue-400" : "text-zinc-500"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Coupe
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => {
                    const fit = getFitBadge(row.size);
                    return (
                      <tr
                        key={i}
                        className={`border-t border-white/5 transition-colors duration-200 hover:bg-zinc-900/40 ${
                          i % 2 === 0 ? "bg-transparent" : "bg-zinc-900/20"
                        }`}
                      >
                        {/* Size */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-600/20 flex items-center justify-center text-blue-400 font-black text-sm">
                              {row.size}
                            </span>
                            <span className="text-zinc-500 text-xs">{row.label}</span>
                          </div>
                        </td>
                        {/* Other columns */}
                        {data.headers.slice(1).map((h, j) => (
                          <td key={j} className="px-6 py-5 text-zinc-300 text-sm">
                            {getRowValue(row, h)}
                          </td>
                        ))}
                        {/* Fit badge */}
                        <td className="px-6 py-5">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              color: fit.color,
                              backgroundColor: `${fit.color}18`,
                            }}
                          >
                            {fit.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── CONSEILS ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-3">
              Conseils
            </span>
            <h2 className="text-4xl font-black tracking-tighter">
              À SAVOIR
            </h2>
          </div>

          <div className="space-y-3">
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex items-start gap-4 bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-xl px-5 py-4 transition-all duration-300 cursor-pointer"
                onClick={() => setOpenTip(openTip === i ? null : i)}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
              PRÊT À COMMANDER ?
            </h2>
            <p className="text-zinc-400 mb-8">
              Maintenant que tu connais ta taille, il ne reste plus qu'à trouver
              ta pièce préférée.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/shop"
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300"
              >
                Voir la boutique
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300"
              >
                Notre histoire
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
