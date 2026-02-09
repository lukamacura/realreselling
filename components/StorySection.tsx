"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Brain, X, Zap } from "lucide-react";

// Focus challenge popup component
function FocusPopup({ hide = false }: { hide?: boolean }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show popup after 4 seconds
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  // Auto-hide when swipe bar appears
  useEffect(() => {
    if (hide && show) setShow(false);
  }, [hide, show]);

  return (
    <AnimatePresence>
      {show && !hide && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-[340px]"
        >
          <div className="relative rounded-2xl border border-amber-500/40 bg-[#12171E]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-3 border border-amber-500/30">
                <Brain className="h-6 w-6 text-amber-400" />
              </div>

              <div className="flex-1 pr-4">
                <p className="text-white font-semibold text-sm leading-relaxed">
                  Ako nemaš fokus da pročitaš dva minuta teksta, spadaš u{" "}
                  <span className="text-amber-400">88% ljudi</span> kojima je
                  pažnja potpuno uništena.
                </p>
                <p className="mt-2 text-neutral-400 text-xs">
                  Izdvoji dva minuta. Pročitaj do kraja.
                </p>
              </div>
            </div>

            {/* Challenge accepted button */}
            <button
              onClick={handleDismiss}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Mogu da pročitam sve
            </button>

            {/* Decorative glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-500/20 via-transparent to-transparent opacity-50 blur-sm -z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Animated highlight component with soft underline reveal
function Highlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="relative inline">
      <span className="relative z-10 text-white">{children}</span>
      {/* Soft underline effect */}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500/60 to-amber-400/40 rounded-full"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: 0 }}
      />
    </span>
  );
}

// Section wrapper with fade-in animation
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function StorySection({ hidePopup = false }: { hidePopup?: boolean }) {
  return (
    <>
      {/* Focus Challenge Popup */}
      <FocusPopup hide={hidePopup} />

      <section className="py-2 sm:py-4 bg-[#0B0F13]">
        <div className="container mx-auto max-w-[880px] px-5 sm:px-8">
          {/* Header */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-medium text-sm uppercase tracking-wider">
            Prava Priča
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-3">
            Od Minimalca do{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Slobode
            </span>
          </h2>
        </motion.div>

        {/* Story Content */}
        <div className="space-y-14 text-neutral-300 text-xl leading-[1.8] tracking-wide">
          {/* Section 1: The Struggle */}
          <Section>
            <div className="rounded-2xl border border-white/10 bg-[#12171E]/60 p-6 sm:p-8 backdrop-blur">
              <p>
                Imam <strong className="text-white">23 godine</strong>, završio faks,
                i radim za{" "}
                <Highlight>
                  <strong className="text-white">45.000 dinara mesečno</strong>
                </Highlight>
                . Posle kirije, režija i hrane - ostane mi toliko da biram:{" "}
                izlazak ili gorivo za ceo mesec. Devojka me pita{" "}
                <em>&quot;Kad idemo negde?&quot;</em> i ja se pravim da nisam čuo.
              </p>
              <p className="mt-4">
                Najgori deo nije bio nedostatak para. Najgore je bilo{" "}
                <strong className="text-white">
                  to što sam uradio sve &quot;kako treba&quot; - škola, faks, posao - i opet nisam
                  imao ništa
                </strong>
                .
              </p>
            </div>
          </Section>

          {/* Section 2: Discovery + Finding Real Reselling */}
          <Section>
            <div className="border-l-4 border-amber-500/50 pl-6 py-2">
              <p>
                Na mrežama naletim na ljude koji pričaju o preprodaji - kupuju stvari
                jeftino, prodaju skuplje. Moja prva reakcija:{" "}
                <em>&quot;Još jedan koji prodaje maglu.&quot;</em> Ali{" "}
                <strong className="text-white">
                  ostajem jer mi mozak traži bilo kakav izlaz
                </strong>
                .
              </p>
              <p className="mt-4">
                Onda naletim na{" "}
                <strong className="text-amber-400">Real Reselling</strong>. Ne
                zatvaram odmah - listam šta dobijaš. Piše:{" "}
                <strong className="text-white">
                  kompletna edukacija, zajednica, alati za prodaju, sistem bez dodira sa
                  proizvodom
                </strong>
                .{" "}
                <Highlight>
                  <strong className="text-white">
                    Prvi put mi deluje kao konkretan recept, ne motivacioni govor.
                  </strong>
                </Highlight>
              </p>
            </div>
          </Section>

          {/* Section 3: Taking the Leap */}
          <Section>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
              <p>
                Cena:{" "}
                <Highlight>
                  <strong className="text-white">39 evra</strong>
                </Highlight>
                . Dva dana razmišljam. Onda sebi kažem iskreno:{" "}
                <Highlight>
                  <strong className="text-white">
                    ili pokušavam ili nastavljam da se vrtim u istom krugu
                  </strong>
                </Highlight>
                . Uzmem kurs. Ostane mi dovoljno keša da krenem sa prvom robom.
              </p>
              <p className="mt-4">
                Vodič me nije dočekao sa inspirativnim citatima. Prva lekcija:{" "}
                <strong className="text-white">
                  kako da napravim profil koji izgleda profesionalno
                </strong>
                . Koje slike, koji opis, kako da komuniciram sa kupcima. Konkretno, korak po
                korak.
              </p>
            </div>
          </Section>

          {/* Section 4: First Sale */}
          <Section>
            <div className="rounded-2xl border border-white/10 bg-[#12171E]/60 p-6 sm:p-8">
              <p>
                Nađem Nike Air Max na KupujemProdajem za{" "}
                <strong className="text-amber-400">2500 dinara</strong>. Proverim
                autentičnost kako piše u vodiču, očistim ih, fotkam po sistemu, napišem
                realan oglas. Cenu stavim{" "}
                <strong className="text-amber-400">5500</strong>.
              </p>
              <p className="mt-4">
                Trećeg dana stiže poruka: <em>&quot;Može za 5000?&quot;</em>{" "}
                <Highlight>
                  <strong className="text-white">
                    Ljudi pregovaraju iz navike.
                  </strong>
                </Highlight>{" "}
                Prihvatim. Dođe čovek, pogleda, uzme, plati.
              </p>

              {/* Profit Calculation */}
              <div className="mt-6 flex items-center justify-center gap-4 text-center">
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
                  <div className="text-red-400 text-sm">Kupovina</div>
                  <div className="text-white font-display text-2xl">2500 RSD</div>
                </div>
                <div className="text-2xl text-neutral-500">→</div>
                <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3">
                  <div className="text-green-400 text-sm">Prodaja</div>
                  <div className="text-white font-display text-2xl">5000 RSD</div>
                </div>
                <div className="text-2xl text-neutral-500">=</div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3">
                  <div className="text-amber-400 text-sm">Profit</div>
                  <div className="text-amber-400 font-display text-2xl">2500 RSD</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Section 5: Growth + Community */}
          <Section>
            <p>
              Posle prve prodaje kliknulo mi je:{" "}
              <Highlight>
                <strong className="text-white">
                  nije poenta u jednoj prodaji, nego u ponavljanju
                </strong>
              </Highlight>
              . Pa još jedna stvar, pa još jedna. Naučio sam šta se traži, šta stoji, koji
              brendovi idu brzo. Uz kurs sam dobio i{" "}
              <strong className="text-amber-400">pristup zajednici</strong> - kad zapnem,
              pitam i dobijem konkretan odgovor umesto da trošim dane na nagađanje.
            </p>
          </Section>

          {/* Section 6: Results */}
          <Section>
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-6 sm:p-8">
              <p className="text-lg">
                <strong className="text-white text-xl">Četiri meseca kasnije</strong> - nisam
                dao otkaz niti sam postao milioner. Ali:
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-amber-500">✓</span>
                  <span>
                    <Highlight>
                      <strong className="text-white">
                        Izveo sam devojku na večeru i nisam brojao u glavi koliko mi ostaje.
                      </strong>
                    </Highlight>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-amber-500">✓</span>
                  <span>
                    Imam{" "}
                    <strong className="text-white">dodatni prihod koji ne zavisi od poslodavca</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-amber-500">✓</span>
                  <span>
                    <Highlight>
                      <strong className="text-white">
                        Znam da mogu da napravim pare kad zatreba, a ne da čekam platu
                      </strong>
                    </Highlight>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </Section>

          {/* Section 7: Conclusion */}
          <Section>
            <div className="text-center py-8">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 mb-8">
                <p className="text-xl text-white">
                  Tih{" "}
                  <Highlight>
                    <strong className="text-amber-400 text-2xl">39 evra</strong>
                  </Highlight>{" "}
                  su mi doneli više nego bilo koja investicija do sad.
                </p>
                <p className="mt-4 text-neutral-400">
                  Ne zato što sam odmah obogatio, nego zato što sam{" "}
                  <strong className="text-white">stekao veštinu koja mi ostaje</strong>.
                </p>
              </div>
              <p className="text-2xl sm:text-3xl font-display text-white">
                Više nemam osećaj da sam{" "}
                <span className="line-through text-neutral-500">bez opcija</span>.
              </p>
              <p className="mt-4 text-xl">
                <Highlight>
                  <strong className="text-amber-400">To je razlika.</strong>
                </Highlight>
              </p>
            </div>
          </Section>
        </div>
      </div>
    </section>
    </>
  );
}
