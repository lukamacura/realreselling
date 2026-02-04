"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StorySection from "@/components/StorySection";
import { Sparkles, CheckCircle2, Gift, Clock, Shield } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function useTomorrowDMY() {
  return useMemo(() => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const label = `${day}.${month}.${year}.`;
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateAttr = `${year}-${pad(month)}-${pad(day)}`;
    return { label, dateAttr };
  }, []);
}

export default function PostaniClanPage() {
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const tomorrow = useTomorrowDMY();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutLoading(false);
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0B0F13] text-white">
        {/* Hero Section */}
        <motion.section
          className="relative overflow-hidden pt-32 pb-16"
          variants={container}
          initial="hidden"
          animate={loading ? "hidden" : "visible"}
        >
          <div className="container mx-auto max-w-[1200px] px-4">
            <motion.div variants={item} className="text-center">
              <span className="inline-block text-amber-500 font-medium text-sm uppercase tracking-wider mb-4">
                Moja Priča
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
                Od 800 Dinara do{" "}
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Slobode
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
                Kako sam sa 17 godina, bez posla i sa 800 dinara u džepu,
                promenio svoju situaciju uz Real Reselling.
              </p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              variants={item}
              className="mt-12 flex justify-center"
            >
              <div className="flex flex-col items-center gap-2 text-neutral-500">
                <span className="text-sm">Pročitaj priču</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-10 rounded-full border-2 border-neutral-600 flex justify-center pt-2"
                >
                  <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Story Section */}
        <StorySection />

        {/* Final CTA Section - Value Stack */}
        <section className="bg-brand-dark py-16 md:py-24 mx-auto">
          <div className="container mx-auto max-w-[980px] px-4 text-center">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display leading-tight text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Spreman da Napišeš
                <br />
                <span className="inline-block mt-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Svoju Priču?
                </span>
              </h2>
            </motion.div>

            {/* Value Stack */}
            <motion.div
              className="mt-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="rounded-2xl border border-amber-500/30 bg-[#12171E]/80 p-6 sm:p-8 backdrop-blur">
                <div className="space-y-4">
                  {[
                    "Kompletna edukacija od A do Ž",
                    "Pristup zatvorenoj zajednici",
                    "Copy-paste šabloni za oglase",
                    "Direktna podrška kad zapneš",
                    "Doživotni pristup svim ažuriranjima",
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 text-left"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <span className="text-white text-lg">{text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Price Section */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-neutral-400 text-lg mb-2">Sve ovo bi koštalo</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl sm:text-5xl text-neutral-500 line-through font-display">
                  50€
                </span>
                <span className="text-amber-500 font-bold text-xl">→</span>
                <span className="text-5xl sm:text-6xl md:text-7xl font-display text-amber-400">
                  39€
                </span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2">
                <Gift className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">
                  Specijalna ponuda za čitaoce
                </span>
              </div>
            </motion.div>

            {/* CTA Button with Shine Animation */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="group relative mx-auto flex items-center justify-center font-display w-full max-w-[520px] rounded-[28px] bg-gradient-to-b from-amber-400 to-amber-600 px-8 py-6 text-xl font-bold text-black shadow-[0_10px_40px_rgba(212,160,32,.4)] transition-all duration-300 hover:shadow-[0_15px_50px_rgba(212,160,32,.6)] hover:scale-[1.02] active:scale-[.98] overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 overflow-hidden rounded-[28px]">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                </span>

                {/* Pulsing glow */}
                <span className="absolute inset-0 rounded-[28px] animate-pulse bg-gradient-to-b from-amber-300/20 to-transparent" />

                {/* Button content */}
                <span className="relative flex items-center gap-3">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                  {checkoutLoading ? "Učitavanje..." : "Započni Svoju Priču za 39€"}
                </span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-6 text-neutral-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Garancija povrata novca</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>
                  Ponuda važi do{" "}
                  <time dateTime={tomorrow.dateAttr} className="text-amber-400">
                    {tomorrow.label}
                  </time>
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
