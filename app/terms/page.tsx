import React from "react";
import Head from "next/head";
import Link from "next/link";

/**
 * Terms page (Uslovi i politika) for Real Reselling
 * - Minimalno, jasno, na srpskom jeziku
 * - Prilagođeno Next.js (app ili pages) — koristi <Head> i <Link>
 * - TailwindCSS za stilove
 */

const TermsPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Head>
        <title>Uslovi i politika | Real Reselling</title>
        <meta
          name="description"
          content="Uslovi korišćenja i politika privatnosti za Real Reselling. Jasna i kratka pravila korišćenja platforme."
        />
        <meta name="robots" content="noindex,follow" />
      </Head>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 prose prose-neutral dark:prose-invert">
        <h1 className="mb-2">Uslovi i politika</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Poslednje ažuriranje: {lastUpdated}</p>

        <section>
          <h2>1. Opšte informacije</h2>
          <p>
            Real Reselling je online platforma koja posreduje u prodaji i
            preprodaji proizvoda. Real Reselling <strong>nije registrovana firma</strong> i
            deluje kao posrednik između kupaca i prodavaca, bez pravnog statusa
            preduzeća.
          </p>
        </section>

        <section>
          <h2>2. Korišćenje sajta</h2>
          <ul>
            <li>Pristupom i korišćenjem sajta prihvatate ove uslove.</li>
            <li>Zabranjeni su lažno predstavljanje, zloupotreba sadržaja i prevare.</li>
            <li>Sadržaj (opisi, slike, cene) je informativan i može se menjati bez najave.</li>
          </ul>
        </section>

        <section>
          <h2>3. Prodaja i plaćanje</h2>
          <ul>
            <li>Transakcije se odvijaju po dogovoru između kupca i posrednika.</li>
            <li>Cene i dostupnost proizvoda podložni su promenama u bilo kom trenutku.</li>
            <li>Kupac je dužan da proveri tačnost unetih podataka pre uplate.</li>
          </ul>
        </section>

        <section>
          <h2>4. Odgovornost</h2>
          <p>Real Reselling ne preuzima odgovornost za:</p>
          <ul>
            <li>greške u opisu, ceni ili dostupnosti proizvoda,</li>
            <li>kašnjenja u isporuci, oštećenja ili gubitke tokom transporta,</li>
            <li>zloupotrebu informacija od strane trećih lica.</li>
          </ul>
          <p>Korišćenje usluga je na sopstvenu odgovornost kupaca i prodavaca.</p>
        </section>

        <section>
          <h2>5. Privatnost i podaci</h2>
          <ul>
            <li>Lični podaci se koriste isključivo za komunikaciju i realizaciju porudžbina.</li>
            <li>Podaci se ne dele sa trećim stranama osim kada je to zakonski obavezno.</li>
          </ul>
        </section>

        <section>
          <h2>6. Promene uslova</h2>
          <p>
            Real Reselling zadržava pravo izmene ovih uslova u bilo kom trenutku bez
            prethodne najave. Korisnici treba redovno da proveravaju ovu stranicu.
          </p>
        </section>

        <section>
          <h2>7. Kontakt</h2>
          <p>
            Za pitanja ili informacije, pišite nam putem e‑pošte ili društvenih mreža
            navedenih na sajtu.
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
    </>
  );
};

export default TermsPage;
