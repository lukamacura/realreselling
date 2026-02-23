"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  Variants,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  useReducedMotion,
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
  Flame,
  type LucideIcon,
} from "lucide-react";
import {
  Users,
  Wifi,
  GraduationCap,
  Package,
  ListChecks,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

function useTypewriter({
  text,
  speed = 18,
  startDelay = 120,
  enabled = true,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
}) {
  const [out, setOut] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setOut(text);
      setDone(true);
      return;
    }
    let i = 0;
    let cancelled = false;
    let typeTimer: ReturnType<typeof setTimeout> | undefined;
    const kick = setTimeout(function tick() {
      if (cancelled) return;
      i += 1;
      setOut(text.slice(0, i));
      if (i < text.length) {
        typeTimer = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(kick);
      if (typeTimer) clearTimeout(typeTimer);
    };
  }, [text, speed, startDelay, enabled]);

  return { out, done } as const;
}

const PACKAGE_ITEMS: { icon: LucideIcon; label: string; sub: string | null }[] = [
  {
    icon: Users,
    label: "Mentor i zajednica",
    sub: "Nikad više ne pogrešiš sam",
  },
  {
    icon: GraduationCap,
    label: "Lekcije korak po korak",
    sub: "Kako najlakše doći do kupaca",
  },
  {
    icon: Package,
    label: "Magacin po nabavnim cenama",
    sub: "Najniže cene proizvoda",
  },
];

const BONUS_ITEMS: { icon: LucideIcon; label: string; sub: string | null }[] = [
  {
    icon: Wifi,
    label: "Contactless sistem",
    sub: "Roba ide sama, ti brojiš pare",
  },
  {
    icon: ListChecks,
    label: "Spisak koraka redom",
    sub: "Ne možeš pogrešiti",
  },
  {
    icon: CalendarDays,
    label: "Live pozivi sa mentorom",
    sub: "Imaš problem? Rešiš iste večeri",
  },
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

/* ── Spots countdown ── */
const SPOTS_START_DATE = new Date("2026-02-23");
const SPOTS_INITIAL = 27;

function useSpots() {
  const base = useMemo(() => {
    const diffDays = Math.floor(
      (Date.now() - SPOTS_START_DATE.getTime()) / 86_400_000
    );
    return Math.max(SPOTS_INITIAL - Math.floor(diffDays / 2), 2);
  }, []);

  const [spots, setSpots] = useState(base);
  const [dropping, setDropping] = useState(false);

  useEffect(() => {
    const LS_KEY = "rr_spots_seen";
    const today = new Date().toDateString();
    if (localStorage.getItem(LS_KEY) === today) {
      setSpots(base - 1);
      return;
    }
    setSpots(base);
    const t = setTimeout(() => {
      setDropping(true);
      setTimeout(() => {
        setSpots(base - 1);
        localStorage.setItem(LS_KEY, today);
        setDropping(false);
      }, 400);
    }, 1800);
    return () => clearTimeout(t);
  }, [base]);

  return { spots, dropping };
}

/* ── Swipe-to-buy constants ── */
const THUMB_W = 56;
const TRACK_PAD = 4;

export default function PostaniClanPage() {
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const tomorrow = useTomorrowDMY();
  const { spots, dropping } = useSpots();
  const reduced = useReducedMotion();
  const typedHeadline = useMemo(() => "od resellinga u 30 dana ILI VRAĆAMO NOVAC", []);
  const { out: typedOut, done: typedDone } = useTypewriter({
    text: typedHeadline,
    speed: 18,
    startDelay: 800,
    enabled: !reduced && !loading,
  });

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
              <h1 className="mb-2 font-display text-[36px] leading-[1.05] tracking-tight text-white md:mb-6 md:text-[64px]">
                <span className="m-0 block font-display text-[40px] leading-tight text-brand-gold md:text-[64px]">
                  💸 Prva online zarada
                  <span className="ml-2 text-white" aria-label={typedHeadline} aria-live="polite">
                    {typedOut}
                    {!typedDone && !reduced && (
                      <motion.span
                        aria-hidden
                        className="inline-block w-[0.5ch] translate-y-[0.05em]"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                      >
                        |
                      </motion.span>
                    )}
                  </span>
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
                Kako sam sa 23 godine, platom od 45.000 dinara i nulom na kraju meseca,
                napravio novac uz Real Reselling.
              </p>

              {/* Spots badge */}
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span className="text-sm text-neutral-300">
                    Ostalo{" "}
                    <span className="overflow-hidden inline-block align-middle" style={{ height: "1.25em" }}>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={spots}
                          initial={{ y: dropping ? 16 : 0, opacity: dropping ? 0 : 1 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -16, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="inline-block font-bold text-red-400"
                        >
                          {spots}
                        </motion.span>
                      </AnimatePresence>
                    </span>{" "}
                    mesta
                  </span>
                </div>
              </div>
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
              {/* Paketi */}
              <p className="text-neutral-400 text-base mb-4 uppercase tracking-wider font-medium">
                Šta dobijaš u paketu
              </p>
              <div className="grid grid-cols-3 gap-3">
                {PACKAGE_ITEMS.map(({ icon: Icon, label, sub }, i) => (
                  <motion.div
                    key={i}
                    className="group rounded-2xl border border-white/10 bg-[#12171E]/80 p-4 sm:p-5 backdrop-blur text-center transition-colors duration-300 hover:border-amber-500/30 hover:bg-amber-500/5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  >
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 transition-colors duration-300 group-hover:from-amber-500/25 group-hover:to-amber-600/10">
                      <Icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <span className="text-white text-sm font-medium leading-tight block">
                      {label}
                    </span>
                    {sub && (
                      <span className="text-neutral-500 text-xs leading-tight mt-1 block">
                        {sub}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Doživotan pristup — compact banner */}
              <motion.div
                className="mt-3 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <BadgeCheck className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-amber-300 text-sm font-medium">
                  Doživotan pristup svemu navedenom
                </span>
              </motion.div>

              {/* Bonusi */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <p className="text-neutral-400 text-base mb-4 uppercase tracking-wider font-medium">
                  + Bonusi
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {BONUS_ITEMS.map(({ icon: Icon, label, sub }, i) => (
                    <motion.div
                      key={i}
                      className="group rounded-2xl border border-white/10 bg-[#12171E]/80 p-4 sm:p-5 backdrop-blur text-center transition-colors duration-300 hover:border-amber-500/30 hover:bg-amber-500/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                    >
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 transition-colors duration-300 group-hover:from-amber-500/25 group-hover:to-amber-600/10">
                        <Icon className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="text-white text-sm font-medium leading-tight block">
                        {label}
                      </span>
                      {sub && (
                        <span className="text-neutral-500 text-xs leading-tight mt-1 block">
                          {sub}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Spots urgency */}
            <motion.div
              className="mt-10 mx-auto max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <div className="rounded-2xl border border-red-500/25 bg-red-500/8 px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <Flame className="h-5 w-5 text-red-400 shrink-0" />
                  <span className="text-neutral-300 text-sm font-medium">
                    Preostalo slobodnih mesta:
                  </span>
                  <span className="overflow-hidden inline-flex items-center" style={{ height: "2rem" }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={spots}
                        initial={{ y: dropping ? 24 : 0, opacity: dropping ? 0 : 1 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -24, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
                        className="inline-block text-2xl font-bold text-red-400 font-display"
                      >
                        {spots}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: `${((spots + 1) / SPOTS_INITIAL) * 100}%` }}
                    animate={{ width: `${(spots / SPOTS_INITIAL) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500 text-center">
                  od {SPOTS_INITIAL} ukupnih mesta
                </p>
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
              {/* Spots mini-line */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
                <span className="text-neutral-400 text-xs">
                  Ostalo{" "}
                  <span className="overflow-hidden inline-block align-middle" style={{ height: "1em" }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={spots}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-block font-bold text-red-400"
                      >
                        {spots}
                      </motion.span>
                    </AnimatePresence>
                  </span>{" "}
                  mesta
                </span>
              </div>
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
