"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles, CreditCard, Landmark, CheckCircle2, AlertTriangle, ClipboardCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { postRRSWebhook } from "@/lib/webhook";
import { track } from "@/lib/pixel";


const LEAD_KEY = "rrs_lead_v1";

function saveLeadToStorage(lead: {
  name: string;
  email: string;
  code?: string;
  price: number;
  method: "uplatnica" | "kartica";
}) {
  const ttlMinutes = 72 * 60; // važi 72h
  const payload = {
    ...lead,
    exp: Date.now() + ttlMinutes * 60 * 1000,
  };
  try {
    localStorage.setItem(LEAD_KEY, JSON.stringify(payload));
  } catch {}
}

// ✅ Partial upsert (koristi se kad se samo kupon primeni)
function upsertLead(partial: {
  name?: string;
  email?: string;
  code?: string;
  price?: number;
  method?: "uplatnica" | "kartica";
}) {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    const cur = raw ? JSON.parse(raw) : {};
    const next = {
      ...cur,
      ...partial,
      exp: Date.now() + 72 * 60 * 60 * 1000, // produži važenje 72h
    };
    localStorage.setItem(LEAD_KEY, JSON.stringify(next));
  } catch {}
}

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
    name: string;
    email: string;
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
  const [missingCodeWarn, setMissingCodeWarn] = useState(false);

  // animirana cena
  const [displayPrice, setDisplayPrice] = useState(basePrice);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const couponPanelRef = useRef<HTMLDivElement>(null);
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const normCode = (c?: string) => (c ? String(c).trim().toUpperCase() : undefined);

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  useEffect(() => setDisplayPrice(basePrice), [basePrice]);

  useEffect(() => {
    const target = applied ? Math.max(0, basePrice - couponValue) : basePrice;

    // prekini staru animaciju
    if (animRef.current) {
      clearInterval(animRef.current);
      animRef.current = null;
    }
    if (displayPrice === target) return;

    const TICK_MS = 35;
    animRef.current = setInterval(() => {
      setDisplayPrice((prev) => {
        if (prev === target) {
          if (animRef.current) {
            clearInterval(animRef.current);
            animRef.current = null;
          }
          return prev;
        }
        const dir = prev < target ? 1 : -1;
        const next = prev + dir;
        return (dir > 0 && next > target) || (dir < 0 && next < target) ? target : next;
      });
    }, TICK_MS);

    return () => {
      if (animRef.current) {
        clearInterval(animRef.current);
        animRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, basePrice, couponValue]);

  const priceToPay = useMemo(
    () => (applied ? Math.max(0, basePrice - couponValue) : basePrice),
    [applied, basePrice, couponValue]
  );

  function applyCode() {
    const normalized = normCode(code);
    const ok = normalized === normCode(couponCode);

    setApplied(ok);
    setError(ok ? "" : "Netačan kod. Pokušaj ponovo.");

    if (!ok) {
      inputRef.current?.focus();
      return;
    }

    setMissingCodeWarn(false);

    // ✅ ODMAH zapiši u LS da /uplatnica i /kartica znaju za kupon i cenu
    upsertLead({
      code: normalized,                              // npr. "RRS25"
      price: Math.max(0, basePrice - couponValue),   // 50€
      name: name?.trim() || undefined,               // ako je već upisao
      email: email?.trim() || undefined,
      method,                                        // trenutna metoda
    });
  }

  async function copyCodeToInput() {
    setCode(couponCode);
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* no-op */
    }
    inputRef.current?.focus();
  }

  const router = useRouter();

  function handleContinue() {
    // 1) Kod obavezan
    if (!applied) {
      setMissingCodeWarn(true);
      setError("");
      inputRef.current?.focus();
      couponPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2) Ime/Email obavezni
    let ok = true;
    if (name.trim().length < 3) {
      setNameErr("Unesi ime.");
      nameInputRef.current?.focus();
      ok = false;
    }
    if (!validateEmail(email)) {
      setEmailErr("Unesi validan email.");
      if (ok) emailInputRef.current?.focus();
      ok = false;
    }
    if (!ok) return;

    // 3) Emituj payload
    const payload = {
      method,
      codeApplied: applied,
      code: applied ? normCode(couponCode) : undefined,
      priceToPay,
      name,
      email,
    };
    onContinue?.(payload);



  void track("Lead - prosao discount", {
    value: priceToPay,
    currency: "EUR",
    num_items: 1,
    contents: [{ id: "RRS_PROGRAM", quantity: 1, item_price: priceToPay }],
    content_type: "product",
    coupon: applied ? normCode(couponCode) : undefined,
    payment_method: method,
  });
    postRRSWebhook({
      event: "lead_checkout_started",
      email,
      name,
      price: priceToPay,
      code: applied ? normCode(couponCode) : undefined,
      method,
      ts: new Date().toISOString(),
      utm: {
        utm_source: new URLSearchParams(window.location.search).get("utm_source"),
        utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
        utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
      },
    });

    // 4) Prosledi kroz query
    const qs = new URLSearchParams();
    qs.set("price", String(priceToPay));
    if (applied) qs.set("code", normCode(couponCode)!);
    qs.set("name", name);
    qs.set("email", email);

    // 3.5) Sačuvaj lead u localStorage (fallback ako user dođe kasnije)
    saveLeadToStorage({
      name,
      email,
      code: applied ? normCode(couponCode) : undefined,
      price: priceToPay,
      method,
    });

    router.push(`${method === "uplatnica" ? "/uplatnica" : "/kartica"}?${qs.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-[#0B0F13] text-white">
      <div className="container mx-auto max-w-[1000px] px-4 py-10 sm:py-14">
        <div className="relative rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6 md:p-7">
          <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          {/* 1) KUPON PANEL */}
          <div
            ref={couponPanelRef}
            className={`rounded-xl border p-4 sm:p-5 transition ${
              missingCodeWarn ? "border-rose-400/50 bg-rose-400/10" : "border-amber-400/30 bg-amber-400/10"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold text-amber-200">
                <span className="text-white">Unesi kod i odmah ostvari</span> 10€
              </p>
              <button
                onClick={copyCodeToInput}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-300/40 bg-amber-300/10 px-2.5 py-1.5 text-xs font-semibold text-amber-200 hover:brightness-110"
                title={`Kopiraj ${couponCode}`}
              >
                <ClipboardCheck className="h-4 w-4" /> {copied ? "Kopirano!" : couponCode}
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                ref={inputRef}
                id="promo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Unesi kod (npr. ${couponCode})`}
                className={`min-w-0 flex-1 rounded-xl border bg-[#0E1319] px-3 py-3 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 ${
                  missingCodeWarn ? "border-rose-400/50 focus:ring-rose-400/60" : "border-amber-300/30 focus:ring-amber-400/60"
                }`}
              />
              <button
                onClick={applyCode}
                className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black shadow-[0_10px_30px_rgba(212,160,32,0.35)] transition hover:brightness-95"
              >
                Primeni kod
              </button>
            </div>

            {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
            {applied && (
              <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Kod je prihvaćen, nova cena: {priceToPay}€
              </p>
            )}

            {missingCodeWarn && !applied && !error && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-300/10 p-2.5 text-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">
                  <b>Nisi uneo kod</b> kojim ostvaruješ 10€ popusta.
                </p>
              </div>
            )}
          </div>

          {/* PODACI KUPCA */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-white/70">Ime</label>
              <input
                ref={nameInputRef}
                value={name}
                onChange={(e) => { setFullName(e.target.value); setNameErr(""); }}
                placeholder="npr. Luka"
                className={`mt-1 w-full rounded-xl border bg-[#0E1319] px-3 py-3 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 ${
                  nameErr ? "border-rose-400/50 focus:ring-rose-400/60" : "border-white/10 focus:ring-amber-400/60"
                }`}
              />
              {nameErr && <p className="mt-1 text-xs text-rose-400">{nameErr}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70">Email</label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailErr(""); }}
                placeholder="tvoj@email.com"
                className={`mt-1 w-full rounded-xl border bg-[#0E1319] px-3 py-3 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 ${
                  emailErr ? "border-rose-400/50 focus:ring-rose-400/60" : "border-white/10 focus:ring-amber-400/60"
                }`}
              />
              {emailErr && <p className="mt-1 text-xs text-rose-400">{emailErr}</p>}
            </div>
          </div>

          {/* 2) CENA */}
          <div className="mt-5 text-center">
            <p className="text-sm font-extrabold text-zinc-300 line-through decoration-rose-500/80 decoration-4">
              Redovna: {regularPrice}€
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-amber-300 sm:text-3xl">
              Cena: <span className="text-white">{displayPrice}€</span>
            </p>
          </div>

          {/* 3) ILUSTRACIJA */}
          <div className="mt-5 rounded-xl bg-[#0E1319] p-4 ring-1 ring-white/5">
            <Image
              src="/hero.png"
              alt=""
              width={1600}
              height={900}
              className="h-auto mx-auto w-full rounded-md object-contain"
            />
            <p className="mt-3 text-center text-sm text-white/70">
              Popust neće važiti još dugo
            </p>
          </div>

          {/* 4) METODE PLAĆANJA */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <PaymentOption
              icon={Landmark}
              label="Uplatnica (bez kartice)"
              active={method === "uplatnica"}
              onSelect={() => { setMethod("uplatnica"); upsertLead({ method: "uplatnica" }); }}
            />
          {/* Kartica - trenutno nefunkcionalna (crveno), klik ne radi ništa */}
  <button
    type="button"
    aria-pressed="false"
    aria-disabled="true"
    onClick={(e) => { e.preventDefault(); /* no-op */ }}
    className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition
               border-rose-400/70 bg-rose-500/10 ring-1 ring-rose-500/30
               focus:outline-none focus:ring-2 focus:ring-rose-400/60"
    title="Kartično plaćanje je trenutno nefunkcionalno"
  >
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30">
      <CreditCard className="h-4 w-4" />
    </span>
    <span className="text-rose-300 font-semibold">Kartica (trenutno nefunkcionalna)</span>
  </button>
          </div>

          {/* 5) CTA */}
          <button
            onClick={handleContinue}
            className="mt-6 w-full border rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-4 py-8 text-xl shadow-[0_12px_36px_rgba(212,160,32,0.25)] text-black font-display font-bold transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Hoću program po specijalnoj ceni od {displayPrice}€
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* helpers */

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
