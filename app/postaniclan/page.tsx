"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StorySection from "@/components/StorySection";
import {
  Sparkles,
  CheckCircle2,
  Gift,
  Clock,
  Shield,
  ArrowRight,
  Lock,
  type LucideIcon,
  IdCard,
} from "lucide-react";
import { BookOpen, Users, Wrench, Smartphone, Wifi } from "lucide-react";

const VALUE_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: BookOpen, label: "Vodiči i edukacija" },
  { icon: Users, label: "Zajednica i podrška" },
  { icon: Wrench, label: "Alati za prodaju" },
  { icon: Smartphone, label: "La digitale" },
  { icon: Wifi, label: "Contactless sistem" },
  { icon: IdCard, label: "Doživotan pristup" },
];

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

/* ── Swipe-to-buy constants ── */
const THUMB_W = 56;
const TRACK_PAD = 4;

export default function PostaniClanPage() {
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const tomorrow = useTomorrowDMY();

  /* ── Swipe-to-buy state ── */
  const [showFixedBar, setShowFixedBar] = useState(false);
  const [ctaInView, setCtaInView] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [maxDrag, setMaxDrag] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const maxDragRef = useRef(0);
  const x = useMotionValue(0);

  const swipeBarVisible = showFixedBar && !ctaInView;

  maxDragRef.current = maxDrag;

  /* Derived motion values for the swipe track */
  const bgWidth = useTransform(x, (v) => v + THUMB_W + TRACK_PAD * 2);
  const textOpacity = useTransform(x, (v) => {
    const m = maxDragRef.current;
    return m ? Math.max(1 - v / (m * 0.4), 0) : 1;
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  /* Show fixed bar after scrolling past the hero */
  useEffect(() => {
    const onScroll = () => setShowFixedBar(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Hide swipe bar when the static CTA section is in view */
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCtaInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Compute max drag distance on mount & resize */
  useEffect(() => {
    const compute = () => {
      if (trackRef.current) {
        setMaxDrag(trackRef.current.offsetWidth - THUMB_W - TRACK_PAD * 2);
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [swipeBarVisible]);

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
      setSwiped(false);
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  }

  function handleDragEnd() {
    if (swiped || checkoutLoading) return;
    const m = maxDragRef.current;
    if (x.get() > m * 0.75) {
      animate(x, m, { type: "spring", stiffness: 300, damping: 30 });
      setSwiped(true);
      handleCheckout();
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0B0F13] text-white pb-28">
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
                Od Minimalca do{" "}
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Slobode
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
                Kako sam sa 23 godine, platom od 45.000 dinara i nulom na kraju meseca,
                napravio izlaz uz Real Reselling.
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
        <StorySection hidePopup={swipeBarVisible} />

        {/* Final CTA Section - Value Stack */}
        <section ref={ctaRef} className="bg-brand-dark py-16 md:py-24 mx-auto">
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
              className="mt-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-neutral-400 text-base mb-6 uppercase tracking-wider font-medium">
                Šta dobijaš u paketu
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {VALUE_ITEMS.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={i}
                    className="group rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 sm:p-6 backdrop-blur text-center transition-colors duration-300 hover:border-amber-500/30 hover:bg-amber-500/5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 transition-colors duration-300 group-hover:from-amber-500/25 group-hover:to-amber-600/10">
                      <Icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-white text-sm sm:text-base font-medium leading-tight">
                      {label}
                    </span>
                  </motion.div>
                ))}
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
                  {checkoutLoading ? "Učitavanje..." : "Želim program za 39€"}
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

      {/* ── Fixed Bottom Swipe-to-Buy ── */}
      <AnimatePresence>
        {swipeBarVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-8 bg-gradient-to-t from-[#0B0F13] via-[#0B0F13]/98 to-transparent pointer-events-none"
          >
            <div className="mx-auto max-w-lg pointer-events-auto">
              {/* Swipe Track */}
              <div
                ref={trackRef}
                className="relative h-[64px] rounded-full bg-[#1a1f27] border border-amber-500/20 overflow-hidden shadow-[0_0_30px_rgba(212,160,32,.15)]"
              >
                {/* Progress fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-500/25"
                  style={{ width: bgWidth }}
                />

                {/* Center text */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{ opacity: textOpacity }}
                >
                  <span className="text-amber-400/70 font-medium text-[15px] tracking-wide pl-12">
                    Prevuci za kupovinu &bull; 39&euro;
                  </span>
                </motion.div>

                {/* Draggable Thumb */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: maxDrag }}
                  dragElastic={0}
                  dragMomentum={false}
                  style={{ x }}
                  onDragEnd={handleDragEnd}
                  whileTap={{ scale: 1.05 }}
                  className={`absolute left-1 top-1 h-[calc(100%-8px)] w-[56px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-colors duration-300 ${
                    swiped
                      ? "bg-gradient-to-b from-green-400 to-green-600"
                      : "bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_4px_20px_rgba(212,160,32,.5)]"
                  }`}
                >
                  {swiped ? (
                    <CheckCircle2 className="h-6 w-6 text-black" />
                  ) : (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-6 w-6 text-black" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Trust line */}
              <div className="flex items-center justify-center gap-2 mt-2.5 mb-1">
                <Lock className="h-3 w-3 text-neutral-500" />
                <span className="text-neutral-500 text-xs">
                  Sigurno plaćanje &bull; Garancija povrata novca
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
