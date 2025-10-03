"use client";

import Image from "next/image";
import Link from "next/link";
import { Banknote, Users, BadgeCheck, BadgeDollarSign } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative mx-auto mt-10 md:mt-40 overflow-hidden bg-brand-dark py-10 sm:py-14 md:py-0">
      {/* Zlatni radijal desno */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[-10%] w-[70%] max-w-[900px] opacity-80"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.45) 0%, rgba(212,160,32,0.15) 40%, rgba(11,15,19,0) 70%)",
        }}
      />

      <div className="container mx-auto grid max-w-[1600px] items-center gap-10 px-4 md:grid-cols-2 md:gap-12">
        {/* LEFT */}
        <div className="relative z-10">
          <h1 className="mb-2 md:mb-6 font-display text-[36px] leading-[1.05] tracking-tight text-white md:text-[64px]">
            <span className="m-0 block font-display text-[40px] leading-tight text-brand-gold md:text-[64px]">
              💸 Prva online zarada <span className="ml-2 text-white">od resellinga u 30 dana ILI VRAĆAMO NOVAC</span>
            </span>

          </h1>

          <p className="mb-6 max-w-[680px] text-lg leading-relaxed text-white/85 md:text-xl">
            Dobijaš proizvode, uputstva i “copy-paste” šablone da napraviš prvu
            prodaju za 30 dana, a ako ne uspeš VRATIĆEMO TI NOVAC.
          </p>

          {/* social proof */}
          <div className="mb-8 flex flex-wrap items-center gap-3 text-white/85">
            <div className="flex -space-x-2">
              <Image src="/a1.webp" alt="član" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-brand-dark" />
              <Image src="/a2.webp" alt="član" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-brand-dark" />
              <Image src="/a3.webp" alt="član" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-brand-dark" />
              <span className="inline-flex h-10 items-center justify-center rounded-full bg-brand-gold px-2 text-sm font-semibold text-black">
                3000+
              </span>
            </div>
            <span className="text-xs md:text-base">
              Pridruži se zajednici od preko 3000+ članova
            </span>
          </div>

          {/* CTA */}
          <Link
            href="#sta-dobijam"
            className="inline-flex w-full max-w-[640px] items-center justify-center rounded-[28px] bg-brand-gold px-6 py-8 font-bold font-display text-xl md:text-2xl text-brand-dark shadow-[0_10px_30px_rgba(212,160,32,.35)] transition hover:bg-brand-goldDark active:scale-[.99]"
          >
                          <BadgeDollarSign className="h-9 w-9 mb-[3px] mr-[2px] text-brand-dark" aria-hidden />

            Hoću da zarađujem od resellinga
          </Link>
        </div>

        {/* RIGHT — veća hero slika */}
        <div className="relative z-0 mx-auto w-full md:max-w-none">
          <div className="relative rounded-[24px] bg-transparent p-0">
            <Image
              src="/hero.png"
              alt="Kompletan sistem za prvu zaradu od resellinga u 30 dana"
              width={2007}
              height={1172}
              priority
              quality={100}
              sizes="(min-width:1536px) 940px, (min-width:1280px) 860px, (min-width:1024px) 720px, 100vw"
              className="mx-auto h-auto w-full"
            />
          </div>
        </div>
      </div>

      {/* FEATURE TRAKA sa Lucide ikonama */}
      <div className="container mx-auto max-w-[1600px] px-4">
        <div className="mt-10 grid grid-cols-1 gap-0 text-center sm:grid-cols-3">
          {/* 1 */}
          <div className="flex mb-6 flex-col items-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <Banknote className="h-9 w-9 text-brand-gold" aria-hidden />
            </div>
            <p className="font-display text-xl font-semibold leading-snug text-white md:text-2xl">
              Prva prodaja za<br className="hidden sm:block" /> mesec dana
            </p>
          </div>

          {/* 2 */}
          <div className="flex mb-6 flex-col items-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <Users className="h-9 w-9 text-brand-gold" aria-hidden />
            </div>
            <p className="font-display text-xl font-semibold leading-snug text-white md:text-2xl">
              Zajednica<br className="hidden sm:block" /> uspešnih ljudi
            </p>
          </div>

          {/* 3 */}
          <div className="flex mb-6 flex-col items-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <BadgeCheck className="h-9 w-9 text-brand-gold" aria-hidden />
            </div>
            <p className="font-display text-xl font-semibold leading-snug text-white md:text-2xl">
              100%<br className="hidden sm:block" /> garancija
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
