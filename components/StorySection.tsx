"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Brain, X, Zap } from "lucide-react";

// Focus challenge popup component
function FocusPopup() {
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

  return (
    <AnimatePresence>
      {show && (
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
                  Ako nemaš fokus da pročitaš sve, spadaš u{" "}
                  <span className="text-amber-400">88% ljudi</span> kojima je
                  pažnja nepovratno uništena.
                </p>
                <p className="mt-2 text-neutral-400 text-xs">
                  Budi drugačiji. Pročitaj do kraja.
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

export default function StorySection() {
  return (
    <>
      {/* Focus Challenge Popup */}
      <FocusPopup />

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
            Od 800 Dinara do{" "}
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
                Prošlog oktobra sedim kući u <strong className="text-white">3 ujutru</strong> i
                vrtim TikTok jer ne mogu da zaspim. Devojka me već nedelju dana smara <em>&quot;Kad idemo na večeru?&quot;</em> i nije kriva. Obećao sam joj &quot;normalan
                izlazak&quot;, a ja imam{" "}
                <Highlight>
                  <strong className="text-white">800 dinara</strong>
                </Highlight>
                . 800.
              </p>
              <p className="mt-4">
                Mama mi daje za užinu 1500din nedeljno i to je to. Ćale, standardno:{" "}
                <em>&quot;Idi radi nešto.&quot;</em> A ja imam <strong className="text-white">17 godina</strong>{" "}
                i u glavi jedno pitanje: gde da odem, ko mene uopšte prima?
              </p>
            </div>
          </Section>

          {/* Section 2: Discovery */}
          <Section>
            <p>
              Na tiktoku iskoči mi klip gde lik pokazuje patike koje je našao jeftino, pa
              ih preprodao za{" "}
              <Highlight>
                <strong className="text-white">skoro četiri puta više</strong>
              </Highlight>
              . Priča opušteno, kao da je kupio hleb. Meni prvo krene ono:{" "}
              <em>&quot;Ma ajde, još jedan što prodaje maglu.&quot;</em> Ali ostanem na videu.{" "}
              <strong className="text-white">
                Ne zato što verujem, nego zato što mi mozak traži bilo kakav izlaz
              </strong>{" "}
              iz tog osećaja da sam zalepljen za mesto.
            </p>
            <p className="mt-4">
              Sutradan opet isti fazon. Novi klipovi, novi ljudi, svi ponavljaju isto:{" "}
              <strong className="text-white">reselling, preprodaja</strong>,{" "}
              <em>&quot;kupi za manje - prodaj za više&quot;</em>. Deluje banalno, ali me jede.{" "}
              <Highlight>
                Dve nedelje zaredom gledam te stvari više nego što gledam serije.
              </Highlight>
            </p>
          </Section>

          {/* Section 3: Finding Real Reselling */}
          <Section>
            <div className="border-l-4 border-amber-500/50 pl-6 py-2">
              <p>
                I onda naletim na objavu sa linkom za{" "}
                <strong className="text-amber-400">Real Reselling</strong>. Uđem iz radoznalosti,
                očekujem neku besplatnu priču, kad ono cenovnik. Regularna cena{" "}
                <strong className="text-white">50 evra</strong>, ali ima neka akcija za{" "}
                <Highlight>
                  <strong className="text-white">39 evra</strong>
                </Highlight>
                . I dalje mi je to bilo mnogo, ali manje nego što sam očekivao.
              </p>
              <p className="mt-4">
                Ipak ne zatvaram odmah. Listam šta tačno piše da dobijaš. U tom trenutku mi je
                bitno samo da vidim{" "}
                <Highlight>
                  da li je konkretno ili je &quot;mindset, motivacija, veruj u sebe&quot;
                </Highlight>
                .
              </p>
              <p className="mt-4">
                Piše da vodič pokriva{" "}
                <strong className="text-white">
                  kompletnu edukaciju, zajednicu, alate za prodaju i sistem gde ne moram da imam dodir sa proizvodom
                </strong>
                , i ima primere oglasa.{" "}
                <Highlight>
                  <strong className="text-white">
                    To je prvi put da mi deluje kao nešto što se može pratiti kao recept.
                  </strong>
                </Highlight>
              </p>
            </div>
          </Section>

          {/* Section 4: Real Testimonials */}
          <Section>
            <p>
              Ne kupujem odmah. Par dana samo pratim njihov besplatan sadržaj i komentare ljudi
              koji već rade. Ono što mi je zapalo za oko{" "}
              <strong className="text-white">nisu &quot;milioni za nedelju dana&quot;</strong>, nego sitne
              stvari: klinac piše da je prodao jaknu i zaradio 3000, neko drugi da mu je prvi
              kupac tražio popust i da je uspeo da ne spusti cenu previše.
            </p>
            <p className="mt-4 text-xl text-white/90 italic">
              &quot;Te poruke su imale{" "}
              <Highlight>
                <strong>smisla</strong>
              </Highlight>
              . Nisu zvučale kao reklama, zvučale su kao{" "}
              <span className="text-amber-400">&apos;evo šta mi se desilo&apos;</span>.&quot;
            </p>
          </Section>

          {/* Section 5: Taking the Leap */}
          <Section>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
              <p>
                Onda dođe trenutak gde{" "}
                <Highlight>
                  <strong className="text-white">ili pokušavam ili nastavljam da se vrtim u krug</strong>
                </Highlight>
                . Odem kod babe i kažem joj iskreno da hoću da probam da zaradim preko interneta,
                da mi treba za jednu obuku i da ću joj vratiti od prve prodaje.
              </p>
              <p className="mt-4">
                Gledala me je par sekundi, onim njenim pogledom kao da mi skenira dušu, pa izvadi{" "}
                <strong className="text-amber-400 text-xl">100 evra</strong> i kaže:{" "}
                <em>&quot;Nemoj da mi bacaš na gluposti.&quot;</em> Kažem: <em>&quot;Neću, majke mi.&quot;</em>
              </p>
              <p className="mt-4 text-white font-medium">
                I u tom trenutku sam se osećao kao da mi je dala nešto mnogo veće od para.
              </p>
            </div>
          </Section>

          {/* Section 6: The Guide */}
          <Section>
            <p>
              Uzmem kurs za{" "}
              <Highlight>
                <strong className="text-white">39 evra</strong>
              </Highlight>
              . Ostane mi oko 60 evra keša - dovoljno da krenem sa prvom robom. I tad me uhvati panika:{" "}
              <Highlight>
                <strong className="text-white">dobro, sada mora da se desi nešto, jer nema nazad.</strong>
              </Highlight>
            </p>
            <p className="mt-4">
              Vodič me nije dočekao sa motivacionim govorom. Prva stranica bukvalno:{" "}
              <strong className="text-white">kako da napravim profil koji ne izgleda kao prevara</strong>.
              Koje slike da stavim, šta da napišem u opis, kako da odgovaram ljudima da ne
              delujem kao klinac koji pokušava da ih navuče.
            </p>

            {/* Guide Details Box */}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-[#12171E]/80 p-4">
                <span className="text-amber-500 font-semibold text-sm">📝 Komunikacija</span>
                <p className="mt-2 text-base text-neutral-400">
                  Šablon poruke kad ti neko napiše &quot;poslednja cena?&quot; i šablon kako da kažeš &quot;ne&quot; bez svađe.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#12171E]/80 p-4">
                <span className="text-amber-500 font-semibold text-sm">📸 Fotkanje</span>
                <p className="mt-2 text-base text-neutral-400">
                  Svetlo pored prozora, bela pozadina, četiri ugla, detalj đona, detalj etikete.
                </p>
              </div>
            </div>
          </Section>

          {/* Section 7: First Purchase */}
          <Section>
            <p>
              Pošto nisam imao para za ne znam kakvu robu, krenem od onoga što znam da ljudi
              kupuju stalno: <strong className="text-white">patike</strong>. Nađem oglas na
              KupujemProdajem za Nike Air Max,{" "}
              <strong className="text-amber-400">2500 dinara</strong>. Realno, čim vidiš tu cenu
              odmah pomisliš fejk.
            </p>
            <p className="mt-4">
              I ja sam. Zato{" "}
              <Highlight>
                <strong className="text-white">ne kupujem na slepo</strong>
              </Highlight>
              . Pitam lika dodatne slike etikete, đona i unutrašnjosti. Nađem se s njim, pogledam
              uživo, probam da uporedim šavove i materijal sa slikama originala koje sam našao
              ranije, i uzmem.
            </p>
          </Section>

          {/* Section 8: First Sale */}
          <Section>
            <div className="rounded-2xl border border-white/10 bg-[#12171E]/60 p-6 sm:p-8">
              <p>
                Dođem kući i{" "}
                <strong className="text-white">dva sata ih čistim</strong>. Ne ono &quot;polio vodom i
                gotovo&quot;, nego četkica, malo deterdženta, krpa, sušenje kako treba. Onda ih fotkam
                tačno po onom spisku iz vodiča. Napravim oglas, napišem realno stanje, stavim da
                je moguće lično preuzimanje i slanje. Cenu stavim{" "}
                <strong className="text-amber-400">5500 dinara</strong>.
              </p>
              <p className="mt-4">
                Prva dva dana niko. I ja već krećem da paničim. Trećeg dana stiže poruka:{" "}
                <em>&quot;Može za 5000?&quot;</em> I tu mi se desi ono što vodič pominje, a ja nisam
                verovao.{" "}
                <Highlight>
                  <strong className="text-white">Ljudi pregovaraju iz navike.</strong>
                </Highlight>{" "}
                Prihvatim 5000. Dođe lik, pogleda, uzme, plati.
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

          {/* Section 9: The Realization */}
          <Section>
            <p className="text-xl text-white leading-relaxed">
              Tu mi je prvi put u glavi kliknulo da{" "}
              <Highlight>
                <strong>nije poenta u jednoj prodaji, nego u ponavljanju</strong>
              </Highlight>
              . Nisam se tad osećao kao &quot;biznismen&quot;. Osećao sam se kao neko ko je{" "}
              <strong>našao kvaku na vratima koja su mu stalno bila zaključana</strong>.
            </p>
          </Section>

          {/* Section 10: Growth & Learning */}
          <Section>
            <p>
              Posle te prodaje vratim babi deo kako sam obećao, da vidi da nisam bacio. Onda
              uzmem još jednu stvar za preprodaju, pa još jednu. Jednom sam se zeznuo i uzeo
              majicu koja je stajala dve nedelje bez ikakve poruke.
            </p>
            <p className="mt-4">
              Tad sam shvatio da{" "}
              <Highlight>
                <strong className="text-white">nije svaka &quot;jeftina stvar&quot; dobra stvar</strong>
              </Highlight>
              . Mora da postoji potražnja, mora da ima smisla veličina, stanje, brend, sezona.
              Počeo sam da vodim belešku: šta se javlja brzo, šta stoji, šta ljudi najčešće
              pitaju.
            </p>
          </Section>

          {/* Section 11: Community */}
          <Section>
            <div className="border-l-4 border-amber-500/50 pl-6 py-2">
              <p>
                Uz kurs dobio sam i{" "}
                <strong className="text-amber-400">pristup zajednici</strong>. Tu sam prvi put
                dobio osećaj da{" "}
                <Highlight>
                  <strong className="text-white">nisam sam</strong>
                </Highlight>
                . Ne zbog &quot;mentorstva&quot; kao reči, nego zbog toga što kad zapnem, ne trošim tri
                dana na nagađanje.
              </p>
              <p className="mt-4">
                Napišem konkretno pitanje, ljudi mi odgovore iz svog iskustva. Nekad u 10 minuta,
                nekad za sat, ali mi odgovore. I više puta su me{" "}
                <strong className="text-white">spasili od gluposti</strong>, tipa kad mi je jedan
                kupac pokušao da uvali priču{" "}
                <em>&quot;poslaću kurira, samo mi pošalji broj kartice&quot;</em>.
              </p>
            </div>
          </Section>

          {/* Section 12: Results */}
          <Section>
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-6 sm:p-8">
              <p className="text-lg">
                <strong className="text-white text-xl">Četiri meseca kasnije</strong> nisam
                postao milioner i neću da glumim da jesam. Ali desilo se nešto što mi je tad
                delovalo nemoguće:
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-amber-500">✓</span>
                  <span>
                    <Highlight>
                      <strong className="text-white">
                        Izveo sam devojku u lokal i nisam brojao u glavi koliko mi ostaje posle
                        računa.
                      </strong>
                    </Highlight>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-amber-500">✓</span>
                  <span>
                    Kupio sam sebi{" "}
                    <strong className="text-white">patike koje sam godinama gledao</strong> i
                    preskakao.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-amber-500">✓</span>
                  <span>
                    I najbitnije,{" "}
                    <Highlight>
                      <strong className="text-white">
                        prestao sam da tražim od mojih za svaku sitnicu
                      </strong>
                    </Highlight>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </Section>

          {/* Section 13: The Mindset Shift */}
          <Section>
            <p className="text-lg">
              Najčudniji deo cele priče je što mi nije promenilo život &quot;mnogo para&quot;, nego{" "}
              <Highlight>
                <strong className="text-white text-xl">
                  osećaj da mogu da napravim pare kad mi zatreba, a ne da čekam da mi neko da
                </strong>
              </Highlight>
              .
            </p>
            <p className="mt-4">
              Da me ne ubije ona rečenica <em>&quot;idi radi negde&quot;</em> jer sada imam odgovor:{" "}
              <strong className="text-amber-400">radim, samo na svoj način</strong>.
            </p>
          </Section>

          {/* Section: Best Purchase */}
          <Section>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 text-center">
              <p className="text-xl text-white">
                Tih{" "}
                <Highlight>
                  <strong className="text-amber-400 text-2xl">39 evra</strong>
                </Highlight>{" "}
                su mi doneli više nego bilo šta što sam ikad kupio.
              </p>
              <p className="mt-4 text-neutral-400">
                Ne zato što sam odmah obogatio, nego zato što sam{" "}
                <strong className="text-white">naučio kako da zaradim kad god mi treba</strong>.
                To je veština koja mi ostaje zauvek.
              </p>
            </div>
          </Section>

          {/* Section 14: Conclusion */}
          <Section>
            <div className="text-center py-8">
              <p className="text-lg text-neutral-400">
                I dalje sam klinac, i dalje pravim greške, i dalje me ponekad mrzi da fotkam i
                pišem oglase.
              </p>
              <p className="mt-6 text-2xl sm:text-3xl font-display text-white">
                Ali više nemam onaj osećaj da sam{" "}
                <span className="line-through text-neutral-500">bez izbora</span>.
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
