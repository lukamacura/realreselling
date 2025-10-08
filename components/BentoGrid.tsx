"use client";

import Image from "next/image";
import { Gift, BadgeCheck, GraduationCap, Users, Wrench } from "lucide-react";

export default function BentoGrid() {
  return (
    <section id="sta-dobijam" className="py-14 mx-auto">
      <div className="container max-w-[1200px]">
        <h2 className="mb-8 text-center font-display text-4xl leading-tight md:text-5xl">
          ŠTA SVE DOBIJAŠ?
        </h2>

        {/* Mobile: 1 kolona → Tablet: 2 → Desktop: 12 kolona */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {/* 1) Vodiči i edukacija — veliki blok */}
          <article className="card col-span-1 flex h-full flex-col rounded-3xl bg-brand-gray/70 p-6 sm:col-span-2 lg:col-span-8 lg:row-span-2 md:p-8">
            <header className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-brand-gold" />
              <h3 className="font-display font-bold text-3xl md:text-4xl">Vodiči i edukacija</h3>
              <Image src="/edu.png" alt="" width={56} height={56} className="ml-auto hidden md:block" />
            </header>

            {/* Bulleti: tackice • sa marker stilom */}
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base text-white/90 marker:text-white/60 md:text-lg">
              <li>Detaljan plan kako da izvučeš maksimum iz kursa i stigneš do prvih prodaja</li>
              <li>Strategije i primeri za bržu prodaju i reklamiranje proizvoda</li>
              <li>Konkretni saveti i koraci za brze rezultate</li>
              <li>Kompletan kurs o prodaji: praktične tehnike i pristupi</li>
            </ul>

            <footer className="mt-auto pt-6 text-center text-lg font-semibold text-white/90">
              Regularna cena: <span className="text-brand-gold">60€</span>
            </footer>

          
          </article>

          {/* 2) Zajednica i podrška — mali zlatni blok */}
          <article className="col-span-1 flex h-full flex-col justify-between rounded-3xl bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,215,130,.6),rgba(212,160,32,.9)40%,rgba(179,133,22,.98)72%)] p-6 text-brand-dark sm:col-span-1 lg:col-span-4">
            <header className="flex items-center gap-3">
              <Users className="h-6 w-6 text-brand-dark" />
              <h3 className="font-display font-bold text-3xl md:text-4xl text-brand-dark/90">Zajednica i podrška</h3>
            </header>
            <div className="mt-4 flex items-start gap-3">
              <Image src="/feat-community.png" alt="" width={56} height={56} />
              <p className="text-brand-dark/90">
                24/7 kontakt sa mentorima i 3000+ članova. Brzi odgovori i pomoć iz prve ruke.
              </p>
            </div>
            <p className="mt-4 font-semibold text-brand-dark/90">
              Regularna cena: <span className="text-brand-dark">50€</span>
            </p>
          </article>

          {/* 3) Garancija — mali tamni blok */}
          <article className="card col-span-1 flex h-full items-center justify-center rounded-3xl bg-brand-gray/70 p-6 sm:col-span-1 lg:col-span-4">

            <div className="grid h-56 w-56 place-items-center rounded-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-[0_20px_60px_rgba(212,160,32,0.45)] ring-8 ring-amber-900/40 md:h-40 md:w-40">
              {/* inner bevel */}
              <div className="grid h-[72%] w-[72%] place-items-center rounded-full bg-gradient-to-b from-white/70 to-white/15 shadow-inner">
                <BadgeCheck className="h-20 w-20 md:h-14 md:w-14" />
              </div>
            </div>      
            </article>

          {/* 4) Alati za bržu prodaju — veliki zlatni blok */}
          <article className="col-span-1 flex h-full flex-col rounded-3xl bg-[radial-gradient(120%_120%_at_25%_20%,rgba(255,215,130,.55),rgba(212,160,32,1)46%,rgba(179,133,22,1)75%)] p-6 text-brand-dark sm:col-span-2 lg:col-span-8 md:p-8">
            <header className="flex items-center gap-3">
              <Wrench className="h-6 w-6 text-brand-dark" />
              <h3 className="font-display font-bold text-3xl md:text-4xl">Alati za bržu prodaju</h3>
              <Image src="/tools.png" alt="" width={56} height={56} className="ml-auto hidden md:block" />
            </header>

            {/* Bulleti: tackice • sa marker stilom (tamna varijanta) */}
            <ul className="mt-4 list-disc space-y-3 pl-6 text-brand-dark/95 marker:text-brand-dark/70">
              <li>Instant izgradnja portfolija – članovi jedni drugima ostavljaju pozitivne ocene na KP</li>
              <li>Recenzije proizvoda – poseban chat sa iskustvima kolega</li>
            </ul>

            <p className="mt-auto pt-6 text-center text-lg font-semibold">
              Regularna cena: <span className="text-brand-dark">40€</span>
            </p>
          </article>

          {/* 5) Bonusi — visoki tamni blok */}
          <aside className="card col-span-1 flex h-full flex-col items-center justify-between rounded-3xl bg-brand-gray/70 p-6 sm:col-span-2 lg:col-span-4 lg:row-span-2">
            <header className="flex items-center gap-3">
              <h3 className="font-display font-bold text-3xl md:text-4xl text-white">BONUSI</h3>
            </header>
           
                <Gift className="h-20 w-20 md:h-14 md:w-14" />
                
            <a href="#bonussection" className="font-display mt-4 w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 px-4 py-3 text-center text-2xl font-semibold text-amber-300 shadow-[0_12px_30px_rgba(212,160,32,.35)] hover:brightness-95 active:scale-[.99]">
              Pogledaj bonuse
            </a>
          </aside>
          
        </div>
        
      </div>


      <a href="#cena" className=" mx-auto block font-display mt-4 w-[93%] rounded-2xl bg-[rgba(212,160,32,.95)] px-4 py-8 text-center text-2xl font-semibold text-black shadow-[0_12px_30px_rgba(212,160,32,.35)] hover:brightness-95 active:scale-[.99]">
              Hoću pristup programu & popust 
      </a>
    </section>
    
  );
}
