"use client";

import { Gift, Zap, Notebook} from "lucide-react";

export default function BonusSection() {
  return (
    <section id="bonussection" className="bg-brand-dark py-0 md:py-8 mx-auto">
      <div className="container mx-auto max-w-[1100px] px-4">
                      
<Gift className="mb-2 h-20 w-20 text-brand-gold mx-auto" />

        <h2 className="mb-10 text-center font-display text-3xl text-white md:text-6xl">
            
          Bonusi koje dobijaš
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* La Digitale */}
          <article className="card rounded-3xl bg-brand-gray/70 p-6 md:p-8">
            <header className="mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-brand-gold" />
              <h3 className="font-display text-2xl text-white">La Digitale</h3>
            </header>
            <ul className="list-disc space-y-3 pl-5 text-white/90 leading-relaxed">
              <li>
                Trguješ digitalnim proizvodima – nema kupovine unapred, nema
                skladištenja i slanja proizvoda.
              </li>
              <li>
                Neko želi da kupi Netflix, ti ga kupiš po najnižoj ceni, i
                njemu prodaš po višoj.
              </li>
            </ul>
          </article>

          {/* Contactless sistem */}
          <article className="card rounded-3xl bg-brand-gray/70 p-6 md:p-8">
            <header className="mb-4 flex items-center gap-3">
              <Notebook className="h-6 w-6 text-brand-gold" />
              <h3 className="font-display text-2xl text-white">Contactless sistem</h3>
            </header>
            <ul className="list-disc space-y-3 pl-5 text-white/90 leading-relaxed">
              <li>
                Ranije se dobijao u ekskluzivnom programu, sada ga dobijaš u
                okviru RealReselling-a.
              </li>
              <li>
                Napraviš listu proizvoda, i ti proizvodi se šalju direktno
                tvojim kupcima. Nikada ne ulaziš u kontakt sa proizvodima, samo
                ti leže pare na račun.
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
