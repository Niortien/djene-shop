"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, LayoutGrid, Menu, X,
  Home, ShoppingBag, Info, Ruler, ArrowRight,
  Phone, MessageCircle, User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore, cartItemCount } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import gsap from "gsap";

const NAV_LINKS = [
  { href: "/",          label: "Accueil",        Icon: Home },
  { href: "/shop",      label: "Boutique",        Icon: ShoppingBag },
  { href: "/about",     label: "À propos",        Icon: Info },
  { href: "/size-guide",label: "Guide tailles",   Icon: Ruler },
  { href: "/faq",       label: "FAQ",             Icon: MessageCircle },
  { href: "/contact",   label: "Contact",         Icon: Phone },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const { items, toggleCart } = useCartStore();
  const { user } = useAuthStore();
  const count = cartItemCount(items);
  const isAdmin = user?.role === "admin" || user?.role === "seller";

  // GSAP entrance — slides in from right
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });
    });
    return () => ctx.revert();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ─── Desktop sidebar (md+) ─────────────────────────────────── */}
      <nav
        ref={navRef}
        className="hidden md:flex fixed right-0 top-0 h-screen w-20 z-50 flex-col items-center py-6 bg-[#0a0a0a]/90 backdrop-blur-xl border-l border-white/5"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 mb-8 group"
          title="Djenebou Shop"
        >
          <span className="text-white font-black text-xl tracking-tighter leading-none group-hover:text-blue-400 transition-colors duration-200">
            D
          </span>
          <span className="text-blue-500 font-black text-xl leading-none">.</span>
          <span className="text-[8px] text-zinc-600 tracking-[0.25em] uppercase mt-0.5">
            Shop
          </span>
        </Link>

        {/* Divider */}
        <div className="w-8 h-px bg-white/8 mb-8" />

        {/* Nav links */}
        <ul className="flex flex-col items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href} className="relative w-full flex justify-center">
                <Link
                  href={href}
                  onMouseEnter={() => setHovered(href)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl w-16 transition-all duration-200 group",
                    active
                      ? "text-white bg-white/8"
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r-full" />
                  )}
                  <Icon size={19} strokeWidth={active ? 2 : 1.5} />
                  <span className="text-[9px] tracking-[0.15em] uppercase leading-none font-medium text-center w-full">
                    {label}
                  </span>
                </Link>

                {/* Tooltip (shows full label on hover when overflows) */}
                <AnimatePresence>
                  {hovered === href && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-22 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
                    >
                      {label}
                      <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-r border-t border-white/10 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="w-8 h-px bg-white/8 mb-3" />

          {isAdmin && (
            <Link
              href="/admin"
              title="Administration"
              className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl w-16 text-zinc-500 hover:text-blue-400 hover:bg-white/5 transition-all duration-200 group"
            >
              <LayoutGrid size={19} strokeWidth={1.5} />
              <span className="text-[9px] tracking-[0.15em] uppercase leading-none">Admin</span>
            </Link>
          )}

          <Link
            href="/account"
            title="Mon compte"
            className={cn(
              "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl w-16 transition-all duration-200",
              pathname === "/account"
                ? "text-white bg-white/8"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            <User size={19} strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.15em] uppercase leading-none">Compte</span>
          </Link>

          <button
            onClick={toggleCart}
            aria-label={`Panier (${count} articles)`}
            className="relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl w-16 text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <ShoppingCart size={19} strokeWidth={1.5} />
            <span className="text-[9px] tracking-[0.15em] uppercase leading-none">Panier</span>
            {count > 0 && (
              <span
                suppressHydrationWarning
                className="absolute top-2 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white leading-none"
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ─── Mobile FAB + menu (< md) ───────────────────────────────── */}
      <div className="md:hidden">
        {/* FAB button */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg shadow-blue-900/40 flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <Menu size={22} className="text-white" />
          {count > 0 && (
            <span
              suppressHydrationWarning
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-blue-600 leading-none"
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        {/* Full-screen menu overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 h-full w-70 bg-[#0a0a0a] border-l border-white/5 flex flex-col px-6 py-8"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    <span className="text-2xl font-black tracking-tighter text-white">
                      DJENEBOU<span className="text-blue-500">.</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1">
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map(({ href, label, Icon }, i) => {
                      const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                      return (
                        <motion.li
                          key={href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
                        >
                          <Link
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200",
                              active
                                ? "text-white bg-white/8"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                            <span className="font-medium text-sm tracking-wide">{label}</span>
                            {active && <ArrowRight size={14} className="ml-auto text-blue-500" />}
                          </Link>
                        </motion.li>
                      );
                    })}
                    {isAdmin && (
                      <motion.li
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + NAV_LINKS.length * 0.06, duration: 0.3 }}
                      >
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 transition-all duration-200"
                        >
                          <LayoutGrid size={20} strokeWidth={1.5} />
                          <span className="font-medium text-sm tracking-wide">Administration</span>
                        </Link>
                      </motion.li>
                    )}
                  </ul>
                </nav>

                {/* Cart CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); toggleCart(); }}
                    className="w-full flex items-center justify-between gap-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 px-4 py-4 rounded-xl transition-colors duration-200 mt-6"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={19} className="text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-300">Mon panier</span>
                    </div>
                    {count > 0 && (
                      <span
                        suppressHydrationWarning
                        className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full"
                      >
                        {count}
                      </span>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
