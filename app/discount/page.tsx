"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles, GraduationCap, Users, Wrench,
  Zap, ShieldCheck, CheckCircle2, CreditCard, Landmark,
  Notebook
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  basePrice?: number;
  regularPrice?: number;
  couponCode?: string;
  couponValue?: number;
  onContinue?: (payload: {
    method: "uplatnica" | "kartica";
    codeApplied: boolean;
    code?: string;
    priceToPay: number;
  }) => void;
};

export default function DiscountSection({
  basePrice = 60,
  regularPrice = 230,
  couponCode = "RRS25",
  couponValue = 10,
  onContinue,
}: Props) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [method, setMethod] = useState<"uplatnica" | "kartica">("uplatnica");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // --- NOVO: animirana prikazana cena ---
  const [displayPrice, setDisplayPrice] = useState(basePrice);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ako se promeni polazna cena, resetuj prikaz
  useEffect(() => {
    setDisplayPrice(basePrice);
  }, [basePrice]);

  // pokreni animaciju kad (ne)primeniš kupon
  useEffect(() => {
    const target = applied ? Math.max(0, basePrice - couponValue) : basePrice;

    // prekini staru animaciju ako je ima
    if (animRef.current) {
      clearInterval(animRef.current);
      animRef.current = null;
    }
    if (displayPrice === target) return;

    const TICK_MS = 35; // brzina smene cifara (manje = brže)

    animRef.current = setInterval(() => {
      setDisplayPrice((prev) => {
        if (prev === target) {
          if (animRef.current) {
            clearInterval(animRef.current);
            animRef.current = null;
          }
          return prev;
        }
        const dir = prev < target ? 1 : -1; // gore ili dole
        const next = prev + dir;
        // clamp da ne preskoči cilj
        if ((dir > 0 && next > target) || (dir < 0 && next < target)) return target;
        return next;
      });
    }, TICK_MS);

    return () => {
      if (animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, basePrice, couponValue]); // namerno bez displayPrice da ne restartuje na svaki tick
  // --- /NOVO ---

  const priceToPay = useMemo(() => {
    return applied ? Math.max(0, basePrice - couponValue) : basePrice;
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
const router = useRouter();

  function handleContinue() {
  const payload = {
    method,
    codeApplied: applied,
    code: applied ? couponCode : undefined,
    priceToPay,
  };

  onContinue?.(payload);

  if (method === "uplatnica") {
    const qs = new URLSearchParams();
    qs.set("price", String(priceToPay));
    if (applied) qs.set("code", couponCode);
    router.push(`/uplatnica?${qs.toString()}`);
    return;
  }
  if (method === "kartica") {
    const qs = new URLSearchParams();
    qs.set("price", String(priceToPay));
    if (applied) qs.set("code", couponCode);
    router.push(`/kartica?${qs.toString()}`);
    return;
  }

  // (opciono) ako želiš redirect i za karticu:
  // router.push(`/checkout-card?price=${priceToPay}${applied ? `&code=${couponCode}` : ""}`);
}


  return (
    <section className="relative overflow-hidden bg-[#0B0F13] text-white">
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

            {/* sadržaj paketa */}
            <div className="mt-6 grid gap-4 rounded-xl bg-[#0E1319] p-4 ring-1 ring-white/5">
              <div className="grid grid-cols-1 gap-3">
                <Image src="/hero.png" alt="" width={2000} height={2000} className="h-auto mx-auto w-full rounded-md object-contain" />
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
                <Bonus icon={Zap} text="La Digitale - Neko želi da kupi Netflix, ti ga kupiš po najnižoj ceni, i njemu prodaš po višoj." value="(vrednost: 40 €)"/>
                <Bonus icon={Notebook} text="Contactless opcija - mi šaljemo proizvode direktno kupcima, ti samo ubaciš profiti" value="(vrednost: 40 €)"/>
                <Bonus icon={ShieldCheck} text="Pravo na povraćaj novca ili zamenu proizvoda u bilo kojoj situaciji" />
                <div className="pt-1 text-right text-sm text-zinc-300">
                  Ukupno: <span className="font-semibold text-white">80€</span>
                </div>
              </div>
            </div>

            {/* cene */}
            <div className="mt-6 text-center">
              <p className="text-sm font-extrabold text-zinc-300 line-through decoration-rose-500/80 decoration-4">
                Redovna: {regularPrice}€
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-amber-300 sm:text-3xl">
                Cena: <span className="text-white">{displayPrice}€</span>
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
                  placeholder="Ovde unesite kod (npr. RXXX5)"
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
              className="mt-6 w-full border rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-4 py-8 text-3xl shadow-[0_12px_36px_rgba(212,160,32,0.25)] text-black font-display font-bold transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Hoću da zarađujem od resellinga — {displayPrice}€
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* helpers */

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

function Bonus({ icon: Icon, text, value }: { icon: LucideIcon; text: string; value?: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0 rounded-full bg-amber-500/15 p-1.5 text-amber-300 ring-1 ring-amber-500/30">
        <Icon className="h-4 w-4" />
      </span>
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
