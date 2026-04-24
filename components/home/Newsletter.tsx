"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Adresse email invalide.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    // Simulate — replace with real API call when backend newsletter endpoint exists
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  return (
    <section className="relative py-28 overflow-hidden bg-[#080808]">
      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-blue-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-100 h-100 bg-purple-700/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={13} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
              Exclusivités & drops
            </span>
          </div>

          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-white leading-none mb-5">
            RESTE
            <br />
            <span className="text-blue-500">DANS LA BOUCLE</span>
          </h2>

          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Sois le premier informé des nouvelles collections, drops limités et
            offres exclusives. Aucun spam — promis.
          </p>

          {/* Form */}
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl mb-1">
                    Bienvenue dans la famille !
                  </div>
                  <div className="text-zinc-400 text-sm">
                    Tu recevras nos prochains drops en avant-première.
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 focus:border-blue-500 rounded-full px-6 py-4 text-white placeholder-zinc-600 text-sm outline-none transition-colors duration-200"
                    disabled={status === "loading"}
                  />
                  {errorMsg && (
                    <p className="absolute -bottom-5 left-4 text-xs text-red-400">
                      {errorMsg}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold px-7 py-4 rounded-full text-sm tracking-wide transition-all duration-300 whitespace-nowrap group"
                >
                  {status === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      S&apos;inscrire
                      <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social proof micro-text */}
          <p className="mt-10 text-zinc-700 text-xs">
            Rejoins{" "}
            <span className="text-zinc-400 font-semibold">500+ abonnés</span>{" "}
            · Désinscription en 1 clic · Aucun spam
          </p>
        </motion.div>
      </div>
    </section>
  );
}
