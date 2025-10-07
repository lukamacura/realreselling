"use client";

import Image from "next/image";
import { Gift, Zap, Notebook } from "lucide-react";

/**
 * BonusSection (optimized)
 * - Dodata mockup slika ispod naslova (responsive, optimizovana sa next/image)
 * - Dodata napomena o ceni za oba bonusa ("Regularna cena: 40 €")
 * - Poboljšana semantika, razmaci i responsive grid
 */
export default function BonusSection() {
  return (
    <section
      id="bonussection"
      aria-labelledby="bonussection-title"
      className="bg-brand-dark py-0 md:py-10 mx-auto"
    >
      <div className="container mx-auto max-w-[1100px] px-4">
        <div className="mb-6 md:mb-8 flex flex-col items-center text-center">
          <Gift aria-hidden className="mb-3 h-16 w-16 md:h-20 md:w-20 text-brand-gold" />
          <h2
            id="bonussection-title"
            className="font-display text-3xl md:text-6xl text-white tracking-tight"
          >
            Bonusi koje dobijaš
          </h2>
        </div>


        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* La Digitale */}
          <article className="rounded-3xl bg-brand-gray/70 p-6 md:p-8 ring-1 ring-white/10">
            <header className="mb-4 flex items-center gap-3">
              <Zap aria-hidden className="h-6 w-6 text-brand-gold" />
              <h3 className="font-display text-2xl text-white">La Digitale</h3>
            </header>
             <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-2xl r">
            <Image
              src="/ladigitale.png" // promeni stazu po potrebi
              alt="Mockup prikaz bonusa i materijala koje dobijaš"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1100px) 90vw, 1100px"
              priority
              className="object-cover"
            />
          </div>
            <ul className="list-disc space-y-3 pl-5 leading-relaxed text-white/90">
              <li>
                Trguješ digitalnim proizvodima – nema kupovine unapred, nema
                skladištenja i slanja proizvoda.
              </li>
              <li>
                Neko želi da kupi Netflix, ti ga kupiš po najnižoj ceni, i njemu
                prodaš po višoj.
              </li>
            </ul>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-sm text-white/80">
                Regularna cena: <span className="font-semibold text-brand-gold">40 €</span>
              </p>
            </div>
          </article>

          {/* Contactless sistem */}
          <article className="rounded-3xl bg-brand-gray/70 p-6 md:p-8 ring-1 ring-white/10">
            <header className="mb-4 flex items-center gap-3">
              <Notebook aria-hidden className="h-6 w-6 text-brand-gold" />
              <h3 className="font-display text-2xl text-white">Contactless sistem</h3>
            </header>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-2xl r">
            <Image
              src="/contactless.png" // promeni stazu po potrebi
              alt="Mockup prikaz bonusa i materijala koje dobijaš"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1100px) 90vw, 1100px"
              priority
              className="object-cover"
            />
          </div>
            <ul className="list-disc space-y-3 pl-5 leading-relaxed text-white/90">
              <li>
                Ranije se dobijao u ekskluzivnom programu, sada ga dobijaš u okviru
                RealReselling-a.
              </li>
              <li>
                Napraviš listu proizvoda, i ti proizvodi se šalju direktno tvojim
                kupcima. Nikada ne ulaziš u kontakt sa proizvodima, a pare ti samo ležu
                na račun.
              </li>
            </ul>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-sm text-white/80">
                Regularna cena: <span className="font-semibold text-brand-gold">40 €</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
