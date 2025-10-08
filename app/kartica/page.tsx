// app/checkout-card/page.tsx
"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { postRRSWebhook } from "@/lib/webhook";

export const dynamic = "force-dynamic";

type Status = "idle" | "processing" | "success" | "error";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Učitavanje…</div>}>
      <CheckoutCardClient />
    </Suspense>
  );
}

function CheckoutCardClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const name = sp.get("name") ?? undefined;
  const email = sp.get("email") ?? undefined;
  const code = sp.get("code") ?? undefined;

  const price = useMemo(() => {
    const v = Number(sp.get("price"));
    return Number.isFinite(v) && v > 0 ? v : 60;
  }, [sp]);

  const [status, setStatus] = useState<Status>("idle");
  const [orderId, setOrderId] = useState<string | undefined>(undefined); // undefined, ne null

  const clientId = "sb"; // ili process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!

  if (!clientId) {
    return (
      <section className="min-h-dvh bg-[#0B0F13] text-white">
        <div className="container mx-auto max-w-[900px] px-4 py-12">
          <div className="rounded-2xl border border-white/10 bg-[#12171E]/80 p-6">
            <h1 className="text-2xl font-bold">Kartično plaćanje</h1>
            <p className="mt-3 text-white/80">
              Nije postavljen <code className="text-amber-300">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>.
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
              <PayPalButtons
                // samo lokalni UI status – uklonjen lead_checkout_started webhook
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onClick={(_data) => {
                  setStatus("processing");
                }}
                createOrder={(_, actions) => {
                  const p = actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: { currency_code: "EUR", value: price.toFixed(2) },
                        description: "RealReselling članarina",
                        custom_id: code ? `coupon:${code}` : undefined,
                      },
                    ],
                    application_context: { shipping_preference: "NO_SHIPPING" },
                  });

                  p.then((id) => {
                    setOrderId(id ?? undefined);
                    window.setTimeout(() => {
                      if (status === "processing") setStatus("idle");
                    }, 90000);
                  });

                  return p;
                }}
                onApprove={async (_data, actions) => {
                  try {
                    const details = await actions.order?.capture();
                    const id = details?.id ?? orderId;
                    setOrderId(id);
                    setStatus("success");

                    postRRSWebhook({
                      event: "purchase_completed",
                      email,
                      name,
                      price,
                      code,
                      method: "kartica",
                      orderId: id,
                      status: "success",
                      ts: new Date().toISOString(),
                    });
                  } catch (err) {
                    console.error("[PP] capture error:", err);
                    setStatus("error");
                    postRRSWebhook({
                      event: "purchase_abandoned",
                      email,
                      name,
                      price,
                      code,
                      method: "kartica",
                      orderId,
                      status: "error",
                      reason: "capture_error",
                      ts: new Date().toISOString(),
                    });
                  }
                }}
                onCancel={() => {
                  setStatus("idle");
                  postRRSWebhook({
                    event: "purchase_abandoned",
                    email,
                    name,
                    price,
                    code,
                    method: "kartica",
                    orderId,
                    status: "canceled",
                    reason: "user_canceled",
                    ts: new Date().toISOString(),
                  });
                }}
                onError={(err) => {
                  console.error("[PP] onError:", err);
                  setStatus("error");
                  postRRSWebhook({
                    event: "purchase_abandoned",
                    email,
                    name,
                    price,
                    code,
                    method: "kartica",
                    orderId,
                    status: "error",
                    reason: "paypal_error",
                    ts: new Date().toISOString(),
                  });
                }}
              />
            </PayPalScriptProvider>

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
              <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-300">
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
