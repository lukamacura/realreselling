"use client";

import { ShoppingCart, Rocket, ShieldCheck } from "lucide-react";

type Step = {
  title: string;
  desc: React.ReactNode;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const steps: Step[] = [
  {
    title: "Kupovina",
    desc: (
      <>
        <b>Odmah dobijaš pristup</b> platformi i svim bonusima
      </>
    ),
    Icon: ShoppingCart,
  },
  {
    title: "Start",
    desc: (
      <>
        Dobijaš sve što ti je potrebno da <b>pokreneš</b> svoj reselling biznis
      </>
    ),
    Icon: Rocket,
  },
  {
    title: "Garancija",
    desc: (
      <>
        Ako u roku od 30 dana ne napraviš ni jednu prodaju, <b>vraćamo ti sav novac</b>
      </>
    ),
    Icon: ShieldCheck,
  },
];

export default function ThreeSteps() {
  return (
    <section className="bg-brand-dark pb-16 md:pb-24 mx-auto">
      <div className="container mx-auto max-w-[1100px] px-4 text-center">
        {/* Naslov u 3 reda kao na referenci */}
        <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
          3 jednostavna koraka
          <br />
          kako do zarade od
          <br />
          <span className="inline-block">resellinga</span>
        </h2>

        {/* Koraci */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map(({ title, desc, Icon }) => (
            <div key={title} className="flex flex-col items-center text-white">
              {/* Žuti “kvadratić” sa senkom */}
              <div
                className="mb-5 inline-flex h-28 w-28 items-center justify-center rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,.35)]"
                style={{
                  background:
                    "linear-gradient(180deg, #FFD36C 0%, #EFB441 70%), #EFB441",
                }}
              >
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl"
                  style={{ boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.08)" }}>
                  <Icon className="h-10 w-10 text-[#8E5B00]" aria-hidden />
                </div>
              </div>

              <h3 className="font-display text-4xl">{title}</h3>
              <p className="mt-2 max-w-[320px] text-base leading-relaxed text-white/90">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
