import Link from "next/link";

/**
 * Uslovi i politika (Terms) — Real Reselling (App Router)
 * - Minimalno, jasno, srpski jezik (latinica)
 * - Next.js 15 (app/) — koristi `export const metadata` umesto <Head>
 * - TailwindCSS za stilove (prose)
 * - Server Component (bez "use client"): nema hydration mismatch-a
 */

export const metadata = {
  title: "Uslovi i politika | Real Reselling",
  description:
    "Uslovi korišćenja i politika privatnosti za Real Reselling. Jasna i kratka pravila korišćenja platforme.",
  robots: { index: false, follow: true },
};

function formatLastUpdated(date: Date) {
  return new Intl.DateTimeFormat("sr-RS", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function TermsPage() {
  // Server component => izračunato na serveru; nema klijentske razlike
  const lastUpdated = formatLastUpdated(new Date());

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Uslovi i politika</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Poslednje ažuriranje: {lastUpdated}
      </p>

      <section>
        <h2>1. Opšte informacije</h2>
        <p>
          Real Reselling je onlajn platforma kojom upravlja <strong>RR Team Consulting LLC</strong>,
          registrovano privredno društvo u saveznoj državi Vajoming, SAD. Platforma deluje kao
          posrednik između kupaca i prodavaca i ne preuzima vlasništvo nad ponudama trećih lica.
        </p>
      </section>

      <section>
        <h2>2. Korišćenje sajta</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pristupom i korišćenjem sajta prihvatate ove uslove.</li>
          <li>Zabranjeni su lažno predstavljanje, zloupotreba sadržaja i prevare.</li>
          <li>Sadržaj (opisi, slike, cene) je informativan i može da se menja bez najave.</li>
        </ul>
      </section>

      <section>
        <h2>3. Prodaja i plaćanje</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Transakcije se realizuju po dogovoru između kupca i posrednika.</li>
          <li>Cene i dostupnost proizvoda podložne su promenama u bilo kom trenutku.</li>
          <li>Kupac je dužan da proveri tačnost unetih podataka pre uplate.</li>
        </ul>
      </section>

      <section>
        <h2>4. Odgovornost</h2>
        <p>Real Reselling ne odgovara za:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>greške u opisu, ceni ili dostupnosti proizvoda;</li>
          <li>kašnjenja u isporuci, oštećenja ili gubitke tokom transporta;</li>
          <li>radnje i zloupotrebe trećih lica.</li>
        </ul>
        <p>Korišćenje usluga je na sopstvenu odgovornost kupaca i prodavaca.</p>
      </section>

      <section>
        <h2>5. Privatnost i podaci</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Lični podaci koriste se isključivo za komunikaciju i realizaciju porudžbina.</li>
          <li>
            Podaci se ne dele sa trećim stranama osim kada je to zakonski obavezno ili nužno
            za izvršenje usluge.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Izmene uslova</h2>
        <p>
          Zadržavamo pravo izmene ovih uslova u bilo kom trenutku bez prethodne najave.
          Korisnici treba povremeno da provere ovu stranicu.
        </p>
      </section>

      <section>
        <h2>7. Kontakt</h2>
        <p>
          Za pitanja ili informacije pišite na{" "}
          <a href="mailto:support@realreselling.com">support@realreselling.com</a>{" "}
          ili nam se obratite putem kanala navedenih na sajtu.
        </p>
      </section>

      <section>
        <h2>8. Garancija</h2>
        <p>
          Garancija važi samo ukoliko je korisnik dokazivo ispunio najmanje 90% programa i pratećih
          instrukcija (npr. praćenje modula, izvršene zadatke, dostavljene evidencije).
          U suprotnom, garancija se poništava. Ova odredba sprečava zloupotrebu usluga.
        </p>
      </section>

      <section>
        <h2>9. Odricanje od odgovornosti (Disclaimer)</h2>
        <p>
          RR Team Consulting pruža edukativne i konsultantske usluge za preduzetnike i mala
          preduzeća. Obuke, strategijske smernice i digitalni resursi služe isključivo u
          edukativne svrhe. Ne garantujemo specifične rezultate ili zaradu, jer ishodi zavise od
          individualnog angažovanja i okolnosti svakog korisnika.
        </p>
      </section>

      <hr className="my-8" />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Napomena: Ovaj tekst je informativnog karaktera i ne predstavlja pravni savet.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="no-underline inline-flex items-center rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Nazad na početnu
        </Link>
      </div>
    </main>
  );
}
