"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "500+", label: "Clients satisfaits" },
  { value: "48h", label: "Livraison Dakar" },
  { value: "100%", label: "Qualité premium" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry timeline
      const tl = gsap.timeline({ delay: 0.6 });

      tl.from(".hero-tag", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".hero-line",
          {
            y: 110,
            opacity: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .from(
          ".hero-sub",
          { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ".hero-cta",
          { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .from(
          ".hero-stat",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          scrollIndicatorRef.current,
          { opacity: 0, duration: 0.6 },
          "-=0.2"
        );

      // Scroll indicator bounce loop
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.5,
      });

      // Background slow ken-burns
      gsap.to(bgRef.current, {
        scale: 1.08,
        duration: 14,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      // Parallax on scroll
      gsap.to(bgRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] flex items-center overflow-hidden bg-black"
    >
      {/* Background image with overlay */}
      <div ref={bgRef} className="absolute inset-0 scale-110 origin-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85)",
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Blue accent glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24">
        <div className="max-w-2xl">
          {/* Tag line */}
          <div className="hero-tag mb-6">
            <span className="inline-flex items-center gap-2 text-blue-400 text-[11px] tracking-[0.5em] uppercase font-semibold">
              <span className="w-8 h-px bg-blue-500 inline-block" />
              Nouvelle Collection 2025
            </span>
          </div>

          {/* Main heading — each word animates independently */}
          <h1 className="text-[clamp(4rem,12vw,9rem)] font-black leading-[0.9] tracking-tighter mb-6">
            <div className="overflow-hidden">
              <span className="hero-line block text-white">STREET</span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block text-blue-500">PREMIUM</span>
            </div>
            <div className="overflow-hidden">
              <span className="hero-line block text-white">STYLE.</span>
            </div>
          </h1>

          {/* Sub */}
          <p className="hero-sub text-zinc-400 text-base sm:text-lg leading-relaxed max-w-md mb-10">
            Des pièces exclusives pour les esprits libres.{" "}
            <br className="hidden sm:block" />
            Joggers, ensembles et hoodies premium —
            <span className="text-zinc-200"> Made for the streets.</span>
          </p>

          {/* CTA buttons */}
          <div className="hero-cta flex flex-col sm:flex-row gap-3 mb-14">
            <Button size="lg" asChild className="group">
              <Link href="/shop">
                Découvrir la collection
                <ArrowRight
                  size={17}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop?category=ensemble">Voir les ensembles</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 sm:gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black text-white leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] text-zinc-600 tracking-[0.2em] uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
      >
        <span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
        <ChevronDown size={15} />
      </div>
    </section>
  );
}
