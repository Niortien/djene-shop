import Link from "next/link";
import { Globe, MessageCircle, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 mb-5">
              <span className="text-2xl font-black tracking-tighter text-white">
                DJENEBOU
              </span>
              <span className="text-2xl font-black text-blue-500">.</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              La marque streetwear premium pour les esprits libres. Style,
              confort et authenticité — Made in Dakar.
            </p>
            <div className="flex gap-3 mt-6">
              {[Globe, MessageCircle, AtSign].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-full bg-zinc-900 text-zinc-500 hover:text-white hover:bg-blue-600 transition-all duration-300"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold tracking-[0.2em] uppercase text-xs mb-5">
              Boutique
            </h3>
            <ul className="space-y-3">
              {[
                "Tous les produits",
                "Joggings",
                "Ensembles",
                "Hoodies",
                "T-Shirts",
                "Nouveautés",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/shop"
                    className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold tracking-[0.2em] uppercase text-xs mb-5">
              Informations
            </h3>
            <ul className="space-y-3">
              {[
                { label: "À propos", href: "/about" },
                { label: "Guide des tailles", href: "/size-guide" },
                { label: "Livraison", href: "/faq#livraison" },
                { label: "Retours", href: "/faq#retours" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-500 hover:text-zinc-200 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold tracking-[0.2em] uppercase text-xs mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <a href="https://wa.me/221000000000" className="hover:text-zinc-200 transition-colors">
                  WhatsApp: +221 XX XXX XX XX
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@djene-shop.com"
                  className="hover:text-zinc-200 transition-colors"
                >
                  contact@djene-shop.com
                </a>
              </li>
              <li className="pt-3 border-t border-white/5 text-xs text-zinc-600 leading-relaxed">
                Livraison en 24–48h
                <br />
                Dakar & banlieue
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 text-xs text-zinc-700">
          <p>© 2025 Djenebou Shop. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
