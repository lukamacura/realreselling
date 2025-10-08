"use client";

import Image from "next/image";
import {Zap, Notebook, ShieldCheck, Sparkles, GraduationCap, Users, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import Collapsible from "@/components/OfferShrink";

/**
 * OfferHero
 *
 * A responsive hero/offer card matching the provided mockup.
 * - Dark brand background with warm gold accents
 * - Left: headline + features/bonuses + pricing
 * - Right: hero.png product mockup
 *
 * Requirements: Tailwind CSS, Next.js Image, lucide-react
 */

function useTomorrowDMY() {
  return useMemo(() => {
    const now = new Date();
    // +1 dan
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // lokalna ponoć
    // label: D.M.YYYY.
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const label = `${day}.${month}.${year}.`;

    // HTML <time> sme da ima samo datum (YYYY-MM-DD)
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateAttr = `${year}-${pad(month)}-${pad(day)}`;

    return { label, dateAttr }; 
  }, []);
}

export default function OfferHero({ onOpenQuiz }: { onOpenQuiz?: () => void }) {
    const tomorrow = useTomorrowDMY();

  return (
    <section id="cena" className="mx-auto relative overflow-hidden bg-[#0B0F13] text-white">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[-20%] h-[140%] w-[70%] opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="container mx-auto max-w-[1200px] px-4 py-10 sm:py-14">
        <div className="grid items-center">
          {/* LEFT CARD */}
          <div className="relative rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6 md:p-7">
            {/* Card inner top bar */}
            <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

            {/* Headline */}
            <h2 className="mt-2 text-center text-xl font-extrabold leading-tight text-amber-300 underline underline-offset-[6px] decoration-amber-400/80 sm:text-2xl">
              REALRESELLING
            </h2>
            <h3 className="mt-3 text-center text-2xl font-extrabold leading-snug sm:text-3xl md:text-4xl">
              Prva online zarada od resellinga u 30 dana
              <br />
              <span className="text-amber-300">ILI VRAĆAMO NOVAC</span>
            </h3>

            {/* Mockup image (mobile only) */}
              <Image
                src="/hero.png"
                alt="RealReselling program box"
                width={1800}
                height={1000}
                className="h-auto w-[600px] rounded-md mx-auto "
                priority
              />
            

            <Collapsible title="Šta sve dobijaš (regularna cena: 150€)" defaultOpen={false} >
              <ul className="mt-2 space-y-3 rounded-xl text-sm sm:text-base bg-[#0E1319] p-4 ring-1 ring-white/5">
                <Feature icon={GraduationCap} text="Vodiči i edukacija" priceNote="(Regularna cena: 60€)" />
                <Feature icon={Users} text="Zajednica i podrška" priceNote="(Regularna cena: 50€)" />
                <Feature icon={Wrench} text="Alati za prodaju" priceNote="(Regularna cena: 40€)" />
                <li className="pt-1 text-right text-sm text-zinc-300">
                  Ukupno: <span className="font-semibold text-white">150€</span>
                </li>
              </ul>
            </Collapsible>

            {/* Bonusi */}
            <Collapsible title="Bonusi (regularna cena: 80€)" defaultOpen={false}>
              <div className="mt-2 space-y-3 rounded-xl text-sm sm:text-base bg-[#0E1319] p-4 ring-1 ring-white/5">
                <Bonus icon={Zap} text="La Digitale - Neko želi da kupi Netflix, ti ga kupiš po najnižoj ceni, i njemu prodaš po višoj." value="(Regularna cena: 40 €)" />
                <Bonus icon={Notebook} text="Contactless opcija - mi šaljemo proizvode direktno kupcima, ti samo ubaciš profiti" value="(Regularna cena: 40 €)" />
                <Bonus icon={ShieldCheck} text="Pravo na povraćaj novca ili zamenu proizvoda u bilo kojoj situaciji" />
                <div className="pt-1 text-right text-sm text-zinc-300">
                  Ukupno: <span className="font-semibold text-white">80€</span>
                </div>
              </div>
            </Collapsible>

            {/* Pricing */}
            <div className="mt-6 space-y-2 text-center">
              <p className="text-lg font-extrabold text-zinc-300 line-through decoration-rose-500/80 decoration-4">
                Regularna: 230€
              </p>
              <p className="text-2xl font-black tracking-tight text-amber-300 sm:text-3xl">
                Specijalna ponuda: <span className="text-white">60€</span>
              </p>
              <p className="text-[13px] text-zinc-400">
                Ovu ponudu možemo garantovati do <span className="whitespace-nowrap">
                            <time dateTime={tomorrow.dateAttr}>{tomorrow.label}</time>

                </span>
              </p>
            </div>

            {/* Quiz saver */}
            <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
              <p className="text-sm font-bold text-amber-300">
                Odgovori na 3 pitanja <span className="whitespace-nowrap">(15 sekundi)</span> i
                <span className="ml-1 text-white">osvoji JOŠ 10€ popusta!!!</span>
              </p>
              <p className="text-sm text-zinc-300">U tom slučaju je cena <span className="font-semibold text-white">50€</span></p>
            </div>

            {/* CTA */}
             <div className="mt-4">
      <a
        href="#quiz"
        role="button"
        onClick={(e) => { e.preventDefault(); onOpenQuiz?.(); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenQuiz?.(); } }}
        className="group font-display text-xl font-semibold flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-8 text-center text-black shadow-[0_14px_40px_rgba(212,160,32,0.45)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
      >
        <Sparkles className="h-12 w-12" />
        Odgovori na 3 pitanja i osvoji JOŠ 10€ popusta (cena: 50€)
      </a>
      <p className="text-[13px] mx-auto block w-fit pt-4 text-zinc-400">
                          👆 Klikni na link kako bi kupio program 👆
              </p>

          </div>
              

      </div>

        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, text, priceNote }: { icon: LucideIcon; text: string; priceNote?: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0 rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30">
        <Icon className="h-4 w-4 " />
      </span>
      <p className="text-zinc-200">
        <span className="font-medium text-white">{text}</span> {priceNote && <span className="text-zinc-400">{priceNote}</span>}
      </p>
    </li>
  );
}

function Bonus({ icon: Icon, text, value }: { icon: LucideIcon; text: string; value?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mb-0 rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-zinc-200">
        {text} {value && <span className="text-zinc-400">{value}</span>}
      </p>
    </div>
  );
}
