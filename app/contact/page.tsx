"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle, Mail, MapPin, Clock, Send, CheckCircle,
  Phone, ArrowRight, Camera, Globe,
} from "lucide-react";

const CONTACT_CARDS = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+221 77 100 00 01",
    sub: "Réponse rapide en moins d'1h",
    href: "https://wa.me/221771000001",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    btnLabel: "Écrire sur WhatsApp",
    external: true,
  },
  {
    Icon: Mail,
    label: "Email",
    value: "contact@djene-shop.com",
    sub: "Réponse sous 24h",
    href: "mailto:contact@djene-shop.com",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    btnLabel: "Envoyer un email",
    external: false,
  },
  {
    Icon: MapPin,
    label: "Adresse",
    value: "Dakar, Sénégal",
    sub: "Livraison dans toute l'Afrique",
    href: "#",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    btnLabel: "Voir sur la carte",
    external: true,
  },
  {
    Icon: Clock,
    label: "Horaires",
    value: "Lun–Ven 9h–18h",
    sub: "Samedi 10h–16h",
    href: null,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    btnLabel: null,
    external: false,
  },
];

const SOCIALS = [
  { Icon: Camera, href: "#", label: "Instagram" },
  { Icon: Globe, href: "#", label: "Facebook" },
  { Icon: MessageCircle, href: "https://wa.me/221771000001", label: "WhatsApp" },
];

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // Simulate send — wire to real API when available
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  return (
    <main className="min-h-screen bg-[#080808] text-[#f8f8f8]">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs tracking-[0.3em] text-blue-400 uppercase mb-4 font-semibold">
              — Contactez-nous
            </span>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-6">
              ON EST LÀ<span className="text-blue-500">.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              Une question sur une commande, une taille, ou juste envie de discuter ?
              On répond vite, toujours avec le sourire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact cards ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_CARDS.map(({ Icon, label, value, sub, href, color, bg, btnLabel, external }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className={`rounded-2xl border p-6 flex flex-col gap-4 ${bg}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 ${color}`}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-bold text-white text-sm">{value}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{sub}</p>
              </div>
              {href && btnLabel && (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`mt-auto flex items-center gap-2 text-xs font-semibold ${color} hover:opacity-70 transition-opacity`}
                >
                  {btnLabel} <ArrowRight size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Form + info ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-2">Envoyer un message</h2>
              <p className="text-zinc-500 text-sm mb-8">On vous répond dans les meilleurs délais.</p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message envoyé !</h3>
                  <p className="text-zinc-400 text-sm">
                    Merci pour votre message. On vous répond sous 24h.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5 tracking-wide uppercase">Nom</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5 tracking-wide uppercase">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                        className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 tracking-wide uppercase">Sujet</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors"
                    >
                      <option value="" disabled className="bg-zinc-900">Choisir un sujet</option>
                      <option value="commande" className="bg-zinc-900">Suivi de commande</option>
                      <option value="retour" className="bg-zinc-900">Retour / Remboursement</option>
                      <option value="taille" className="bg-zinc-900">Conseil en taille</option>
                      <option value="paiement" className="bg-zinc-900">Problème de paiement</option>
                      <option value="autre" className="bg-zinc-900">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 tracking-wide uppercase">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Décrivez votre demande..."
                      className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 active:scale-95"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Side info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Quick contact */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Besoin d'une réponse rapide ?</h3>
              <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
                Pour toute urgence, contactez-nous directement sur WhatsApp.
                On répond en moyenne en moins d'une heure.
              </p>
              <a
                href="https://wa.me/221771000001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 active:scale-95 text-sm"
              >
                <Phone size={16} />
                +221 77 100 00 01
              </a>
            </div>

            {/* Social */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">Suivez-nous</h3>
              <p className="text-zinc-400 text-sm mb-5">Nouveautés, promos et tenues inspirantes.</p>
              <div className="flex gap-3">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ CTA */}
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">Questions fréquentes</h3>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                Livraison, retours, tailles… Consultez notre FAQ avant d'écrire.
              </p>
              <Link
                href="/faq"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
              >
                Voir la FAQ <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
