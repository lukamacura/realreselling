"use client";

import Image from "next/image";
import { Zap, Notebook, ShieldCheck, Sparkles, GraduationCap, Users, Wrench, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Collapsible from "@/components/OfferShrink"; // tvoj postojeći toggle

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
  const [left, setLeft] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const ms = end.getTime() - now.getTime();
      if (ms <= 0) return setLeft("00:00:00");
      const hh = Math.floor(ms / 3_600_000);
      const mm = Math.floor((ms % 3_600_000) / 60_000);
      const ss = Math.floor((ms % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setLeft(`${pad(hh)}:${pad(mm)}:${pad(ss)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

export default function OfferHeroOptimizedFullMobile({ onOpenQuiz }: { onOpenQuiz?: () => void }) {
  const tomorrow = useTomorrowDMY();
  const countdown = useCountdownToTomorrow();

  const handleCTA = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    onOpenQuiz?.();
  };

  return (
    <section
      id="cena"
      className="relative mx-auto bg-[#0B0F13] text-white overflow-hidden min-h-[100svh] md:min-h-0"
    >
      {/* BG glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-[-15%] top-[-20%] h-[140%] w-[70%] opacity-70"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      <div className="container h-fit mx-auto max-w-[16s00px] px-4">
        {/* MOBILE: full-screen layout (header / scroll area / bottom bar) */}
        <div className="grid min-h-[100svh] grid-rows-[auto,1fr,auto] py-4 md:min-h-0 md:grid-rows-none md:py-12 md:grid md:grid-cols-1 md:items-center md:gap-10">
          {/* HEADER */}
          <header className="md:col-span-2">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[12px] font-semibold text-amber-200">
              <ShieldCheck className="h-4 w-4" /> Garancija povraćaja novca
            </p>
            <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
              Prva online zarada od resellinga u 30 dana
              <br />
              <span className="text-amber-300">ILI VRAĆAMO NOVAC</span>
            </h1>
          </header>

          {/* SCROLL AREA (mobilni) / CONTENT (desktop) */}
          <div className="min-h-0 overflow-y-auto md:overflow-visible md:items-center">
            {/* LEFT content */}
            <div className="mt-3 md:mt-0">
              <PriceBlock tomorrow={tomorrow} countdown={countdown} />
               <div className="mt-6 md:mt-10">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <div className=" w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center"><p className="text-xs font-bold text-amber-300">Odgovori na 3 pitanja <span className="whitespace-nowrap">(15 sekundi)</span><span className="ml-1 text-white"> i osvoji JOŠ 10€ popusta (cena je u tom slučaju 50€)!!!</span></p></div>
              <button
                id="start-quiz"
                onClick={handleCTA}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCTA(e); }}
                className="group inline-flex w-full md:w-full items-center justify-center font-display text-xl gap-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 px-6 py-8 font-extrabold text-black transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                aria-describedby="cta-desc"
                data-rr-action="start-quiz"
              >
                <Sparkles className="h-6 w-6" />
                Počni kviz i uzmi 10€ popusta
              </button>

              <p id="cta-desc" className="text-xs text-white">
                3 pitanja • 15 sekundi • odmah dobijaš popust
              </p>

              
            </div>
          </div>

              {/* Tvoj COLLAPSIBLE: Šta dobijaš */}
              <Collapsible title="Šta sve dobijaš (regularna cena: 150€)" defaultOpen={false} > <ul className="mt-2 space-y-3 rounded-xl text-sm sm:text-base bg-[#0E1319] p-4 ring-1 ring-white/5"> <Feature icon={GraduationCap} text="Vodiči i edukacija" priceNote="(Regularna cena: 60€)" /> <Feature icon={Users} text="Zajednica i podrška" priceNote="(Regularna cena: 50€)" /> <Feature icon={Wrench} text="Alati za prodaju" priceNote="(Regularna cena: 40€)" /> <li className="pt-1 text-right text-sm text-zinc-300"> Ukupno: <span className="font-semibold text-white">150€</span> </li> </ul> </Collapsible> {/* Bonusi */} <Collapsible title="Bonusi (regularna cena: 80€)" defaultOpen={false}> <div className="mt-2 space-y-3 rounded-xl text-sm sm:text-base bg-[#0E1319] p-4 ring-1 ring-white/5"> <Bonus icon={Zap} text="La Digitale - Neko želi da kupi Netflix, ti ga kupiš po najnižoj ceni, i njemu prodaš po višoj." value="(Regularna cena: 40 €)" /> <Bonus icon={Notebook} text="Contactless opcija - mi šaljemo proizvode direktno kupcima, ti samo ubaciš profiti" value="(Regularna cena: 40 €)" /> <Bonus icon={ShieldCheck} text="Pravo na povraćaj novca ili zamenu proizvoda u bilo kojoj situaciji" /> <div className="pt-1 text-right text-sm text-zinc-300"> Ukupno: <span className="font-semibold text-white">80€</span> </div> </div> </Collapsible>
            </div>

            {/* RIGHT image */}
            <figure className="relative mx-auto mt-4 max-w-xs md:mt-0 md:max-w-none">
              <Image
                src="/hero.png"
                alt="RealReselling program box"
                width={1200}
                height={900}
                className="h-auto w-full rounded-xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:max-h-[320px]"
                priority
              />
              <figcaption className="sr-only">Vizual programa</figcaption>
            </figure>
            
                    {/* GLOBAL CTA — odmah ispod SVEGA */}
         

          </div>



        </div>
      </div>
    </section>
  );
}

function PriceBlock({ tomorrow, countdown }: { tomorrow: { label: string; dateAttr: string }; countdown: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <p className="text-lg font-extrabold text-zinc-300 line-through decoration-rose-500/80 decoration-4">230€</p>
        <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Specijalna: <span className="text-amber-300">60€</span> - sa kvizom <span className="text-amber-600">50€</span>
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
  );
}


function Feature({ icon: Icon, text, priceNote }: { icon: LucideIcon; text: string; priceNote?: string }) { return ( <li className="flex items-start gap-3"> <span className="mt-0 rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30"> <Icon className="h-4 w-4 " /> </span> <p className="text-zinc-200"> <span className="font-medium text-white">{text}</span> {priceNote && <span className="text-zinc-400">{priceNote}</span>} </p> </li> ); }
function Bonus({ icon: Icon, text, value }: { icon: LucideIcon; text: string; value?: string }) { return ( <div className="flex items-start gap-3"> <span className="mb-0 rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30"> <Icon className="h-4 w-4" /> </span> <p className="text-zinc-200"> {text} {value && <span className="text-zinc-400">{value}</span>} </p> </div> ); }
