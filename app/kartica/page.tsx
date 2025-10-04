// app/checkout-card/page.tsx
"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

// 🔧 Recite Next-u da ne radi SSG za ovu stranu (sprečava prerender error)
export const dynamic = "force-dynamic";
// (alternativa je: export const revalidate = 0)

type Status = "idle" | "processing" | "success" | "error";

// 1) Ovo je mali wrapper koji dodaje <Suspense>
//    Ostaje u ISTOM fajlu, bez novih fajlova.
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Učitavanje…</div>}>
      <CheckoutCardClient />
    </Suspense>
  );
}

// 2) Tvoja postojeća logika ostaje ista, samo je pomerena u unutrašnju komponentu
function CheckoutCardClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const code = sp.get("code") ?? undefined;

  // Cena iz query-ja (fallback 60)
  const price = useMemo(() => {
    const v = Number(sp.get("price"));
    return Number.isFinite(v) && v > 0 ? v : 60;
  }, [sp]);

  const [status, setStatus] = useState<Status>("idle");
const [orderId, setOrderId] = useState<string | null>(null);

const clientId = "sb";

  if (!clientId) {
    return (
      <section className="min-h-dvh bg-[#0B0F13] text-white">
        <div className="container mx-auto max-w-[900px] px-4 py-12">
          <div className="rounded-2xl border border-white/10 bg-[#12171E]/80 p-6">
            <h1 className="text-2xl font-bold">Kartično plaćanje</h1>
            <p className="mt-3 text-white/80">
              Nije postavljen <code className="text-amber-300">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>.
              Dodaj ga u <code>.env</code>, pa pokreni app ponovo.
            </p>
            <Link
              href="/discount"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-white/80 hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" /> Nazad
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#0B0F13] text-white">
      {/* pozadinski glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-15%] top-[-20%] h-[160%] w-[70%] opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="container mx-auto max-w-[900px] px-4 py-10 sm:py-14">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Nazad
        </button>

        <div className="relative rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6 md:p-7">
          <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          <header className="text-center">
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Kartično plaćanje <span className="text-amber-300">/ PayPal</span>
            </h1>
            <p className="mt-2 text-white/80">
              Iznos: <b className="text-white">{price.toFixed(2)} €</b>{" "}
              {code && <span className="text-emerald-400">(kod: {code})</span>}
            </p>
          </header>

          <div className="mt-6 rounded-xl bg-[#0E1319] p-4 ring-1 ring-white/5">
            <PayPalScriptProvider
  options={{
    clientId,
    currency: "EUR",
    intent: "capture",
    components: "buttons",
    enableFunding: "card",
  }}
>
  {/* zajednički handleri */}
  <PayPalButtons
  onClick={(data /*, actions*/) => {
    setStatus("processing");
    console.log("[PP] onClick funding:", data.fundingSource); // ✅ ispravno
  }}
    // KREIRANJE NALOGA
    createOrder={(_, actions) => {
      const p = actions.order.create({
        intent: "CAPTURE", // traže TS tipovi
        purchase_units: [
          {
            amount: { currency_code: "EUR", value: price.toFixed(2) },
            description: "RealReselling članarina",
            custom_id: code ? `coupon:${code}` : undefined,
          },
        ],
        application_context: { shipping_preference: "NO_SHIPPING" },
      });

      // Watchdog: ako ništa ne dođe 90s, vrati UI iz processing
      p.then((id) => {
        console.log("[PP] order id:", id);
        window.setTimeout(() => {
          if (status === "processing") {
            console.warn("[PP] watchdog: no approve/cancel/error in 90s -> reset");
            setStatus("idle");
          }
        }, 90000);
      });

      return p;
    }}
    // ODOBRENO → CAPTURE
    onApprove={async (_data, actions) => {
      try {
        console.log("[PP] onApprove");
        const details = await actions.order?.capture();
        console.log("[PP] CAPTURE:", details);
        setOrderId(details?.id ?? null);
        setStatus("success");
      } catch (e) {
        console.error("[PP] capture error:", e);
        setStatus("error");
      }
    }}
    // KORISNIK OTKAZAO
    onCancel={() => {
      console.log("[PP] onCancel");
      setStatus("idle");
    }}
    // BILO KAKVA GREŠKA
    onError={(err) => {
      console.error("[PP] onError:", err);
      setStatus("error");
    }}
  />

  {/* Dodatno, zasebno card dugme (ako želiš da ga prikažeš posebno) */}
  {/* <PayPalButtons fundingSource="card" ...isti handleri kao gore... /> */}
</PayPalScriptProvider>



            {/* status zona */}
            {status === "processing" && (
              <p className="mt-3 text-sm text-white/70">Obrađujemo vašu transakciju…</p>
            )}
            {status === "success" && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
                <p className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5" /> Uplata uspešna!
                </p>
                {orderId && (
                  <p className="mt-1 text-emerald-200/80 text-sm">ID porudžbine: {orderId}</p>
                )}
                <Link
                  href="/"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(212,160,32,0.35)] transition hover:brightness-95"
                >
                  <Sparkles className="h-4 w-4" /> Idi na početnu
                </Link>
              </div>
            )}
            {status === "error" && (
              <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-300">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-5 w-5" /> Došlo je do greške. Pokušajte ponovo.
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-white/60">
            Plaćanje se obavlja preko PayPal-a. Za izdavanje fakture i pristup programu, podaci o uspešnoj uplati se čuvaju.
          </p>
        </div>
      </div>
    </section>
  );
}
