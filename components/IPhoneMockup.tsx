"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";
import Image from "next/image";

/* ─── Step 1: Marketplace Listing ─────────────────────────────── */
function ListingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 pt-[48px] bg-[#fafafa]"
    >
      {/* App header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-neutral-200/80">
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-neutral-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="text-[12px] font-semibold text-neutral-800 tracking-tight">
          Oglas
        </span>
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>

      {/* Product image */}
      <div className="relative w-full h-[160px] bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/nikeair.png"
            alt="Nike Air Max"
            width={200}
            height={160}
            className="object-contain drop-shadow-md"
            priority
          />
        </motion.div>
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
          1 / 4
        </div>
      </div>

      {/* Product info */}
      <div className="bg-white px-4 pt-3 pb-2">
        <h3 className="text-[14px] font-bold text-neutral-900 leading-tight">
          Nike Air Max 90
        </h3>
        <p className="text-[10px] text-neutral-500 mt-1">
          Odlično stanje &middot; Veličina 43
        </p>
        <div className="mt-2">
          <span className="text-[18px] font-extrabold text-neutral-900 tracking-tight">
            5.500{" "}
            <span className="text-[12px] font-semibold text-neutral-500">
              RSD
            </span>
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white px-4 py-1.5 border-t border-neutral-100 flex items-center gap-1">
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-neutral-400"
          fill="currentColor"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span className="text-[10px] text-neutral-500">Beograd</span>
      </div>

      {/* CTA */}
      <div className="px-4 mt-2.5">
        <div className="w-full flex items-center justify-center gap-1.5 bg-amber-500 text-white text-[12px] font-semibold py-2 rounded-xl shadow-sm">
          <MessageCircle className="w-3.5 h-3.5" />
          Pošalji poruku
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 2: iOS Notification ────────────────────────────────── */
function NotificationBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.85, transition: { duration: 0.3 } }}
      transition={{ type: "spring", damping: 26, stiffness: 320 }}
      className="absolute top-[44px] left-2.5 right-2.5 z-50"
      style={{ transformOrigin: "top center" }}
    >
      <div className="bg-white/[0.97] backdrop-blur-xl rounded-[18px] px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-2.5">
          {/* App icon */}
          <div className="flex-shrink-0 w-[34px] h-[34px] rounded-[8px] bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-[9px] font-bold tracking-tight">
              KP
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-neutral-700">
                KupujemProdajem
              </span>
              <span className="text-[9px] text-neutral-400">sada</span>
            </div>
            <p className="text-[11px] text-neutral-600 font-medium mt-0.5 leading-tight">
              Nova poruka
            </p>
            <p className="text-[10px] text-neutral-500 leading-tight">
              &quot;Pozdrav, može za 5.000?&quot;
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 3: Sold / Profit Screen ────────────────────────────── */
function SoldScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 pt-[48px] bg-gradient-to-b from-[#080c10] via-[#0b1018] to-[#0d1219] flex flex-col items-center justify-center px-5"
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.3,
          type: "spring",
          damping: 14,
          stiffness: 200,
        }}
        className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.25)]"
      >
        <Check className="w-7 h-7 text-white" strokeWidth={3} />
      </motion.div>

      {/* PRODATO */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-3 text-white font-display text-[22px] tracking-wider"
      >
        PRODATO
      </motion.p>

      {/* Profit card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
        className="mt-5 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3.5 space-y-2"
      >
        <div className="flex justify-between text-[12px]">
          <span className="text-neutral-500">Kupljeno</span>
          <span className="text-neutral-300 font-medium">2.500 RSD</span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-neutral-500">Prodato</span>
          <span className="text-neutral-300 font-medium">5.000 RSD</span>
        </div>
        <div className="h-px bg-white/[0.08]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="flex justify-between text-[14px]"
        >
          <span className="text-amber-400 font-semibold">Profit</span>
          <span className="text-amber-400 font-bold">+2.500 RSD</span>
        </motion.div>
      </motion.div>

      {/* Time badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.4 }}
        className="mt-3 text-[11px] text-neutral-500 flex items-center gap-1"
      >
        <span className="text-amber-500">&#9889;</span>
        Za manje od 72h
      </motion.p>
    </motion.div>
  );
}

/* ─── Main: iPhone 16 Pro Frame + Animation ───────────────────── */
export default function IPhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: "all" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(() => { if (!cancelled) fn(); }, ms));
    };

    const runCycle = () => {
      if (cancelled) return;
      schedule(() => setStep(1), 0);
      schedule(() => setStep(2), 3600);
      schedule(() => setStep(3), 6100);
      schedule(() => {
        setStep(0);
        schedule(runCycle, 900);
      }, 10500);
    };

    schedule(runCycle, 500);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isInView]);

  return (
    <div ref={ref} className="flex justify-center my-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Ambient glow */}
        <div className="absolute -inset-16 rounded-full bg-amber-500/[0.06] blur-3xl pointer-events-none" />

        {/* ── Phone body ── */}
        <div
          className="relative select-none"
          style={{ width: 272, height: 558 }}
        >
          {/* Titanium outer frame */}
          <div className="absolute inset-0 rounded-[52px] bg-gradient-to-b from-[#404044] via-[#2e2e32] to-[#212124] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-[1px] rounded-[51px] bg-gradient-to-b from-[#4a4a4e] via-[#313134] to-[#232326]" />
          </div>

          {/* Side buttons */}
          <div className="absolute -left-[2.5px] top-[106px] w-[3px] h-[22px] rounded-l-full bg-[#3d3d40]" />
          <div className="absolute -left-[2.5px] top-[148px] w-[3px] h-[34px] rounded-l-full bg-[#3d3d40]" />
          <div className="absolute -left-[2.5px] top-[194px] w-[3px] h-[34px] rounded-l-full bg-[#3d3d40]" />
          <div className="absolute -right-[2.5px] top-[164px] w-[3px] h-[54px] rounded-r-full bg-[#3d3d40]" />

          {/* ── Screen ── */}
          <div className="absolute inset-[7px] rounded-[45px] bg-black overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 z-40 w-[94px] h-[29px] bg-black rounded-full">
              <div className="absolute right-[19px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-[#111125]">
                <div className="absolute inset-[2.5px] rounded-full bg-[#0a0a16]" />
              </div>
            </div>

            {/* Status bar — sits above content with gradient backdrop */}
            <div className="absolute top-0 left-0 right-0 z-30 h-[48px]">
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
              <div className="relative flex items-center justify-between px-7 pt-[15px]">
                <span
                  className="text-white text-[10px] font-semibold leading-none"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  9:41
                </span>
                <div className="flex items-center gap-[4px]">
                  {/* Signal */}
                  <svg
                    width="12"
                    height="9"
                    viewBox="0 0 16 12"
                    fill="white"
                  >
                    <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                    <rect x="4.2" y="5.5" width="2.5" height="6.5" rx="0.5" />
                    <rect x="8.4" y="3" width="2.5" height="9" rx="0.5" />
                    <rect x="12.6" y="0" width="2.5" height="12" rx="0.5" />
                  </svg>
                  {/* WiFi */}
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 16 14"
                    fill="white"
                  >
                    <circle cx="8" cy="12" r="1.4" />
                    <path d="M4.5 9.2a5 5 0 017 0" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    <path d="M2 6.5a8.5 8.5 0 0112 0" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                  {/* Battery */}
                  <div className="relative" style={{ width: 18, height: 9 }}>
                    <div className="absolute inset-0 border border-white/50 rounded-[2px]">
                      <div className="absolute inset-[1.5px] right-auto w-[10px] bg-white rounded-[0.5px]" />
                    </div>
                    <div className="absolute -right-[1px] top-[2px] w-[1px] h-[5px] bg-white/40 rounded-r-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Animated content ── */}
            <div className="relative w-full h-full">
              <AnimatePresence>
                {step >= 1 && step < 3 && (
                  <ListingScreen key="listing" />
                )}
                {step === 3 && <SoldScreen key="sold" />}
              </AnimatePresence>

              <AnimatePresence>
                {step === 2 && <NotificationBanner key="notif" />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
