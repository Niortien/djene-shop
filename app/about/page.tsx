"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, Heart, Zap, Shield, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    icon: Heart,
    title: "Fait avec amour",
    text: "Chaque pièce est conçue avec passion à Dakar. Notre équipe met tout son cœur dans chaque détail de la conception jusqu'à la livraison.",
    color: "#ef4444",
  },
  {
    icon: Zap,
    title: "Style sans compromis",
    text: "Le streetwear c'est une attitude. Nos collections allient esthétique urbaine et confort absolu pour s'adapter à toutes tes journées.",
    color: "#3b82f6",
  },
  {
    icon: Shield,
    title: "Qualité premium",
    text: "Matières sélectionnées, coutures renforcées, finitions impeccables. On refuse la médiocrité à chaque étape de la production.",
    color: "#8b5cf6",
  },
  {
    icon: Users,
    title: "Une communauté",
    text: "Djenebou c'est plus qu'une marque — c'est une famille. Des milliers de jeunes qui partagent une même vision du style et de la liberté.",
    color: "#f97316",
  },
];

const TIMELINE = [
  {
    year: "2021",
    title: "L'idée germe",
    text: "Djenebou Diallo, frustrée de ne pas trouver des vêtements streetwear de qualité à Dakar, décide de les créer elle-même.",
  },
  {
    year: "2022",
    title: "Les premières pièces",
    text: "Les 50 premiers joggings cousus dans un petit atelier de la Médina partent en moins de 48h. La demande explose.",
  },
  {
    year: "2023",
    title: "La boutique en ligne",
    text: "Lancement de djene-shop.com. Les commandes arrivent de tout le Sénégal, puis de la diaspora en France et en Espagne.",
  },
  {
    year: "2024",
    title: "Collections exclusives",
    text: "Première collaboration avec des artistes locaux. Chaque saison apporte une nouvelle identité visuelle forte et reconnaissable.",
  },
  {
    year: "2025 →",
    title: "Le futur s'écrit ici",
    text: "Expansion vers Abidjan, Bamako et Paris. La vision : devenir la référence du streetwear africain à l'échelle mondiale.",
  },
];

const STATS = [
  { value: "500+", label: "Clients satisfaits", suffix: "" },
  { value: "48", label: "Heures max — livraison Dakar", suffix: "h" },
  { value: "3", label: "Années d'existence", suffix: "" },
  { value: "100", label: "Qualité garantie", suffix: "%" },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-word", {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.3,
      });

      gsap.from(".about-sub", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 1.0,
      });

      gsap.from(".about-cta", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 1.3,
      });

      // Timeline items
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((el, i) => {
        gsap.from(el, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#080808] text-white overflow-x-hidden">
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#080808]/80 via-[#080808]/60 to-[#080808]" />
        </motion.div>

        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 z-1 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
          }}
        />

        <div ref={heroTextRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="overflow-hidden mb-4">
            <span className="about-sub inline-block text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold">
              Notre histoire
            </span>
          </div>

          <div className="overflow-hidden mb-6">
            <h1 className="text-6xl sm:text-8xl lg:text-[120px] font-black tracking-tighter leading-none">
              {"NÉE À".split("").map((char, i) => (
                <span key={i} className="about-hero-word inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
              <br />
              <span className="text-blue-500">
                {"DAKAR".split("").map((char, i) => (
                  <span key={i} className="about-hero-word inline-block">
                    {char}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <p className="about-sub max-w-2xl mx-auto text-zinc-400 text-lg sm:text-xl leading-relaxed mb-10">
            Djenebou Shop est née d&apos;une conviction simple : la mode streetwear
            premium n&apos;a pas de frontières géographiques. Nous l&apos;avons créée
            pour toi, ici, depuis Dakar.
          </p>

          <div className="about-cta flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/shop"
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300"
            >
              Découvrir la collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <MapPin size={14} className="text-blue-500" />
              Dakar, Sénégal
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-linear-to-b from-transparent to-blue-500" />
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────────────── */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-2">
                  {stat.value}
                  <span className="text-blue-500">{stat.suffix}</span>
                </div>
                <div className="text-zinc-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MANIFESTO ──────────────────────────────────────────────── */}
      <section className="py-28 sm:py-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -top-8 -left-4 text-[120px] font-black text-white/3 leading-none select-none pointer-events-none">
              &quot;
            </div>
            <blockquote className="relative z-10 text-3xl sm:text-5xl font-black tracking-tighter leading-tight text-white">
              Le streetwear n&apos;est pas qu&apos;une tendance.
              <br />
              <span className="text-blue-500">C&apos;est une façon de vivre.</span>
              <br />
              Et nous la vivons depuis Dakar,
              <br />
              pour le monde entier.
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                D
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Djenebou Diallo</div>
                <div className="text-zinc-500 text-xs">Fondatrice & Creative Director</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VALEURS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-4">
              Ce qui nous définit
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
              NOS VALEURS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-500 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${val.color}18, transparent 70%)`,
                    }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${val.color}20` }}
                  >
                    <Icon size={22} style={{ color: val.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{val.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ───────────────────────────────────────────────── */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <span className="text-blue-500 text-[11px] tracking-[0.5em] uppercase font-semibold block mb-4">
              Depuis le début
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
              NOTRE PARCOURS
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-blue-600 via-blue-600/30 to-transparent" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className={`timeline-item relative flex gap-8 sm:gap-0 ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-8 sm:left-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#080808] -translate-x-1/2 mt-2 z-10" />

                  {/* Content */}
                  <div
                    className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                      i % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left sm:ml-auto"
                    }`}
                  >
                    <span className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-1 block">
                      {item.year}
                    </span>
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VISUAL BREAK ───────────────────────────────────────────── */}
      <section className="relative h-[40vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[#080808]/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl font-black tracking-tighter text-white text-center px-4"
          >
            Made in Dakar.
            <br />
            <span className="text-blue-500">Worn by the world.</span>
          </motion.p>
        </div>
      </section>

      {/* ─── CTA FINAL ──────────────────────────────────────────────── */}
      <section className="py-28 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-6">
              REJOINS
              <br />
              <span className="text-blue-500">LA FAMILLE</span>
            </h2>
            <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
              Des milliers de personnes ont déjà choisi Djenebou. Maintenant
              c&apos;est ton tour de porter quelque chose de plus grand que toi.
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
                href="/size-guide"
                className="flex items-center gap-2 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300"
              >
                Guide des tailles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
