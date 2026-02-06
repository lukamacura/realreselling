"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Download,
  ArrowLeft,
  Info,
  MessageCircle,
} from "lucide-react";
import SnowCanvas from "@/components/SnowCanvas";

export const dynamic = "force-dynamic";

// -----------------------------
// KONSTANTE
// -----------------------------
const LEAD_KEY = "rrs_lead_v1";
const BASE_PRICE = 50;
const DISCOUNT_PRICE = 45;

const WHATSAPP_LINK = "https://wa.me/message/SYOT6G5LAW7UC1";
const INSTAGRAM_LINK = "https://instagram.com/rrealreselling";

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

  const [lead, setLead] = useState<{ code?: string }>({});

  const finalPrice = useMemo(() => {
    return lead.code ? DISCOUNT_PRICE : BASE_PRICE;
  }, [lead.code]);

  const priceText = useMemo(() => `${finalPrice}€`, [finalPrice]);

  const hasPromo = Boolean(lead.code);
  const exampleImageSrc = hasPromo ? "/popust.jpeg" : "/uplatnica.png";
  const exampleImageAlt = hasPromo ? "Primer uplatnice (popust)" : "Primer uplatnice";

  // Load lead
  useEffect(() => {
    const code = sp.get("code")?.trim() || undefined;
    if (code) {
      setLead({ code });
      return;
    }

    const stored = readLeadFromStorage();
    if (stored?.code) {
      setLead({ code: stored.code });
    }
  }, [sp]);

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#0B0F13] text-white">
      <SnowCanvas className="pointer-events-none absolute inset-0 z-0 opacity-80" />

      <div className="container mx-auto max-w-[920px] px-4 py-8 sm:py-12">
        <button
          onClick={() => router.back()}
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

            <div className="mt-4">
              <Link
                href={exampleImageSrc}
                download
                className="inline-flex items-center rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
              >
                <Download className="inline h-4 w-4 mr-1" />{" "}
                {hasPromo ? "Preuzmi primer uplatnice (popust)" : "Preuzmi primer uplatnice"}
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#0E1319] p-5 ring-1 ring-white/5">
            <p className="text-center text-sm text-white/70 mb-4">
              Nakon uplate, pošalji nam sliku uplatnice putem jednog od kanala:
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>

              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
