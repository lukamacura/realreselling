"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Gift} from "lucide-react";


function useTomorrowDMY() {
  return useMemo(() => {
    const now = new Date();
    // +1 dan
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // lokalna ponoć
    // label: D.M.YYYY.
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const label = `${day}.${month}.${year}.`;

    // HTML <time> sme da ima samo datum (YYYY-MM-DD)
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateAttr = `${year}-${pad(month)}-${pad(day)}`;

    return { label, dateAttr }; 
  }, []);
}

export default function SpecialOffer() {
  const tomorrow = useTomorrowDMY();

  return (
    <section className="bg-brand-dark py-0 md:py-8 mx-auto">
      <div className="container mx-auto max-w-[980px] px-4 text-center">
        <h2 className="font-display leading-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Ovo bi ukupno platio
          <br />
          <span className="inline-block mt-2">230€ sa bonusima</span>
        </h2>

        <div className="mt-8 font-display text-brand-gold text-5xl sm:text-6xl md:text-7xl">
          ALI
        </div>

        <p className="mt-8 font-display leading-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Imamo specijalnu
          <br />
          ponudu za tebe
        </p>


        <div className="mt-10 ">
          <Link
            href="#cena"
            className="flex items-center justify-center font-display w-full max-w-[640px] rounded-[28px] bg-gradient-to-b from-amber-400 to-amber-600 px-6 py-8 text-xl font-bold text-black shadow-[0_10px_30px_rgba(212,160,32,.35)] transition hover:bg-brand-goldDark active:scale-[.99]"
          >
            {/* može i emoji direktno */}
           <Gift className="mb-2 h-9 w-9 text-brand-black" />

            Želim da dobijem specijalnu ponudu
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/80">
          Ovu ponudu možemo garantovati do{" "}
          <time dateTime={tomorrow.dateAttr}>{tomorrow.label}</time>
        </p>
      </div>
    </section>
  );
}
