import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";

/**
 * PriceComparison (auto-rotating)
 * - Svakih 3s menja par (slika + cene) sa lepom tranzicijom (bez naslova proizvoda)
 * - 4 default proizvoda: /p1.png, /p2.png, /p3.png, /p4.png
 * - Možeš proslediti svoj niz proizvoda, interval i ostale propse
 */

export type PriceItem = {
  image: string; // npr. "/p1.png"
  priceRegular: number;
  priceWithGroup: number;
};

export type PriceComparisonProps = {
  products?: PriceItem[]; // Ako ne proslediš, koristi default p1..p4
  currency?: string; // npr. "EUR" ili "EUR"
  groupUrl?: string; // opcioni link ka "grupi" (ako želiš CTA)
  className?: string;
  featuresOutside?: string[]; // benefiti van grupe
  featuresWithGroup?: string[]; // benefiti sa grupom
  intervalMs?: number; // default 3000ms
};

const fmt = (v: number, currency = "EUR") =>
  new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "EUR" ? 0 : 2,
  }).format(v);

const badge = (label: string, style = "bg-amber-400 text-black") => (
  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${style}`}>
    {label}
  </span>
);

const Li: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-2">
    <Check className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{text}</span>
  </li>
);

const fadeTransition: Transition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };
const fadeMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: fadeTransition,
};

const PriceComparison: React.FC<PriceComparisonProps> = ({
  products,
  currency = "EUR",
  groupUrl = "#cena",
  className = "",
  featuresOutside = [
    "Plaćaš puno više",
    "Sporija dostava",
    "Nema podrške",
  ],
  featuresWithGroup = [
    "Niža nabavna cena",
    "Prioritetna dostupnost",
    "Predlozi proizvoda sa većom maržom",
  ],
  intervalMs = 3000,
}) => {
  const data: PriceItem[] = useMemo(
    () =>
      products?.length
        ? products
        : [
            { image: "/p1.png", priceRegular: 98000, priceWithGroup: 89900 },
            { image: "/p2.png", priceRegular: 125000, priceWithGroup: 112990 },
            { image: "/p3.png", priceRegular: 45990, priceWithGroup: 38990 },
            { image: "/p4.png", priceRegular: 399, priceWithGroup: 355 }, // primer za EUR ako promeniš currency
          ],
    [products]
  );

  const [idx, setIdx] = useState(0);
  const current = data[idx] ?? data[0];
  const saving = Math.max(0, current.priceRegular - current.priceWithGroup);
  const savingPct = current.priceRegular > 0 ? Math.round((saving / current.priceRegular) * 100) : 0;

  useEffect(() => {
    if (data.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % data.length);
    }, Math.max(1200, intervalMs));
    return () => clearInterval(id);
  }, [data.length, intervalMs]);

  return (
    <section className={`w-full bg-[#0B0F13] text-white py-12 ${className}`}>
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-8 text-center">
          {/* Bez naslova proizvoda: generalni naslov sekcije */}
          <h2 className="font-display text-3xl md:text-5xl font-bold">Pogledajte koliko ušteđujete ako pristupite grupi</h2>
          <p className="mt-2 text-white/70">Van grupe vs sa grupom</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Van grupe */}
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#12171E] p-6">
            {/* Image wrapper sa fade animacijom */}
            <div className="relative my-4 mx-auto w-[30%] aspect-[1.8/1]">{/* kontrolisan prostor */}
              <AnimatePresence mode="wait">
                <motion.div key={`out-${idx}`} className="absolute inset-0" {...fadeMotion}>
                  <Image
                    className="rounded-xl object-contain"
                    src={current.image}
                    alt="Product"
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cena u radnji</h3>
            </div>

            <div className="mb-6 flex items-end gap-2 min-h-[2.75rem]">
              <AnimatePresence mode="wait">
                <motion.span key={`out-price-${idx}`} className="text-4xl font-bold inline-block" {...fadeMotion}>
                  {fmt(current.priceRegular, currency)}
                </motion.span>
              </AnimatePresence>
            </div>

            <ul className="space-y-2 text-white/90">
              {featuresOutside.map((t) => (
                <Li key={t} text={t} />
              ))}
            </ul>

          

          </div>

          {/* Sa grupom */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-[#1A212A] p-6 ring-1 ring-amber-400/20">
            {/* Image wrapper sa fade animacijom */}
            <div className="relative my-4 mx-auto w-[30%] aspect-[1.8/1]">
              <AnimatePresence mode="wait">
                <motion.div key={`in-${idx}`} className="absolute inset-0" {...fadeMotion}>
                  <Image
                    className="rounded-xl object-contain"
                    src={current.image}
                    alt="Product"
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ako uđeš u program</h3>
              {saving > 0 && badge(`Ušteda ${fmt(saving, currency)} · ${savingPct}%`)}
            </div>

            <div className="mb-2 flex items-end gap-3 min-h-[2.75rem]">
              <AnimatePresence mode="wait">
                <motion.span key={`in-price-${idx}`} className="text-4xl font-bold text-amber-300 inline-block" {...fadeMotion}>
                  {fmt(current.priceWithGroup, currency)}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/50 line-through">{fmt(current.priceRegular, currency)}</span>
            </div>

            <ul className="space-y-2 text-white/90">
              {featuresWithGroup.map((t) => (
                <Li key={t} text={t} />
              ))}
            </ul>

            {groupUrl ? (
              <a
                href={groupUrl}
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl font-display text-xl bg-amber-400 text-black px-4 py-3 font-semibold hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Pridruži se grupi
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                disabled
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-white/70 px-4 py-3 font-medium cursor-not-allowed"
              >
                Pridruži se grupi (uskoro)
              </button>
            )}

            <p className="mt-4 text-xs text-white/60">
              Cena u grupi dostupna je kroz zajedničku nabavku / dogovorene uslove.
            </p>
          </div>
        </div>

     
      </div>
    </section>
  );
};

export default PriceComparison;
