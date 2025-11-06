/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Gift,
  Sparkles,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
  X,
  PartyPopper,
  ClipboardCopy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step = 0 | 1 | 2 | 3;
type Answers = { age: string; goal: string; phone: string };

function isValidPhone(v: string) {
  const s = v.trim();
  if (!s) return false;
  if (!/^[+\d\s().-]{7,20}$/.test(s)) return false;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7;
}

export default function QuizDiscountPopup({
  open,
  onClose,
  redirectTo = "/discount",
  couponCode = "RRS25",
  priceBefore = 60,
  priceAfter = 50,
  attachAnswersAsQuery = true,
}: {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  couponCode?: string;
  priceBefore?: number;
  priceAfter?: number;
  attachAnswersAsQuery?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>({ age: "", goal: "", phone: "" });
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstInteractiveRef = useRef<HTMLButtonElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setCopied(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstInteractiveRef.current?.focus(), 75);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  const logQuiz = useCallback(async () => {
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: answers.age,
          goal: answers.goal,
          phone: answers.phone,
          code: couponCode,
          priceBefore,
          priceAfter,
          source: "quiz-popup",
        }),
        cache: "no-store",
      });
    } catch {}
  }, [answers, couponCode, priceBefore, priceAfter]);

  const canNext = useMemo(() => {
    if (step === 0) return !!answers.age;
    if (step === 1) return !!answers.goal;
    if (step === 2) return isValidPhone(answers.phone);
    if (step === 3) return true;
    return false;
  }, [step, answers]);

  const prev = useCallback(() => setStep((s) => (s === 0 ? 0 : ((s - 1) as Step))), []);
  const goToCongrats = useCallback(() => {
    setStep(3);
    logQuiz();
  }, [logQuiz]);

  const loggedOnceRef = useRef(false);
  useEffect(() => {
    if (open) loggedOnceRef.current = false;
  }, [open]);
  useEffect(() => {
    if (step === 3 && !loggedOnceRef.current) {
      loggedOnceRef.current = true;
      logQuiz();
    }
  }, [step, logQuiz]);

  const next = useCallback(() => {
    if (!canNext) return;
    setStep((s) => {
      if (s < 2) return ((s + 1) as Step);
      if (s === 2) return 3;
      return s;
    });
  }, [canNext]);

  const continueToDiscount = useCallback(() => {
    const params = new URLSearchParams();
    params.set("code", couponCode);
    if (attachAnswersAsQuery) {
      if (answers.age) params.set("age", answers.age);
      if (answers.goal) params.set("goal", answers.goal);
      // namerno ne šaljemo phone u query
    }
    router.push(`${redirectTo}?${params.toString()}`);
    onClose();
  }, [answers, attachAnswersAsQuery, couponCode, onClose, redirectTo, router]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }, [couponCode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") if (step < 3) next();
      if (e.key === "Enter") {
        if (step < 2) next();
        else if (step === 2) isValidPhone(answers.phone) && goToCongrats();
        else continueToDiscount();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, prev, next, step, goToCongrats, continueToDiscount, answers.phone]);

  const Dot = ({ i }: { i: number }) => (
    <span className={`h-2.5 w-2.5 rounded-full transition ${step >= i ? "bg-amber-400" : "bg-white/20"}`} />
  );

  useEffect(() => {
    if (step === 2) setTimeout(() => phoneInputRef.current?.focus(), 50);
  }, [step]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label="Zatvori"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-100 animate-[fadeIn_.18s_ease-out]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="rounded-2xl border border-white/10 bg-[#0B0F13]/90 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-[popIn_.18s_ease-out]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <Gift className="h-5 w-5" />
              <p className="text-sm/6 font-semibold text-amber-300">Odgovori na 3 pitanja i osvoji popust</p>
            </div>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Dot i={0} /> <Dot i={1} /> <Dot i={2} />
          </div>

          {/* <<<<<<  OVO JE BILO POGREŠNO  >>>>>> */}
          <div className="relative mt-4 min-h-[220px]">
            {step === 0 && (
              <div className="animate-[fadeSlide_.22s_ease-out]">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white/90">
                  <Sparkles className="h-5 w-5 text-amber-300" /> Koliko imate godina?
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { v: "<18", label: "Manje od 18" },
                    { v: "18-24", label: "18–24" },
                    { v: "25-34", label: "25–34" },
                    { v: "35+", label: "35+" },
                  ].map((o, idx) => (
                    <button
                      key={o.v}
                      ref={idx === 0 ? firstInteractiveRef : undefined}
                      onClick={() => setAnswers((a) => ({ ...a, age: o.v }))}
                      className={`rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                        answers.age === o.v ? "border-amber-400 bg-amber-400/15" : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-[fadeSlide_.22s_ease-out]">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white/90">
                  <BadgeCheck className="h-5 w-5 text-amber-300" /> Koliki ti je cilj da zarađuješ?
                </h3>
                <div className="mt-4 grid gap-3">
                  {[
                    { v: "0-1000", label: "0–1000€" },
                    { v: "1000-5000", label: "1000–5000€" },
                    { v: "5000+", label: "5000€+" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => setAnswers((a) => ({ ...a, goal: o.v }))}
                      className={`rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                        answers.goal === o.v ? "border-amber-400 bg-amber-400/15" : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-[fadeSlide_.22s_ease-out]">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white/90">
                  <Sparkles className="h-5 w-5 text-amber-300" /> Unesite svoj broj telefona
                </h3>
                <p className="mt-1 text-white/60 text-sm">
                  Koristimo ga samo za slanje detalja o popustu i podršku. Ne delimo sa trećim licima.
                </p>
                <div className="mt-4">
                  <input
                    ref={phoneInputRef}
                    inputMode="tel"
                    aria-label="Broj telefona"
                    placeholder="+381 60 123 4567"
                    value={answers.phone}
                    onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none ring-2 ring-transparent focus:ring-amber-400/60"
                  />
                  {!answers.phone ? null : isValidPhone(answers.phone) ? (
                    <p className="mt-1 text-xs text-emerald-400/90">✓ Izgleda dobro</p>
                  ) : (
                    <p className="mt-1 text-xs text-rose-400/90">Unesite validan broj telefona.</p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-[fadeSlide_.22s_ease-out] text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                  <PartyPopper className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">Čestitamo</h3>
                <p className="mt-1 text-white/80">Unesite ovaj kod i dobićete 10€ popusta</p>

                <div className="mt-6">
                  <div className="relative mx-auto w-fit select-none text-white/60">
                    <span className="text-xl line-through">{priceBefore}€</span>
                    <span className="absolute left-0 right-0 top-3 h-[2px] -rotate-6 bg-rose-400/80" aria-hidden />
                  </div>
                  <div className="mt-1 text-5xl font-extrabold tracking-tight text-white">{priceAfter}€</div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2">
                  <code className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-lg font-semibold text-amber-300">
                    Kod: {couponCode}
                  </code>
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/5"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" /> Kopirano
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-4 w-4" /> Kopiraj
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={continueToDiscount}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-3 text-center text-base font-semibold text-black shadow-[0_14px_40px_rgba(212,160,32,0.45)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                >
                  Uzmi kod i nastavi <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-white/80 ring-1 ring-white/10 transition hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Nazad
              </button>

              <button
                onClick={step === 2 ? goToCongrats : next}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-semibold text-black shadow-[0_10px_30px_rgba(212,160,32,0.35)] transition hover:brightness-95 disabled:opacity-60"
              >
                {step < 2 ? (
                  <>
                    Dalje <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Prikaži kod <Gift className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(.98) } to { opacity: 1; transform: scale(1) } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
