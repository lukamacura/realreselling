"use client";

import { BadgeCheck } from "lucide-react";
import React from "react";

/**
 * GuaranteeSection
 * 
 * Drop this into your Next.js app (app/ or components/). Tailwind required.
 * Colors are tuned for a dark brand background with a warm gold accent.
 */
export default function GuaranteeSection() {
  return (
    <section
      aria-labelledby="guarantee-title"
      className="relative overflow-hidden bg-[#0B0F13] mx-auto text-white"
    >
      {/* BACKGROUND LAYERS */}
      {/* soft gold radial glow (right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-1/2 h-[140%] w-[100%] -translate-y-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.45) 0%, rgba(212,160,32,0.15) 40%, rgba(11,15,19,0) 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* subtle dotted grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)",
          backgroundPosition: "0 0, 25px 25px",
          backgroundSize: "50px 50px",
          color: "#ffffff",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />

      <div className="container mx-auto max-w-[1100px] px-4 py-0 md:py-24">
        {/* TOP COPY */}
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-300">
            Garancija
          </p>
          <h1
            id="guarantee-title"
            className="mt-3 text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl md:text-6xl"
          >
            <span className="font-display block"><span className="text-[#D4A020]">No sell – No pay</span></span>
          </h1>
        </header>

        {/* BADGE / MEDALLION */}
        <div className="mt-10 flex items-center justify-center">
          <div className="relative">
            {/* outer medal */}
            <div className="grid h-56 w-56 place-items-center rounded-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-[0_20px_60px_rgba(212,160,32,0.45)] ring-8 ring-amber-900/40 md:h-64 md:w-64">
              {/* inner bevel */}
              <div className="grid h-[72%] w-[72%] place-items-center rounded-full bg-gradient-to-b from-white/70 to-white/15 shadow-inner">
                <BadgeCheck className="h-20 w-20 md:h-24 md:w-24" />
              </div>
            </div>

            {/* ribbon */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <div className="rounded-full font-display font-light text-center bg-[#5c480b] px-5 py-2 text-sm tracking-wider text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-2 ring-white/10 md:px-6 md:py-2.5 md:text-lg">
                100% GARANCIJA
              </div>
              {/* ribbon tails */}
              <div className="absolute -z-10 -left-6 top-1/2 hidden h-3 w-12 -translate-y-1/2 skew-x-[-20deg] bg-[#D4A020] md:block" />
              <div className="absolute -z-10 -right-6 top-1/2 hidden h-3 w-12 -translate-y-1/2 skew-x-[20deg] bg-[#D4A020] md:block" />
            </div>
          </div>
        </div>

        {/* SUBTEXT */}
        <p className="mx-auto mt-10 max-w-3xl text-center text-base italic leading-relaxed text-zinc-300 md:text-lg">
          “Ako ne napraviš prvu zaradu (od koje ćeš zapravo otplatiti ovaj program)”
        </p>

        {/* BIG PROMISE */}
        <div className="mt-8 text-center md:mt-10">
          <p className="mx-auto font-display inline-block border-b-4 border-white/70 pb-2 text-3xl font-extrabold tracking-wide text-white sm:text-4xl md:text-6xl">
            VRAĆAMO TI SVAKI DINAR
          </p>
        </div>
      </div>
    </section>
  );
}
