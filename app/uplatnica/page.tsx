/* eslint-disable @next/next/no-img-element */
// app/uplatnica/page.tsx
"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Camera, Download, UploadCloud, CheckCircle2, ArrowLeft, Info } from "lucide-react";
import { postRRSWebhook } from "@/lib/webhook";

// Sprečava prerender/SSG koji pravi problem sa useSearchParams
export const dynamic = "force-dynamic";

// 1) Page wrapper sa <Suspense> — sve je i dalje u istom fajlu
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Učitavanje…</div>}>
      <UplatnicaClient />
    </Suspense>
  );
}


// 2) Klijent komponenta
function UplatnicaClient() {
  const sp = useSearchParams();
  const router = useRouter();


  // query parametri koje šaljemo i u webhook
  const price = sp.get("price") ?? "60";
  const code = sp.get("code") ?? undefined;
  const name = sp.get("name") ?? undefined;
  const email = sp.get("email") ?? undefined;

  const fileInput = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [saved, setSaved] = useState(false);

  function openCamera() {
    fileInput.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }
const [busy, setBusy] = useState(false);
const [sent, setSent] = useState(false);
  // klik na potvrdu → javi da je poslao dokaz (sa metapodacima fajla ako postoji)
async function handleConfirm() {
  if (!agreed || busy || sent) return;   // ⬅️ spreči dupli klik
  setBusy(true);
  try {
    const fd = new FormData();
    fd.append("event", "bank_transfer_proof_submitted");
    if (email) fd.append("email", email);
    if (name) fd.append("name", name);
    if (code) fd.append("code", code);
    fd.append("price", String(price));
    fd.append("method", "uplatnica");
    fd.append("ts", new Date().toISOString());
    if (file) fd.append("proof", file);

    await postRRSWebhook(fd);

    setSaved(true);
    setSent(true);                        // ⬅️ trajno zaključaj
    setTimeout(() => setSaved(false), 1600);
  } finally {
    setBusy(false);
  }
}


  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#0B0F13] text-white">
      {/* glow pozadina */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[-20%] h-[160%] w-[70%] opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(212,160,32,0.40) 0%, rgba(212,160,32,0.12) 45%, rgba(11,15,19,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="container mx-auto max-w-[920px] px-4 py-8 sm:py-12">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Nazad
        </button>

        <div className="relative rounded-2xl border border-white/10 bg-[#12171E]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6 md:p-7">
          <div className="absolute inset-x-0 top-0 h-[10px] rounded-t-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          <h1 className="text-center text-2xl font-extrabold leading-tight sm:text-3xl">
            REALRESELLING - Od nule do prve prodaje za mesec dana{" "}
            <span className="text-amber-300">ILI VRAĆAMO NOVAC</span>
          </h1>

          {/* mockup / testimonial */}
          <div className="mt-6 flex flex-col items-center">
            <Image
              src="/uplatnica.png"
              alt="Primer uplatnice"
              width={1400}
              height={900}
              className="h-auto w-full max-w-[560px] rounded-md ring-1 ring-white/10"
              priority
            />
            <p className="mt-3 max-w-prose text-center text-sm text-white/70 italic">
              Milan (16 godina): Nakon 2 meseca zarađujem više od ćaleta i mogu sebi da kupim šta god hoću.
            </p>
          </div>

          {/* objašnjenje plaćanja */}
          <div className="mt-6 rounded-xl bg-[#0E1319] p-4 ring-1 ring-white/5">
            <p className="text-lg font-semibold text-white">
              Nemaš karticu? <span className="italic">Nema problema.</span>
            </p>
            <p className="mt-1 text-white/80">
              Uplatu možeš izvršiti putem <b>uplatnice</b>, menjačnice, pošte ili <b>online bankarstva</b> direktno na naš žiro račun.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/uplatnica.png"
                download
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/90 transition hover:bg:white/5"
              >
                <Download className="h-4 w-4" /> Preuzmi primer uplatnice
              </Link>

              <button
                type="button"
                onClick={openCamera}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(212,160,32,0.35)] transition hover:brightness-95"
              >
                <Camera className="h-4 w-4" /> Slikaj uplatnicu
              </button>

              <span className="inline-flex items-center gap-2 text-xs text-white/60">
                <Info className="h-4 w-4" />
                Ukupna cena: <b className="ml-1 text-white">{price}€</b>
                {code && <span className="ml-2 text-emerald-400">(kod: {code})</span>}
              </span>
            </div>

            {/* upload zona / preview */}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileChange}
            />
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
              {!preview ? (
                <div className="grid place-items-center gap-2 py-8 text-center text-white/70">
                  <UploadCloud className="h-6 w-6 text-amber-300" />
                  <p className="text-sm">Ovde će se pojaviti fotografija uplatnice nakon slikanja.</p>
                </div>
              ) : (
                <div className="grid gap-2">
                  <img
                    src={preview}
                    alt="Fotografija uplatnice (preview)"
                    className="h-auto w-full rounded-md"
                  />
                  <p className="text-xs text-white/60">Ako je slika nejasna, ponovi fotografisanje.</p>
                </div>
              )}
            </div>
          </div>

          {/* potvrda i uslovi */}
          <label className="mt-6 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 accent-amber-400"
            />
            <span className="text-sm text-white/80">
              Slažem se sa uslovima i potvrđujem kupovinu
            </span>
          </label>

                  <button
          disabled={!agreed || busy || sent}
          onClick={handleConfirm}
          className="mt-4 w-full font-display rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-4 text-center text-xl font-bold text-black shadow-[0_14px_40px_rgba(212,160,32,0.45)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sent ? "Poslato ✅" : busy ? "Šaljem…" : "Potvrđujem kupovinu i slažem se sa uslovima"}
        </button>


          {saved && (
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Sačuvano! (dokaz poslat na obradu)
            </p>
          )}

          <p className="mt-4 text-center text-xs text-white/60">
            Članarina se plaća jednom i nema dodatnih troškova.
          </p>
        </div>
      </div>
    </section>
  );
}
