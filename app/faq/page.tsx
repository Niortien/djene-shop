"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Truck, RotateCcw, CreditCard, Ruler, MessageCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  label: string;
  Icon: React.ElementType;
  color: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    id: "livraison",
    label: "Livraison",
    Icon: Truck,
    color: "text-blue-400",
    items: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Pour Dakar et la banlieue, comptez 24 à 48h après confirmation de votre commande. Pour les autres régions du Sénégal, le délai est de 2 à 5 jours ouvrables. Pour les livraisons internationales (Afrique de l'Ouest), comptez 5 à 10 jours.",
      },
      {
        q: "Quels sont les frais de livraison ?",
        a: "La livraison est gratuite pour toute commande supérieure à 25 000 FCFA à Dakar. En dessous de ce montant, les frais sont de 2 000 FCFA. Pour les autres régions, les frais varient de 3 000 à 7 000 FCFA selon la destination.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Dès l'expédition de votre commande, vous recevez un SMS et/ou un message WhatsApp avec un numéro de suivi. Vous pouvez aussi consulter l'historique de vos commandes dans votre espace client.",
      },
      {
        q: "Livrez-vous à l'international ?",
        a: "Oui, nous livrons dans toute l'Afrique de l'Ouest. Contactez-nous sur WhatsApp pour connaître les frais et délais spécifiques à votre pays.",
      },
    ],
  },
  {
    id: "retours",
    label: "Retours",
    Icon: RotateCcw,
    color: "text-orange-400",
    items: [
      {
        q: "Quelle est la politique de retour ?",
        a: "Vous disposez de 7 jours après réception pour retourner un article. L'article doit être non porté, non lavé, avec toutes ses étiquettes d'origine. Les retours pour cause de défaut de fabrication sont pris en charge intégralement.",
      },
      {
        q: "Comment initier un retour ?",
        a: "Contactez-nous sur WhatsApp ou par email avec votre numéro de commande et la raison du retour. On vous guidera sur la procédure. Les frais de retour sont à votre charge sauf en cas de défaut du produit.",
      },
      {
        q: "Quand serai-je remboursé(e) ?",
        a: "Une fois le retour reçu et inspecté (sous 48h), le remboursement est effectué sous 3 à 5 jours ouvrables. Vous serez notifié(e) par SMS/WhatsApp à chaque étape.",
      },
      {
        q: "Puis-je échanger un article ?",
        a: "Oui, l'échange est possible pour la même référence dans une autre taille ou couleur, sous réserve de disponibilité. Contactez-nous rapidement car les stocks peuvent être limités.",
      },
    ],
  },
  {
    id: "paiement",
    label: "Paiement",
    Icon: CreditCard,
    color: "text-green-400",
    items: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons : Wave, Orange Money, Free Money, paiement à la livraison (Dakar uniquement), et les virements bancaires. D'autres modes de paiement sont en cours d'intégration.",
      },
      {
        q: "Le paiement à la livraison est-il disponible ?",
        a: "Oui, le paiement à la livraison est disponible uniquement pour Dakar et la banlieue (Pikine, Guédiawaye, Rufisque). Il n'est pas disponible pour les commandes en dehors de cette zone.",
      },
      {
        q: "Mes données de paiement sont-elles sécurisées ?",
        a: "Absolument. Nous ne stockons aucune donnée bancaire sur nos serveurs. Toutes les transactions sont chiffrées et sécurisées. Pour les paiements mobile money, la transaction se passe directement avec votre opérateur.",
      },
      {
        q: "Puis-je payer en plusieurs fois ?",
        a: "Pour les commandes supérieures à 50 000 FCFA, nous proposons un paiement en 2 fois sans frais. Contactez-nous sur WhatsApp pour en savoir plus.",
      },
    ],
  },
  {
    id: "tailles",
    label: "Tailles",
    Icon: Ruler,
    color: "text-purple-400",
    items: [
      {
        q: "Comment choisir ma taille ?",
        a: "Consultez notre guide des tailles avec des mesures précises en cm. En cas de doute entre deux tailles, nous recommandons généralement de prendre la taille supérieure pour un confort optimal, surtout pour les joggings et hoodies.",
      },
      {
        q: "Les tailles sont-elles fidèles au guide ?",
        a: "Oui, nos tailles correspondent aux mesures indiquées dans le guide. Toutefois, chaque article dispose parfois de notes spécifiques (coupe slim, oversize, etc.) que nous précisons dans la description du produit.",
      },
      {
        q: "Que faire si l'article ne me va pas ?",
        a: "Pas de panique — échangez l'article dans les 7 jours suivant la réception. Contactez-nous sur WhatsApp avec votre numéro de commande et on s'occupe de tout.",
      },
      {
        q: "Proposez-vous des grandes tailles ?",
        a: "Oui, la plupart de nos articles sont disponibles jusqu'en 3XL. Si votre taille n'est pas disponible en ligne, contactez-nous, nous ferons le maximum pour vous satisfaire.",
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? "border-white/12 bg-white/3" : "border-white/5 bg-white/1 hover:border-white/10"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-sm text-white leading-relaxed">{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-zinc-500"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("livraison");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const currentCat = FAQ_DATA.find((c) => c.id === activeCategory)!;

  // Search across all categories
  const searchResults = search.trim().length > 1
    ? FAQ_DATA.flatMap((cat) =>
        cat.items
          .filter(
            (item) =>
              item.q.toLowerCase().includes(search.toLowerCase()) ||
              item.a.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => ({ ...item, catLabel: cat.label }))
      )
    : null;

  return (
    <main className="min-h-screen bg-[#080808] text-[#f8f8f8]">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs tracking-[0.3em] text-blue-400 uppercase mb-4 font-semibold">
              — Questions fréquentes
            </span>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-6">
              FAQ<span className="text-blue-500">.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed mb-10">
              Toutes les réponses à vos questions sur la livraison, les retours, le paiement et les tailles.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
                placeholder="Rechercher une question..."
                className="w-full bg-zinc-900/80 border border-white/8 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Content ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        {searchResults !== null ? (
          /* Search results */
          <div>
            <p className="text-zinc-500 text-sm mb-6">
              {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""} pour &ldquo;{search}&rdquo;
            </p>
            <div className="flex flex-col gap-3">
              {searchResults.length === 0 ? (
                <div className="text-center py-16 text-zinc-500">
                  <p className="text-lg font-medium text-white mb-2">Aucun résultat</p>
                  <p className="text-sm">Essayez d&apos;autres mots clés ou <Link href="/contact" className="text-blue-400 hover:underline">contactez-nous</Link>.</p>
                </div>
              ) : (
                searchResults.map((item, i) => (
                  <AccordionItem
                    key={i}
                    item={item}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          /* Category tabs + accordion */
          <div>
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
              {FAQ_DATA.map(({ id, label, Icon, color }) => (
                <button
                  key={id}
                  onClick={() => { setActiveCategory(id); setOpenIndex(0); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    activeCategory === id
                      ? "bg-white/8 border-white/12 text-white"
                      : "bg-transparent border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                  }`}
                >
                  <Icon size={15} className={activeCategory === id ? color : ""} strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                {currentCat.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    item={item}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600/20 to-purple-600/10 border border-blue-500/20 p-10 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={24} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-3">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Notre équipe est disponible pour répondre à toutes vos questions,
              que ce soit par WhatsApp, email ou via notre formulaire de contact.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-95 text-sm"
            >
              Nous contacter <MessageCircle size={15} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
