"use client";

import Image from "next/image";
import { ShieldCheck, Sparkles, Timer, Users, GraduationCap, Wrench, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ---- Utilities ----
function useTomorrowDMY() {
  return useMemo(() => {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const pad = (n: number) => String(n).padStart(2, "0");
    return { label: `${day}.${month}.${year}.`, dateAttr: `${year}-${pad(month)}-${pad(day)}` };
  }, []);
}

function useCountdownToTomorrow() {
  const [left, setLeft] = useState("00:00:00");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const ms = end.getTime() - now.getTime();
      const clamp0 = Math.max(0, ms);
      const hh = Math.floor(clamp0 / 3_600_000);
      const mm = Math.floor((clamp0 % 3_600_000) / 60_000);
      const ss = Math.floor((clamp0 % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setLeft(`${pad(hh)}:${pad(mm)}:${pad(ss)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

// ---- Component ----
export default function OfferHeroOneScreen({ onOpenQuiz }: { onOpenQuiz?: () => void }) {
  const tomorrow = useTomorrowDMY();
  const countdown = useCountdownToTomorrow();

  const handleCTA = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    onOpenQuiz?.();
  };

  /**
   * Layout goals
   * - Fits in *one viewport* (no scroll) on mobile and desktop
   * - Clear hierarchy: headline → price/timer → CTA → trust/what you get → image
   * - Minimal eye candy; strong contrast; big tap targets
   */
  return (
    <section
      id="cena"
      className="relative mx-auto bg-[#0B0F13] text-white overflow-hidden"
      aria-labelledby="offer-title"
    >
      {/* Soft gold radial */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-[-20%] top-[-30%] h-[160%] w-[80%] opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.10) 45%, rgba(11,15,19,0) 70%)",
            filter: "blur(12px)",
          }}
        />
      </div>

      {/* Centered grid. On md+: 2 columns; on mobile: stacked but still fits */}
      <div className="container mx-auto max-w-[1180px] px-4">
        <div
          className="grid content-center gap-6 py-6 md:grid-cols-2 md:items-center md:gap-10 md:py-10"
        >
          {/* LEFT: Copy + Price + CTA + Trust */}
          <div className="flex flex-col gap-2 md:gap-6">
            {/* Badge */}
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[12px] font-semibold text-amber-200">
              <ShieldCheck className="h-4 w-4" /> Garancija povraćaja novca
            </p>

            {/* Title */}
            <h1 id="offer-title" className="font-black leading-tight tracking-tight text-balance text-[clamp(22px,4.2vw,40px)]">
              Prva online zarada od resellinga u 30 dana <span className="text-amber-300">ILI VRAĆAMO NOVAC</span>
            </h1>

            {/* Price + timer */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <p className="text-lg font-extrabold text-zinc-300 line-through decoration-rose-500/80 decoration-4">230€</p>
                <p className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Specijalna cena: <span className="text-amber-300">60€</span>, a ako uradiš kviz: <span className="text-amber-500">50€</span>
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-zinc-300">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-1">
                  <Timer className="h-4 w-4" /> Ističe za {countdown}
                </span>
                <span>
                  Garantovano do <time dateTime={tomorrow.dateAttr}>{tomorrow.label}</time>
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-1">
              <button
                id="start-quiz"
                onClick={handleCTA}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCTA(e);
                }}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 px-6 py-4 font-display text-lg sm:text-xl font-extrabold text-black transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                aria-describedby="cta-desc"
                data-rr-action="start-quiz"
              >
                <Sparkles className="h-6 w-6" /> Počni kviz i uzmi 10€ popusta
              </button>
              <p id="cta-desc" className="text-center text-xs text-zinc-300">
                3 pitanja • 15 sekundi • odmah dobijaš popust
              </p>
            </div>

            {/* What you get (short, single line items) */}
            <ul className="grid grid-cols-1 gap-1 text-sm sm:text-[15px]">
              <Feature icon={GraduationCap} text="Vodiči i edukacija" note="(vrednost 60€)" />
              <Feature icon={Users} text="Zajednica i podrška" note="(vrednost 50€)" />
              <Feature icon={Wrench} text="Alati za prodaju" note="(vrednost 40€)" />
              <Feature icon={Gift} text="La digitale" note="(vrednost 40€)" />
              <Feature icon={Gift} text="Contactless sistem" note="(vrednost 40€)" />
              <li className="pt-1 text-right text-sm text-zinc-300">
                Ukupno: <span className="font-semibold text-white">230€</span>
              </li>
              <li className="pt-1 text-right text-sm text-zinc-300">
                Specijalna ponuda: <span className="font-semibold text-amber-300">60€</span>
              </li>
              <li className="pt-1 text-right text-sm text-zinc-300">
                Ako uradiš kviz: <span className="font-semibold text-amber-500">50€</span>
              </li>
            </ul>
          </div>

          {/* RIGHT: Image (kept compact to always fit) */}
          <figure className="relative mx-auto w-full max-w-md md:max-w-none">
            <Image
              src="/hero.png"
              alt="RealReselling program box"
              width={1200}
              height={900}
              className="mx-auto h-auto w-full rounded-xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.45)] max-h-[34vh] md:max-h-[52vh]"
              priority
            />
            <figcaption className="sr-only">Vizual programa</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

// ---- Small helpers ----
function Feature({ icon: Icon, text, note }: { icon: LucideIcon; text: string; note?: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-zinc-200">
        <span className="font-medium text-white">{text}</span> {note && <span className="text-zinc-400">{note}</span>}
      </p>
    </li>
  );
}
