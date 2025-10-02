// components/DiscountSection.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Sparkles, GraduationCap, Users, Wrench,
  BadgeCheck, CheckCircle2, CreditCard, Landmark
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  basePrice?: number;        // Cena koju prikazuješ pre koda (60)
  regularPrice?: number;     // "Redovna 250€"
  couponCode?: string;       // ispravan kod (RRS25)
  couponValue?: number;      // iznos popusta (10)
  onContinue?: (payload: {
    method: "uplatnica" | "kartica";
    codeApplied: boolean;
    code?: string;
    priceToPay: number;
  }) => void;
};

export default function DiscountSection({
  basePrice = 60,
  regularPrice = 250,
  couponCode = "RRS25",
  couponValue = 10,
  onContinue,
}: Props) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [method, setMethod] = useState<"uplatnica" | "kartica">("uplatnica");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const priceToPay = useMemo(() => {
    if (applied) return Math.max(0, basePrice - couponValue);
    return basePrice;
  }, [applied, basePrice, couponValue]);

  function applyCode() {
    const ok = code.trim().toUpperCase() === couponCode.toUpperCase();
    setApplied(ok);
    setError(ok ? "" : "Netačan kod. Pokušaj ponovo.");
  }

  async function copyCodeToInput() {
    setCode(couponCode);
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op
    }
  }

  function handleContinue() {
    onContinue?.({
      method,
      codeApplied: applied,
      code: applied ? couponCode : undefined,
      priceToPay,
    });
    // ovde po želji: router.push("/checkout?method=...&price=...&code=...")
  }

  return (
    <section className="relative overflow-hidden bg-[#0B0F13] text-white">
      {/* zlatni glow pozadina */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-15%] top-[-20%] h-[160%] w-[70%] opacity-70"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />
      <div className="container mx-auto max-w-[1200px] px-4 py-10 sm:py-14">
        <div className="grid items-start">
          <div className="relative rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6 md:p-7">
            <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

            <h2 className="text-center text-2xl font-extrabold text-amber-300 sm:text-3xl">
              Unesite promo kod i ostvarite popust od 10€
            </h2>

            {/* “sadržaj paketa” kao u offeru */}
            <div className="mt-6 grid gap-4 rounded-xl bg-[#0E1319] p-4 ring-1 ring-white/5">
              <div className="grid grid-cols-3 gap-3">
                <Image src="/hero.png" alt="" width={500} height={300} className="h-auto w-full rounded-md object-contain" />
                <Image src="/hero.png" alt="" width={500} height={300} className="h-auto w-full rounded-md object-contain" />
                <Image src="/hero.png" alt="" width={500} height={300} className="h-auto w-full rounded-md object-contain" />
              </div>

              <ul className="mt-3 space-y-3 text-sm sm:text-base">
                <Feature icon={GraduationCap} text="Vodiči i edukacija" priceNote="(vrednost: 60€)" />
                <Feature icon={Users} text="Zajednica i podrška" priceNote="(vrednost: 50€)" />
                <Feature icon={Wrench} text="Alati za rast" priceNote="(vrednost: 40€)" />
                <li className="pt-1 text-right text-sm text-zinc-300">
                  Ukupno: <span className="font-semibold text-white">150€</span>
                </li>
              </ul>

              <div className="my-2 h-px bg-white/10" />

              <div className="space-y-2">
                <Bullet text="Cilj: prva online prodaja za najviše mesec dana" value="(vrednost: 60€)" />
                <Bullet text="Contactless opcija — mi šaljemo proizvode direktno kupcima" value="(vrednost: 40€)" />
                <Bullet text="Povraćaj novca ili zamena u bilo kojoj situaciji" />
                <div className="pt-1 text-right text-sm text-zinc-300">
                  Ukupno: <span className="font-semibold text-white">100€</span>
                </div>
              </div>
            </div>

            {/* cene */}
            <div className="mt-6 text-center">
              <p className="text-sm font-extrabold text-zinc-300 line-through decoration-rose-500/80 decoration-4">
                Redovna: {regularPrice}€
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-amber-300 sm:text-3xl">
                Cena: <span className="text-white">{basePrice}€</span>
              </p>
            </div>

            {/* kod */}
            <div className="mt-5">
              <label htmlFor="promo" className="block text-sm font-semibold text-white/80">
                Kod:
              </label>
              <div className="mt-2 flex items-stretch gap-2">
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Unesite kod (npr. RRS25)"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0E1319] px-3 py-3 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                />
                <button
                  onClick={applyCode}
                  className="rounded-xl bg-amber-400 px-4 font-semibold text-black shadow-[0_10px_30px_rgba(212,160,32,0.35)] transition hover:brightness-95"
                >
                  Primeni
                </button>
                <button
                  onClick={copyCodeToInput}
                  className="rounded-xl border border-white/10 px-3 text-sm text-white/80 transition hover:bg-white/5"
                  title="Kopiraj RRS25 u polje"
                >
                  {copied ? "Kopirano" : "Kopiraj kod"}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
              {applied && (
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Kod je prihvaćen — nova cena: {priceToPay}€
                </p>
              )}
            </div>

            {/* metode plaćanja */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <PaymentOption
                icon={Landmark}
                label="Uplatnica (bez kartice)"
                active={method === "uplatnica"}
                onSelect={() => setMethod("uplatnica")}
              />
              <PaymentOption
                icon={CreditCard}
                label="Kartica"
                active={method === "kartica"}
                onSelect={() => setMethod("kartica")}
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              className="mt-6 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-4 text-lg font-bold text-amber-300 shadow-[0_12px_36px_rgba(212,160,32,0.25)] transition hover:bg-amber-500/15 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Hoću da zarađujem od resellinga {applied && <span className="text-white">— {priceToPay}€</span>}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* — helpers — */

function Feature({ icon: Icon, text, priceNote }: { icon: LucideIcon; text: string; priceNote?: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0 rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-zinc-200">
        <span className="font-medium text-white">{text}</span>{" "}
        {priceNote && <span className="text-zinc-400">{priceNote}</span>}
      </p>
    </li>
  );
}

function Bullet({ text, value }: { text: string; value?: string }) {
  return (
    <div className="flex items-start gap-2">
      <BadgeCheck className="mt-0.5 h-4 w-4 text-amber-300" />
      <p className="text-zinc-200">
        {text} {value && <span className="text-zinc-400">{value}</span>}
      </p>
    </div>
  );
}

function PaymentOption({
  icon: Icon,
  label,
  active,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
        active ? "border-amber-400 bg-amber-400/10" : "border-white/10 hover:bg-white/5"
      }`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-white/90">{label}</span>
    </button>
  );
}
