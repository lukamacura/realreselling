/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import {
  Gift,
  MessageCircle,
  Rocket,
  Timer,
  Footprints,
  ShieldCheck,
  CalendarCheck2,
  ArrowRight,
} from "lucide-react";

/**
 * Meet (Lead Magnet) – Bento grid section
 */
export default function MeetBento() {
  return (
    <section id="meet-lead" className="py-14 mx-auto">
      <div className="container max-w-7xl">
        <h2 className="mb-8 text-center font-bold font-display text-4xl leading-tight md:text-5xl">
          Reselling Starter Meetup
        </h2>

        {/* Grid: Mobile 1 → Tablet 2 → Desktop 12 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {/* (A) REASON WHY FREE – veliki tamni blok */}
          <article className="col-span-1 flex h-full flex-col rounded-3xl bg-brand-gray/70 p-6 sm:col-span-2 lg:col-span-8 lg:row-span-2 md:p-8">
            <header className="flex items-center gap-3">
              <Gift className="h-9 w-9 text-brand-gold mb-[8px]" />
              <h3 className="font-display text-3xl md:text-4xl">Zašto je besplatno?</h3>
            </header>

            <ul className="mt-6 list-disc space-y-3 pl-6 text-base text-white/90 marker:text-white/60 md:text-lg">
              <li>
                <span className="font-semibold text-white">Win–Win pristup:</span> želimo da vidiš put i odlučiš da li je reselling za tebe,
                bez plaćanja i bez bilo kakvih obaveza.
              </li>
              <li>
                <span className="font-semibold text-white">Filtriramo ozbiljne kandidate:</span> ko prepozna sistem i pravu vrednost, taj kasnije lakše napreduje u programu.
              </li>
              <li>
                <span className="font-semibold text-white">Social proof & feedback:</span> što više povratnih informacija sa meeta, to bolje unapređujemo
                materijal za sve.
              </li>
            </ul>

            <footer className="mt-auto pt-6 text-center text-lg font-semibold text-white/90">
              Cena za tebe: <span className="text-brand-gold">0€</span>, nema obavezne kupovine.
            </footer>
          </article>

          {/* (B) OUTPUT – mali zlatni blok */}
          <article className="col-span-1 flex h-full flex-col justify-between rounded-3xl bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,215,130,.6),rgba(212,160,32,.9)40%,rgba(179,133,22,.98)72%)] p-6 text-brand-dark sm:col-span-1 lg:col-span-4">
            <header className="flex items-center gap-3">
              <Rocket className="h-6 w-6 mb-[2px] text-brand-dark" />
              <h3 className="font-display text-2xl text-brand-dark/90">Šta imaš posle meeta</h3>
            </header>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-brand-dark/90 marker:text-brand-dark/70">
              <li><b>Jasan mapirani put</b>: od nule do prve zarade (korak–po–korak).</li>
              <li><b>Checklista</b>: 10 tačaka za start bez lutanja.</li>
              <li><b>Procena</b>: da li je reselling realno za tebe <em>baš sada</em>.</li>
            </ul>
          </article>

          {/* (C) SOCIAL/LIKELIHOOD – mali tamni blok sa porukom mentora */}
          <article className="card col-span-1 flex h-full flex-col justify-between rounded-3xl bg-brand-gray/70 p-6 sm:col-span-1 lg:col-span-4">
            <header className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-brand-gold" />
              <h3 className="font-display text-2xl">Direktna poruka mentora</h3>
            </header>
            <p className="mt-3 text-white/90">
              Nakon prijave, dobijaš <span className="font-semibold">WhatsApp poruku direktno od mentora</span> sa kratkim uputstvima, linkom za
              meet i odgovorima na prva pitanja.
            </p>
          </article>

          {/* (D) EFFORT & SACRIFICE – veliki zlatni blok */}
          <article className="col-span-1 flex h-full flex-col rounded-3xl bg-[radial-gradient(120%_120%_at_25%_20%,rgba(255,215,130,.55),rgba(212,160,32,1)46%,rgba(179,133,22,1)75%)] p-6 text-brand-dark sm:col-span-2 lg:col-span-8 md:p-8">
            <header className="flex items-center gap-3">
              <Footprints className="h-6 w-6 text-brand-dark" />
              <h3 className="font-display text-3xl md:text-4xl">Trud i žrtva</h3>
            </header>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-brand-dark/95 marker:text-brand-dark/70">
              <li><b>10 min na telefonu</b> da se dogovoriš sa mentorom kako bi ti poslao link za meet i WhatsApp grupu</li>
              <li><b>30-45 min fokusa</b> tokom meeta.</li>
              <li><b>Otvorenost</b> da čuješ realne brojeve i očekivanja, bez šminkanja (nemoj očekitavi money over night metode).</li>
            </ul>
            <p className="mt-auto pt-6 text-center text-lg font-semibold">Nema nikakvog ulaganja novca. Ulažeš samo vreme i pažnju.</p>
          </article>

          {/* (E) TIME DELAY – visoki tamni blok */}
          <aside className="card col-span-1 flex h-full flex-col items-center justify-between rounded-3xl bg-brand-gray/70 p-6 sm:col-span-2 lg:col-span-4 lg:row-span-1">
            <header className="flex items-center gap-2">
              <Timer className="h-9 w-9 mb-[9px] text-brand-gold" />
              <h3 className="font-display text-3xl text-white">Šta nakon Meeta?</h3>
            </header>
            <div className="text-center text-white/90">
              <p className="text-lg">Nakon meeta ćeš znati <b>da li je reselling za tebe</b> i da li želiš da ideš tim putem.</p>
              <p className="mt-2 font-bold text-[#00FF00]">Ako odlučiš da ideš tim putem, učlani se u program u kojem ćeš nakon 30 dana početi da zarađuješ.</p>
              <p className="mt-2 font-bold text-[#FF0000]">Ako odlučiš da ne ideš tim putem, nikom ništa.</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/75">
                <span><b>Realna očekivanja</b>: meet ≠ kompletna edukacija, ali dobijaš putanju.</span>
              </div>
            </div>
          </aside>

          {/* (F) KAKO FUNKCIONIŠE – koraci + CTA */}
          <article className="col-span-1 flex h-full flex-col justify-between rounded-3xl bg-brand-gray/70 p-6 text-brand-dark sm:col-span-2 lg:col-span-8">
            <header className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-white/90" />
              <h3 className="font-display text-3xl text-white/90">Kako funkcioniše</h3>
            </header>
            <ol className="mt-4 list-decimal space-y-3 pl-6 text-white/90 marker:text-white/90">
              <li><b>Prijavi se i rezerviši</b> besplatno mesto.</li>
              <li><b>Dobijaš WhatsApp poruku</b> od mentora sa uputstvima i linkom.</li>
              <li><b>Prisustvuj meetu (30-45 min)</b> i postavi sva pitanja.</li>
              <li><b>Donesi odluku</b> da li želiš dalje.</li>
            </ol>

            <p className="mt-2 text-xs font-extrabold text-white">Ostalo još 2 mesta</p>
            <p className="mt-2 text-xs text-white/60">
              Brzo je, traje oko 45 min i nije obavezna kupovina.
            </p>
          </article>

          {/* (G) CTA ASIDE — kao na slici */}
          <aside className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-3xl border border-white/10 bg-[#12171E]/80 p-6 md:p-7 shadow-[0_20px_70px_rgba(0,0,0,.45)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-display text-2xl md:text-3xl">MIsliš da si spreman?</h3>
                <p className="mt-1 max-w-3xl text-white/85">
                  Ako ti je meet pomogao ili si odlučan i želiš da vidiš kako izgleda kompletan sistem u praksi,
                  vrati se na glavnu stranu da pogledaš RealReselling ponudu, recenzije i sledeće korake.
                </p>

                <ul className="mt-3 space-y-2 text-white/90">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-[2px] h-5 w-5 text-brand-gold shrink-0" />
                    <span>
                      <b>Garancija:</b> ako ne napraviš prvu zaradu u 30 dana, <b>vraćamo ti svaki dinar</b>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CalendarCheck2 className="mt-[2px] h-5 w-5 text-brand-gold shrink-0" />
                    <span>
                      <b>Zakazani meet ti ostaje</b>, ovo je samo dodatni korak ako želiš više detalja.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Gift className="mt-[2px] h-5 w-5 text-brand-gold shrink-0" />
                    <span>
                      <b>Bonusi, recenzije i ponuda</b> na glavnoj strani.
                    </span>
                  </li>
                </ul>
                <a
                href="/"
                className="inline-flex items-center mt-2 justify-center rounded-full border border-amber-400/60 bg-amber-400/10 px-5 py-3 text-md font-semibold text-amber-300 transition hover:bg-amber-400/20 md:self-start"
              >
                Pogledaj glavnu stranu
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>

                <p className="mt-4 text-xs text-white/55">
                  P. S. Ako ti je lakše, ostani na ovoj stranici, dovrši zakazivanje i dobićeš sve bitne informacije na meetu.
                </p>
              </div>

              
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
