/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Camera,
  Download,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Info,
} from "lucide-react";
import { postRRSWebhook } from "@/lib/webhook";
import { trackCustom } from "@/lib/pixel";
import SnowCanvas from "@/components/SnowCanvas";

export const dynamic = "force-dynamic";

// -----------------------------
// KONSTANTE
// -----------------------------
const LEAD_KEY = "rrs_lead_v1";
const BASE_PRICE = 50;
const DISCOUNT_PRICE = 45;
const BOZIC_PRICE = 39;

// -----------------------------
// LocalStorage helpers
// -----------------------------
function readLeadFromStorage():
  | { name?: string; email?: string; code?: string; method?: "uplatnica" | "kartica" }
  | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) {
      localStorage.removeItem(LEAD_KEY);
      return null;
    }
    return {
      name: parsed.name,
      email: parsed.email,
      code: parsed.code,
      method: parsed.method,
    };
  } catch {
    return null;
  }
}

function refreshLeadInStorage(partial: {
  name?: string;
  email?: string;
  code?: string;
  method?: "uplatnica" | "kartica";
}) {
  try {
    const current = readLeadFromStorage() || {};
    const next = {
      ...current,
      ...partial,
      exp: Date.now() + 72 * 60 * 60 * 1000,
    };
    localStorage.setItem(LEAD_KEY, JSON.stringify(next));
  } catch {}
}

// -----------------------------
// Page wrapper
// -----------------------------
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm opacity-70">Učitavanje…</div>}>
      <UplatnicaClient />
    </Suspense>
  );
}

// -----------------------------
// Client component
// -----------------------------
function UplatnicaClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const firedRef = useRef(false);

  const [lead, setLead] = useState<{ code?: string; name?: string; email?: string }>({});
  const [fallbackName, setFallbackName] = useState("");
  const [fallbackEmail, setFallbackEmail] = useState("");
  const [fallbackErr, setFallbackErr] = useState("");

  const fileInput = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ FINAL CENA
  const finalPrice = useMemo(() => {
    if (!lead.code) return BASE_PRICE;
    // Provera za Božićni kod
    const normalizedCode = lead.code?.trim().toUpperCase();
    if (normalizedCode === "BOZIC") return BOZIC_PRICE;
    // Standardni popust kod
    return DISCOUNT_PRICE;
  }, [lead.code]);

  const priceText = useMemo(() => `${finalPrice}€`, [finalPrice]);
// ✅ iznad return-a, negde pored priceText
const hasPromo = Boolean(lead.code);
const normalizedCode = lead.code?.trim().toUpperCase();
const isBozicCode = normalizedCode === "BOZIC";

const exampleImageSrc = isBozicCode ? "/uplatnica_39.jpeg" : (hasPromo ? "/popust.jpeg" : "/uplatnica.png");
const exampleImageAlt = isBozicCode ? "Primer uplatnice (Božićna akcija - 39€)" : (hasPromo ? "Primer uplatnice (popust)" : "Primer uplatnice");

  // Load lead
  useEffect(() => {
    const qp = {
      code: sp.get("code") ?? undefined,
      name: sp.get("name") ?? undefined,
      email: sp.get("email") ?? undefined,
    };

    if (qp.code || qp.name || qp.email) {
      const normalized = {
        code: qp.code?.trim() || undefined,
        name: qp.name?.trim() || undefined,
        email: qp.email?.trim() || undefined,
      };
      setLead(normalized);
      refreshLeadInStorage(normalized);
      if (qp.name) setFallbackName(qp.name);
      if (qp.email) setFallbackEmail(qp.email);
      return;
    }

    const stored = readLeadFromStorage();
    if (stored) {
      setLead({
        code: stored.code,
        name: stored.name,
        email: stored.email,
      });
      if (stored.name) setFallbackName(stored.name);
      if (stored.email) setFallbackEmail(stored.email);
    }
  }, [sp]);

  useEffect(() => {
    return () => {
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    };
  }, []);

  function openCamera() {
    const el = fileInput.current;
    if (!el) return;
    el.value = "";
    el.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);

    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);

    if (f) {
      const url = URL.createObjectURL(f);
      lastUrlRef.current = url;
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleConfirm() {
    if (busy || sent || !file) return;

    const finalName = (lead.name ?? fallbackName).trim();
    const finalEmail = (lead.email ?? fallbackEmail).trim();

    if (!finalName || !validateEmail(finalEmail)) {
      setFallbackErr("Unesi validno ime i email pre slanja dokaza.");
      return;
    }

    refreshLeadInStorage({
      name: finalName,
      email: finalEmail,
      code: lead.code,
      method: "uplatnica",
    });

    setBusy(true);
    setFallbackErr("");

    try {
      const fd = new FormData();
      fd.append("event", "bank_transfer_proof_submitted");
      fd.append("method", "uplatnica");
      fd.append("price", String(finalPrice));
      fd.append("name", finalName);
      fd.append("email", finalEmail);
      if (lead.code) fd.append("code", lead.code);
      if (file) fd.append("proof", file, file.name);

      const res = await postRRSWebhook(fd);
      if (!res.ok) throw new Error("Greška pri slanju dokaza.");

      if (!firedRef.current) {
        firedRef.current = true;
        void trackCustom("Closed - kupio uplatnicom", {
          value: finalPrice,
          currency: "EUR",
          method: "uplatnica",
          code: lead.code,
        });
      }

      setSaved(true);
      setSent(true);
      router.replace("/uplatnica/success");
    } catch (err) {
      setFallbackErr("Došlo je do greške pri slanju. Pokušaj ponovo.");
      setSent(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#0B0F13] text-white">
      <SnowCanvas className="pointer-events-none absolute inset-0 z-0 opacity-80" />

      <div className="container mx-auto max-w-[920px] px-4 py-8 sm:py-12">
        <button
          onClick={() => !busy && router.back()}
          disabled={busy}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Nazad
        </button>

        <div className="relative rounded-2xl border border-white/10 bg-[#12171E]/80 p-6 shadow-xl">
          <h1 className="text-center text-2xl font-extrabold">
            REALRESELLING – <span className="text-amber-300">uplata uplatnicom</span>
          </h1>

          <div className="mt-6 flex flex-col items-center">
            <Image
              src={exampleImageSrc}
              alt={exampleImageAlt}
              width={1400}
              height={900}
              className="w-full max-w-[560px] rounded-md ring-1 ring-white/10"
            />

          </div>

          <div className="mt-6 rounded-xl bg-[#0E1319] p-4 ring-1 ring-white/5">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Info className="h-4 w-4" />
              Ukupna cena: <b className="text-white">{priceText}</b>
              {lead.code && <span className="text-emerald-400">(kod primenjen)</span>}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <Link
                href={exampleImageSrc}
                download
                className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
              >
                <Download className="inline h-4 w-4 mr-1" />{" "}
                {isBozicCode ? "Preuzmi primer uplatnice (Božićna akcija - 39€)" : (hasPromo ? "Preuzmi primer uplatnice (popust)" : "Preuzmi primer uplatnice")}
              </Link>


              <button
                onClick={openCamera}
                className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-800"
              >
                <Camera className="inline h-4 w-4 mr-1" /> Slikaj uplatnicu
              </button>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFileChange}
              className="hidden"
            />

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
              {!preview ? (
                <div className="grid place-items-center gap-2 py-8 text-white/60">
                  <UploadCloud className="h-6 w-6" />
                  <p className="text-sm">Dodaj fotografiju uplatnice</p>
                </div>
              ) : (
                <img src={preview} alt="Preview uplatnice" className="rounded-md w-full" />
              )}
            </div>
          </div>

          <button
            disabled={busy || sent || !file}
            onClick={handleConfirm}
            className="mt-6 w-full font-display rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 py-4 text-xl font-bold text-black disabled:opacity-60"
          >
            {sent ? "Poslato ✅" : busy ? "Šaljem…" : "Potvrđujem kupovinu i slažem se sa uslovima"}
          </button>

          {saved && (
            <p className="mt-3 text-center text-sm text-emerald-400">
              <CheckCircle2 className="inline h-4 w-4 mr-1" /> Dokaz je uspešno poslat
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
