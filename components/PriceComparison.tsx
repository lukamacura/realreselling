import React from "react";
import { ArrowRight, Check, Info } from "lucide-react";

/**
 * Komponenta: PriceComparison
 * "Usporedba" cene: van grupe vs sa grupom
 * - Prikazuje dve kartice (Van grupe / Sa grupom)
 * - Izračunava uštedu i procenat
 * - Dugme za Telegram (free grupa) za poručivanje VAN grupe
 * - Opcioni CTA za pridruživanje grupi (ako proslediš groupUrl)
 *
 * TailwindCSS i lucide-react ikonice.
 */

export type PriceComparisonProps = {
  productName?: string;
  priceRegular: number; // Cena van grupe
  priceWithGroup: number; // Cena sa grupom
  currency?: string; // npr. "RSD" ili "€"
  telegramUrl: string; // link do FREE Telegram grupe (poručivanje van grupe)
  groupUrl?: string; // opcioni link ka "grupi" (ako želiš CTA)
  className?: string;
  featuresOutside?: string[]; // benefiti van grupe
  featuresWithGroup?: string[]; // benefiti sa grupom
};

const fmt = (v: number, currency = "RSD") =>
  new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RSD" ? 0 : 2,
  }).format(v);

const badge = (
  label: string,
  style = "bg-amber-400 text-black"
) => (
  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${style}`}>
    {label}
  </span>
);

const li = (text: string) => (
  <li key={text} className="flex items-start gap-2">
    <Check className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{text}</span>
  </li>
);

const PriceComparison: React.FC<PriceComparisonProps> = ({
  productName = "Proizvod",
  priceRegular,
  priceWithGroup,
  currency = "RSD",
  telegramUrl,
  groupUrl,
  className = "",
  featuresOutside = [
    "Poručivanje kroz FREE Telegram grupu",
    "Plaćanje po dogovoru",
    "Osnovna podrška",
  ],
  featuresWithGroup = [
    "Niža nabavna cena",
    "Prioritetna dostupnost",
    "Predlozi proizvoda sa većom maržom",
  ],
}) => {
  const saving = Math.max(0, priceRegular - priceWithGroup);
  const savingPct = priceRegular > 0 ? Math.round((saving / priceRegular) * 100) : 0;

  return (
    <section className={`w-full bg-[#0B0F13] text-white py-12 ${className}`}>
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold">Usporedba cena</h2>
          <p className="mt-2 text-white/70">
            {productName}: van grupe vs sa grupom
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Van grupe */}
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#12171E] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Van grupe</h3>
              {badge("FREE Telegram", "bg-white/10 text-white border border-white/15")}
            </div>

            <div className="mb-6 flex items-end gap-2">
              <span className="text-4xl font-bold">{fmt(priceRegular, currency)}</span>
            </div>

            <ul className="space-y-2 text-white/90">
              {featuresOutside.map(li)}
            </ul>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black px-4 py-3 font-medium hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Poruči VAN grupe
              <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-4 flex items-start gap-2 text-xs text-white/60">
              <Info className="mt-0.5 h-4 w-4" />
              <p>Poručivanje preko FREE Telegram grupe za korisnike koji nisu u plaćenoj/grupnoj nabavci.</p>
            </div>
          </div>

          {/* Sa grupom */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-[#1A212A] p-6 ring-1 ring-amber-400/20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sa grupom</h3>
              {saving > 0 && badge(`Ušteda ${fmt(saving, currency)} · ${savingPct}%`) }
            </div>

            <div className="mb-2 flex items-end gap-3">
              <span className="text-4xl font-bold text-amber-300">{fmt(priceWithGroup, currency)}</span>
              <span className="text-white/50 line-through">{fmt(priceRegular, currency)}</span>
            </div>

            <ul className="space-y-2 text-white/90">
              {featuresWithGroup.map(li)}
            </ul>

            {groupUrl ? (
              <a
                href={groupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-black px-4 py-3 font-semibold hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Pridruži se grupi
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                disabled
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-white/70 px-4 py-3 font-medium cursor-not-allowed"
              >
                Pridruži se grupi (uskoro)
              </button>
            )}

            <p className="mt-4 text-xs text-white/60">
              Cena u grupi dostupna je kroz zajedničku nabavku / dogovorene uslove.
            </p>
          </div>
        </div>

        {/* Sažetak uštede */}
        {saving > 0 && (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-sm text-white/80">
              Procena uštede za <strong>{productName}</strong>: <strong>{fmt(saving, currency)}</strong> ({savingPct}%).
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PriceComparison;
